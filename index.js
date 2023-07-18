const fetch = require('node-fetch');
const { Octokit } = require("@octokit/core");
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');


// Create a new Octokit instance
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    fetch: fetch,
  },
});

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  
  // Parse the changelog
  let filtered_lines = [];
  let start_processing = false;

  const path = require('path');
  const changelogPath = path.join(process.env.GITHUB_WORKSPACE, 'CHANGELOG.md');
  const lines = fs.readFileSync(changelogPath, 'utf-8').split('\n');
  for(let line of lines) {
    if(line.startsWith("#### [v")) {
      if(start_processing) {
        break;
      } else {
        start_processing = true;
        continue;
      }
    }
    if(start_processing) {
      filtered_lines.push(line);
    }
  }

  fs.writeFileSync('FILTERED_CHANGELOG.md', filtered_lines.join('\n'));

  // Create a new release with the contents of 'FILTERED_CHANGELOG.md'
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const body = fs.readFileSync('FILTERED_CHANGELOG.md', 'utf-8');

  octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: github.ref_name,
    name: 'Release ' + github.ref_name,
    body: body,
    draft: false,
    prerelease: false
  })
  .catch((error) => {
    core.setFailed(error.message);
  });

} catch (error) {
  core.setFailed(error.message);
}
