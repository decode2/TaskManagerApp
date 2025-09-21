#!/usr/bin/env node

/**
 * Version Management Script for TaskManagerApp
 * Handles semantic versioning, changelog generation, and release automation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  versionFile: 'VERSION',
  changelogFile: 'CHANGELOG.md',
  packageJson: 'client-ts/package.json',
  csprojFile: 'TaskManagerApp.csproj',
  gitTagPrefix: 'v'
};

// ANSI Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

/**
 * Get current version from VERSION file
 */
function getCurrentVersion() {
  try {
    const version = fs.readFileSync(CONFIG.versionFile, 'utf8').trim();
    return version;
  } catch (err) {
    error(`Could not read version file: ${CONFIG.versionFile}`);
  }
}

/**
 * Update version in VERSION file
 */
function updateVersionFile(newVersion) {
  try {
    fs.writeFileSync(CONFIG.versionFile, `${newVersion}\n`);
    success(`Updated ${CONFIG.versionFile} to ${newVersion}`);
  } catch (err) {
    error(`Could not update version file: ${err.message}`);
  }
}

/**
 * Update version in package.json
 */
function updatePackageJson(newVersion) {
  try {
    const packagePath = CONFIG.packageJson;
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    packageJson.version = newVersion;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    success(`Updated ${packagePath} to version ${newVersion}`);
  } catch (err) {
    warning(`Could not update package.json: ${err.message}`);
  }
}

/**
 * Update version in .csproj file
 */
function updateCsprojFile(newVersion) {
  try {
    const csprojPath = CONFIG.csprojFile;
    let content = fs.readFileSync(csprojPath, 'utf8');
    
    // Update Version property
    content = content.replace(
      /<Version>.*?<\/Version>/,
      `<Version>${newVersion}</Version>`
    );
    
    // Update AssemblyVersion if it exists
    content = content.replace(
      /<AssemblyVersion>.*?<\/AssemblyVersion>/,
      `<AssemblyVersion>${newVersion}</AssemblyVersion>`
    );
    
    // Update FileVersion if it exists
    content = content.replace(
      /<FileVersion>.*?<\/FileVersion>/,
      `<FileVersion>${newVersion}</FileVersion>`
    );
    
    fs.writeFileSync(csprojPath, content);
    success(`Updated ${csprojPath} to version ${newVersion}`);
  } catch (err) {
    warning(`Could not update .csproj file: ${err.message}`);
  }
}

/**
 * Parse semantic version
 */
function parseVersion(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    error(`Invalid version format: ${version}. Expected format: MAJOR.MINOR.PATCH`);
  }
  return { major: parts[0], minor: parts[1], patch: parts[2] };
}

/**
 * Generate next version based on type
 */
function getNextVersion(currentVersion, type) {
  const { major, minor, patch } = parseVersion(currentVersion);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      error(`Invalid version type: ${type}. Use: major, minor, or patch`);
  }
}

/**
 * Generate git tag name
 */
function getGitTag(version) {
  return `${CONFIG.gitTagPrefix}${version}`;
}

/**
 * Check if git repository is clean
 */
function isGitClean() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim() === '';
  } catch (err) {
    error('Not a git repository or git command failed');
  }
}

/**
 * Get current git branch
 */
function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (err) {
    error('Could not determine current git branch');
  }
}

/**
 * Check if version tag already exists
 */
