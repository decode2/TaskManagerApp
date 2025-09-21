#!/usr/bin/env node

/**
 * Release Management Script for TaskManagerApp
 * Handles automated release process including building, testing, and deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  versionFile: 'VERSION',
  buildDir: 'build',
  distDir: 'client-ts/build',
  releaseDir: 'releases',
  gitRemote: 'origin',
  mainBranch: 'main'
};

// ANSI Colors
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
 * Get current version
 */
function getCurrentVersion() {
  try {
    return fs.readFileSync(CONFIG.versionFile, 'utf8').trim();
  } catch (err) {
    error(`Could not read version file: ${CONFIG.versionFile}`);
  }
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
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (err) {
    error('Could not determine current git branch');
  }
}

/**
 * Run tests
 */
function runTests() {
  info('🧪 Running tests...');
  
  try {
    // Run backend tests
    info('Running backend tests...');
    execSync('dotnet test', { stdio: 'inherit' });
    success('Backend tests passed');
    
    // Run frontend tests
    info('Running frontend tests...');
    process.chdir('client-ts');
    execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });
    process.chdir('..');
    success('Frontend tests passed');
    
  } catch (err) {
    error('Tests failed. Please fix failing tests before releasing.');
  }
}

/**
 * Build application
 */
function buildApplication() {
  info('🔨 Building application...');
  
  try {
    // Build backend
    info('Building backend...');
    execSync('dotnet build --configuration Release', { stdio: 'inherit' });
    success('Backend build successful');
    
    // Build frontend
    info('Building frontend...');
    process.chdir('client-ts');
    execSync('npm run build', { stdio: 'inherit' });
    process.chdir('..');
    success('Frontend build successful');
    
  } catch (err) {
    error(`Build failed: ${err.message}`);
  }
}

/**
 * Create release directory
 */
function createReleaseDirectory(version) {
  const releaseDir = path.join(CONFIG.releaseDir, `v${version}`);
  
  try {
    if (fs.existsSync(releaseDir)) {
      execSync(`rm -rf ${releaseDir}`);
    }
    execSync(`mkdir -p ${releaseDir}`);
    success(`Created release directory: ${releaseDir}`);
    return releaseDir;
  } catch (err) {
    error(`Failed to create release directory: ${err.message}`);
  }
}

/**
 * Package release files
 */
function packageRelease(version) {
  const releaseDir = createReleaseDirectory(version);
  
  try {
    info('📦 Packaging release files...');
    
    // Copy backend files
    execSync(`cp -r bin/Release/net9.0/publish/* ${releaseDir}/ 2>/dev/null || echo "Backend publish not found"`);
    
    // Copy frontend build
    if (fs.existsSync('client-ts/build')) {
      execSync(`cp -r client-ts/build ${releaseDir}/frontend`);
      success('Frontend files packaged');
    }
    
    // Copy configuration files
    execSync(`cp appsettings.json ${releaseDir}/ 2>/dev/null || echo "appsettings.json not found"`);
    execSync(`cp VERSION ${releaseDir}/`);
    execSync(`cp CHANGELOG.md ${releaseDir}/`);
    execSync(`cp README.md ${releaseDir}/ 2>/dev/null || echo "README.md not found"`);
    
    // Create release info file
    const releaseInfo = {
      version: version,
      releaseDate: new Date().toISOString(),
      gitCommit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      gitBranch: getCurrentBranch(),
      buildDate: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(releaseDir, 'release-info.json'),
      JSON.stringify(releaseInfo, null, 2)
    );
    
    success(`Release packaged in: ${releaseDir}`);
    
  } catch (err) {
    error(`Failed to package release: ${err.message}`);
  }
}

/**
 * Create release archive
 */
