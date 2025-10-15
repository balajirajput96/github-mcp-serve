# Contributing to GitHub MCP Server

Thank you for your interest in contributing to the GitHub MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions with the project and community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (Node.js version, OS, etc.)

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/balajirajput96/github-mcp-serve.git
   cd github-mcp-serve
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run build
   npm start  # Test with a valid GITHUB_TOKEN
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for test additions/changes
   - `chore:` for maintenance tasks

6. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- GitHub Personal Access Token

### Setup Steps

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
github-mcp-serve/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled output (generated)
├── .github/
│   └── workflows/        # CI/CD workflows
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Docker container definition
└── README.md             # Project documentation
```

## Adding New Tools

To add a new GitHub API tool:

1. **Add tool definition** in the `TOOLS` array:
```typescript
{
  name: "your_tool_name",
  description: "Tool description",
  inputSchema: {
    type: "object",
    properties: {
      param1: {
        type: "string",
        description: "Parameter description",
      },
    },
    required: ["param1"],
  },
}
```

2. **Add handler** in the `CallToolRequestSchema` handler:
```typescript
case "your_tool_name": {
  const { param1 } = args as any;
  const response = await octokit.someApi.someMethod({
    param1,
  });
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
}
```

3. **Test the tool** by building and running the server

4. **Document the tool** in USAGE.md

## Code Style

- Use TypeScript
- Follow existing formatting patterns
- Use meaningful variable and function names
- Add JSDoc comments for exported functions
- Keep functions focused and small

## Testing

Currently, the project uses manual testing. Contributions to add automated testing are welcome!

To manually test:
```bash
# Build the project
npm run build

# Test with a real GitHub token
export GITHUB_TOKEN=your_token
node dist/index.js
```

## Documentation

When contributing, please update:
- README.md - For major features or setup changes
- USAGE.md - For new tools or tool changes
- DEPLOYMENT.md - For deployment-related changes
- Comments in code - For complex logic

## Questions?

Feel free to open an issue for any questions about contributing!
