from rest_framework import serializers
from .models import Recipient, Campaign, DeliveryLog
from django.utils import timezone


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'

    def validate_scheduled_time(self, value):
        # Make naive datetime aware in current timezone
        if timezone.is_naive(value):
            value = timezone.make_aware(value, timezone.get_current_timezone())
        return value

class DeliveryLogSerializer(serializers.ModelSerializer):
    recipient_email = serializers.CharField(source='recipient.email', read_only=True)
    
    class Meta:
        model = DeliveryLog
        fields = ['id', 'recipient_email', 'status', 'failure_reason', 'timestamp']
