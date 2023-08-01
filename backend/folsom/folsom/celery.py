# django_celery/celery.py

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "folsom.settings")
app = Celery("folsom")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
