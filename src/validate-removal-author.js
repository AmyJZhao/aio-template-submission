import fs from 'fs'
import * as core from '@actions/core'
import fetch from 'node-fetch';

const myArgs = process.argv.slice(2);
const creator = myArgs[0];
const npmLink = myArgs[1]

fetch('https://api.github.com/repos/adobe/aio-template-submission/issues?state=closed&labels=add-template&creator=' + creator)
  .then(response => response.json())
  .then(data => {
    if(data.length == 0) {
      throw new Error('No add-template issues submitted by creator found.')
    } else {
      let found = data.find(element => element.body.includes(npmLink))
      if(found == undefined) {
        throw new Error('Matching add-template issue for removal request by creator not found.')
      } else {
        console.log('Github add-template issue by creator found: ' + found.url)
      }
    }
  })
  .catch(function(e) {
    core.setOutput('error', ':x: ' + e.message)
  })
