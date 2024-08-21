# oghunt
Product Hunt with ZERO AI Slop™
![image](https://github.com/user-attachments/assets/733569f6-ca25-4f91-bda4-472f1c833646)

### Development
1. `pnpm i`
2. `pnpm dev`

Create a ProductHunt account. Then, go to your [API Dashboard](https://www.producthunt.com/v2/oauth/applications). Afterwards, create an application. Set the redirect URI to `https://localhost:3000` for local development purposes. Then, generate a `Developer Token`, copy that, create a `.env` file in the root of this project's directory and paste that like:

```
API_TOKEN=myTokenHereUwu
```

Architecture diagram is located at [public/og-hunt-diagram.excalidraw](/public/og-hunt-diagram.excalidraw) which you can upload to Excalidraw to view.
