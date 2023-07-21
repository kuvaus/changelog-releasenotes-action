const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");
const path = require('path');


async function parse_options() {

    
    let file_path = process.env.GITHUB_WORKSPACE;
    if (file_path === undefined){
        file_path = "./";
    }
    

    let options = {
      changelog:            core.getInput('changelog', {required: false}) || 'CHANGELOG.md',
      filtered_changelog:   core.getInput('filtered_changelog', {required: false}) || 'FILTERED_CHANGELOG.md',
      start_token:          core.getInput('start_token', {required: false}) || '#### [v',
      end_token:            core.getInput('end_token', {required: false}) || '#### [v',
      specific_tag:         core.getInput('specific_tag', {required: false}) || '',
      use_date:             core.getInput('use_date', {required: false}) === 'false',
      upcoming_release:     core.getInput('upcoming_release', {required: false}) === 'true',
      create_release:      (core.getInput('create_release', {required: false}) !== 'false'),
      update_release:      (core.getInput('update_release', {required: false}) !== 'false')
      //create_release:       core.getInput('create_release', {required: false}) === 'true',
      //update_release:       core.getInput('update_release', {required: false}) === 'true'
    }; 

    options.changelog_path = path.join(file_path, options.changelog);
    options.filtered_changelog_path = path.join(file_path, options.filtered_changelog);
    
    console.log(options);
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
    let skip_n_lines = 2;
    if (options.use_date) {
        skip_n_lines = 0;
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
        
        started_processing = true;
        index = 0;
        continue;     
      }
      
      if(started_processing && index > skip_n_lines) {
        filtered_lines.push(line);
      }      
    }
    
    let release_notes = filtered_lines.join('\n');
    
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
    let version_tag = refParts[refParts.length - 1];
    

    if (options.specific_tag !== '') {
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
      const updated_release = await octokit.rest.repos.updateRelease({
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
     
  let options = await parse_options();
  let release_notes =  await parse_changelog(options);
  
    write_filtered_changelog(release_notes, options);
    let success = await create_release(release_notes, options);

  core.setOutput("releasenotes", release_notes);
  
}

main();
