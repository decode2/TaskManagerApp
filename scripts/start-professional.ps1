# Script de inicio profesional para TaskManagerApp
# Inicia la aplicación con URLs amigables y configuración optimizada

Write-Host "🚀 Iniciando TaskManagerApp en modo profesional..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Cargar variables de entorno
if (Test-Path "load-env.ps1") {
    Write-Host "🔧 Cargando variables de entorno..." -ForegroundColor Yellow
    & .\load-env.ps1
} else {
    Write-Host "⚠️  Script load-env.ps1 no encontrado" -ForegroundColor Yellow
}

# Obtener la IP local desde variables de entorno o detectar automáticamente
$localIP = $env:LOCAL_IP
if (-not $localIP) {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -like "192.168.*" -and $_.IPAddress -ne "192.168.254.1"
    } | Select-Object -First 1).IPAddress
}

if (-not $localIP) {
    Write-Host "❌ No se pudo detectar la IP local" -ForegroundColor Red
    exit 1
}

Write-Host "📍 IP detectada: $localIP" -ForegroundColor Green

# Obtener configuración desde variables de entorno
$appPort = $env:APP_PORT ?? "7044"
$domainPrimary = $env:DOMAIN_PRIMARY ?? "taskmanager.local"
$domainAlt1 = $env:DOMAIN_ALTERNATIVE_1 ?? "myapp.local"
$domainAlt2 = $env:DOMAIN_ALTERNATIVE_2 ?? "tasks.local"
$appEnvironment = $env:APP_ENVIRONMENT ?? "Development"

Write-Host "🔧 Configuración:" -ForegroundColor Cyan
Write-Host "   Entorno: $appEnvironment" -ForegroundColor White
Write-Host "   Puerto: $appPort" -ForegroundColor White
Write-Host "   Dominio principal: $domainPrimary" -ForegroundColor White

# Verificar si el archivo hosts está configurado
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$hostsContent = Get-Content $hostsPath -Raw

if ($hostsContent -notlike "*$domainPrimary*") {
    Write-Host "⚠️  Dominios locales no configurados" -ForegroundColor Yellow
    Write-Host "💡 Ejecuta primero: .\setup-hosts.ps1 (Como Administrador)" -ForegroundColor Cyan
}

# Verificar si existe el directorio wwwroot
if (-not (Test-Path "wwwroot")) {
    Write-Host "⚠️  Frontend no desplegado" -ForegroundColor Yellow
    Write-Host "💡 Ejecuta: .\setup-production.ps1" -ForegroundColor Cyan
}

# Verificar si el backend está ejecutándose
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "https://localhost:$appPort/api/tasks" -UseBasicParsing -TimeoutSec 5
    $backendRunning = $true
} catch {
    $backendRunning = $false
}

if (-not $backendRunning) {
    Write-Host "`n🔧 Iniciando backend..." -ForegroundColor Yellow
    
    # Iniciar backend en background
    Start-Process -FilePath "dotnet" -ArgumentList "run" -WindowStyle Minimized
    
    # Esperar a que el backend esté listo
    Write-Host "⏳ Esperando que el backend esté listo..." -ForegroundColor Cyan
    $attempts = 0
    do {
        Start-Sleep -Seconds 2
        $attempts++
        try {
            $response = Invoke-WebRequest -Uri "https://localhost:$appPort/api/tasks" -UseBasicParsing -TimeoutSec 5
            $backendRunning = $true
        } catch {
            $backendRunning = $false
        }
    } while (-not $backendRunning -and $attempts -lt 15)
    
    if ($backendRunning) {
        Write-Host "✅ Backend iniciado correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error iniciando backend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Backend ya está ejecutándose" -ForegroundColor Green
}

# Mostrar URLs de acceso
Write-Host "`n🌐 URLs de Acceso Disponibles:" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

if ($hostsContent -like "*$domainPrimary*") {
    Write-Host "  🏠 Local (PC host):" -ForegroundColor White
    Write-Host "    - https://$domainPrimary" -ForegroundColor Green
    Write-Host "    - https://$domainAlt1" -ForegroundColor Green
    Write-Host "    - https://$domainAlt2" -ForegroundColor Green
}

Write-Host "`n  📱 Red local (dispositivos móviles):" -ForegroundColor White
Write-Host "    - https://$localIP" -ForegroundColor Green

Write-Host "`n  🔧 Desarrollo:" -ForegroundColor White
Write-Host "    - https://localhost:$appPort" -ForegroundColor Yellow

# Abrir navegador
Write-Host "`n🚀 Abriendo navegador..." -ForegroundColor Cyan
if ($hostsContent -like "*$domainPrimary*") {
    Start-Process "https://$domainPrimary"
} else {
    Start-Process "https://localhost:$appPort"
}

Write-Host "`n✅ ¡Aplicación iniciada!" -ForegroundColor Green
Write-Host "📝 Para detener: Ctrl+C en esta ventana" -ForegroundColor Yellow

# Mantener la ventana abierta
Write-Host "`n⏳ Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
