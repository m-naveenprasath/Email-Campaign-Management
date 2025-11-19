from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Recipient, Campaign, DeliveryLog
from .serializers import RecipientSerializer, CampaignSerializer, DeliveryLogSerializer
import csv, io


class RecipientViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for recipients.
    Uses DRF ModelViewSet for automatic validation/error responses.
    """
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer

    @action(detail=False, methods=['post'])
    def bulk_upload(self, request):
        """
        Upload multiple recipients via CSV file.
        Creates recipients if email doesn't exist.
        """
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        created = 0
        for row in reader:
            email = row.get('email')
            name = row.get('name', '')
            if email:
                obj, created_flag = Recipient.objects.get_or_create(email=email, defaults={'name': name})
                if created_flag:
                    created += 1
        return Response({"created": created})


class CampaignViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for campaigns.
    Provides scheduling and dashboard analytics.
    """
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        campaigns = Campaign.objects.all()
        data = []

        for campaign in campaigns:
            total = campaign.logs.count()
            sent_count = campaign.logs.filter(status='sent').count()
            failed_count = campaign.logs.filter(status='failed').count()
            data.append({
                "id": campaign.id,
                "name": campaign.name,
                "status": campaign.status,
                "total_recipients": total,
                "sent_count": sent_count,
                "failed_count": failed_count,
                "summary": f"{sent_count}/{total} sent",
                "scheduled_time": campaign.scheduled_time 
            })

        return Response(data)
        
    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        """
        Sets a draft campaign to scheduled.
        """
        campaign = self.get_object()
        if campaign.status != "draft":
            return Response({"error": "Only draft campaigns can be scheduled"}, status=400)
        campaign.status = "scheduled"
        campaign.save(update_fields=["status"])
        return Response({"status": "scheduled"})
    
    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """
        Updates scheduled_time for a draft/scheduled campaign.
        """
        campaign = self.get_object()
        if campaign.status not in ["draft", "scheduled"]:
            return Response({"error": "Only draft or scheduled campaigns can be rescheduled"}, status=400)
        
        new_time = request.data.get("scheduled_time")
        if not new_time:
            return Response({"error": "scheduled_time is required"}, status=400)
        
        campaign.status = "scheduled"
        campaign.scheduled_time = new_time
        campaign.save(update_fields=["status", "scheduled_time"])

        return Response({"status": "rescheduled", "scheduled_time": new_time})


class DeliveryLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view for campaign delivery logs with optional filtering.
    """
    queryset = DeliveryLog.objects.all()
    serializer_class = DeliveryLogSerializer

    def get_queryset(self):
        campaign_id = self.request.query_params.get('campaign_id')
        qs = DeliveryLog.objects.all()
        if campaign_id:
            qs = qs.filter(campaign_id=campaign_id)
        return qs

