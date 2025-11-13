# Jenkins CI/CD Demo Pipeline

## Prerequisites

- Docker installed
- GitHub account with SSH access
- Ubuntu/WSL environment
- ngrok account (free tier works)

## Quick Setup

### 1. Install Dependencies
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Build Custom Jenkins Image
```bash
mkdir -p ~/jenkins-custom
cd ~/jenkins-custom

cat > Dockerfile << 'DOCKERFILE'
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
USER jenkins
DOCKERFILE

docker build -t jenkins-custom .
```

### 3. Run Jenkins Container
```bash
mkdir -p ~/jenkins_home

docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v ~/jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --group-add $(getent group docker | cut -d: -f3) \
  --restart=unless-stopped \
  jenkins-custom
```

### 4. Access Jenkins
```bash
# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access Jenkins at http://localhost:8080
```

### 5. Setup ngrok (for GitHub webhooks)
```bash
# Install ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.stable.linux.amd64.tgz -o ngrok.tgz
tar xvzf ngrok.tgz -C /usr/local/bin

# Start ngrok tunnel
ngrok http 8080

# Note the public URL (e.g., https://xxxx.ngrok-free.dev)
```

## Jenkins Configuration

### Install Required Plugins

1. Go to **Manage Jenkins** → **Plugins**
2. Install:
   - Docker Pipeline
   - GitHub Integration Plugin
   - Pipeline: GitHub

### Add GitHub Credentials

1. Go to **Manage Jenkins** → **Credentials**
2. Add **Secret text** credential:
   - **Secret**: Your GitHub Personal Access Token
   - **ID**: `github-token`
   - **Description**: GitHub Personal Access Token

### Create Pipeline Project

1. Click **New Item**
2. Name: `Jenkins-Demo-Pipeline`
3. Type: **Pipeline**
4. Configuration:
   - **GitHub project**: `https://github.com/YOUR_USERNAME/Jenkins_Demo/`
   - **Build Triggers**: ☑ GitHub hook trigger for GITScm polling
   - **Pipeline Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/YOUR_USERNAME/Jenkins_Demo.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

### Configure GitHub Webhook

1. Go to your GitHub repository → **Settings** → **Webhooks**
2. Click **Add webhook**
3. **Payload URL**: `https://your-ngrok-url.ngrok-free.dev/github-webhook/`
4. **Content type**: `application/json`
5. **Events**: Just the push event
6. Click **Add webhook**

## Pipeline Stages

The Jenkinsfile defines the following stages:

1. **Checkout** - Clones the repository and retrieves commit info
2. **Environment Info** - Displays tool versions and build details
3. **Install Dependencies** - Runs `npm install`
4. **Parallel Tests** - Runs unit tests, linting, and security scans simultaneously
5. **Build Docker Image** - Creates Docker image with build number tag
6. **Test Docker Image** - Verifies the Docker image works correctly
7. **Deploy to Dev** - Deploys container to development environment (port 3002)
8. **Docker Image Info** - Lists created images and running containers

## Docker Details

### Image Tags
Each build creates multiple tags:
- `jenkins-demo-app:BUILD_NUMBER` - Specific build version
- `jenkins-demo-app:latest` - Latest build
- `jenkins-demo-app:dev` - Development environment

### Running Container
The deployed application runs on:
- **Container name**: `jenkins-demo-dev`
- **Port mapping**: `3002:3000`
- **Access**: `http://localhost:3002`

## Testing Locally
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Jenkins_Demo.git
cd Jenkins_Demo

# Run the application locally
node app.js

# Access at http://localhost:3000
```

## Manual Docker Build
```bash
# Build the image
docker build -t jenkins-demo-app:manual .

# Run the container
docker run -d -p 3000:3000 --name demo-app jenkins-demo-app:manual

# Test
curl http://localhost:3000

# View logs
docker logs demo-app

# Stop and remove
docker stop demo-app
docker rm demo-app
```

## Monitoring

### Check Pipeline Status
- View builds: Jenkins Dashboard → Jenkins-Demo-Pipeline
- Console output: Click build number → Console Output

### Check Running Containers
```bash
docker ps
docker logs jenkins-demo-dev
```

### Check Docker Images
```bash
docker images | grep jenkins-demo-app
```

## Troubleshooting

### Pipeline Fails at Docker Build
```bash
# Check if Docker socket is accessible
docker ps

# Restart Jenkins container if needed
docker restart jenkins
```

### Webhook Not Triggering
- Verify ngrok is running: `ngrok http 8080`
- Check GitHub webhook deliveries for errors
- Ensure webhook URL ends with `/github-webhook/`

### Container Won't Start
```bash
# Check container logs
docker logs jenkins-demo-dev

# Check for port conflicts
netstat -tlnp | grep 3002
```

### Jenkins Can't Access Docker
```bash
# Ensure Jenkins container has Docker access
docker exec jenkins docker ps

# If fails, recreate container with proper permissions
```

## Cleanup
```bash
# Stop and remove containers
docker stop jenkins jenkins-demo-dev
docker rm jenkins jenkins-demo-dev

# Remove images
docker rmi jenkins-custom jenkins-demo-app:latest jenkins-demo-app:dev

# Clean up volumes (WARNING: deletes all Jenkins data)
rm -rf ~/jenkins_home ~/jenkins-custom
```

## Learning Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)