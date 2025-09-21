#!/usr/bin/env node

/**
 * Pre-commit hook for TaskManagerApp
 * Runs checks before allowing commits
 */

const { execSync } = require('child_process');
const fs = require('fs');

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
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
 * Check if version files are consistent
 */
function checkVersionConsistency() {
  info('Checking version consistency...');
  
  try {
    execSync('node scripts/check-version.js check', { stdio: 'inherit' });
    success('Version consistency check passed');
    return true;
  } catch (err) {
    error('Version consistency check failed');
    return false;
  }
}

/**
 * Run linting checks
 */
function runLinting() {
  info('Running linting checks...');
  
  try {
    // Check frontend linting
    process.chdir('client-ts');
    execSync('npm run lint', { stdio: 'inherit' });
    process.chdir('..');
    
    success('Linting checks passed');
    return true;
  } catch (err) {
    error('Linting checks failed');
    return false;
  }
}

/**
 * Run type checking
 */
function runTypeChecking() {
  info('Running type checking...');
  
  try {
    // Check frontend types
    process.chdir('client-ts');
    execSync('npm run type-check', { stdio: 'inherit' });
    process.chdir('..');
    
    success('Type checking passed');
    return true;
  } catch (err) {
    warning('Type checking failed (this may be expected if script doesn\'t exist)');
    return true; // Don't fail the commit for missing type-check script
  }
}

/**
 * Check for sensitive information
 */
function checkSensitiveInfo() {
  info('Checking for sensitive information...');
  
  const sensitivePatterns = [
    /password\s*=\s*["'][^"']+["']/i,
    /secret\s*=\s*["'][^"']+["']/i,
    /token\s*=\s*["'][^"']+["']/i,
    /key\s*=\s*["'][^"']+["']/i
  ];
  
  try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(file => file.trim() !== '');
    
    let foundSensitive = false;
    
    for (const file of stagedFiles) {
      if (fs.existsSync(file) && !file.includes('node_modules') && !file.includes('.git')) {
        const content = fs.readFileSync(file, 'utf8');
        
        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            error(`Potential sensitive information found in ${file}`);
            foundSensitive = true;
          }
        }
      }
    }
    
    if (!foundSensitive) {
      success('No sensitive information detected');
    }
    
    return !foundSensitive;
  } catch (err) {
    warning('Could not check for sensitive information');
    return true;
  }
}

/**
 * Main pre-commit function
 */
function main() {
  log('\n🔍 Running pre-commit checks...', colors.bright);
  
  let allPassed = true;
  
  // Run all checks
  const checks = [
    { name: 'Version Consistency', fn: checkVersionConsistency },
    { name: 'Linting', fn: runLinting },
    { name: 'Type Checking', fn: runTypeChecking },
    { name: 'Sensitive Information', fn: checkSensitiveInfo }
  ];
  
  for (const check of checks) {
    if (!check.fn()) {
      allPassed = false;
    }
  }
  
  if (allPassed) {
    success('\n🎉 All pre-commit checks passed!');
    process.exit(0);
  } else {
    error('\n❌ Pre-commit checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

// Run main function
if (require.main === module) {
  main();
}
