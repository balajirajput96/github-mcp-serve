# Usage Guide

This guide provides detailed examples of how to use the GitHub MCP Server.

## Tool Reference

### 1. list_repositories

List repositories for a specific user or organization.

**Parameters:**
- `username` (required): GitHub username or organization name
- `type` (optional): Type of repositories - "owner", "public", or "member" (default: "owner")
- `per_page` (optional): Number of repositories per page (max 100, default 30)

**Example:**
```json
{
  "name": "list_repositories",
  "arguments": {
    "username": "octocat",
    "type": "owner",
    "per_page": 10
  }
}
```

### 2. get_repository

Get detailed information about a specific repository.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name

**Example:**
```json
{
  "name": "get_repository",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World"
  }
}
```

### 3. search_repositories

Search for repositories across GitHub.

**Parameters:**
- `query` (required): Search query
- `sort` (optional): Sort field - "stars", "forks", "help-wanted-issues", or "updated"
- `per_page` (optional): Results per page (max 100, default 30)

**Example:**
```json
{
  "name": "search_repositories",
  "arguments": {
    "query": "machine learning language:python",
    "sort": "stars",
    "per_page": 20
  }
}
```

### 4. get_file_contents

Get the contents of a file from a repository.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `path` (required): Path to the file
- `ref` (optional): Branch, tag, or commit SHA (default: default branch)

**Example:**
```json
{
  "name": "get_file_contents",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "path": "README.md",
    "ref": "main"
  }
}
```

### 5. list_issues

List issues for a repository.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `state` (optional): Issue state - "open", "closed", or "all" (default: "open")
- `per_page` (optional): Results per page (max 100, default 30)

**Example:**
```json
{
  "name": "list_issues",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "state": "open",
    "per_page": 10
  }
}
```

### 6. create_issue

Create a new issue in a repository.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `title` (required): Issue title
- `body` (optional): Issue body/description
- `labels` (optional): Array of labels to add

**Example:**
```json
{
  "name": "create_issue",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "title": "Bug: Application crashes on startup",
    "body": "## Description\n\nThe application crashes when...",
    "labels": ["bug", "priority-high"]
  }
}
```

### 7. list_pull_requests

List pull requests for a repository.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `state` (optional): PR state - "open", "closed", or "all" (default: "open")
- `per_page` (optional): Results per page (max 100, default 30)

**Example:**
```json
{
  "name": "list_pull_requests",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "state": "open"
  }
}
```

### 8. get_pull_request

Get details of a specific pull request.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `pull_number` (required): Pull request number

**Example:**
```json
{
  "name": "get_pull_request",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "pull_number": 42
  }
}
```

### 9. create_pull_request

Create a new pull request.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `title` (required): PR title
- `head` (required): The name of the branch where your changes are
- `base` (required): The name of the branch you want to merge into
- `body` (optional): PR description

**Example:**
```json
{
  "name": "create_pull_request",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "title": "Add new feature",
    "head": "feature-branch",
    "base": "main",
    "body": "This PR adds a new feature that..."
  }
}
```

### 10. list_commits

List commits in a repository.

**Parameters:**
- `owner` (required): Repository owner
- `repo` (required): Repository name
- `sha` (optional): Branch or commit SHA
- `per_page` (optional): Results per page (max 100, default 30)

**Example:**
```json
{
  "name": "list_commits",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "sha": "main",
    "per_page": 20
  }
}
```

## Common Use Cases

### Monitoring Open Issues

```json
{
  "name": "list_issues",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "state": "open"
  }
}
```

### Finding Popular Repositories

```json
{
  "name": "search_repositories",
  "arguments": {
    "query": "stars:>1000 language:javascript",
    "sort": "stars",
    "per_page": 50
  }
}
```

### Reading Documentation

```json
{
  "name": "get_file_contents",
  "arguments": {
    "owner": "octocat",
    "repo": "Hello-World",
    "path": "docs/README.md"
  }
}
```

### Reviewing Pull Requests

```json
{
  "name": "list_pull_requests",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "state": "open"
  }
}
```

Then get details:
```json
{
  "name": "get_pull_request",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "pull_number": 123
  }
}
```

## Error Handling

The server returns errors in the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Not Found"
    }
  ],
  "isError": true
}
```

Common errors:
- **401 Unauthorized**: Invalid or expired GitHub token
- **403 Forbidden**: Token doesn't have required permissions
- **404 Not Found**: Repository, issue, or file doesn't exist
- **422 Validation Failed**: Invalid parameters

## Tips

1. **Rate Limiting**: GitHub API has rate limits. Authenticated requests have higher limits.
2. **Token Scopes**: Ensure your token has the necessary scopes for the operations you want to perform.
3. **Pagination**: Use `per_page` to control the number of results returned.
4. **Search Queries**: Learn GitHub's search syntax for powerful repository searches.
