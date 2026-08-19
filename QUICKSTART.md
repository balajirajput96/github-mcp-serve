# Quick Start Guide

Get up and running with GitHub MCP Server in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- A GitHub fine-grained personal access token. Create or manage one at [GitHub Settings](https://github.com/settings/personal-access-tokens/new); use a classic token only when a required GitHub API capability is not supported by fine-grained tokens.

## 🚀 Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/balajirajput96/github-mcp-serve.git
cd github-mcp-serve
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Set Your GitHub Token

```bash
export GITHUB_TOKEN="<your-github-token>"
```

### 4. Run

```bash
npm start
```

You should see: `GitHub MCP Server running on stdio`

## 🎯 Quick Test

The server communicates via stdio and follows the MCP protocol. To use it:

### With Claude Desktop

1. Edit your Claude Desktop config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add this configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/full/path/to/github-mcp-serve/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "<your-github-token>"
      }
    }
  }
}
```

3. Restart Claude Desktop

4. You can now ask Claude to:
   - "List repositories for user octocat"
   - "Search for popular machine learning repositories"
   - "Get the README from repository owner/repo"
   - "List open issues in owner/repo"
   - And more!

## 🐳 Docker Quick Start

```bash
# Build locally first
npm install
npm run build

# Build Docker image
docker build -t github-mcp-server .

# Run with your token
docker run -e GITHUB_TOKEN="<your-github-token>" github-mcp-server
```

## 📚 What's Next?

- Read [USAGE.md](USAGE.md) for detailed tool documentation
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment options
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## 🛠️ Available Tools

The server provides these tools:

1. **list_repositories** - List user/org repositories
2. **get_repository** - Get repo details
3. **search_repositories** - Search GitHub repos
4. **get_file_contents** - Read files from repos
5. **list_issues** - List issues
6. **create_issue** - Create new issues
7. **list_pull_requests** - List PRs
8. **get_pull_request** - Get PR details
9. **create_pull_request** - Create new PRs
10. **list_commits** - List commits

## ⚡ Pro Tips

1. **Least privilege**: Fine-grained tokens are preferred. Restrict the token to only the repositories this server needs and choose only the required permissions: repository metadata, contents, issues, and pull requests, with write access only when creating issues or pull requests.
2. **Expiration**: Set an expiration and rotate the token through GitHub Settings rather than storing it in source control.
3. **Rate Limits**: Authenticated requests have 5000/hour limit.
4. **Error Messages**: Check stderr for detailed error information.
5. **Testing**: Use a test repository to try out features first.

## 🆘 Troubleshooting

**Error: GITHUB_TOKEN environment variable is required**
- Solution: Set the environment variable before running

**Error: 401 Unauthorized**
- Solution: Check your token is valid and not expired

**Error: 404 Not Found**
- Solution: Verify repository/file path exists and you have access

## 📞 Need Help?

- Check the [README.md](README.md) for full documentation
- Open an issue on GitHub
- Review [USAGE.md](USAGE.md) for tool examples

---

Happy coding! 🎉
