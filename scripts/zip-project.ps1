Add-Type -AssemblyName System.IO.Compression.FileSystem
$source = 'C:\Users\Cam Tu\.gemini\antigravity\scratch\det-nen-tuong-lai-export'
$dest1 = 'C:\Users\Cam Tu\.gemini\antigravity\scratch\det-nen-tuong-lai-source.zip'
$dest2 = 'C:\Users\Cam Tu\.gemini\antigravity\brain\5c203936-185a-4c89-8d5c-12a0b30dbd6c\det-nen-tuong-lai-source.zip'

if (Test-Path $dest1) { Remove-Item $dest1 -Force }
if (Test-Path $dest2) { Remove-Item $dest2 -Force }

Write-Host "Compressing $source to $dest1..."
[System.IO.Compression.ZipFile]::CreateFromDirectory($source, $dest1, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Write-Host "Copying to $dest2..."
Copy-Item $dest1 $dest2 -Force

Get-Item $dest1, $dest2 | Select-Object FullName, Length | Format-Table -AutoSize
Write-Host "Compression completed successfully."
