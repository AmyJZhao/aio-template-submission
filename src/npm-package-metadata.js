const fs = require('fs');
const YAML = require('yaml');

/**
 * Grab template package metadata from package.json and install.yml files
 *
 * @param {string} packagePath a path to template package files
 * @returns {object}
 */
function getNpmPackageMetadata(packagePath) {
    // Grab package.json data
    const packageJson = fs.readFileSync(packagePath + '/package.json', 'utf8');
    const packageJsonData = JSON.parse(packageJson);

    // Grab install.yml data
    const installYml = fs.readFileSync(packagePath + '/install.yml', 'utf8');
    const installYmlData = YAML.parse(installYml);

    let npmPackageMetadata = {
        "author": packageJsonData.author,
        "name": packageJsonData.name,
        "description": packageJsonData.description,
        "version": packageJsonData.version,
        "keywords": [].concat(packageJsonData.keywords),
        "categories": [].concat(installYmlData.categories)
    }
    // "extension", "services" are optional
    if (installYmlData.extension) {
        npmPackageMetadata["extension"] = installYmlData.extension;
    }
    if (installYmlData.services) {
        npmPackageMetadata["services"] = installYmlData.services;
    }
    return npmPackageMetadata;
}

module.exports = {
    getNpmPackageMetadata
}
