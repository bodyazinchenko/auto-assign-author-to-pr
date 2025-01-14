# Auto Assign PR Author

This GitHub Action automatically assigns pull requests to their authors. It skips bot-created PRs and PRs that already have assignees.

## Features

- Automatically assigns the PR author as the assignee
- Skips bot-created PRs (including GitHub Actions and Dependabot)
- Skips PRs that already have assignees
- Provides informative logging

## Usage

Add this to your workflow file (e.g., `.github/workflows/auto-assign.yml`):

```yaml
name: Auto Assign PR Author
on:
  pull_request:
    types: [opened, reopened]

permissions:
  pull-requests: write
  issues: write

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    steps:
      - uses: bodyazinchenko/auto-assign-author-to-pr@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Permissions

This action requires the following permissions:
- `pull-requests: write` - needed to assign users to PRs
- `issues: write` - needed because PR assignments use the issues API

These permissions are automatically granted when using the default `GITHUB_TOKEN`.

## Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `github_token` | GitHub token for authentication | Yes |

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.