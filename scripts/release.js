#!/usr/bin/env node

/**
 * Release script for TaskManagerApp
 * Automates the release process including versioning, building, and packaging
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  releaseDir: 'releases',
  buildDir: 'build',
  frontendDir: 'client-ts'
};

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
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
    return fs.readFileSync('VERSION', 'utf8').trim();
  } catch (err) {
    error('Could not read VERSION file');
    process.exit(1);
  }
}

/**
 * Check if git working directory is clean
 */
function isGitClean() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim() === '';
  } catch (err) {
    return false;
  }
}

/**
 * Get current git branch
 */
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (err) {
    return 'unknown';
  }
}

/**
 * Run tests
 */
function runTests() {
  info('Running tests...');
  
  try {
    // Run frontend tests
    process.chdir(CONFIG.frontendDir);
    execSync('npm test -- --watchAll=false', { stdio: 'inherit' });
    process.chdir('..');
    
    // Run backend tests
    execSync('dotnet test --configuration Release', { stdio: 'inherit' });
    
    success('All tests passed');
    return true;
  } catch (err) {
    error('Tests failed');
    return false;
  }
}

/**
 * Build application
 */
function buildApplication() {
  info('Building application...');
  
  try {
    // Build frontend
    process.chdir(CONFIG.frontendDir);
    execSync('npm run build', { stdio: 'inherit' });
    process.chdir('..');
    
    // Build backend
    execSync('dotnet build --configuration Release', { stdio: 'inherit' });
    
    success('Build completed');
    return true;
  } catch (err) {
    error('Build failed');
    return false;
  }
}

/**
 * Create release directory structure
 */
function createReleaseDirectory(version) {
  info('Creating release directory...');
  
  const releaseDir = path.join(CONFIG.releaseDir, `v${version}`);
  
  if (!fs.existsSync(CONFIG.releaseDir)) {
    fs.mkdirSync(CONFIG.releaseDir);
  }
  
  if (fs.existsSync(releaseDir)) {
    fs.rmSync(releaseDir, { recursive: true });
  }
  
  fs.mkdirSync(releaseDir, { recursive: true });
  success(`Release directory created: ${releaseDir}`);
}

/**
 * Package release files
 */
function packageRelease(version) {
  info('Packaging release files...');
  
  try {
    const releaseDir = path.join(CONFIG.releaseDir, `v${version}`);
    
    // Copy frontend build
    const frontendBuild = path.join(CONFIG.frontendDir, 'build');
    if (fs.existsSync(frontendBuild)) {
      fs.cpSync(frontendBuild, path.join(releaseDir, 'frontend'), { recursive: true });
    }
    
    // Copy backend build
    const backendBuild = 'bin/Release/net9.0/publish';
    if (fs.existsSync(backendBuild)) {
      fs.cpSync(backendBuild, path.join(releaseDir, 'backend'), { recursive: true });
    }
    
    // Copy configuration files
    const configFiles = [
      'appsettings.json',
      'appsettings.Production.json',
      'README.md',
      'RELEASE.md'
    ];
    
    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(releaseDir, file));
      }
    });
    
    success('Release files packaged');
    return true;
  } catch (err) {
    error(`Packaging failed: ${err.message}`);
    return false;
  }
}

/**
 * Create release archive
 */
function createReleaseArchive(version) {
  info('Creating release archive...');
  
  try {
    const releaseDir = path.join(CONFIG.releaseDir, `v${version}`);
    const archiveName = `TaskManagerApp-v${version}.tar.gz`;
    const archivePath = path.join(CONFIG.releaseDir, archiveName);
    
    // Create tar.gz archive
    execSync(`tar -czf ${archivePath} -C ${CONFIG.releaseDir} v${version}`);
    
    success(`Release archive created: ${archivePath}`);
    return archivePath;
  } catch (err) {
    error(`Archive creation failed: ${err.message}`);
    return null;
  }
}

/**
 * Push to git repository
 */
function pushToGit(version) {
  info('Pushing to git repository...');
  
  try {
    const tag = `v${version}`;
    
    // Push commits
    execSync('git push origin main', { stdio: 'inherit' });
    
    // Push tags
    execSync(`git push origin ${tag}`, { stdio: 'inherit' });
    
    success('Changes pushed to repository');
    return true;
  } catch (err) {
    error(`Git push failed: ${err.message}`);
    return false;
  }
}

/**
 * Generate release notes from changelog
 */
