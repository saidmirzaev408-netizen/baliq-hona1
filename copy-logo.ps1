$src = "C:\Users\user\.gemini\antigravity\brain\c97d2a39-bdd2-4a24-8696-ddf8f879511f\.user_uploaded\media_1794417748300_7a4710be.png"
$dst = "C:\Users\user\Desktop\baliq hona 1\public\fishhouse-logo.png"
[System.IO.File]::Copy($src, $dst, $true)
Write-Host "Logo copied successfully"

