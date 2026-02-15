# Taskformer

Taskformer is a Next.js app for task management, habits, and categories with gamification features.

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frobbsbodyshop-lab%2Ftaskformer&env=DATABASE_URL&envDescription=PostgreSQL%20connection%20string%20(get%20a%20free%20one%20from%20Supabase)&envLink=https%3A%2F%2Fsupabase.com%2Fdashboard&project-name=taskformer&repository-name=taskformer)

### Quick Start with Supabase

1. Click the **Deploy with Vercel** button above
2. Create a free database at [Supabase](https://supabase.com/dashboard):
   - Sign in with GitHub
   - Create new project (name: `taskformer`)
   - Save the database password
   - Go to Settings → Database → Connection string (URI)
3. Paste the connection string when Vercel asks for `DATABASE_URL`
4. After deployment, run migrations:
   ```bash
   DATABASE_URL="your-connection-string" npx prisma db push
   ```

## Local Setup

1. Copy environment template:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Start development server:

```bash
npm run dev
```

## Quality gates

Run the full production-quality gate:

```bash
npm run quality
```

This executes:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Autonomous build-test loop

Run the autonomous validation cycle:

```bash
npm run autonomous:cycle
```

By default it runs 5 consecutive cycles of lint, typecheck, test, and build.

You can override cycle count:

```bash
AUTONOMOUS_MAX_CYCLES=2 npm run autonomous:cycle
```

On Windows PowerShell:

```powershell
$env:AUTONOMOUS_MAX_CYCLES="2"; npm run autonomous:cycle
```
