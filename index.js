const fetch = require('node-fetch').default;
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");
const path = require('path');

async function main() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({
      auth: token,
      request: { fetch: fetch, },
    }); 
      //const octokit = new Octokit({ auth: token });


    // Parse the changelog
    let filtered_lines = [];
    let start_processing = false;

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

    const filteredChangelogPath = path.join(process.env.GITHUB_WORKSPACE, 'FILTERED_CHANGELOG.md');
    fs.writeFileSync(filteredChangelogPath, filtered_lines.join('\n'));

    // Read the filtered changelog
    const releaseBody = fs.readFileSync(filteredChangelogPath, 'utf-8');

    // Create a new release
    const { owner, repo } = github.context.repo;
    const { ref_name: tagName } = github.context.ref;

    const response = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      name: `Release ${tagName}`,
      body: releaseBody,
      draft: false,
      prerelease: false,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
