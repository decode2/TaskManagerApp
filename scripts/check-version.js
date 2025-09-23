#!/usr/bin/env node

/**
 * Version Consistency Checker for TaskManagerApp
 * Ensures all version files are synchronized
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  versionFile: path.join(__dirname, '..', 'VERSION'),
  packageJson: path.join(__dirname, '..', 'client-ts', 'package.json'),
  csprojFile: path.join(__dirname, '..', 'TaskManagerApp.csproj')
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
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

/**
 * Get version from VERSION file
 */
function getVersionFromFile() {
  try {
    return fs.readFileSync(CONFIG.versionFile, 'utf8').trim();
  } catch (err) {
    return null;
  }
}

/**
 * Get version from package.json
 */
function getVersionFromPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(CONFIG.packageJson, 'utf8'));
    return packageJson.version;
  } catch (err) {
    return null;
  }
}

/**
 * Get version from .csproj file
 */
function getVersionFromCsproj() {
  try {
    const content = fs.readFileSync(CONFIG.csprojFile, 'utf8');
    
    // Look for Version property
    const versionMatch = content.match(/<Version>(.*?)<\/Version>/);
    if (versionMatch) {
      return versionMatch[1];
    }
    
    // Look for AssemblyVersion as fallback
    const assemblyVersionMatch = content.match(/<AssemblyVersion>(.*?)<\/AssemblyVersion>/);
    if (assemblyVersionMatch) {
      return assemblyVersionMatch[1];
    }
    
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Parse semantic version
 */
function parseVersion(version) {
  if (!version) return null;
  
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return null;
  }
  
  return { major: parts[0], minor: parts[1], patch: parts[2] };
}

/**
 * Compare two versions
 */
function compareVersions(version1, version2) {
  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);
  
  if (!v1 || !v2) return null;
  
  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  return v1.patch - v2.patch;
}

/**
 * Check version consistency
 */
function checkVersionConsistency() {
  log('\n🔍 Checking version consistency...', colors.bright);
  
  const versions = {
    versionFile: getVersionFromFile(),
    packageJson: getVersionFromPackageJson(),
    csproj: getVersionFromCsproj()
  };
  
  let allConsistent = true;
  const versionEntries = [];
  
  // Collect version information
  for (const [source, version] of Object.entries(versions)) {
    if (version) {
      versionEntries.push({ source, version });
      log(`   ${source}: ${version}`, colors.cyan);
    } else {
      error(`   ${source}: No version found`);
      allConsistent = false;
    }
  }
  
  // Check if all versions are the same
  if (versionEntries.length > 1) {
    const referenceVersion = versionEntries[0].version;
    
    for (let i = 1; i < versionEntries.length; i++) {
      const comparison = compareVersions(referenceVersion, versionEntries[i].version);
      if (comparison !== 0) {
        error(`   Version mismatch: ${versionEntries[0].source} (${referenceVersion}) vs ${versionEntries[i].source} (${versionEntries[i].version})`);
        allConsistent = false;
      }
    }
  }
  
  if (allConsistent && versionEntries.length > 0) {
    success('All versions are consistent!');
    return true;
  } else {
    error('Version inconsistency detected!');
    return false;
  }
}

/**
 * Show version information
 */
function showVersionInfo() {
  log('\n📋 Version Information', colors.bright);
  
  const versions = {
    'VERSION file': getVersionFromFile(),
    'package.json': getVersionFromPackageJson(),
    '.csproj file': getVersionFromCsproj()
  };
  
  for (const [source, version] of Object.entries(versions)) {
    if (version) {
      log(`   ${source}: ${version}`, colors.cyan);
    } else {
      log(`   ${source}: Not found`, colors.red);
    }
  }
  
  // Show parsed version details
  const mainVersion = getVersionFromFile();
  if (mainVersion) {
    const parsed = parseVersion(mainVersion);
    if (parsed) {
      log('\n📊 Version Details:', colors.bright);
      log(`   Major: ${parsed.major}`, colors.cyan);
      log(`   Minor: ${parsed.minor}`, colors.cyan);
      log(`   Patch: ${parsed.patch}`, colors.cyan);
    }
  }
}

/**
 * Fix version inconsistencies
 */
function fixVersionInconsistencies() {
  log('\n🔧 Fixing version inconsistencies...', colors.bright);
  
  const mainVersion = getVersionFromFile();
  if (!mainVersion) {
    error('No version found in VERSION file. Cannot fix inconsistencies.');
    return false;
  }
  
  let fixed = false;
  
  // Fix package.json
  try {
    const packageJsonPath = CONFIG.packageJson;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.version !== mainVersion) {
      packageJson.version = mainVersion;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      success(`Fixed package.json version: ${mainVersion}`);
      fixed = true;
    }
  } catch (err) {
    warning(`Could not fix package.json: ${err.message}`);
  }
  
  // Fix .csproj file
  try {
    const csprojPath = CONFIG.csprojFile;
    let content = fs.readFileSync(csprojPath, 'utf8');
    let modified = false;
    
    // Update Version property
    content = content.replace(
      /<Version>.*?<\/Version>/,
      `<Version>${mainVersion}</Version>`
    );
    
    // Update AssemblyVersion if it exists
    if (content.includes('<AssemblyVersion>')) {
      content = content.replace(
        /<AssemblyVersion>.*?<\/AssemblyVersion>/,
        `<AssemblyVersion>${mainVersion}</AssemblyVersion>`
      );
    }
    
    // Update FileVersion if it exists
    if (content.includes('<FileVersion>')) {
      content = content.replace(
        /<FileVersion>.*?<\/FileVersion>/,
        `<FileVersion>${mainVersion}</FileVersion>`
      );
    }
    
    // Write back if modified
    if (content !== fs.readFileSync(csprojPath, 'utf8')) {
      fs.writeFileSync(csprojPath, content);
      success(`Fixed .csproj version: ${mainVersion}`);
      fixed = true;
    }
  } catch (err) {
    warning(`Could not fix .csproj file: ${err.message}`);
  }
  
  if (fixed) {
    success('Version inconsistencies fixed!');
    return true;
  } else {
    info('No version inconsistencies found to fix.');
    return false;
  }
}

/**
 * Show help information
 */
function showHelp() {
  log('\n🔍 TaskManagerApp Version Checker', colors.bright);
  log('\nUsage:', colors.cyan);
  log('  node scripts/check-version.js <command>');
  log('\nCommands:', colors.cyan);
  log('  check           Check version consistency across all files');
  log('  info            Show version information');
  log('  fix             Fix version inconsistencies');
  log('  help            Show this help message');
  log('\nExamples:', colors.cyan);
  log('  node scripts/check-version.js check');
  log('  node scripts/check-version.js info');
  log('  node scripts/check-version.js fix');
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
    case 'check':
      checkVersionConsistency();
      break;
      
    case 'info':
      showVersionInfo();
      break;
      
    case 'fix':
      if (checkVersionConsistency()) {
        info('All versions are already consistent.');
      } else {
        fixVersionInconsistencies();
        log('\n');
        checkVersionConsistency();
      }
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
  checkVersionConsistency,
  showVersionInfo,
  fixVersionInconsistencies
};
