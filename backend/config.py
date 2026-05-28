import os
from datetime import timedelta
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse


def is_postgres_url(url):
    return bool(
        url
        and (
            url.startswith('postgres://')
            or url.startswith('postgresql://')
            or url.startswith('postgresql+')
        )
    )


def normalize_database_url(url):
    """Render Postgres needs postgresql:// and sslmode=require."""
    if not url or not is_postgres_url(url):
        return url
    if url.startswith('postgres://'):
        url = url.replace('postgres://', 'postgresql://', 1)
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    if 'sslmode' not in query:
        query['sslmode'] = ['require']
    return urlunparse(parsed._replace(query=urlencode(query, doseq=True)))


POSTGRES_ENGINE_OPTIONS = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
    'max_overflow': 20,
    'connect_args': {
        'sslmode': 'require',
        'connect_timeout': 10,
        'application_name': 'coop-tracker',
    },
}


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Database Configuration
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///instance/coop_tracker.db'
    SQLALCHEMY_DATABASE_URI = normalize_database_url(DATABASE_URL)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    if is_postgres_url(DATABASE_URL):
        SQLALCHEMY_ENGINE_OPTIONS = POSTGRES_ENGINE_OPTIONS
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,https://co-op-tracker-orcin.vercel.app').split(',')
    
    # Development settings
    DEBUG = True

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
} 