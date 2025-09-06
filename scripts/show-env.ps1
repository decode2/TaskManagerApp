# Script para mostrar el estado de las variables de entorno
Write-Host "🔍 Estado de Variables de Entorno - TaskManagerApp" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Verificar archivos de configuración
$envFile = ".env"
$envExample = "env.example"

Write-Host "`n📁 Archivos de configuración:" -ForegroundColor Cyan
if (Test-Path $envFile) {
    Write-Host "   ✅ .env encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env no encontrado" -ForegroundColor Red
}

if (Test-Path $envExample) {
    Write-Host "   ✅ env.example encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ env.example no encontrado" -ForegroundColor Red
}

# Cargar variables si existe .env
if (Test-Path $envFile) {
    Write-Host "`n🔧 Cargando variables desde .env..." -ForegroundColor Yellow
    & .\load-env.ps1
}

# Mostrar variables importantes
Write-Host "`n📋 Variables de Entorno Actuales:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$importantVars = @(
    "APP_ENVIRONMENT",
    "APP_PORT", 
    "DB_SERVER",
    "DB_NAME",
    "LOCAL_IP",
    "DOMAIN_PRIMARY",
    "JWT_ISSUER",
    "LOG_LEVEL_DEFAULT"
)

foreach ($var in $importantVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if ($value) {
        Write-Host "   $var = $value" -ForegroundColor Green
    } else {
        Write-Host "   $var = [NO DEFINIDA]" -ForegroundColor Red
    }
}

# Mostrar configuración de red
Write-Host "`n🌐 Configuración de Red:" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

$localIP = [Environment]::GetEnvironmentVariable("LOCAL_IP", "Process") ?? "192.168.0.21"
$domainPrimary = [Environment]::GetEnvironmentVariable("DOMAIN_PRIMARY", "Process") ?? "taskmanager.local"
$appPort = [Environment]::GetEnvironmentVariable("APP_PORT", "Process") ?? "7044"

Write-Host "   IP Local: $localIP" -ForegroundColor White
Write-Host "   Dominio Principal: $domainPrimary" -ForegroundColor White
Write-Host "   Puerto App: $appPort" -ForegroundColor White

# Verificar servicios
Write-Host "`n🔍 Estado de Servicios:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Verificar Caddy
$caddyProcess = Get-Process -Name "caddy" -ErrorAction SilentlyContinue
if ($caddyProcess) {
    Write-Host "   ✅ Caddy ejecutándose (PID: $($caddyProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   ❌ Caddy no ejecutándose" -ForegroundColor Red
}

# Verificar puertos
$port80 = Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
$port443 = Get-NetTCPConnection -LocalPort 443 -ErrorAction SilentlyContinue

if ($port80) {
    Write-Host "   ✅ Puerto 80 activo" -ForegroundColor Green
} else {
    Write-Host "   ❌ Puerto 80 inactivo" -ForegroundColor Red
}

if ($port443) {
    Write-Host "   ✅ Puerto 443 activo" -ForegroundColor Green
} else {
    Write-Host "   ❌ Puerto 443 inactivo" -ForegroundColor Red
}

# URLs disponibles
Write-Host "`n🌐 URLs Disponibles:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

Write-Host "   📱 Móviles: https://$localIP" -ForegroundColor Green
Write-Host "   🏠 PC: https://$domainPrimary" -ForegroundColor Green
Write-Host "   🔧 Dev: https://localhost:$appPort" -ForegroundColor Yellow

Write-Host "`n✅ Análisis completado" -ForegroundColor Green
