# PowerShell скрипт для загрузки файлов на сервер
param(
    [string]$ServerIP = "147.45.161.106",
    [string]$Username = "root",
    [string]$Password = "dC#qYrnY6yHoNz",
    [string]$LocalFile = "deployment_package.zip",
    [string]$RemotePath = "/root/"
)

Write-Host "🚀 Начинаем загрузку файлов на сервер $ServerIP..." -ForegroundColor Green

# Проверяем подключение
Write-Host "📡 Проверяем подключение к серверу..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName $ServerIP -Port 22 -InformationLevel Quiet

if (-not $connection) {
    Write-Host "❌ Не удалось подключиться к серверу!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Подключение к серверу успешно!" -ForegroundColor Green

# Проверяем существование файла
if (-not (Test-Path $LocalFile)) {
    Write-Host "❌ Файл $LocalFile не найден!" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Файл $LocalFile найден" -ForegroundColor Green

# Создаем команду SCP
$scpCommand = "scp `"$LocalFile`" ${Username}@${ServerIP}:${RemotePath}"

Write-Host "🔧 Команда для загрузки:" -ForegroundColor Cyan
Write-Host "   $scpCommand" -ForegroundColor White

Write-Host "`n📋 Инструкция по загрузке:" -ForegroundColor Yellow
Write-Host "1. Откройте командную строку или PowerShell" -ForegroundColor White
Write-Host "2. Выполните команду выше" -ForegroundColor White
Write-Host "3. Введите пароль: $Password" -ForegroundColor White
Write-Host "4. Дождитесь завершения загрузки" -ForegroundColor White

Write-Host "`n🌐 Альтернативный способ - через веб-интерфейс:" -ForegroundColor Green
Write-Host "1. Зайдите в панель управления Timeweb" -ForegroundColor White
Write-Host "2. Найдите 'Файловый менеджер' или 'File Manager'" -ForegroundColor White
Write-Host "3. Загрузите файл $LocalFile в папку /root/" -ForegroundColor White

Write-Host "`n📊 Информация о файле:" -ForegroundColor Cyan
$fileInfo = Get-Item $LocalFile
Write-Host "   Размер: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host "   Дата создания: $($fileInfo.CreationTime)" -ForegroundColor White
