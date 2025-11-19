from django.utils import timezone

def generate_campaign_text_report(campaign):
    logs = campaign.logs.all()

    lines = []
    lines.append("=== Campaign Report ===")
    lines.append(f"Campaign Name : {campaign.name}")
    lines.append(f"Status        : {campaign.status}")
    lines.append(f"Completed At  : {timezone.now()}")
    lines.append("")
    lines.append("=== Delivery Logs ===")
    lines.append("")

    for log in logs:
        lines.append(
            f"Email: {log.recipient.email} | "
            f"Status: {log.status} | "
            f"Reason: {log.failure_reason or '—'} | "
            f"Time: {log.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
        )

    return "\n".join(lines)
