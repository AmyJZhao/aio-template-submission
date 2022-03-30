
const fs = require('fs');
const myArgs = process.argv.slice(2);
const creator = myArgs[0];

let issues = await octokit.request('GET /repos/{owner}/{repo}/issues', {
  owner: 'octocat',
  repo: 'hello-world'
})