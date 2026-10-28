# ⚡ ETHERLYVAN — Engineering Journey

> **Learn the fundamentals → Build reusable tools → Ship real applications.**  
> `[ BUILD // BREAK // DEBUG // REPEAT ]`

A public learning roadmap and project organization plan for [@etherlyvan](https://github.com/etherlyvan). The goal is to demonstrate actual engineering growth through working code, tests, and clear documentation—not a collection of empty repositories.

## Repository Organization

> **Note:** These are separate GitHub repositories under one account, *not* literal folders or nested repositories. The groups below are conceptual; use GitHub **topics** to categorize them.

```text
github.com/etherlyvan/
│
├── etherlyvan                 # Profile README
├── engineering-journey        # Master roadmap & progress tracker
│
├── [01] ENGINEERING FUNDAMENTALS
│   ├── ether-algo             # Data Structures & Algorithms — TypeScript
│   ├── ether-cli              # CLI & File I/O — TypeScript / Node.js
│   ├── ether-http             # HTTP Server from Scratch — TypeScript / TCP
│   ├── ether-db               # Mini Database Engine — TypeScript
│   ├── ether-cache            # TTL / LRU Cache — TypeScript
│   ├── ether-auth             # Authentication & RBAC — TypeScript / PostgreSQL
│   ├── ether-queue            # Background Jobs — TypeScript / PostgreSQL
│   └── ether-proxy            # Basic Reverse Proxy — Go
│
├── [02] DEVELOPER BOILERPLATES
│   ├── ether-fullstack        # Next.js / Prisma / PostgreSQL
│   ├── ether-backend          # NestJS / PostgreSQL / Redis
│   ├── ether-ai               # FastAPI / Pydantic / LLM API
│   ├── ether-agent            # LangGraph / FastAPI / PostgreSQL
│   ├── ether-rag              # FastAPI / pgvector / PostgreSQL
│   ├── ether-saas             # Next.js / Multi-tenancy
│   ├── ether-microservice     # NestJS / RabbitMQ / Docker
│   └── ether-devops           # Docker / GitHub Actions / Nginx
│
└── [03] FEATURED PROJECTS
    ├── agentforge             # AI Workflow Platform
    ├── vaultmind              # AI Document Intelligence
    └── pulsewatch             # API Monitoring
```

## Phase 1 — Engineering Fundamentals

Build these **in sequence**. Estimated durations are flexible, assuming part-time learning alongside a full-time job.

| Order | Repository | Stack | Concepts | Target |
|---|---|---|---|---|
| 01 | `ether-algo` | TypeScript, Vitest | Arrays, stacks, queues, searching, sorting, Big O | Weeks 1–2 |
| 02 | `ether-cli` | Node.js, TypeScript | CLI arguments, filesystem, JSON, error handling | Week 3 |
| 03 | `ether-http` | Node.js, TypeScript, TCP | Sockets, HTTP parsing, routing, responses | Week 4 |
| 04 | `ether-db` | TypeScript, Node.js | Key-value storage, indexing basics, persistence | Week 5 |
| 05 | `ether-cache` | TypeScript, Vitest | TTL, cache policies, LRU eviction | Week 6 |
| 06 | `ether-auth` | Node.js, TypeScript, PostgreSQL | Password hashing, sessions, authorization, RBAC | Week 7 |
| 07 | `ether-queue` | Node.js, TypeScript, PostgreSQL | Background workers, retries, idempotency | Week 8 |
| 08 | `ether-proxy` | Go, HTTP, Docker | Reverse proxy, load balancing, health checks | Weeks 9–10 |

### Progress Tracker

- [x] `ether-algo` — Data structures and algorithms
- [ ] `ether-cli` — CLI task manager
- [ ] `ether-http` — Basic HTTP server from scratch
- [ ] `ether-db` — Persistent mini database
- [ ] `ether-cache` — Cache engine with expiration and LRU
- [ ] `ether-auth` — Secure authentication API
- [ ] `ether-queue` — Background job processing
- [ ] `ether-proxy` — Reverse proxy in Go

> **Publishing rule:** Create a repository when you start it. Publish it when it has meaningful code, instructions, and tests; don't create 8 empty public repos at once.

## Phase 2 — Reusable Developer Boilerplates

These are **GitHub template repositories**, designed to start future projects quickly. Build the first three before attempting the advanced ones.

| Priority | Repository | Stack | Starter Capabilities |
|---|---|---|---|
| First | `ether-fullstack` | Next.js, TypeScript, Prisma, PostgreSQL | Auth, dashboard, RBAC, tests |
| First | `ether-backend` | NestJS, TypeScript, PostgreSQL, Redis | REST API, validation, logging, caching |
| First | `ether-ai` | Python, FastAPI, Pydantic, LLM API | LLM integration, tool calling, structured output |
| Later | `ether-agent` | LangGraph, FastAPI, PostgreSQL | Agent workflows, state, approvals |
| Later | `ether-rag` | FastAPI, PostgreSQL, pgvector | Ingestion, embeddings, search, citations |
| Later | `ether-saas` | Next.js, Prisma, PostgreSQL | Multi-tenancy, teams, permissions |
| Later | `ether-microservice` | NestJS, RabbitMQ, PostgreSQL, Docker | Async messaging, retries, service boundaries |
| Later | `ether-devops` | Docker, GitHub Actions, Nginx | CI/CD, health checks, deployment examples |

Each boilerplate should include a working example, `.env.example`, tests, setup instructions, and a clear statement of what is **not** included. Enable **Settings → General → Template repository** on GitHub.

## Phase 3 — Featured Applications

Use the boilerplates you built to ship meaningful portfolio applications.

| Repository | Concept | Suggested Stack |
|---|---|---|
| `agentforge` | AI agent & workflow orchestration | Next.js, FastAPI, LangGraph, PostgreSQL |
| `vaultmind` | Document Q&A with retrieval and source citations | Next.js, FastAPI, PostgreSQL, pgvector |
| `pulsewatch` | API uptime, latency monitoring, incident alerts | Go, Next.js, PostgreSQL |

**Rule:** A finished, tested project with a live demo is more valuable than several incomplete projects.

## Naming & GitHub Topics

- Repository names: **lowercase kebab-case**, e.g., `ether-http`.
- Fundamentals: `engineering-fundamentals`, `learning-in-public`.
- Boilerplates: `starter-template`, `boilerplate`.
- AI: `ai-engineering`, `rag`, `ai-agents` as applicable.
- Featured apps: `portfolio-project` plus relevant technical topics.

## Repository Quality Checklist

Every completed repository should include:

- [ ] A concise README explaining **what it does** and **what was learned**
- [ ] Reproducible install and run instructions
- [ ] Usage examples or sample output
- [ ] Unit tests and important edge cases
- [ ] Meaningful commits and a clean `.gitignore`
- [ ] A note about technical decisions and limitations
- [ ] A license (only if you intend to permit reuse)

For boilerplates, also include `.env.example`, CI, and a working template setup. For featured apps, add a live demo, screenshots, and a brief architecture diagram when available.

### Example Repository Layout — `ether-http`

```text
ether-http/
├── src/
│   ├── server.ts
│   ├── parser.ts
│   └── router.ts
├── tests/
├── docs/
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## GitHub Profile Layout

Use the `etherlyvan` profile README to help visitors navigate without making it read like a CV.

```text
ETHERLYVAN // SYSTEM ONLINE
├── > whoami
├── > tech_stack
├── > engineering_journey  → engineering-journey
├── > developer_toolkit    → boilerplate repositories
├── > featured_projects    → shipped applications
├── > github_activity
└── > connect
```

### Target Pinned Repositories (once completed)

1. `engineering-journey` — learning index
2. `ether-http` — networking fundamentals
3. `ether-fullstack` — full-stack reusable starter
4. `ether-ai` — AI engineering starter
5. `agentforge` — full AI application
6. `pulsewatch` — backend/system engineering

Until these are ready, pin your strongest **existing** projects rather than unfinished repositories.

## Weekly Routine

| Day | Activity | Time |
|---|---|---|
| Monday | Read concepts & take notes | 45–60 min |
| Tuesday | Implement without copying | ~60 min |
| Wednesday | Rest | — |
| Thursday | Continue and debug | ~60 min |
| Friday | Rest | — |
| Saturday | Build & test | 2–3 hours |
| Sunday | README, refactor, commit | 1–2 hours |

Use AI as a tutor, debugger, or reviewer—but make sure you understand and can explain the solution yourself.

---

<div align="center">

**`[ LEARN THE INTERNALS // BUILD THE TOOLS // SHIP THE PRODUCT ]`**

*Still under development.*

</div>

