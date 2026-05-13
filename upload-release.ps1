# Upload to GitHub Releases
param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$Owner = "hamoudawine-ai",
    [string]$Repo = "solo-hunter",
    [string]$Tag = "v7.0.19",
    [string]$FilePath = ".\dist_electron\SOLO-HUNTER-Portable-7.0.19.zip"
)

if (-not $Token) {
    Write-Error "GITHUB_TOKEN environment variable is not set"
    exit 1
}

# Create release if it doesn't exist
$releaseUrl = "https://api.github.com/repos/$Owner/$Repo/releases/tags/$Tag"
$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

try {
    $release = Invoke-RestMethod -Uri $releaseUrl -Headers $headers -Method Get
    Write-Host "Release $Tag already exists"
} catch {
    Write-Host "Creating release $Tag..."
    $body = @{
        tag_name = $Tag
        name = "SOLO HUNTER v7.0.19"
        body = "Portable version of SOLO HUNTER"
        draft = $false
        prerelease = $false
    } | ConvertTo-Json

    $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/releases" -Headers $headers -Method Post -Body $body
}

# Upload asset
$uploadUrl = $release.upload_url -replace '\{.*\}', "?name=SOLO-HUNTER-Portable-7.0.19.zip"
Write-Host "Uploading $FilePath to $uploadUrl..."

$headers["Content-Type"] = "application/zip"
Invoke-RestMethod -Uri $uploadUrl -Headers $headers -Method Post -InFile $FilePath

Write-Host "Upload completed successfully!"