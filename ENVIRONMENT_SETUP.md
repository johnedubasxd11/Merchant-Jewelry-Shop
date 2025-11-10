# Environment Setup Guide

This guide provides detailed instructions for setting up the development and production environments for the Elegant Jewelry Store application.

## Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v4.4 or higher (local or cloud)
- **Git**: For version control

### Development Tools (Recommended)
- **VS Code**: Code editor
- **MongoDB Compass**: Database GUI
- **Postman**: API testing
- **Chrome DevTools**: Browser debugging

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:4000/api

# Optional: Development settings
VITE_DEBUG=true
VITE_MOCK_DATA=false
```

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/jewelry_store

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
BCRYPT_ROUNDS=12

# Optional: Email Configuration (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: File Upload (for future features)
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=5242880
```

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd jewelry-store
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Set Up Environment Files

Create the environment files as described above with appropriate values.

### 4. Set Up MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Create database (optional - will be created automatically)
mongosh
use jewelry_store
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get connection string and update `MONGO_URI`

### 5. Seed Database (Optional)

```bash
# Create seed data file (server/scripts/seed.js)
node server/scripts/seed.js
```

### 6. Start Development Servers

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

### 7. Verify Setup

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Test: http://localhost:4000/api/products

## Production Environment Setup

### 1. Server Preparation

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 process manager
sudo npm install -g pm2

# Install MongoDB (if using local)
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org
```

#### CentOS/RHEL
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Application Deployment

```bash
# Clone repository
git clone <repository-url>
cd jewelry-store

# Install dependencies
npm install
cd server && npm install && cd ..

# Build frontend
npm run build

# Copy production environment files
# (Upload your .env files with production values)
```

### 3. Process Management with PM2

```bash
# Start backend with PM2
cd server
pm2 start app.js --name "jewelry-store-api"

# Start frontend with PM2
cd ..
pm2 start --name "jewelry-store-frontend" -- npm run preview

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor processes
pm2 status
pm2 logs
```

### 4. Reverse Proxy with Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/jewelry-store
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Connection "";
    }

    # Static files (if serving directly)
    location /static/ {
        alias /path/to/your/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/jewelry-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Environment Variables for Production

Create production environment files:

**Frontend (.env)**
```bash
VITE_API_URL=https://your-domain.com/api
```

**Backend (server/.env)**
```bash
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb://localhost:27017/jewelry_store_prod
JWT_SECRET=your-super-secure-production-jwt-secret
```

## Docker Setup (Alternative)

### Development with Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:4000/api
    depends_on:
      - backend

  backend:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://mongo:27017/jewelry_store
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Production with Docker

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Scale backend
docker-compose up -d --scale backend=3
```

## Environment-Specific Configurations

### Development
- Detailed error messages
- Hot reloading enabled
- Debug logging
- Mock data available
- No caching

### Production
- Minified code
- Optimized bundles
- Error tracking
- Monitoring enabled
- Caching enabled
- Rate limiting
- Security headers

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :4000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

#### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Fix file permissions
sudo chown -R $(whoami) /path/to/project
```

#### Environment Variables Not Loading
```bash
# Check .env file exists
ls -la .env

# Check file permissions
chmod 644 .env

# Restart application
pm2 restart all
```

### Log Files

#### Backend Logs
```bash
# PM2 logs
pm2 logs jewelry-store-api

# Application logs
tail -f server/logs/app.log
```

#### Frontend Logs
```bash
# Browser console
# Developer tools (F12)

# Build logs
npm run build > build.log 2>&1
```

## Security Checklist

### Development
- [ ] Use strong JWT secrets
- [ ] Validate all inputs
- [ ] Implement proper error handling
- [ ] Use HTTPS for external APIs

### Production
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up SSL/TLS
- [ ] Configure security headers
- [ ] Enable CORS properly
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Backup strategy
- [ ] Disaster recovery plan

## Monitoring and Maintenance

### Application Monitoring
```bash
# PM2 monitoring
pm2 monitor

# System monitoring
htop
df -h
```

### Database Maintenance
```bash
# MongoDB maintenance
mongosh
use jewelry_store
db.runCommand({compact: 'users'})
db.runCommand({repairDatabase: 1})
```

### Log Rotation
```bash
# Set up logrotate
sudo nano /etc/logrotate.d/jewelry-store
```

This setup guide provides a comprehensive foundation for both development and production environments. Adjust configurations based on your specific requirements and infrastructure.