function createReleaseArchive(version) {
  try {
    info('🗜️  Creating release archive...');
    
    const releaseDir = path.join(CONFIG.releaseDir, `v${version}`);
    const archiveName = `TaskManagerApp-v${version}.tar.gz`;
    const archivePath = path.join(CONFIG.releaseDir, archiveName);
    
    execSync(`tar -czf ${archivePath} -C ${CONFIG.releaseDir} v${version}`);
    
    // Get archive size
    const stats = fs.statSync(archivePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    success(`Release archive created: ${archiveName} (${sizeInMB} MB)`);
    return archivePath;
    
  } catch (err) {
    error(`Failed to create release archive: ${err.message}`);
  }
}

/**
 * Push to git repository
 */
function pushToGit(version) {
  try {
    info('📤 Pushing to git repository...');
    
    const currentBranch = getCurrentBranch();
    const tag = `v${version}`;
    
    // Push commits
    execSync(`git push ${CONFIG.gitRemote} ${currentBranch}`);
    success('Pushed commits to remote');
    
    // Push tags
    execSync(`git push ${CONFIG.gitRemote} ${tag}`);
    success(`Pushed tag ${tag} to remote`);
    
  } catch (err) {
    error(`Failed to push to git: ${err.message}`);
  }
}

/**
 * Generate release notes
 */
function generateReleaseNotes(version) {
  try {
    info('📝 Generating release notes...');
    
    // Get changelog content
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    
    // Extract version section
    const versionSection = extractVersionSection(changelog, version);
    
    // Create release notes file
    const releaseNotesPath = path.join(CONFIG.releaseDir, `v${version}`, 'RELEASE_NOTES.md`);
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
  const versionHeader = `## [${version}]`;
  const startIndex = changelog.indexOf(versionHeader);
  
  if (startIndex === -1) {
    return `# Release ${version}\n\nNo release notes available.`;
  }
  
  const nextVersionIndex = changelog.indexOf('## [', startIndex + 1);
  const endIndex = nextVersionIndex === -1 ? changelog.length : nextVersionIndex;
  
  return changelog.slice(startIndex, endIndex).trim();
}

/**
 * Main release function
 */
function createRelease(options = {}) {
  info('🚀 Starting release process...');
  
  const {
    skipTests = false,
    skipBuild = false,
    skipPackage = false,
    skipGit = false,
    dryRun = false
  } = options;
  
  // Validate environment
  if (!isGitClean()) {
    error('Working directory is not clean. Please commit or stash changes first.');
  }
  
  const currentBranch = getCurrentBranch();
  if (currentBranch !== CONFIG.mainBranch) {
    warning(`Current branch is '${currentBranch}'. Consider running this on ${CONFIG.mainBranch} branch.`);
  }
  
  const version = getCurrentVersion();
  info(`Releasing version: ${version}`);
  
  if (dryRun) {
    info('🔍 DRY RUN MODE - No actual changes will be made');
  }
  
  try {
    // Run tests
    if (!skipTests && !dryRun) {
      runTests();
    } else if (skipTests) {
      warning('Skipping tests');
    }
    
    // Build application
    if (!skipBuild && !dryRun) {
      buildApplication();
    } else if (skipBuild) {
      warning('Skipping build');
    }
    
    // Package release
    if (!skipPackage && !dryRun) {
      packageRelease(version);
      createReleaseArchive(version);
      generateReleaseNotes(version);
    } else if (skipPackage) {
      warning('Skipping packaging');
    }
    
    // Push to git
    if (!skipGit && !dryRun) {
      pushToGit(version);
    } else if (skipGit) {
      warning('Skipping git push');
    }
    
    if (dryRun) {
      success('🔍 DRY RUN completed successfully');
    } else {
      success(`🎉 Release ${version} completed successfully!`);
      info('Next steps:');
      info('  1. Verify the release in the releases/ directory');
      info('  2. Deploy to staging environment for testing');
      info('  3. Deploy to production when ready');
      info('  4. Create GitHub/GitLab release if needed');
    }
    
  } catch (err) {
    error(`Release failed: ${err.message}`);
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
