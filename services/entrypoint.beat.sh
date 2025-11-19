#!/bin/sh

echo "Starting Celery Beat..."
exec celery -A services beat -l info
