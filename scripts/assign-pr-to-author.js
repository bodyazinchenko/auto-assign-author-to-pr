const authorIsBot = author =>
  author === 'github-actions[bot]' || author === 'dependabot[bot]';

const assignPullRequestToAuthor = async ({ author, github, core, context }) => {
  try {
    const { owner, repo, number } = context.issue;

    await github.rest.issues.addAssignees({
      owner,
      repo,
      issue_number: number,
      assignees: [author],
    });
    core.info(`Added assignees to PR #${number}: ${author}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = async ({ github, context, core }) => {
  const { pull_request: pullRequest } = context.payload;

  if (!pullRequest) {
    throw new Error('context.payload.pull_request is not exist');
  }

  const {
    user: { login: author },
    assignees,
  } = pullRequest;
  if (authorIsBot(author)) {
    core.info(`Can't assign pull-request to bot`);
    return null;
  }

  if (assignees.length > 0) {
    core.info('Pull request already has assignees');
    return null;
  }

  assignPullRequestToAuthor({
    author,
    github,
    core,
    context,
  });
};
