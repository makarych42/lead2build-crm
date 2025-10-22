# Скрипт для загрузки файлов на FTP сервер
param(
    [string]$FtpHost = "37.140.192.212",
    [string]$FtpUser = "u3272131_cursor",
    [string]$FtpPass = "M@k@rych42",
    [string]$FtpPort = "21",
    [string]$LocalPath = "public_html",
    [string]$RemotePath = "public_html"
)

Write-Host "🚀 Начинаем загрузку файлов на FTP сервер..." -ForegroundColor Green

# Проверяем подключение
Write-Host "📡 Проверяем подключение к FTP серверу..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName $FtpHost -Port $FtpPort -InformationLevel Quiet

if (-not $connection) {
    Write-Host "❌ Не удалось подключиться к FTP серверу!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Подключение к FTP серверу успешно!" -ForegroundColor Green

# Создаем FTP команды
$ftpCommands = @"
open $FtpHost $FtpPort
user $FtpUser $FtpPass
binary
cd $RemotePath
"@

# Добавляем команды для каждого файла
Get-ChildItem -Path $LocalPath -Recurse | ForEach-Object {
    if ($_.PSIsContainer -eq $false) {
        $relativePath = $_.FullName.Substring((Resolve-Path $LocalPath).Path.Length + 1)
        $ftpCommands += "`nput `"$($_.FullName)`" `"$relativePath`""
    }
}

$ftpCommands += "`nquit"

# Сохраняем команды в файл
$ftpCommands | Out-File -FilePath "ftp_commands.txt" -Encoding ASCII

Write-Host "📝 FTP команды сохранены в файл ftp_commands.txt" -ForegroundColor Yellow
Write-Host "🔧 Для выполнения загрузки используйте:" -ForegroundColor Cyan
Write-Host "   ftp -s:ftp_commands.txt" -ForegroundColor White

Write-Host "`n📋 Альтернативный способ:" -ForegroundColor Yellow
Write-Host "1. Откройте командную строку" -ForegroundColor White
Write-Host "2. Выполните: ftp" -ForegroundColor White
Write-Host "3. Введите команды из файла ftp_commands.txt" -ForegroundColor White

Write-Host "`n🎯 Или используйте FileZilla с данными:" -ForegroundColor Green
Write-Host "   Хост: $FtpHost" -ForegroundColor White
Write-Host "   Пользователь: $FtpUser" -ForegroundColor White
Write-Host "   Пароль: $FtpPass" -ForegroundColor White
Write-Host "   Port: $FtpPort" -ForegroundColor White