function generateReleaseNotes(version) {
  info('Generating release notes...');
  
  try {
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    const versionSection = extractVersionSection(changelog, version);
    
    if (!versionSection) {
      warning('No changelog entry found for this version');
      return '';
    }
    
    // Create release notes file
    const releaseNotesPath = path.join(CONFIG.releaseDir, `v${version}`, 'RELEASE_NOTES.md');
    fs.writeFileSync(releaseNotesPath, versionSection);
    
    success('Release notes generated');
    return versionSection;
    
  } catch (err) {
    warning(`Could not generate release notes: ${err.message}`);
    return '';
  }
}

/**
 * Extract version section from changelog
 */
function extractVersionSection(changelog, version) {
  const lines = changelog.split('\n');
  const versionHeader = `## [${version}]`;
  const startIndex = lines.findIndex(line => line.startsWith(versionHeader));
  
  if (startIndex === -1) {
    return null;
  }
  
  const endIndex = lines.findIndex((line, index) => 
    index > startIndex && line.startsWith('## [') && !line.includes(version)
  );
  
  const section = lines.slice(startIndex, endIndex === -1 ? lines.length : endIndex);
  return section.join('\n');
}

/**
 * Main release function
 */
function createRelease(options = {}) {
  log('\n🚀 Starting release process...', colors.bright);
  
  const version = getCurrentVersion();
  const branch = getCurrentBranch();
  const isClean = isGitClean();
  
  info(`Version: ${version}`);
  info(`Branch: ${branch}`);
  info(`Git Status: ${isClean ? 'Clean' : 'Dirty'}`);
  
  if (!isClean && !options.dryRun) {
    error('Working directory is not clean. Please commit or stash changes first.');
    process.exit(1);
  }
  
  if (branch !== 'main' && !options.dryRun) {
    warning(`Not on main branch (current: ${branch})`);
  }
  
  let allSuccess = true;
  
  // Run tests
  if (!options.skipTests) {
    if (options.dryRun) {
      info('DRY RUN: Would run tests');
    } else {
      allSuccess = runTests() && allSuccess;
    }
  }
  
  // Build application
  if (!options.skipBuild) {
    if (options.dryRun) {
      info('DRY RUN: Would build application');
    } else {
      allSuccess = buildApplication() && allSuccess;
    }
  }
  
  // Package release
  if (!options.skipPackage) {
    if (options.dryRun) {
      info('DRY RUN: Would package release files');
    } else {
      createReleaseDirectory(version);
      allSuccess = packageRelease(version) && allSuccess;
      createReleaseArchive(version);
      generateReleaseNotes(version);
    }
  }
  
  // Push to git
  if (!options.skipGit && allSuccess) {
    if (options.dryRun) {
      info('DRY RUN: Would push to git repository');
    } else {
      allSuccess = pushToGit(version) && allSuccess;
    }
  }
  
  if (allSuccess) {
    success('\n🎉 Release completed successfully!');
    info(`Version ${version} is ready for deployment.`);
  } else {
    error('\n❌ Release failed. Please check the errors above.');
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp() {
  log('\n🚀 TaskManagerApp Release Manager', colors.bright);
  log('\nUsage:', colors.cyan);
  log('  node scripts/release.js [options]');
  log('\nOptions:', colors.cyan);
  log('  --skip-tests     Skip running tests');
  log('  --skip-build     Skip building application');
  log('  --skip-package   Skip packaging release files');
  log('  --skip-git       Skip pushing to git repository');
  log('  --dry-run        Show what would be done without making changes');
  log('  --help           Show this help message');
  log('\nExamples:', colors.cyan);
  log('  node scripts/release.js');
  log('  node scripts/release.js --skip-tests');
  log('  node scripts/release.js --dry-run');
  log('\nRelease Process:', colors.cyan);
  log('  1. Run tests (frontend and backend)');
  log('  2. Build application in release mode');
  log('  3. Package release files');
  log('  4. Create release archive');
  log('  5. Generate release notes');
  log('  6. Push to git repository');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  const options = {
    skipTests: args.includes('--skip-tests'),
    skipBuild: args.includes('--skip-build'),
    skipPackage: args.includes('--skip-package'),
    skipGit: args.includes('--skip-git'),
    dryRun: args.includes('--dry-run')
  };
  
  createRelease(options);
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  createRelease,
  runTests,
  buildApplication,
  packageRelease
};