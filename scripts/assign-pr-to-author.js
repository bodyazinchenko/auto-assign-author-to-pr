const core = require('@actions/core');
const github = require('@actions/github');

const authorIsBot = author =>
  author === 'github-actions[bot]' || author === 'dependabot[bot]';

const assignPullRequestToAuthor = async ({ author, octokit, context }) => {
  try {
    const { owner, repo, number } = context.issue;
    await octokit.rest.issues.addAssignees({
      owner,
      repo,
      issue_number: number,
      assignees: [author],
    });
    core.info(`Added assignees to PR #${number}: ${author}`);
  } catch (error) {
    core.setFailed(`Failed to assign PR: ${error.message}`);
  }
};

async function run() {
  try {
    const token = core.getInput('github_token');
    const octokit = github.getOctokit(token);
    const context = github.context;

    const { pull_request: pullRequest } = context.payload;
    if (!pullRequest) {
      throw new Error('This action can only be run on pull_request events');
    }

    const {
      user: { login: author },
      assignees,
    } = pullRequest;

    if (authorIsBot(author)) {
      core.info(`Can't assign pull-request to bot`);
      return;
    }

    if (assignees.length > 0) {
      core.info('Pull request already has assignees');
      return;
    }

    await assignPullRequestToAuthor({
      author,
      octokit,
      context,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();