# EcoDrive — AI-Powered EV Charging Station Planner

> A production-ready full-stack web application for optimizing EV charging station placement across Indian cities using machine learning and spatial analysis.

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd ecodrive
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your Supabase + Mapbox credentials

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — no auth credentials needed in demo mode.

---

## 🧩 Features

| Feature | Description |
|---|---|
| 🔐 Auth | Supabase email/password + Google OAuth |
| 🗺️ Interactive Map | Leaflet-based map with animated station markers |
| 🤖 AI Optimization | K-Means++ clustering + greedy coverage maximization |
| 📊 Analytics | 6 live charts: demand, utilization, coverage gap, revenue |
| 🎬 Simulation | Step-by-step playback of optimization algorithm |
| 🧠 AI Explanation | Per-run explanation of why locations were chosen |
| 💾 Plan Management | Save, compare, export optimization results |
| 📥 Export | CSV download of suggested station coordinates |
| 📱 Responsive | Mobile-first layout with sidebar navigation |

---

## 🏗️ Tech Stack

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS + custom glassmorphism utilities
Animations:   Framer Motion
Maps:         Leaflet + React-Leaflet (OSM tiles)
Charts:       Recharts
State:        Zustand (with localStorage persistence)
Database:     Supabase (PostgreSQL + Auth + RLS)
AI Logic:     Custom TypeScript spatial optimization (K-Means++ + greedy)
Fonts:        DM Sans + Syne + JetBrains Mono (Google Fonts)
```

---

## 📁 Project Structure

```
ecodrive/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout + fonts
│   ├── globals.css               # Design system + Tailwind
│   ├── auth/login/page.tsx       # Authentication
│   ├── dashboard/page.tsx        # Main dashboard
│   ├── map/page.tsx              # Interactive map
│   ├── optimize/page.tsx         # AI optimization engine
│   ├── analytics/page.tsx        # Charts & metrics
│   ├── plans/page.tsx            # Saved optimization plans
│   ├── compare/page.tsx          # Side-by-side comparison
│   ├── settings/page.tsx         # User settings
│   └── api/
│       ├── optimize/route.ts     # POST /api/optimize
│       ├── stations/route.ts     # GET /api/stations
│       └── analytics/route.ts   # GET /api/analytics
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # Page wrapper with sidebar
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── Header.tsx            # Top header bar
│   │   └── Providers.tsx         # Framer Motion provider
│   ├── map/
│   │   ├── MapView.tsx           # Leaflet map component
│   │   ├── MapFilters.tsx        # Filter sidebar panel
│   │   └── StationDetail.tsx     # Station info popup
│   ├── analytics/
│   │   └── Charts.tsx            # All Recharts components
│   ├── optimize/
│   │   ├── AIExplanationPanel.tsx # AI reasoning display
│   │   └── SimulationPlayback.tsx # Step-by-step replay
│   └── ui/
│       ├── index.tsx             # Card, Button, Badge, StatCard
│       └── toaster.tsx           # Toast notifications
├── lib/
│   ├── ai-optimizer.ts           # Core optimization algorithm
│   ├── mock-data.ts              # Indian regions + station data
│   ├── store.ts                  # Zustand global state
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # Helpers + export utilities
├── types/index.ts                # TypeScript interfaces
└── supabase/migrations/
    └── 001_initial_schema.sql    # Database schema
```

---

## ⚙️ Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (for production maps)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-token-here

# Optional (for AI microservice)
AI_SERVICE_URL=http://localhost:8000
```

---

## 🗄️ Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run `supabase/migrations/001_initial_schema.sql`
4. Enable Google OAuth in Authentication → Providers
5. Copy your Project URL and anon key to `.env.local`

---

## 🤖 AI Optimization Algorithm

The optimizer runs entirely in TypeScript (no Python required in demo mode):

1. **Candidate Generation**: 80 randomized points weighted by urban proximity
2. **K-Means++ Initialization**: Spread-optimal seed selection
3. **Multi-objective Scoring**: `score = w_demand·demand + w_traffic·traffic + w_pop·population`
4. **Greedy Placement**: Sort by score, place while enforcing minimum inter-station distance
5. **Metrics Computation**: Coverage improvement, CO2 reduction, cost estimation
6. **AI Explanation**: Factor weights and natural language rationale per run

---

## 🐍 Python Microservice (Optional)

For production-grade optimization, connect to a Python FastAPI microservice:

```python
# ai_service/main.py
from fastapi import FastAPI
from sklearn.cluster import KMeans
import geopandas as gpd

app = FastAPI()

@app.post("/optimize")
async def optimize(params: dict):
    # Load VAAHAN data, run scikit-learn clustering
    # Return suggested coordinates
    ...
```

Set `AI_SERVICE_URL=http://localhost:8000` to route optimization calls to it.

---

## 📦 Available Scripts

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript type check
```

---

## 🎨 Design System

- **Theme**: Dark glassmorphism with eco-green + electric-cyan accents
- **Fonts**: Syne (headings) + DM Sans (body) + JetBrains Mono (code)
- **Colors**: `eco-400 (#00f07a)` primary, `electric-400 (#06b6d4)` secondary
- **Components**: Glass cards with backdrop-blur, neon glows, animated markers

---

## 🗺️ Supported Regions

| City | Population | EV Registrations | Gap Score |
|---|---|---|---|
| Mumbai MMR | 20.7M | 48,230 | 72/100 |
| Delhi NCR | 32.9M | 89,540 | 65/100 |
| Bangalore | 13.6M | 62,810 | 58/100 |
| Hyderabad | 10.5M | 31,420 | 75/100 |
| Pune | 7.3M | 28,600 | 68/100 |
| Chennai | 11.0M | 24,350 | 71/100 |

---

## 📜 License

MIT — Built for India's EV infrastructure planning
