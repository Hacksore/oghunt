# oghunt

OGHUNT uses AI to remove the AI listings from today's Product Hunt launches.

![image](https://github.com/user-attachments/assets/28118c37-06df-4081-9504-cac4f18c7c76)


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app powering oghunt

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for code linting and formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Development

This is what you need to get up and running

1. Create a ProductHunt account. Then, go to your [API Dashboard](https://www.producthunt.com/v2/oauth/applications). Afterwards, create an application. Set the redirect URI to `https://localhost:3000` for local development purposes. Then, generate a `Developer Token`.

2. Generate a Gemini API key:
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a new API key
   - Copy the key for use in your environment variables

3. Create a `.env` file similar to [.env.example](/.env.example) with the following variables:
   - `CRON_SECRET`: Set to whatever you'd like locally
   - `DATABASE_URL`: Set to `"postgresql://dev:dev@localhost:5432/oghunt"`
   - `GEMINI_API_KEY`: Your Gemini API key from step 2
   - `PRODUCTHUNT_TOKEN`: Your ProductHunt Developer Token from step 1
   - `LOOPS_FORM_ENDPOINT`:  Set to whatever you'd like locally

4. Start the database:
```
docker compose up -d
```

5. With the docker container running in the background, install dependencies and set up the database:
   - `pnpm i`
   - `pnpm db:push` (only needed once to push these changes to the local DB)
   - `pnpm dev`

6. Seed the database:
   - Send a GET request to `http://localhost:3000/api/ingest-posts`
   - Include the header: `Authorization: Bearer CRON_SECRET` where `CRON_SECRET` matches your `.env` value

Please feel free to check out our [architecture diagram](./public/og-hunt-diagram.excalidraw) in Excalidraw.

## Team

- Lead Developer: [Pizza](https://github.com/RossLitzenberger)
- Product Owner: [Pati](https://typehero.dev/)
- Project Manager: [Hacksore](https://github.com/Hacksore)
- Senior Lead Developer: [Jim](https://github.com/JoshHyde9)
- Tech Consultant: [Trash](https://github.com/bautistaaa)
- Algorithm Specialist: [🐝](https://github.com/ArcherScript)
- Database Engineer: [Overclock](https://github.com/LucFauvel)
- Knows HTML: [Chad](https://github.com/chadstewart)
- Lead 404 Engineer: [Shane](https://github.com/swalker326)
- Lead UI/UX Engineer: [Boston](https://github.com/BostonRohan)
- System Architect: [Max](https://github.com/maxdemaio)
- Data Scientist: [TypeSafe](https://github.com/typesafeui)
- Data Visualization: [Nathan](https://github.com/nathanroark)
- Senior Lead Frontend Developer: [Jean](https://github.com/Kampouse)
- Human Resources: [Metalface](https://github.com/metal-face)
- Scrum Leader: [Aodhan](https://github.com/MVAodhan)
- 👑✨💅 Our Glorious Lead Tailwind Engineer: [PicklNik](https://github.com/picklenik)
- Civil Engineering Lead: [Mark](https://github.com/markkhoo)
