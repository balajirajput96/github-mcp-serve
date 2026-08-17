# GitHub MCP Server

A Model Context Protocol (MCP) server for GitHub API integration, enabling AI agents to interact with GitHub repositories, issues, pull requests, and more.

**[📖 Quick Start Guide](QUICKSTART.md)** | **[📚 Usage Guide](USAGE.md)** | **[🚀 Deployment Guide](DEPLOYMENT.md)**

## Features

- 🔍 **Repository Operations**: List, search, and get repository details
- 📁 **File Access**: Read file contents from repositories
- 🐛 **Issue Management**: List and create issues
- 🔄 **Pull Requests**: List, get, and create pull requests
- 📝 **Commit History**: Browse commit history
- 🔐 **Secure Authentication**: Uses GitHub Personal Access Token

## Installation

### Prerequisites

- Node.js 18 or higher
- GitHub Personal Access Token

### Local Installation

```bash
# Clone the repository
git clone https://github.com/balajirajput96/github-mcp-serve.git
cd github-mcp-serve

# Install dependencies
npm install

# Build the project
npm run build
```

### Docker Installation

**Important**: Build the application locally first before building the Docker image:

```bash
# Build the application locally
npm install
npm run build

# Build the Docker image
docker build -t github-mcp-server .

# Run with environment variable
docker run -e GITHUB_TOKEN=your_token_here github-mcp-server
```

Or use Docker Compose:

```bash
# Build the application locally first
npm install
npm run build

# Copy environment example
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN

# Run with docker-compose
docker-compose up
```

## Configuration

### GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with appropriate scopes:
   - `repo` - Full control of private repositories
   - `public_repo` - Access to public repositories
   - `read:user` - Read user profile data
3. Set the token as an environment variable:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

## Usage

### Running the Server

```bash
# After building
npm start

# Or with development watch mode
npm run dev
```

### Available Tools

The server provides the following MCP tools:

1. **list_repositories**: List repositories for a user or organization
2. **get_repository**: Get details of a specific repository
3. **search_repositories**: Search for repositories on GitHub
4. **get_file_contents**: Get contents of a file from a repository
5. **list_issues**: List issues for a repository
6. **create_issue**: Create a new issue in a repository
7. **list_pull_requests**: List pull requests for a repository
8. **get_pull_request**: Get details of a specific pull request
9. **create_pull_request**: Create a new pull request
10. **list_commits**: List commits in a repository

### Example Integration

Configure your MCP client to use this server:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/path/to/github-mcp-serve/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Development

### Project Structure

```
github-mcp-serve/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── .github/
│   └── workflows/
│       ├── ci.yml       # CI pipeline
│       └── docker.yml   # Docker build pipeline
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

## Deployment

### GitHub Actions

The repository includes CI/CD workflows:

- **CI**: Builds and tests on multiple Node.js versions
- **Docker**: Builds and publishes Docker images

### Docker Hub

Configure Docker Hub credentials in GitHub Secrets:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password/token

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

balajirajput96
