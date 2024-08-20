# oghunt
Sites on ProductHunt with ZERO AI Slop™
![no-slop-og](https://github.com/user-attachments/assets/c7c11807-0f76-47db-8283-45a67793b8a2)

### Development
1. `pnpm i`
2. `pnpm dev`

Create a ProductHunt account. Then, go to your [API Dashboard](https://www.producthunt.com/v2/oauth/applications). Afterwards, create an application. Set the redirect URI to `https://localhost:3000` for local development purposes. Then, generate a `Developer Token`, copy that, create a `.env` file in the root of this project's directory and paste that like:

```
API_TOKEN=myTokenHereUwu
```
