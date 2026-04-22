# Free APIs Guide — EcoDrive

All services listed here are **completely free** with no credit card required.

---

## Maps & Geocoding

### ✅ OpenStreetMap + Leaflet (ALREADY USED)
- **What**: Interactive maps with full global coverage
- **Cost**: Free forever, no API key needed
- **Usage**: `react-leaflet` + `leaflet` — already in `package.json`
- **Tiles**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Rate limit**: None for reasonable use

### ✅ Nominatim Geocoding (ALREADY INTEGRATED)
- **What**: Search any city/address worldwide → lat/lng + bounding box
- **Cost**: Free, no API key
- **URL**: `https://nominatim.openstreetmap.org/search`
- **Rate limit**: 1 request/second (our debounced search handles this)
- **Usage**: `lib/geocoding.ts` — already built in

### Alternative: Photon (faster than Nominatim)
```typescript
const url = `https://photon.komoot.io/api/?q=${query}&limit=5`
```
- No API key, no rate limit concerns, open source

---

## Authentication

### ✅ Supabase (ALREADY USED)
- **Free tier**: 500MB DB, 50k MAU, unlimited auth
- **URL**: `https://supabase.com`
- **Setup**: Create project → copy URL + anon key to `.env.local`
- **Auth methods**: Email/password, Google OAuth (free), GitHub OAuth (free)

---

## EV Charging Data

### OpenChargeMap (Free, No CC Required)
- **What**: Global database of real EV charging stations
- **Cost**: Free for non-commercial use
- **API key**: Register at `https://openchargemap.org/site/develop/api`
- **Usage**:
```typescript
const res = await fetch(
  `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lng}&distance=25&distanceunit=KM&maxresults=50&key=${process.env.NEXT_PUBLIC_OPENCHARGEMAP_KEY}`
)
const stations = await res.json()
```
- **Replaces**: Mock station data with REAL stations worldwide

### EVSE (India-specific, Free)
- **CESL Charging Stations**: `https://evsewa.in` — public API for Indian government chargers

---

## Population & Demographics

### WorldPop (Free, No Key)
- **What**: High-resolution global population density rasters
- **Cost**: Free
- **Usage**: Download GeoTIFF tiles per country, sample at coordinates
- **URL**: `https://hub.worldpop.org/geodata/listing?id=29`

### GeoNames (Free)
- **What**: City populations, admin boundaries
- **Free username**: Register at `https://www.geonames.org/login`
```typescript
const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${YOUR_USERNAME}`
```

---

## Traffic & Road Data

### OpenStreetMap Overpass API (Free)
- **What**: Road network, POIs, building footprints
- **Cost**: Free, no key
```typescript
const query = `[out:json];node["amenity"="charging_station"](${south},${west},${north},${east});out;`
const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
```

---

## Analytics (Optional)

### PostHog (Free Tier)
- 1M events/month free
- Self-hostable
- URL: `https://posthog.com`

### Plausible (Student plan = free)
- Privacy-friendly analytics

---

## Summary: Replace Paid → Free

| Was Paid | Free Alternative | Already Integrated? |
|---|---|---|
| Mapbox (~$5/1k tiles) | OpenStreetMap + Leaflet | ✅ Yes |
| Google Maps (~$7/1k reqs) | Nominatim geocoding | ✅ Yes |
| Supabase Pro | Supabase Free Tier | ✅ Yes |
| Commercial EV data | OpenChargeMap | ⚠️ Add API key |
| Paid population data | WorldPop / GeoNames | ⚠️ Optional upgrade |
| Mapbox Geocoding | Nominatim / Photon | ✅ Yes |

---

## Quick Setup (5 minutes)

```bash
# 1. Copy env file
cp .env.example .env.local

# 2. Create free Supabase project at supabase.com
# Add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 3. (Optional) Free OpenChargeMap key from openchargemap.org
NEXT_PUBLIC_OPENCHARGEMAP_KEY=your-free-key

# 4. Run
npm install && npm run dev
```

The app works **100% without any API keys** in demo mode — Supabase falls back gracefully, maps use free OSM tiles, and geocoding uses the free Nominatim API.
