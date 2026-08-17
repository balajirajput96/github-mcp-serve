#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";

// GitHub API token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

// Initialize Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Define available tools
const TOOLS: Tool[] = [
  {
    name: "list_repositories",
    description: "List repositories for a user or organization",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "GitHub username or organization name",
        },
        type: {
          type: "string",
          enum: ["owner", "public", "member"],
          description: "Type of repositories to list (default: owner)",
        },
        per_page: {
          type: "number",
          description: "Number of repositories per page (max 100, default 30)",
        },
      },
      required: ["username"],
    },
  },
  {
    name: "get_repository",
    description: "Get details of a specific repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "search_repositories",
    description: "Search for repositories on GitHub",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        sort: {
          type: "string",
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          description: "Sort field",
        },
        per_page: {
          type: "number",
          description: "Results per page (max 100, default 30)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_file_contents",
    description: "Get contents of a file from a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        path: {
          type: "string",
          description: "Path to the file",
        },
        ref: {
          type: "string",
          description: "Branch, tag, or commit SHA (default: default branch)",
        },
      },
      required: ["owner", "repo", "path"],
    },
  },
  {
    name: "list_issues",
    description: "List issues for a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        state: {
          type: "string",
          enum: ["open", "closed", "all"],
          description: "Issue state filter (default: open)",
        },
        per_page: {
          type: "number",
          description: "Results per page (max 100, default 30)",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "create_issue",
    description: "Create a new issue in a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        title: {
          type: "string",
          description: "Issue title",
        },
        body: {
          type: "string",
          description: "Issue body/description",
        },
        labels: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Labels to add to the issue",
        },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "list_pull_requests",
    description: "List pull requests for a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        state: {
          type: "string",
          enum: ["open", "closed", "all"],
          description: "PR state filter (default: open)",
        },
        per_page: {
          type: "number",
          description: "Results per page (max 100, default 30)",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "get_pull_request",
    description: "Get details of a specific pull request",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        pull_number: {
          type: "number",
          description: "Pull request number",
        },
      },
      required: ["owner", "repo", "pull_number"],
    },
  },
  {
    name: "create_pull_request",
    description: "Create a new pull request",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        title: {
          type: "string",
          description: "PR title",
        },
        head: {
          type: "string",
          description: "The name of the branch where your changes are",
        },
        base: {
          type: "string",
          description: "The name of the branch you want to merge into",
        },
        body: {
          type: "string",
          description: "PR description",
        },
      },
      required: ["owner", "repo", "title", "head", "base"],
    },
  },
  {
    name: "list_commits",
    description: "List commits in a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        sha: {
          type: "string",
          description: "Branch or commit SHA",
        },
        per_page: {
          type: "number",
          description: "Results per page (max 100, default 30)",
        },
      },
      required: ["owner", "repo"],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handler for listing tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handler for tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_repositories": {
        const { username, type = "owner", per_page = 30 } = args as any;
        const response = await octokit.repos.listForUser({
          username,
          type,
          per_page,
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

      case "get_repository": {
        const { owner, repo } = args as any;
        const response = await octokit.repos.get({
          owner,
          repo,
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

      case "search_repositories": {
        const { query, sort, per_page = 30 } = args as any;
        const response = await octokit.search.repos({
          q: query,
          sort,
          per_page,
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

      case "get_file_contents": {
        const { owner, repo, path, ref } = args as any;
        const response = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref,
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

      case "list_issues": {
        const { owner, repo, state = "open", per_page = 30 } = args as any;
        const response = await octokit.issues.listForRepo({
          owner,
          repo,
          state,
          per_page,
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

      case "create_issue": {
        const { owner, repo, title, body, labels } = args as any;
        const response = await octokit.issues.create({
          owner,
          repo,
          title,
          body,
          labels,
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

      case "list_pull_requests": {
        const { owner, repo, state = "open", per_page = 30 } = args as any;
        const response = await octokit.pulls.list({
          owner,
          repo,
          state,
          per_page,
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

      case "get_pull_request": {
        const { owner, repo, pull_number } = args as any;
        const response = await octokit.pulls.get({
          owner,
          repo,
          pull_number,
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

      case "create_pull_request": {
        const { owner, repo, title, head, base, body } = args as any;
        const response = await octokit.pulls.create({
          owner,
          repo,
          title,
          head,
          base,
          body,
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

      case "list_commits": {
        const { owner, repo, sha, per_page = 30 } = args as any;
        const response = await octokit.repos.listCommits({
          owner,
          repo,
          sha,
          per_page,
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

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
