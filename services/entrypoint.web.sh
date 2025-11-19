#!/bin/sh

echo "Making migrations..."
python manage.py makemigrations --noinput

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
exec gunicorn services.wsgi:application --bind 0.0.0.0:8000
