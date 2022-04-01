import fs from 'fs' ;
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import * as core from '@actions/core';
import validateJson from "./validate-json-schema.js";

// Simple script that collects template metadata and adds it to the registry
const myArgs = process.argv.slice(2);
const packageData = JSON.parse(myArgs[0]);

// Grab stargazers count for the specified GitHub repo
const gitHubUrl = myArgs[1];
const repo = gitHubUrl.split('/').slice(-2).join('/');

// We expect repo to have more than 10 stargazers in order to be featured
let stargazersCount
fetch('https://api.github.com/repos/' + repo)
    .then(response => response.json())
    .then(data => {
        stargazersCount = data['stargazers_count'];
    })
    .catch(function (e) {
        core.setOutput('error', ':warning: ' + e.message);
        throw e;
    })
const stargazersThreshold = 10;
const adobeRecommended = stargazersCount > stargazersThreshold;

// Create registry item object
const registryItem = {
    "id": uuidv4(),
    "author": packageData.author,
    "name": packageData.name,
    "description": packageData.description,
    "latestVersion": packageData.version,
    "publishDate": new Date(Date.now()),
    // ToDo: get date from user input or keywords
    "extensionPoints": [
        "dx-spa",
        "dx-commerce"
    ],
    "categories": [
        "aio-action",
        "aio-graphql"
    ],
    "adobeRecommended": adobeRecommended,
    "keywords": [].concat(packageData.keywords),
    "links": {
        "npm": myArgs[2],
        "github": gitHubUrl
    }
}

// Check for duplicates
const registry = JSON.parse(fs.readFileSync('registry.json'));
if (registry.filter(e => e.name === registryItem.name).length > 0) {
    const errorMessage = ':x: Template with name `' + registryItem.name + '` already exists in Template Registry.';
    core.setOutput('error', errorMessage);
    throw new Error(errorMessage)
}

// Add to the registry
registry.push(registryItem);
const newData = JSON.stringify(registry, null, "  ");

// Validate registry.json file
validateJson(newData)

// Write to registry.json
fs.writeFile('registry.json', newData, err => {
    if (err) {
        core.setOutput('error', ':warning: Error occurred while adding template to Template Registry.');
        throw err;
    }
    console.log('Template was added', newData);
});
