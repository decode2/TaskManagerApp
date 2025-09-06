# Script simple para cargar variables de entorno
Write-Host "🔧 Cargando variables de entorno..." -ForegroundColor Green

# Verificar si existe el archivo .env
$envFile = ".env"
$envExample = "env.example"

if (Test-Path $envFile) {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
    $sourceFile = $envFile
}
elseif (Test-Path $envExample) {
    Write-Host "📋 Usando archivo de ejemplo" -ForegroundColor Yellow
    Copy-Item $envExample $envFile
    $sourceFile = $envFile
    Write-Host "💡 Archivo .env creado desde env.example" -ForegroundColor Cyan
}
else {
    Write-Host "❌ No se encontró archivo de variables de entorno" -ForegroundColor Red
    exit 1
}

# Cargar variables de entorno
$envContent = Get-Content $sourceFile | Where-Object { 
    $_ -match '^[^#].*=.*' -and $_.Trim() -ne '' 
}

foreach ($line in $envContent) {
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Establecer variable de entorno
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "   $key = $value" -ForegroundColor Gray
    }
}

Write-Host "✅ Variables de entorno cargadas correctamente" -ForegroundColor Green

# Mostrar algunas variables importantes
Write-Host "`n📋 Variables principales:" -ForegroundColor Cyan
Write-Host "   APP_ENVIRONMENT: $env:APP_ENVIRONMENT" -ForegroundColor White
Write-Host "   DB_SERVER: $env:DB_SERVER" -ForegroundColor White
Write-Host "   LOCAL_IP: $env:LOCAL_IP" -ForegroundColor White
Write-Host "   DOMAIN_PRIMARY: $env:DOMAIN_PRIMARY" -ForegroundColor White
