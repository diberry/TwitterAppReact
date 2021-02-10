# Fixes

## launch.json

Make sure **url** uses `https`.

```json
        {
            "name": "Launch Edge against localhost",
            "request": "launch",
            "type": "pwa-msedge",
            "url": "https://localhost:3000",
            "webRoot": "${workspaceFolder}",
            "runtimeArgs": [
                "--disable-web-security"
            ],
        }
```

## add .env 

HTTPS is required so make sure it is used in address bar, skip cert check and keep going

```
HTTPS=true
```

## bearer auth undefined
