# 🎯 TaskManagerApp

A modern, full-stack task management application built with **React 19**, **TypeScript**, **ASP.NET Core 8**, and **MySQL**. Features a beautiful, responsive interface with dark/light mode, calendar view, and seamless local network access.

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful gradient design with smooth animations
- 🌙 **Dark/Light Mode** - Toggle between themes
- 📅 **Calendar View** - Visual task scheduling
- 🔄 **Recurring Tasks** - Set up daily, weekly, monthly, or custom recurring tasks
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔐 **JWT Authentication** - Secure login with refresh tokens
- 🌐 **Network Access** - Access from any device on your local network
- 🚀 **Professional Setup** - Ready for production deployment

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **ASP.NET Core 8** - High-performance web framework
- **Entity Framework Core** - ORM for database operations
- **MySQL** - Reliable database
- **JWT Authentication** - Secure token-based auth
- **Identity Framework** - User management

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **.NET 8 SDK**
- **MySQL 8.0+**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd TaskManagerApp
```

2. **Configure environment variables**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your database credentials
# Update DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD
```

3. **Install frontend dependencies**
```bash
cd client-ts
npm install
```

4. **Run database migrations**
```bash
dotnet ef database update
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend**
```bash
dotnet run
```

2. **Start the frontend** (in a new terminal)
```bash
cd client-ts
npm start
```

3. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:7043

### Professional Mode (Recommended)

For a production-like experience with friendly URLs:

1. **Setup local domains** (Windows - Run as Administrator)
```powershell
.\scripts\setup-hosts.ps1
```

2. **Start the application**
```powershell
.\scripts\start-professional.ps1
```

3. **Access via friendly URLs**
- **Local**: https://taskmanager.local
- **Network**: https://192.168.0.21 (your local IP)

## 🌐 Network Access

### Automatic Setup
```powershell
# Windows - Run as Administrator
.\scripts\start-professional.ps1
```

### Manual Setup
1. **Get your local IP**
```bash
ipconfig  # Windows
ifconfig  # macOS/Linux
```

2. **Start backend for network access**
```bash
dotnet run
```

3. **Start frontend in network mode**
```bash
cd client-ts
npm run start:network
```

4. **Access from other devices**
- Open browser on any device on the same network
- Navigate to: `http://YOUR_IP:3000`

## 📁 Project Structure

```
TaskManagerApp/
├── Api/                    # API Controllers
│   ├── AuthController.cs   # Authentication endpoints
│   └── TasksApiController.cs # Task management
├── client-ts/             # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
├── scripts/               # Automation scripts
│   ├── start-professional.ps1  # Main startup script
│   ├── load-env.ps1           # Environment loader
│   ├── show-env.ps1           # Environment display
│   ├── setup-hosts.ps1        # Local domain setup
│   └── setup-production.ps1   # Production deployment
├── Data/                  # Database context
├── Models/               # Data models
├── Services/             # Business logic
├── Dtos/                # Data transfer objects
├── Migrations/          # Database migrations
└── wwwroot/             # Built frontend (auto-generated)
```

## ⚙️ Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `env.example` to `.env` and customize:

```bash
# Database Configuration
DB_SERVER=localhost
DB_NAME=TaskManagerDb
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_KEY=your_super_secret_key_here
JWT_ISSUER=TaskManagerApp
JWT_AUDIENCE=TaskManagerApp

# Application Configuration
APP_ENVIRONMENT=Development
APP_PORT=7043

# Network Configuration
LOCAL_IP=192.168.0.21
DOMAIN_PRIMARY=taskmanager.local
```

### Port Configuration

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | 3000 | 80/443 |
| Backend HTTP | 7043 | 80 |
| Backend HTTPS | 7044 | 443 |

## 🔧 Available Scripts

### Frontend (`client-ts/`)
```bash
npm start              # Local development
npm run start:network  # Network access mode
npm run build          # Production build
npm test               # Run tests
```

### Backend
```bash
dotnet run             # Development mode
dotnet build           # Build project
dotnet test            # Run tests
dotnet ef database update  # Run migrations
```

### PowerShell Scripts (Windows)
```powershell
.\scripts\start-professional.ps1    # Start with professional setup
.\scripts\load-env.ps1             # Load environment variables
.\scripts\show-env.ps1             # Show current environment
.\scripts\setup-hosts.ps1          # Setup local domains (Admin)
.\scripts\setup-production.ps1     # Production deployment
```

## 🚀 Deployment

### Local Production Setup

1. **Build the frontend**
```bash
cd client-ts
npm run build
```

2. **Deploy to wwwroot**
```bash
xcopy /E /Y client-ts\build\* wwwroot\
```

3. **Start the application**
```bash
dotnet run
```

### Cloud Deployment

The application is ready for deployment to:
- **Azure App Service**
- **AWS Elastic Beanstalk**
- **Google Cloud Run**
- **Heroku**
- **DigitalOcean App Platform**

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **CORS Configuration** for secure cross-origin requests
- **Environment-based configuration** for different deployment stages
- **HTTPS support** with automatic certificate management
- **SQL injection protection** via Entity Framework
- **XSS protection** with proper content security policies

## 🐛 Troubleshooting

### Common Issues

**HTTPS Certificate Errors**
- Development certificates may show warnings
- Click "Advanced" and "Continue" to proceed
- Or use HTTP URLs for development

**CORS Errors**
- Verify the device's IP is included in CORS configuration
- Check `Program.cs` for allowed origins

**Cannot Access from Other Devices**
1. Ensure both devices are on the same WiFi network
2. Check firewall settings allow connections on ports 3000/7043
3. Verify you're using the correct local IP address

**Database Connection Issues**
1. Ensure MySQL is running
2. Verify connection string in `appsettings.json`
3. Check database credentials in environment variables

### Debug Mode

Enable detailed logging by setting:
```bash
LOG_LEVEL_DEFAULT=Debug
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Microsoft** for ASP.NET Core
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for smooth animations

---

**Made with ❤️ for productive task management**
