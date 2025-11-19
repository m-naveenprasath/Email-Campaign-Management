FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && pip install gunicorn

COPY . .

# Add entrypoint
COPY entrypoint.web.sh /entrypoint.web.sh
COPY entrypoint.worker.sh /entrypoint.worker.sh
COPY entrypoint.beat.sh /entrypoint.beat.sh

RUN chmod +x /entrypoint.web.sh /entrypoint.worker.sh /entrypoint.beat.sh

EXPOSE 8000
