# Development related setting
import os
from .base import *

DEBUG = os.getenv("DEBUG", "True") == "True"
CORS_ALLOW_ALL_ORIGINS = True

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# Development database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ["POSTGRES_DB"],
        'USER': os.environ["POSTGRES_USER"],
        'PASSWORD': os.environ["POSTGRES_PASSWORD"],
        'HOST': os.environ["DB_HOST"],
        'PORT': os.environ.get("DB_PORT", "5432"),
    }
}
