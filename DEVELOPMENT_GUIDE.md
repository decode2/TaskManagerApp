# 🏗️ Development Guide - TaskManagerApp

## 🎯 Project Organization

This guide explains the project structure and best practices for development, following industry standards used by Staff Engineers and Senior Developers.

## 📁 Directory Structure

```
TaskManagerApp/
├── 📁 Api/                    # API Controllers (ASP.NET Core)
├── 📁 client-ts/             # React Frontend (TypeScript)
├── 📁 scripts/               # Automation & DevOps Scripts
├── 📁 Data/                  # Database Context & Migrations
├── 📁 Models/               # Domain Models
├── 📁 Services/             # Business Logic Services
├── 📁 Dtos/                # Data Transfer Objects
├── 📁 Migrations/          # Entity Framework Migrations
├── 📁 wwwroot/             # Built Frontend (Auto-generated)
└── 📄 Configuration Files
```

## 🔧 Scripts Organization

### **Why `/scripts` Folder?**

Following industry best practices from:
- **Microsoft .NET Projects**: Use `/scripts` or `/tools`
- **Node.js Projects**: Use `/scripts` folder
- **Enterprise Projects**: Use `/devops`, `/scripts`, or `/tools`

### **Benefits:**
- ✅ **Clear Separation**: Scripts separated from application code
- ✅ **Easy Discovery**: Developers know where to find automation
- ✅ **Version Control**: Safe to include in GitHub (no sensitive data)
- ✅ **Documentation**: Centralized documentation for all scripts
- ✅ **Maintainability**: Easy to update and maintain

## 🚀 Scripts Included

### **Development Scripts**
- `start-professional.ps1` - Main startup script
- `load-env.ps1` - Environment variable loader
- `show-env.ps1` - Environment configuration display

### **Setup Scripts**
- `setup-hosts.ps1` - Local domain configuration
- `setup-production.ps1` - Production deployment

## 🔒 Security Best Practices

### **✅ Safe for Version Control**
- No hardcoded credentials
- Use environment variables
- Follow security guidelines
- Help other developers

### **❌ NOT Included**
- `.env` files (contain sensitive data)
- Database credentials
- API keys
- Personal configuration

## 🎯 Staff Engineer Best Practices

### **1. Script Organization**
```powershell
# ✅ Good: Clear, descriptive names
start-professional.ps1
setup-hosts.ps1
load-env.ps1

# ❌ Bad: Unclear names
run.ps1
setup.ps1
config.ps1
```

### **2. Error Handling**
```powershell
# ✅ Good: Proper error handling
try {
    # Operation
} catch {
    Write-Error "Failed to perform operation: $($_.Exception.Message)"
    exit 1
}

# ❌ Bad: No error handling
# Operation
```

### **3. Documentation**
```powershell
# ✅ Good: Clear documentation
<#
.SYNOPSIS
    Starts the application in professional mode
    
.DESCRIPTION
    Loads environment variables, detects local IP, and starts
    both backend and frontend with friendly URLs.
    
.PARAMETER Environment
    The environment to run in (Development, Production)
    
.EXAMPLE
    .\start-professional.ps1
#>
```

### **4. Idempotency**
```powershell
# ✅ Good: Safe to run multiple times
if (-not (Test-Path ".env")) {
    Copy-Item "env.example" ".env"
}

# ❌ Bad: Destructive operations
Remove-Item ".env" -Force
Copy-Item "env.example" ".env"
```

## 🔧 Development Workflow

### **For New Developers**
1. **Clone repository**
2. **Copy environment template**: `cp env.example .env`
3. **Configure environment** in `.env`
4. **Run setup** (as Administrator): `.\scripts\setup-hosts.ps1`
5. **Start development**: `.\scripts\start-professional.ps1`

### **For Staff Engineers**
1. **Review scripts** before execution
2. **Test in development** environment first
3. **Document changes** to scripts
4. **Follow naming conventions**
5. **Include error handling**

## 📊 Industry Standards

### **Microsoft .NET Projects**
```
Project/
├── src/                    # Source code
├── scripts/               # Build & deployment scripts
├── tools/                 # Development tools
└── docs/                  # Documentation
```

### **Node.js Projects**
```
Project/
├── src/                   # Source code
├── scripts/              # NPM scripts & automation
├── tools/                # Development tools
└── docs/                 # Documentation
```

### **Enterprise Projects**
```
Project/
├── src/                   # Source code
├── scripts/              # Automation scripts
├── devops/               # CI/CD & deployment
├── tools/                # Development tools
└── docs/                 # Documentation
```

## 🎯 Recommendations

### **For This Project**
1. **Keep scripts in `/scripts`** - Follows industry standards
2. **Include in GitHub** - Safe and helpful for other developers
3. **Document thoroughly** - Clear purpose and usage
4. **Use environment variables** - No hardcoded values
5. **Follow PowerShell best practices** - Error handling, documentation

### **For Future Enhancements**
1. **Add CI/CD scripts** for automated deployment
2. **Include database migration scripts**
3. **Add testing automation scripts**
4. **Consider cross-platform compatibility** (Node.js scripts)

## 📝 Script Development Guidelines

### **Naming Conventions**
- Use `verb-noun.ps1` format
- Be descriptive and clear
- Include purpose in filename

### **Documentation Standards**
- Include purpose and usage
- Document parameters
- Provide examples
- List requirements (Admin rights, etc.)

### **Error Handling**
- Use try-catch blocks
- Provide meaningful error messages
- Exit with appropriate codes
- Log errors for debugging

### **Security**
- Never hardcode credentials
- Use environment variables
- Validate inputs
- Follow least privilege principle

---

**This organization follows industry best practices and makes the project maintainable and scalable for teams of any size.**
