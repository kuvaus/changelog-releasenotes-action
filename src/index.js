const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");
const path = require('path');


async function parse_options() {
    
    let options = {

        changelog:          core.getInput('changelog'),
        changelog_path:     path.join(process.env.GITHUB_WORKSPACE, core.getInput('changelog')),
 
        filtered_changelog: core.getInput('filtered_changelog'),
        filtered_changelog_path: path.join(process.env.GITHUB_WORKSPACE, core.getInput('filtered_changelog')),
    
        start_token:        core.getInput('start_token'),
        end_token:          core.getInput('end_token'),
        specific_tag:       core.getInput('specific_tag'),
        use_date:           core.getInput('use_date'),
        upcoming_release:   core.getInput('upcoming_release'),
        create_release:     core.getInput('make_release'),
        update_release:     core.getInput('update_release')
    }  
     
    core.debug(`options.changelog = '${options.changelog}'`);
    
    return options;
    
}

async function parse_changelog(options) {
    
    // Change start_token accordingly
    if (options.upcoming_release) {
        options.start_token = "#### ["    
    }
    
    
    // Parse the changelog
    let filtered_lines = [];
    let started_processing = false;
    let index = 0;
    //let extracted_version_tag;
    
    // skip first 2 lines because those contain the date string
    if (options.use_date) {
        skip_n_lines = 0;
    } else {
        skip_n_lines = 2;
    }

    const lines = fs.readFileSync(options.changelog_path, 'utf-8').split('\n');
    for(let line of lines) {
      index += 1;
      
      if(line.startsWith(options.end_token) && started_processing) {
        break;
      } else if (line.startsWith(options.start_token)) {
        
        //this part extracts the version tag (optional)
        //const version_tag_line = line.match(/v[\d\.]+/);
        //extracted_version_tag = version_tag_line[0];
        
        start_processing = true;
        index = 0;
        continue;     
      }
      
      if(start_processing && index > skip_n_lines) {
        filtered_lines.push(line);
      }      
    }
    
    release_notes = filtered_lines.join('\n');
    
    return release_notes;        
}

async function write_filtered_changelog(release_notes, options) {
    
    fs.writeFileSync(options.filtered_changelog_path, release_notes);
}

async function read_filtered_changelog(options) {
    
    const releaseBody = fs.readFileSync(options.filtered_changelog_path, 'utf-8');
    console.log(releaseBody);
    return releaseBody

}

async function create_release(release_notes, options) {
    
  //try {    
    
    const token = process.env.GITHUB_TOKEN; 
    const octokit = new Octokit({ auth: token });
    
    // Create a new release
    const { owner, repo } = github.context.repo;
    
    // get the release tag from the refs
    const ref = github.context.ref;
    const refParts = ref.split('/');
    version_tag = refParts[refParts.length - 1];
    

    if (options.specific_tag !== false) {
        version_tag = options.specific_tag;
    } 
    //console.log(version_tag);
    //console.log(github.context.ref);
    
    
    
    // Fetch all releases
    const releases = await octokit.rest.repos.listReleases({
      owner,
      repo,
    });
    
    // Check if your release exists
    let release = releases.data.find(r => r.tag_name === version_tag); 
       
    // If release exists, update it
    if(release && options.update_release) {
      const updatedRelease = await octokit.rest.repos.updateRelease({
        owner,
        repo,
        release_id: release.id,
        body: release_notes,
      });
      
    }
    // If release does not exist, create it
    else if (options.create_release) {
      const response = await octokit.rest.repos.createRelease({
        owner,
        repo,
        tag_name: version_tag,
        name: `Release ${version_tag}`,
        body: release_notes,
        draft: false,
        prerelease: options.upcoming_release,
      });
    }
    
    return true;
  //} catch (error) {
  //  core.setFailed(error.message);
  //}

}


async function main() {
    
    
  try {
    
   let options = await parse_options();
   let release_notes =  await parse_changelog(options);
   write_filtered_changelog(release_notes, options);
   let success = await create_release(release_notes, options);
    
   core.setOutput("releasenotes", release_notes)
    
  } catch (error) {
    core.setFailed(error.message);
  }
  
  
}

main();