function tagExists(version) {
  try {
    const tag = getGitTag(version);
    execSync(`git rev-parse ${tag}`, { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Create git tag
 */
function createGitTag(version, message) {
  try {
    const tag = getGitTag(version);
    execSync(`git tag -a ${tag} -m "${message}"`);
    success(`Created git tag: ${tag}`);
  } catch (err) {
    error(`Failed to create git tag: ${err.message}`);
  }
}

/**
 * Generate changelog entry for new version
 */
function generateChangelogEntry(version, type, changes = []) {
  const date = new Date().toISOString().split('T')[0];
  const typeEmojis = {
    major: '🚀',
    minor: '✨',
    patch: '🐛'
  };
  
  const emoji = typeEmojis[type] || '📝';
  const versionType = type.charAt(0).toUpperCase() + type.slice(1);
  
  let entry = `\n## [${version}] - ${date}\n\n`;
  entry += `### ${emoji} ${versionType} Release\n\n`;
  
  if (changes.length > 0) {
    entry += '### Changes\n';
    changes.forEach(change => {
      entry += `- ${change}\n`;
    });
    entry += '\n';
  }
  
  return entry;
}

/**
 * Update changelog file
 */
function updateChangelog(version, type, changes = []) {
  try {
    let changelog = fs.readFileSync(CONFIG.changelogFile, 'utf8');
    
    // Insert new entry after [Unreleased] section
    const unreleasedIndex = changelog.indexOf('## [Unreleased]');
    if (unreleasedIndex === -1) {
      error('Could not find [Unreleased] section in changelog');
    }
    
    const endOfUnreleased = changelog.indexOf('\n## [', unreleasedIndex + 1);
    const insertIndex = endOfUnreleased === -1 ? changelog.length : endOfUnreleased;
    
    const newEntry = generateChangelogEntry(version, type, changes);
    changelog = changelog.slice(0, insertIndex) + newEntry + changelog.slice(insertIndex);
    
    fs.writeFileSync(CONFIG.changelogFile, changelog);
    success(`Updated ${CONFIG.changelogFile}`);
  } catch (err) {
    error(`Could not update changelog: ${err.message}`);
  }
}

/**
 * Main version bump function
 */
function bumpVersion(type, changes = []) {
  info('🚀 Starting version bump process...');
  
  // Validate inputs
  if (!['major', 'minor', 'patch'].includes(type)) {
    error('Invalid version type. Use: major, minor, or patch');
  }
  
  // Check git status
  if (!isGitClean()) {
    error('Working directory is not clean. Please commit or stash changes first.');
  }
  
  const currentBranch = getCurrentBranch();
  if (currentBranch !== 'main' && currentBranch !== 'master') {
    warning(`Current branch is '${currentBranch}'. Consider running this on main/master branch.`);
  }
  
  // Get current version and calculate next version
  const currentVersion = getCurrentVersion();
  const newVersion = getNextVersion(currentVersion, type);
  
  info(`Current version: ${currentVersion}`);
  info(`New version: ${newVersion}`);
  
  // Check if tag already exists
  if (tagExists(newVersion)) {
    error(`Version ${newVersion} already exists as a git tag`);
  }
  
  // Update version files
  updateVersionFile(newVersion);
  updatePackageJson(newVersion);
  updateCsprojFile(newVersion);
  
  // Update changelog
  updateChangelog(newVersion, type, changes);
  
  // Commit changes
  try {
    execSync('git add VERSION client-ts/package.json TaskManagerApp.csproj CHANGELOG.md');
    execSync(`git commit -m "chore: bump version to ${newVersion}"`);
    success('Committed version changes');
  } catch (err) {
    error(`Failed to commit changes: ${err.message}`);
  }
  
  // Create git tag
  const tagMessage = `Release version ${newVersion}\n\n${changes.join('\n')}`;
  createGitTag(newVersion, tagMessage);
  
  success(`🎉 Successfully bumped version to ${newVersion}`);
  info(`Next steps:`);
  info(`  1. Push changes: git push origin ${currentBranch}`);
  info(`  2. Push tags: git push origin ${getGitTag(newVersion)}`);
  info(`  3. Create release on GitHub/GitLab if needed`);
}

/**
 * Show current version info
 */
function showVersion() {
  const version = getCurrentVersion();
  const branch = getCurrentBranch();
  const isClean = isGitClean();
  
  log('\n📋 Version Information', colors.bright);
  log(`   Version: ${version}`, colors.cyan);
  log(`   Branch: ${branch}`, colors.cyan);
  log(`   Git Status: ${isClean ? 'Clean' : 'Dirty'}`, colors.cyan);
  
  if (tagExists(version)) {
    log(`   Git Tag: ${getGitTag(version)} ✅`, colors.green);
  } else {
    log(`   Git Tag: Not found ❌`, colors.red);
  }
}

/**
 * Show help information
 */
function showHelp() {
  log('\n📚 TaskManagerApp Version Manager', colors.bright);
  log('\nUsage:', colors.cyan);
  log('  node scripts/version.js <command> [options]');
  log('\nCommands:', colors.cyan);
  log('  bump <type>     Bump version (major|minor|patch)');
  log('  current         Show current version information');
  log('  help            Show this help message');
  log('\nExamples:', colors.cyan);
  log('  node scripts/version.js bump patch');
  log('  node scripts/version.js bump minor');
  log('  node scripts/version.js bump major');
  log('  node scripts/version.js current');
  log('\nVersion Types:', colors.cyan);
  log('  patch          Bug fixes (1.0.0 → 1.0.1)');
  log('  minor          New features (1.0.0 → 1.1.0)');
  log('  major          Breaking changes (1.0.0 → 2.0.0)');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'bump':
      if (args.length < 2) {
        error('Version type required. Use: major, minor, or patch');
      }
      const type = args[1];
      const changes = args.slice(2);
      bumpVersion(type, changes);
      break;
      
    case 'current':
      showVersion();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      error(`Unknown command: ${command}. Use 'help' to see available commands.`);
  }
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  getCurrentVersion,
  bumpVersion,
  showVersion
};
