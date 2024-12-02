# CineStream - Self-Hosted Deployment Guide

This guide will help you deploy CineStream on your own infrastructure.

## Prerequisites

- Docker and Docker Compose installed
- A server with at least 1GB RAM and 2 CPU cores
- Domain name (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token
VITE_BRANDFETCH_API_KEY=your_brandfetch_api_key
```

## Deployment Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd cinestream
```

2. Create and configure the `.env` file as described above.

3. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

4. Run the deployment script:
```bash
./deploy.sh
```

The application will be available at `http://localhost` or your domain.

## Manual Deployment

If you prefer to deploy manually:

1. Build the Docker image:
```bash
docker-compose build
```

2. Start the containers:
```bash
docker-compose up -d
```

## SSL/HTTPS Setup

To enable HTTPS, you'll need to:

1. Point your domain to your server's IP
2. Install Certbot:
```bash
apt-get install certbot python3-certbot-nginx
```

3. Obtain SSL certificate:
```bash
certbot --nginx -d yourdomain.com
```

## Monitoring

Check container status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f
```

## Updating

To update the application:

1. Pull the latest changes:
```bash
git pull
```

2. Run the deployment script:
```bash
./deploy.sh
```

## Backup

The application is stateless, but you might want to backup:
- `.env` file
- Any custom nginx configurations
- User data (if you've added any persistence)

## Troubleshooting

Common issues:

1. **Port 80 already in use**
   - Change the port in docker-compose.yml
   - Stop the conflicting service

2. **Environment variables not loading**
   - Check .env file exists and is properly formatted
   - Verify deploy.sh has execute permissions

3. **Nginx configuration issues**
   - Check nginx logs: `docker-compose logs nginx`
   - Verify nginx.conf syntax: `nginx -t`

## Support

For issues and support:
- Create an issue in the repository
- Contact the development team

## License

[Your License Information]