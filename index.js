const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");
const path = require('path');

async function main() {
  try {
    const token = process.env.GITHUB_TOKEN; 
    const octokit = new Octokit({ auth: token });

    // Parse the changelog
    let filtered_lines = [];
    let start_processing = false;
    let index = 0;
    let tagName;

    const changelogPath = path.join(process.env.GITHUB_WORKSPACE, 'CHANGELOG.md');
    const lines = fs.readFileSync(changelogPath, 'utf-8').split('\n');
    for(let line of lines) {
      index += 1;
      if(line.startsWith("#### [v")) {
        if(start_processing) {
          break;
        } else {
          const version_tag = line.match(/v[\d\.]+/);
          tagName = version_tag[0];
          start_processing = true;
          index = 0;
          continue;
        }
      }
      if(start_processing && index >= 2) {
        filtered_lines.push(line);
      }
    }

    const filteredChangelogPath = path.join(process.env.GITHUB_WORKSPACE, 'FILTERED_CHANGELOG.md');
    fs.writeFileSync(filteredChangelogPath, filtered_lines.join('\n'));

    // Read the filtered changelog
    const releaseBody = fs.readFileSync(filteredChangelogPath, 'utf-8');

    // Create a new release
    const { owner, repo } = github.context.repo;
    //const { ref_name: tagName } = github.context.ref;
    const ref = github.context.ref;
    //const refParts = ref.split('/');
    //const tagName = refParts[refParts.length - 1];
    console.log(tagName);
    // Check if ref is a tag
    if(ref.startsWith('refs/tags/')) {
      const refParts = ref.split('/');
      tagName = refParts[refParts.length - 1];
    }
    
    
    console.log(github.context.ref);
    console.log(refParts);
    console.log(tagName);



    // Fetch all releases
    const releases = await octokit.rest.repos.listReleases({
      owner,
      repo,
    });
    
    // Check if your release exists
    let release = releases.data.find(r => r.tag_name === tagName);
    
    // If release exists, update it
    if(release) {
      const updatedRelease = await octokit.rest.repos.updateRelease({
        owner,
        repo,
        release_id: release.id,
        body: releaseBody,
      });
    } else {
      // If release does not exist, create it
      const response = await octokit.rest.repos.createRelease({
        owner,
        repo,
        tag_name: tagName,
        name: `Release ${tagName}`,
        body: releaseBody,
        draft: false,
        prerelease: false,
      });
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
