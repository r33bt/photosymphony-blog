const path = require('path');
const CredentialsManager = require('../../credentials/credentials-manager');

// Load credentials for this project
const manager = new CredentialsManager();
manager.loadCredentials();

// Setup project-specific env file
manager.setupForProject(process.cwd());

console.log('✅ Credentials loaded and ready for use');

module.exports = {
  wpConfig: manager.getWordPressConfig(),
  vercelConfig: manager.getVercelConfig(),
  githubConfig: manager.getGitHubConfig(),
  manager
};
