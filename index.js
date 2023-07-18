const fetch = require('node-fetch').default;
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");
const path = require('path');

async function main() {
  try {
    const token = process.env.GITHUB_TOKEN; 

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
    console.log("start1");
    console.log(filtered_lines.join('\n'));
    console.log("end1");

    // Read the filtered changelog
    const releaseBody = fs.readFileSync(filteredChangelogPath, 'utf-8');
    console.log("start2");
    console.log(releaseBody);
    console.log("end2");






  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
