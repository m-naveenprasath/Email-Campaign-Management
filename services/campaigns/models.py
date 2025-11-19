from django.db import models

class Recipient(models.Model):
    """
    Stores an email recipient with subscription status.
    """
    SUBSCRIPTION_STATUS = [
        ('subscribed', 'Subscribed'),
        ('unsubscribed', 'Unsubscribed')
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    subscription_status = models.CharField(
        max_length=12,
        choices=SUBSCRIPTION_STATUS,
        default='subscribed'
    )

    def __str__(self):
        return self.email


class Campaign(models.Model):
    """
    Represents an email campaign with scheduling and status tracking.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    content = models.TextField()
    scheduled_time = models.DateTimeField()
    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default='draft'
    )

    def __str__(self):
        return self.name


class DeliveryLog(models.Model):
    """
    Tracks email delivery results for each recipient in a campaign.
    """
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('failed', 'Failed')
    ]
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='logs')
    recipient = models.ForeignKey(Recipient, on_delete=models.CASCADE)
    status = models.CharField(max_length=6, choices=STATUS_CHOICES)
    failure_reason = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.campaign.name} -> {self.recipient.email}"
