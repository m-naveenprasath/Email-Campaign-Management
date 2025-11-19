from celery import shared_task
from django.core.mail import send_mail
from django.db import transaction
from .models import Campaign, Recipient, DeliveryLog
from celery.utils.log import get_task_logger
from django.utils import timezone
from django.conf import settings
from .utils import generate_campaign_text_report
from django.core.mail import EmailMessage


logger = get_task_logger(__name__)

BATCH_SIZE = 100  # send emails in batches

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_campaign_emails(self, campaign_id):
    try:
        campaign = Campaign.objects.get(id=campaign_id)
        campaign.status = "in_progress"
        campaign.save(update_fields=["status"])

        recipients = Recipient.objects.filter(subscription_status="subscribed")
        for recipient in recipients:
            try:
                send_mail(
                    subject=campaign.subject,
                    message=campaign.content,
                    from_email=settings.DEFAULT_FROM_EMAIL,  # use correct from_email
                    recipient_list=[recipient.email],
                    fail_silently=False,
                )
                DeliveryLog.objects.create(campaign=campaign, recipient=recipient, status="sent")
                logger.info(f"Email sent to {recipient.email}")
            except Exception as e:
                logger.error(f"Failed to send email to {recipient.email}: {e}")
                DeliveryLog.objects.create(
                    campaign=campaign,
                    recipient=recipient,
                    status="failed",
                    failure_reason=str(e)
                )

        campaign.status = "completed"
        campaign.save(update_fields=["status"])

        # 🔥 Trigger automatic report generation + email
        send_campaign_report.delay(campaign.id)
        
    except Exception as exc:
        logger.error(f"Campaign task failed: {exc}")
        raise self.retry(exc=exc)


@shared_task
def schedule_pending_campaigns():
    """
    Find all campaigns whose scheduled_time <= now and status='scheduled',
    and trigger send_campaign_emails for them.
    """
    now = timezone.localtime(timezone.now())
    campaigns = Campaign.objects.filter(status="scheduled", scheduled_time__lte=now)
    if not campaigns.exists():
        logger.info(f"No campaigns to send at {now}")
    for campaign in campaigns:
        logger.info(f"Triggering campaign: {campaign.id} - {campaign.name}")
        send_campaign_emails.delay(campaign.id)
        campaign.status = "in_progress"
        campaign.save(update_fields=["status"])



@shared_task
def send_campaign_report(campaign_id):
    campaign = Campaign.objects.get(id=campaign_id)

    # Generate text report
    report_text = generate_campaign_text_report(campaign)
    filename = f"campaign_report_{campaign.id}.txt"

    email = EmailMessage(
        subject=f"Campaign Report: {campaign.name}",
        body="Attached is the campaign text report.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.ADMIN_EMAIL],
    )

    email.attach(filename, report_text, "text/plain")
    email.send()
