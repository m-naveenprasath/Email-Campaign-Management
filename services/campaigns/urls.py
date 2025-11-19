# campaigns/urls.py
from rest_framework.routers import DefaultRouter
from .views import RecipientViewSet, CampaignViewSet, DeliveryLogViewSet

router = DefaultRouter()
router.register(r'recipients', RecipientViewSet)
router.register(r'campaigns', CampaignViewSet)
router.register(r'delivery-logs', DeliveryLogViewSet)

urlpatterns = router.urls
