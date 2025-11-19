#!/bin/sh

echo "Starting Celery Worker..."
exec celery -A services worker -l info --pool=solo
