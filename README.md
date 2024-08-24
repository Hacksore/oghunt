# oghunt

Product Hunt with ZERO AI Slop™
![image](https://github.com/user-attachments/assets/733569f6-ca25-4f91-bda4-472f1c833646)

### Development

This is what you need to get up and running

Create a ProductHunt account. Then, go to your [API Dashboard](https://www.producthunt.com/v2/oauth/applications). Afterwards, create an application. Set the redirect URI to `https://localhost:3000` for local development purposes. Then, generate a `Developer Token`, copy that, create a `.env` file similar to [.env.example](/.env.example). Set `CRON_SECRET` to whatever you'd like locally. Set `DATABASE_URL` to `"postgresql://dev:dev@localhost:5432/oghunt"` and make sure you already don't have PostgreSQL running on your machine otherwise Docker won't know what to do the port already being in use.

```
docker compose up -d
```

With the docker container running in the background: install dependencies, execute prisma commands, and run the app.

1. `pnpm i`
2. `pnpm db:generate` (only needed once or when you change schema)
3. `pnpm db:push` (only needed once to push these changes to the local DB)
4. `pnpm dev`

Then, we need to seed the DB. With the app and the docker container running, we'll do it via an API request to our backend to run our DB seed script.
We'll send a GET request to `http://localhost:3000/api/update-posts` with a header with a key of `Authorization` and a value of `Bearer CRON_SECRET` where `CRON_SECRET` is equal to the secret you put for `CRON_SECRET` in your `.env` file.

Please feel free to check out our [architecture diagram](./public/og-hunt-diagram.excalidraw) in Excalidraw.
