$projectDir = "C:\Users\HP\OneDrive\Desktop\unfiltered campus project\ventiora"
Set-Location $projectDir
node "$projectDir\node_modules\@playwright\test\cli.js" install chromium
