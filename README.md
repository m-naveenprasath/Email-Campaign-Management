# Email Campaign Management System

A minimal but production-grade web application for creating, scheduling, and tracking bulk email campaigns.

---
### 🔗 Live Preview / Demo

🌐 **Live Demo**: [Mail](https://naveenemail-campaign.netlify.app/)

---
## Prerequisites

Before running the project, make sure you have the following installed:

- **Git** (to clone the repository)
- **Docker** (for containerized services)
- **Docker Compose** (to build and run multi-container applications)

**Optional but recommended:**

- **Gmail Account** (with App Password for SMTP)
- Postman or any API client (for testing backend APIs)
- CSV/Excel editor (for preparing recipient lists)

---


## Features

- **Campaign Management**
  - Create campaigns with: Name, Subject, Email Content (HTML/Plain Text), Scheduled Time
  - Campaign statuses: Draft, Scheduled, In Progress, Completed
- **Recipient Management**
  - Store users with Name, Email, Subscription Status
  - Bulk upload via CSV/Excel with validation (email format, duplicates)
- **Automated Campaign Execution**
  - Scheduled campaigns automatically send emails to subscribed recipients
  - Delivery logs maintained per recipient (Sent / Failed / Reason)
- **Dashboard & Reporting**
  - View campaigns, sent/failed counts, and detailed logs
  - Summary reports generated and emailed to admin upon completion

---

## Tech Stack

| Layer                  | Technology                        |
|------------------------|----------------------------------|
| Frontend (Client)      | React + Vite                     |
| Backend (Server)       | Django REST Framework            |
| Task Queue             | Celery + Redis                   |
| Email Sending          | Gmail SMTP                       |
| Containerization       | Docker + Docker Compose          |
| Database               | PostgreSQL                       |

---

## Architecture

```
+-----------------+          +-----------------+
|     React       |  <--->   |     Django      |
|   Frontend      |          |   Backend API   |
+-----------------+          +-----------------+
                                 |
                                 v
                            +---------+
                            | Celery  |
                            | Worker  |
                            +---------+
                                 |
                                 v
                              +-------+
                              | Redis  |
                              +-------+
                                 |
                                 v
                            +-----------+
                            |  Gmail    |
                            |  SMTP     |
                            +-----------+
```

---

## Docker Setup

All services are containerized for easy setup.

**Build and run the project:**

```bash
# Build containers without cache
docker-compose build --no-cache

# Start containers in detached mode
docker-compose up -d
```

**Containers include:**

- Django API server
- React frontend
- Redis (for Celery)
- Celery worker and beat scheduler
- Database (PostgreSQL)

---

## Configuration

- **Environment Variables:** Create a `.env` file for sensitive info

```env
# Django settings
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True

# Database settings
POSTGRES_DB=clogenai
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_HOST=postgres   
POSTGRES_PORT=5432       

# Gmail SMTP for email sending
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
EMAIL_HOST=smtp.gmail.com
ADMIN_EMAIL=your_admin_email@gmail.com   # add admin email to get report

# Celery & Redis
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

> Note: For Gmail, use an App Password if 2FA is enabled.

---

## Project Structure

```
Email-Campaign-Management/
├─ services/
│ ├─ Dockerfile
│ ├─ entrypoint.beat.sh
│ ├─ entrypoint.web.sh
│ ├─ entrypoint.worker.sh
│ ├─ manage.py
│ ├─ requirements.txt
│ ├─ .env                        # Environment variables
│ ├─ services/ # django project
│ │ ├─ __init__.py
│ │ ├─ settings.py
│ │ ├─ urls.py
│ │ └─ celery.py
│ ├─ campaigns/ # django app
│ │ ├─ models.py
│ │ ├─ serializers.py
│ │ ├─ viewsets.py
│ │ ├─ tasks.py
│ │ ├─ admin.py
│ │ ├─ apps.py
│ │ ├─ urls.py
├─ ui/  #React + Vite client
│ ├─ Dockerfile
│ ├─ package.json
│ ├─ vite.config.js
│ └─ src/api.js
│ ├─ main.jsx
│ ├─ App.jsx
│ └─ pages/ (CampaignForm, Dashboard, CampaignDetail)
├─docker-compose.yml # Docker services configuration
├─README.md

```

---

## Running the Project

Clone the repository:

```bash
git clone https://github.com/m-naveenprasath/Email-Campaign-Management.git
cd Email-Campaign-Management
```
Create `.env` file (see config above)  
### Build and start containers:

```bash
docker-compose build --no-cache
docker-compose up -d
```

 Access the application:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/`

---

### 📘 API Documentation

Manual documentation of all available API endpoints, including request/response formats and examples.

- [📄 API Documentation (Word)](./docs/API_Documentation.docx)

## Usage

- Add recipients (individually or via CSV upload)  
- Create and schedule a campaign  
- Campaign emails are sent automatically at the scheduled time  
- Monitor logs and delivery status from the dashboard  
- Reports are sent to the admin email when campaigns complete  

---

## Assumptions

- Minimal UI is sufficient (tables/forms)  
- Gmail SMTP is used for sending emails  
- Focus on clean architecture

