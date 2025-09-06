# Script de Configuración Profesional para TaskManagerApp
# Este script configura un entorno de producción seguro y escalable

param(
    [switch]$InstallCaddy,
    [switch]$ConfigureHosts,
    [switch]$SetupSSL,
    [switch]$All
)

Write-Host "🚀 Configuración Profesional de TaskManagerApp" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Obtener la IP local (excluyendo VMware)
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -like "192.168.*" -and 
    $_.IPAddress -ne "192.168.254.1" -and 
    $_.IPAddress -ne "192.168.23.1"
} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    Write-Host "❌ No se pudo detectar la IP local" -ForegroundColor Red
    exit 1
}

Write-Host "📍 IP detectada: $localIP" -ForegroundColor Green

# Función para instalar Caddy
function Install-Caddy {
    Write-Host "`n📦 Instalando Caddy..." -ForegroundColor Yellow
    
    # Verificar si Chocolatey está instalado
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "📥 Instalando Chocolatey..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    }
    
    # Instalar Caddy
    Write-Host "📥 Instalando Caddy via Chocolatey..." -ForegroundColor Yellow
    choco install caddy -y
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Caddy instalado correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al instalar Caddy" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Función para configurar el archivo hosts
function Set-HostsFile {
    Write-Host "`n📝 Configurando archivo hosts..." -ForegroundColor Yellow
    
    $hostsPath = "C:\Windows\System32\drivers\etc\hosts"
    $domains = @("taskmanager.local", "myapp.local", "tasks.local")
    
    try {
        $hostsContent = Get-Content $hostsPath -Raw
        
        foreach ($domain in $domains) {
            $entry = "$localIP $domain"
            if ($hostsContent -notlike "*$domain*") {
                Add-Content -Path $hostsPath -Value "`n# TaskManagerApp - $domain" -Force
                Add-Content -Path $hostsPath -Value $entry -Force
                Write-Host "✅ Agregado: $entry" -ForegroundColor Green
            } else {
                Write-Host "ℹ️  Ya existe: $entry" -ForegroundColor Blue
            }
        }
        return $true
    }
    catch {
        Write-Host "❌ Error: Necesitas ejecutar como administrador" -ForegroundColor Red
        Write-Host "💡 Ejecuta PowerShell como administrador y vuelve a intentar" -ForegroundColor Yellow
        return $false
    }
}

# Función para configurar SSL
function Set-SSLConfiguration {
    Write-Host "`n🔒 Configurando SSL..." -ForegroundColor Yellow
    
    # Crear directorio para certificados
    $sslDir = "C:\caddy\ssl"
    if (-not (Test-Path $sslDir)) {
        New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
    }
    
    # Configurar certificados de desarrollo
    Write-Host "🔧 Configurando certificados de desarrollo..." -ForegroundColor Yellow
    dotnet dev-certs https --clean
    dotnet dev-certs https --trust
    
    Write-Host "✅ SSL configurado correctamente" -ForegroundColor Green
    return $true
}

# Función para configurar Caddy como servicio
function Set-CaddyService {
    Write-Host "`n⚙️  Configurando Caddy como servicio..." -ForegroundColor Yellow
    
    # Crear directorio de configuración
    $configDir = "C:\caddy\config"
    if (-not (Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
    
    # Copiar configuración
    Copy-Item "Caddyfile.production" "$configDir\Caddyfile" -Force
    
    # Crear directorio de logs
    $logsDir = "C:\caddy\logs"
    if (-not (Test-Path $logsDir)) {
        New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
    }
    
    # Instalar como servicio
    Write-Host "🔧 Instalando Caddy como servicio..." -ForegroundColor Yellow
    caddy install --config "$configDir\Caddyfile"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Caddy instalado como servicio" -ForegroundColor Green
        
        # Iniciar servicio
        Write-Host "🚀 Iniciando servicio Caddy..." -ForegroundColor Yellow
        Start-Service caddy
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Servicio Caddy iniciado" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Error al iniciar el servicio" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Error al instalar Caddy como servicio" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Función para construir la aplicación
function Build-Application {
    Write-Host "`n🔨 Construyendo aplicación..." -ForegroundColor Yellow
    
    if (Test-Path "client-ts") {
        Write-Host "📦 Construyendo React app..." -ForegroundColor Yellow
        cd client-ts
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            cd ..
            if (-not (Test-Path "wwwroot")) {
                New-Item -ItemType Directory -Name "wwwroot"
            }
            Copy-Item -Path "client-ts/build/*" -Destination "wwwroot/" -Recurse -Force
            Write-Host "✅ Aplicación construida y desplegada" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Error al construir la aplicación" -ForegroundColor Red
            cd ..
            return $false
        }
    } else {
        Write-Host "❌ No se encontró el directorio client-ts" -ForegroundColor Red
        return $false
    }
}

# Función para verificar puertos
function Test-Ports {
    Write-Host "`n🔍 Verificando puertos..." -ForegroundColor Yellow
    
    $port80 = Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
    $port443 = Get-NetTCPConnection -LocalPort 443 -ErrorAction SilentlyContinue
    
    if ($port80) {
        Write-Host "⚠️  Puerto 80 está en uso por: $($port80.ProcessName)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Puerto 80 disponible" -ForegroundColor Green
    }
    
    if ($port443) {
        Write-Host "⚠️  Puerto 443 está en uso por: $($port443.ProcessName)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Puerto 443 disponible" -ForegroundColor Green
    }
}

# Ejecutar configuración según parámetros
if ($All -or $InstallCaddy) {
    Install-Caddy
}

if ($All -or $ConfigureHosts) {
    Set-HostsFile
}

if ($All -or $SetupSSL) {
    Set-SSLConfiguration
}

if ($All) {
    Set-CaddyService
    Build-Application
    Test-Ports
}

Write-Host "`n🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "`n🌐 URLs de acceso:" -ForegroundColor Cyan

Write-Host "🚀 Producción (recomendado):" -ForegroundColor Yellow
Write-Host "   - https://taskmanager.local" -ForegroundColor White
Write-Host "   - https://myapp.local" -ForegroundColor White
Write-Host "   - https://tasks.local" -ForegroundColor White

Write-Host "`n📱 Desarrollo:" -ForegroundColor Yellow
Write-Host "   - http://localhost:3000" -ForegroundColor White
Write-Host "   - http://$localIP:3000" -ForegroundColor White

Write-Host "`n📋 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   - Iniciar backend: dotnet run" -ForegroundColor White
Write-Host "   - Iniciar frontend: cd client-ts && npm start" -ForegroundColor White
Write-Host "   - Verificar Caddy: Get-Service caddy" -ForegroundColor White
Write-Host "   - Logs de Caddy: Get-Content C:\caddy\logs\access.log" -ForegroundColor White

Write-Host "`n🔒 Características de seguridad implementadas:" -ForegroundColor Green
Write-Host "   ✅ SSL/TLS automático" -ForegroundColor White
Write-Host "   ✅ Headers de seguridad" -ForegroundColor White
Write-Host "   ✅ Rate limiting" -ForegroundColor White
Write-Host "   ✅ Compresión automática" -ForegroundColor White
Write-Host "   ✅ Cache optimizado" -ForegroundColor White
Write-Host "   ✅ Health checks" -ForegroundColor White
