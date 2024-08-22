# oghunt
Product Hunt with ZERO AI Slop™
![image](https://github.com/user-attachments/assets/733569f6-ca25-4f91-bda4-472f1c833646)

### Development
This is what you need to get up and running

Create a ProductHunt account. Then, go to your [API Dashboard](https://www.producthunt.com/v2/oauth/applications). Afterwards, create an application. Set the redirect URI to `https://localhost:3000` for local development purposes. Then, generate a `Developer Token`, copy that, create a `.env` file similar to [.env.example](/.env.example).

1. `pnpm i`
2. `pnpm db:generate` (only needed once or when you change schema)
2. `pnpm dev`

