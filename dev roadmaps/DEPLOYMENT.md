# Deployment Guide

This guide will help you deploy Co-Op Tracker Pro to production.

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `build`
3. **Environment Variables**:
   - Add `REACT_APP_API_URL=https://your-backend-url.railway.app`

#### Backend (Railway)
1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory
2. **Environment Variables**:
   - Add `FLASK_ENV=production`
   - Add `DATABASE_URL=your-postgresql-url`
3. **Database**: Railway will automatically provision a PostgreSQL database

### Option 2: Netlify + Render

#### Frontend (Netlify)
1. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `frontend/build` folder
   - Or connect your GitHub repository
2. **Environment Variables**: Same as Vercel

#### Backend (Render)
1. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn app:app`

## 🔧 Production Setup

### Backend Requirements
Create a `requirements.txt` file in the backend directory:

```txt
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-CORS==4.0.0
gunicorn==21.2.0
psycopg2-binary==2.9.7
python-dotenv==1.0.0
```

### Environment Variables
Create a `.env` file for local development:

```env
FLASK_ENV=development
DATABASE_URL=sqlite:///coop_tracker.db
SECRET_KEY=your-secret-key-here
```

### Database Migration
For production, you'll want to migrate from SQLite to PostgreSQL:

1. **Install PostgreSQL dependencies**:
   ```bash
   pip install psycopg2-binary
   ```

2. **Update database configuration**:
   ```python
   # In backend/database.py
   import os
   
   SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///coop_tracker.db')
   ```

3. **Initialize production database**:
   ```bash
   python init_database.py
   ```

## 🔒 Security Considerations

### Authentication (Future Enhancement)
1. **Implement JWT tokens**:
   ```python
   from flask_jwt_extended import JWTManager, create_access_token
   
   app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
   jwt = JWTManager(app)
   ```

2. **Add user authentication endpoints**:
   - `/auth/login`
   - `/auth/register`
   - `/auth/logout`

### CORS Configuration
Update your Flask app to handle CORS properly:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://your-frontend-domain.com'])
```

### Rate Limiting
Add rate limiting to prevent abuse:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

## 📊 Monitoring and Analytics

### Error Tracking
1. **Sentry Integration**:
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.flask import FlaskIntegration
   
   sentry_sdk.init(
       dsn="your-sentry-dsn",
       integrations=[FlaskIntegration()]
   )
   ```

2. **Logging**:
   ```python
   import logging
   
   logging.basicConfig(level=logging.INFO)
   logger = logging.getLogger(__name__)
   ```

### Performance Monitoring
- **Frontend**: Use React DevTools and Lighthouse
- **Backend**: Use Flask-Profiler or similar tools
- **Database**: Monitor query performance

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway/deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🧪 Testing

### Frontend Testing
```bash
npm test
npm run build
```

### Backend Testing
```bash
python -m pytest test_routes.py
```

## 📈 Scaling Considerations

### Database Scaling
- **Connection Pooling**: Use connection pooling for database connections
- **Read Replicas**: For high-traffic applications
- **Caching**: Implement Redis for frequently accessed data

### Application Scaling
- **Load Balancing**: Use multiple instances behind a load balancer
- **CDN**: Serve static assets through a CDN
- **Microservices**: Consider breaking into smaller services

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure CORS is properly configured
2. **Database Connection**: Check DATABASE_URL environment variable
3. **Build Failures**: Verify all dependencies are in requirements.txt
4. **Environment Variables**: Ensure all required env vars are set

### Debug Mode
For debugging production issues:
```python
app.config['DEBUG'] = True  # Only in development
```

## 📞 Support

If you encounter deployment issues:
1. Check the logs in your hosting platform
2. Verify environment variables are set correctly
3. Test locally with production-like settings
4. Contact the hosting platform's support

---

**Happy Deploying! 🚀** 