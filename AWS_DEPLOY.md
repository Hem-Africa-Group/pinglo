# Pinglo AWS Deploy

The backend is built and ready, but AWS credentials must be configured before deployment.

Run this in PowerShell without sharing your keys in chat:

```powershell
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" configure
```

Use:

- Region: `us-east-1`
- Output: `json`

Then deploy everything and automatically update `aws-config.js`:

```powershell
cd C:\Users\hanee\Desktop\pinglo-main
.\deploy-aws.ps1
```

Optional production origin:

```powershell
.\deploy-aws.ps1 -AllowedOrigin "https://your-frontend-domain.com"
```
