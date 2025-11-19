import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'services.settings')

app = Celery('services')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Enable timezone-aware scheduling
app.conf.enable_utc = True            # store times in UTC
app.conf.timezone = settings.TIME_ZONE # same as Django TIME_ZONE