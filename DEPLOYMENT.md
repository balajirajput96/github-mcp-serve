# Deployment Guide

This guide covers various deployment options for the GitHub MCP Server.

## Prerequisites

- GitHub Personal Access Token with appropriate scopes
- Node.js 18+ (for local/npm deployment)
- Docker (for containerized deployment)
- GitHub account with repository access

## Deployment Options

### 1. Local Deployment

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/balajirajput96/github-mcp-serve.git
cd github-mcp-serve

# Install dependencies
npm install

# Build the project
npm run build

# Set environment variable
export GITHUB_TOKEN=ghp_your_token_here

# Run the server
npm start
```

#### As a Global Package

```bash
# Build and link globally
npm run build
npm link

# Run from anywhere
GITHUB_TOKEN=ghp_your_token_here github-mcp-server
```

### 2. Docker Deployment

#### Using Docker CLI

```bash
# Build the image
docker build -t github-mcp-server .

# Run the container
docker run -e GITHUB_TOKEN=ghp_your_token_here github-mcp-server
```

#### Using Docker Compose

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your GITHUB_TOKEN
nano .env

# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

### 3. Cloud Deployment

#### AWS ECS/Fargate

1. Push Docker image to ECR:
```bash
aws ecr get-login-password --region region | docker login --username AWS --password-stdin account-id.dkr.ecr.region.amazonaws.com
docker tag github-mcp-server:latest account-id.dkr.ecr.region.amazonaws.com/github-mcp-server:latest
docker push account-id.dkr.ecr.region.amazonaws.com/github-mcp-server:latest
```

2. Create ECS task definition with environment variable for GITHUB_TOKEN
3. Create ECS service

#### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/github-mcp-server

# Deploy to Cloud Run
gcloud run deploy github-mcp-server \
  --image gcr.io/PROJECT_ID/github-mcp-server \
  --set-env-vars GITHUB_TOKEN=ghp_your_token_here \
  --platform managed
```

#### Azure Container Instances

```bash
# Build and push to ACR
az acr build --registry myregistry --image github-mcp-server .

# Deploy to ACI
az container create \
  --resource-group myResourceGroup \
  --name github-mcp-server \
  --image myregistry.azurecr.io/github-mcp-server:latest \
  --environment-variables GITHUB_TOKEN=ghp_your_token_here
```

### 4. Kubernetes Deployment

Create a deployment manifest:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: github-token
type: Opaque
stringData:
  token: ghp_your_token_here
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: github-mcp-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: github-mcp-server
  template:
    metadata:
      labels:
        app: github-mcp-server
    spec:
      containers:
      - name: github-mcp-server
        image: github-mcp-server:latest
        env:
        - name: GITHUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: github-token
              key: token
```

Deploy:
```bash
kubectl apply -f deployment.yaml
```

## Configuration for MCP Clients

### Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/absolute/path/to/github-mcp-serve/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### VS Code with Continue

Add to `.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "github",
      "command": "node",
      "args": ["/absolute/path/to/github-mcp-serve/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  ]
}
```

## CI/CD Setup

### GitHub Actions

The repository includes two workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on push to main and PRs
   - Tests builds on Node.js 18 and 20
   - Validates build output

2. **Docker Workflow** (`.github/workflows/docker.yml`)
   - Builds and pushes Docker images
   - Requires Docker Hub credentials in secrets:
     - `DOCKER_USERNAME`
     - `DOCKER_PASSWORD`

To enable Docker publishing:

```bash
# Add secrets to your GitHub repository
gh secret set DOCKER_USERNAME
gh secret set DOCKER_PASSWORD
```

### Automated Deployment

For automated deployment to production:

1. Create a new workflow file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Cloud Run
      run: |
        # Add your deployment commands here
        gcloud run deploy github-mcp-server \
          --image gcr.io/$PROJECT_ID/github-mcp-server:${{ github.ref_name }} \
          --platform managed
```

## Security Best Practices

1. **Never commit tokens**: Always use environment variables or secrets management
2. **Rotate tokens regularly**: Update your GitHub tokens periodically
3. **Use minimal scopes**: Only grant necessary permissions to your token
4. **Monitor usage**: Keep track of API rate limits and usage
5. **Use secrets management**: For production, use AWS Secrets Manager, Azure Key Vault, or similar

## Monitoring and Logging

### View Server Logs

**Docker**:
```bash
docker logs -f container_name
```

**Docker Compose**:
```bash
docker-compose logs -f
```

**Kubernetes**:
```bash
kubectl logs -f deployment/github-mcp-server
```

### Health Checks

The server logs to stderr. Monitor for:
- Startup message: "GitHub MCP Server running on stdio"
- Error messages indicate API issues or configuration problems

## Troubleshooting

### Common Issues

1. **"GITHUB_TOKEN environment variable is required"**
   - Solution: Ensure GITHUB_TOKEN is set in your environment

2. **401 Unauthorized errors**
   - Solution: Check that your token is valid and not expired

3. **403 Forbidden errors**
   - Solution: Verify your token has the required scopes

4. **Build failures**
   - Solution: Ensure Node.js 18+ is installed
   - Run `npm ci` to clean install dependencies

5. **Docker build fails**
   - Solution: Check Docker daemon is running
   - Ensure all files are present in the build context

## Scaling Considerations

- The server is stateless and can be horizontally scaled
- Each instance needs its own GitHub token or can share one
- Consider rate limits when scaling (5000 req/hour per token)
- Use multiple tokens with load balancing for higher throughput

## Support

For issues or questions:
- Open an issue on GitHub
- Check the USAGE.md file for detailed examples
- Review GitHub API documentation for rate limits and permissions
