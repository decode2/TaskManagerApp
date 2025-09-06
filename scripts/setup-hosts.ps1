# Script simple para configurar archivo hosts
Write-Host "🚀 Configurando archivo hosts para TaskManagerApp..." -ForegroundColor Green

# Obtener la IP local
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

# Configurar archivo hosts
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$domains = @("taskmanager.local", "myapp.local", "tasks.local")

try {
    $hostsContent = Get-Content $hostsPath -Raw
    $added = $false
    
    foreach ($domain in $domains) {
        $entry = "$localIP $domain"
        if ($hostsContent -notlike "*$domain*") {
            Add-Content -Path $hostsPath -Value "`n# TaskManagerApp - $domain" -Force
            Add-Content -Path $hostsPath -Value $entry -Force
            Write-Host "✅ Agregado: $entry" -ForegroundColor Green
            $added = $true
        }
        else {
            Write-Host "ℹ️  Ya existe: $entry" -ForegroundColor Blue
        }
    }
    
    if ($added) {
        Write-Host "`n🎉 ¡Archivo hosts configurado!" -ForegroundColor Green
        Write-Host "`n🌐 URLs disponibles:" -ForegroundColor Cyan
        Write-Host "   - https://taskmanager.local" -ForegroundColor White
        Write-Host "   - https://myapp.local" -ForegroundColor White
        Write-Host "   - https://tasks.local" -ForegroundColor White
        Write-Host "   - https://$localIP" -ForegroundColor White
        Write-Host "`n💡 Reinicia el navegador para que tome los cambios" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error al modificar hosts: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Ejecuta PowerShell como administrador" -ForegroundColor Yellow
}
