## 🔒 Security Review Checklist

### ⚠️ CRITICAL: This PR contains dependency updates

**Before merging, please verify:**

#### 📦 Package Verification
- [ ] **Package source is trusted** (npmjs.com, nuget.org, etc.)
- [ ] **No new packages added** (only version updates)
- [ ] **Package maintainer is verified** (check package page)
- [ ] **Version jump is reasonable** (no suspicious major version jumps)

#### 🔍 Security Checks
- [ ] **No high/critical vulnerabilities** in updated packages
- [ ] **Package integrity verified** (checksums match)
- [ ] **No suspicious package names** or typosquatting
- [ ] **Dependencies are from official sources**

#### 🧪 Testing Required
- [ ] **Application builds successfully**
- [ ] **All tests pass**
- [ ] **No runtime errors**
- [ ] **Functionality works as expected**

#### 📋 Manual Review
- [ ] **Changelog reviewed** for breaking changes
- [ ] **Migration guide checked** if applicable
- [ ] **Performance impact assessed**
- [ ] **Compatibility verified**

### 🚨 Red Flags to Watch For
- ❌ Packages from unknown sources
- ❌ Suspicious package names (typosquatting)
- ❌ Unusually large version jumps
- ❌ Packages with very few downloads
- ❌ Packages with no recent updates
- ❌ Packages with poor documentation

### 📚 Resources
- [npm Security Best Practices](https://docs.npmjs.com/cli/v8/configuring-npm/security)
- [NuGet Security](https://docs.microsoft.com/en-us/nuget/concepts/security-best-practices)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

---
**⚠️ DO NOT MERGE without completing this checklist!**
