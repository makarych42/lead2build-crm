# PowerShell script for uploading files to server
param(
    [string]$ServerIP = "147.45.161.106",
    [string]$Username = "root",
    [string]$Password = "dC#qYrnY6yHoNz",
    [string]$LocalFile = "deployment_package.zip",
    [string]$RemotePath = "/root/"
)

Write-Host "Starting file upload to server $ServerIP..." -ForegroundColor Green

# Test connection
Write-Host "Testing connection to server..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName $ServerIP -Port 22 -InformationLevel Quiet

if (-not $connection) {
    Write-Host "Failed to connect to server!" -ForegroundColor Red
    exit 1
}

Write-Host "Connection successful!" -ForegroundColor Green

# Check if file exists
if (-not (Test-Path $LocalFile)) {
    Write-Host "File $LocalFile not found!" -ForegroundColor Red
    exit 1
}

Write-Host "File $LocalFile found" -ForegroundColor Green

# Create SCP command
$scpCommand = "scp `"$LocalFile`" ${Username}@${ServerIP}:${RemotePath}"

Write-Host "SCP command for upload:" -ForegroundColor Cyan
Write-Host "   $scpCommand" -ForegroundColor White

Write-Host "`nUpload instructions:" -ForegroundColor Yellow
Write-Host "1. Open Command Prompt or PowerShell" -ForegroundColor White
Write-Host "2. Run the command above" -ForegroundColor White
Write-Host "3. Enter password: $Password" -ForegroundColor White
Write-Host "4. Wait for upload to complete" -ForegroundColor White

Write-Host "`nAlternative method - via web interface:" -ForegroundColor Green
Write-Host "1. Go to Timeweb control panel" -ForegroundColor White
Write-Host "2. Find 'File Manager' or 'File Manager'" -ForegroundColor White
Write-Host "3. Upload file $LocalFile to /root/ folder" -ForegroundColor White

Write-Host "`nFile information:" -ForegroundColor Cyan
$fileInfo = Get-Item $LocalFile
Write-Host "   Size: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host "   Created: $($fileInfo.CreationTime)" -ForegroundColor WhiteЁ