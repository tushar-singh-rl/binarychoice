# Deploying Binary Quiz Application to EC2

## Prerequisites

Before deploying to EC2, ensure you have:
- An EC2 instance running Ubuntu 20.04 or later
- SSH access to your EC2 instance
- Node.js 18+ installed on the EC2 instance
- A domain name (optional, for custom domain setup)

## Deployment Steps

### 1. Prepare Your EC2 Instance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install Git (if not already installed)
sudo apt install git -y
```

### 2. Clone and Setup Your Application

```bash
# Clone your repository (replace with your actual repo URL)
git clone <your-repository-url> /var/www/binary-quiz
cd /var/www/binary-quiz

# Install dependencies
npm install

# Build the application
npm run build
```

### 3. Environment Configuration

Create a production environment file:

```bash
# Create environment file
sudo nano /var/www/binary-quiz/.env.production
```

Add the following content:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url_if_using_postgres
```

### 4. PM2 Process Configuration

Create a PM2 ecosystem file:

```bash
# Create PM2 config
sudo nano /var/www/binary-quiz/ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'binary-quiz',
    script: 'dist/index.js',
    cwd: '/var/www/binary-quiz',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/binary-quiz-error.log',
    out_file: '/var/log/pm2/binary-quiz-out.log',
    log_file: '/var/log/pm2/binary-quiz.log'
  }]
};
```

### 5. Start the Application with PM2

```bash
# Start the application
cd /var/www/binary-quiz
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### 6. Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/binary-quiz
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Handle static files
    location /assets/ {
        alias /var/www/binary-quiz/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle favicon and other static files
    location ~ \.(ico|css|js|gif|jpeg|jpg|png|woff|woff2|ttf|svg|eot)$ {
        root /var/www/binary-quiz/dist/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7. Enable Nginx Configuration

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/binary-quiz /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### 8. Configure Firewall

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22  # SSH access

# Enable firewall
sudo ufw enable
```

### 9. SSL Certificate (Optional but Recommended)

If you have a domain name, set up SSL with Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Deployment Script

Create an automated deployment script:

```bash
# Create deployment script
sudo nano /var/www/binary-quiz/deploy.sh
```

Add this content:
```bash
#!/bin/bash

# Deployment script for Binary Quiz Application
echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Restart PM2 process
pm2 restart binary-quiz

# Reload Nginx
sudo nginx -s reload

echo "Deployment completed successfully!"
```

Make it executable:
```bash
sudo chmod +x /var/www/binary-quiz/deploy.sh
```

## Monitoring and Maintenance

### View Application Logs
```bash
# View PM2 logs
pm2 logs binary-quiz

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor Application Status
```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Monitor system resources
htop
```

### Database Setup (If Using PostgreSQL)

If you plan to use a real database instead of in-memory storage:

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres psql
CREATE DATABASE binary_quiz;
CREATE USER quiz_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE binary_quiz TO quiz_user;
\q
```

Update your `.env.production` file with the database URL:
```env
DATABASE_URL=postgresql://quiz_user:your_password@localhost:5432/binary_quiz
```

## Security Considerations

1. **Keep your system updated**: Regularly run `sudo apt update && sudo apt upgrade`
2. **Use strong passwords**: For database and system users
3. **Configure fail2ban**: To protect against brute force attacks
4. **Regular backups**: If using a database, set up automated backups
5. **Monitor logs**: Check application and system logs regularly

## Troubleshooting

### Common Issues:

1. **Port 3000 already in use**: Check with `sudo lsof -i :3000` and kill the process
2. **Permission denied**: Ensure proper file permissions with `sudo chown -R $USER:$USER /var/www/binary-quiz`
3. **Nginx configuration errors**: Test with `sudo nginx -t` before restarting
4. **PM2 not starting**: Check logs with `pm2 logs` for detailed error messages

Your application will be accessible at:
- HTTP: `http://your-ec2-public-ip` or `http://your-domain.com`
- HTTPS: `https://your-domain.com` (if SSL is configured)