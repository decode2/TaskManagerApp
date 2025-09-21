# Release Guide

This document describes the release process for TaskManagerApp, including versioning, building, and deployment procedures.

## Versioning System

TaskManagerApp uses [Semantic Versioning](https://semver.org/) (SemVer) with the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Breaking changes that are not backward compatible
- **MINOR**: New features that are backward compatible
- **PATCH**: Bug fixes that are backward compatible

### Version Files

The following files contain version information and must be kept in sync:

- `VERSION` - Main version file
- `client-ts/package.json` - Frontend version
- `TaskManagerApp.csproj` - Backend version (Version, AssemblyVersion, FileVersion)

## Release Process

### 1. Pre-Release Checklist

Before creating a release, ensure:

- [ ] All tests pass
- [ ] Code is properly documented
- [ ] Changelog is updated
- [ ] Version files are consistent
- [ ] No sensitive information in commits

### 2. Version Bump

Use the version management script to bump versions:

```bash
# Patch release (bug fixes)
node scripts/version.js bump patch

# Minor release (new features)
node scripts/version.js bump minor

# Major release (breaking changes)
node scripts/version.js bump major
```

This will:
- Update all version files
- Update the changelog
- Commit changes with conventional commit message
- Create a git tag

### 3. Release Creation

Create a release using the release script:

```bash
# Full release process
node scripts/release.js

# Skip tests (not recommended)
node scripts/release.js --skip-tests

# Dry run (see what would be done)
node scripts/release.js --dry-run
```

This will:
- Run all tests
- Build the application
- Package release files
- Create release archive
- Generate release notes
- Push to git repository

### 4. Manual Steps

After automated release:

1. **Verify Release**: Check the `releases/` directory for the new version
2. **Deploy to Staging**: Deploy to staging environment for testing
3. **Create GitHub Release**: If using GitHub, create a release with the generated notes
4. **Deploy to Production**: Deploy to production when ready
5. **Monitor**: Monitor the release for any issues

## Scripts Reference

### Version Management (`scripts/version.js`)

```bash
# Show current version
node scripts/version.js current

# Bump version
node scripts/version.js bump <type>

# Show help
node scripts/version.js help
```

### Release Management (`scripts/release.js`)

```bash
# Create release
node scripts/release.js [options]

# Options:
#   --skip-tests     Skip running tests
#   --skip-build     Skip building application
#   --skip-package   Skip packaging release files
#   --skip-git       Skip pushing to git repository
#   --dry-run        Show what would be done without making changes
```

### Version Consistency Check (`scripts/check-version.js`)

```bash
# Check version consistency
node scripts/check-version.js check

# Show version information
node scripts/check-version.js info

# Fix version inconsistencies
node scripts/check-version.js fix
```

## Conventional Commits

TaskManagerApp uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Reverting previous commits

### Examples

```
feat: add user authentication system
fix: resolve calendar display issue on mobile
docs: update API documentation
chore: update dependencies
```

## Branching Strategy

TaskManagerApp follows a simplified Git Flow:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `hotfix/*`: Critical bug fixes

### Release Branches

For major releases, create a release branch:

```bash
git checkout develop
git checkout -b release/v1.2.0
# Make release-specific changes
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags
```

## Deployment

### Frontend Deployment

1. Build the React application:
   ```bash
   cd client-ts
   npm run build
   ```

2. Deploy the `build/` directory to your web server

### Backend Deployment

1. Build the .NET application:
   ```bash
   dotnet build --configuration Release
   dotnet publish --configuration Release
   ```

2. Deploy the published files to your server

### Database Migrations

Run database migrations on deployment:

```bash
dotnet ef database update
```

## Rollback Procedure

If a release has issues:

1. **Identify the problematic version**
2. **Revert to previous version**:
   ```bash
   git checkout <previous-version-tag>
   node scripts/version.js bump patch
   ```
3. **Deploy the reverted version**
4. **Create hotfix if needed**:
   ```bash
   git checkout main
   git checkout -b hotfix/critical-fix
   # Make fixes
   git commit -m "fix: critical issue resolution"
   node scripts/version.js bump patch
   ```

## Troubleshooting

### Version Inconsistency

If version files are out of sync:

```bash
node scripts/check-version.js fix
```

### Failed Release

If a release fails:

1. Check the error message
2. Fix the issue
3. Re-run the release script
4. If needed, clean up and start over

### Git Tag Conflicts

If a version tag already exists:

```bash
git tag -d v1.0.0  # Delete local tag
git push origin :refs/tags/v1.0.0  # Delete remote tag
```

## Best Practices

1. **Always test before releasing**
2. **Keep version files in sync**
3. **Use conventional commits**
4. **Update changelog for each release**
5. **Tag releases immediately**
6. **Deploy to staging first**
7. **Monitor releases closely**
8. **Have rollback plan ready**

## Support

For questions about the release process, please:

1. Check this documentation
2. Review the script help messages
3. Check the project's issue tracker
4. Contact the development team
