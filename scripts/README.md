# 🔧 Scripts Directory

Automation scripts for development, deployment, and maintenance tasks.

## 📋 Available Scripts

### 🚀 **Development Scripts**

#### `start-professional.ps1`
**Purpose**: Start the application in professional mode with friendly URLs
**Usage**: 
```powershell
.\scripts\start-professional.ps1
```
**What it does**:
- Loads environment variables from `.env`
- Detects local IP automatically
- Starts backend and frontend
- Opens browser with friendly URLs
- Professional production-like experience

#### `load-env.ps1`
**Purpose**: Load environment variables from `.env` file
**Usage**:
```powershell
.\scripts\load-env.ps1
```
**What it does**:
- Parses `.env` file
- Sets process-level environment variables
- Creates `.env` from `env.example` if missing
- Shows loaded variables

#### `show-env.ps1`
**Purpose**: Display current environment configuration
**Usage**:
```powershell
.\scripts\show-env.ps1
```
**What it does**:
- Shows all environment variables
- Displays network configuration
- Checks service status
- Shows available URLs

### 🛠️ **Setup Scripts**

#### `setup-hosts.ps1`
**Purpose**: Configure local domain mappings (requires Administrator)
**Usage**:
```powershell
# Run as Administrator
.\scripts\setup-hosts.ps1
```
**What it does**:
- Adds local domain entries to hosts file
- Supports multiple domains (taskmanager.local, myapp.local, etc.)
- Automatic IP detection
- Backup of existing hosts file

#### `setup-production.ps1`
**Purpose**: Complete production environment setup
**Usage**:
```powershell
.\scripts\setup-production.ps1
```
**What it does**:
- Builds frontend for production
- Deploys to wwwroot
- Configures environment variables
- Sets up local domains
- Professional deployment

## 🚀 **Quick Start for New Developers**

1. **Clone the repository**
2. **Copy environment template**:
   ```bash
   cp env.example .env
   ```
3. **Configure your environment** in `.env`
4. **Run setup** (as Administrator):
   ```powershell
   .\scripts\setup-hosts.ps1
   ```
5. **Start development**:
   ```powershell
   .\scripts\start-professional.ps1
   ```

## 🔧 **Customization**

### Adding New Scripts
1. Create script in `/scripts` folder
2. Use `.ps1` extension for PowerShell scripts
3. Add documentation to this README
4. Follow naming conventions:
   - `verb-noun.ps1` (e.g., `start-application.ps1`)
   - Use descriptive names
   - Include purpose in filename

### Environment Variables
Scripts use these environment variables:
- `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE`
- `APP_ENVIRONMENT`, `APP_PORT`
- `LOCAL_IP`, `DOMAIN_PRIMARY`

## 📝 **Troubleshooting**

### Common Issues
1. **Execution Policy**: If scripts won't run, check PowerShell execution policy
2. **Administrator Rights**: Some scripts require Administrator privileges
3. **Environment Variables**: Ensure `.env` file exists and is properly configured

### Debug Mode
Enable verbose output by setting:
```powershell
$VerbosePreference = "Continue"
```

---

**Note**: These scripts are designed for Windows PowerShell. For cross-platform compatibility, consider using Node.js scripts or Docker containers.
