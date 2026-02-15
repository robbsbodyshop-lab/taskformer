# Taskformer

Taskformer is a Next.js app for task management, habits, and categories.

## Setup

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
