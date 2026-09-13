# RailOptAI — Indian Railways Intelligent Maintenance Coordination & Live Conflict Tracking

> **Smart India Hackathon (SIH) Project**  
> AI-powered Railway Maintenance Block Scheduling & Real-Time Corridor Train Tracking System for Indian Railways (IR).

---

## 🚆 System Overview

RailOptAI synchronizes live Indian Railways traffic with track maintenance possessions to eliminate punctuality loss and passenger express conflicts.

### Key Map Live Tracking Capabilities
- **Simulated Track Defect Marker**: Displays precise track anomalies (e.g., *Ultrasonic Track Flaw MT-1042* at Km 54/8 on the Delhi–Rewari corridor) with live pulsing radar markers on the track.
- **Interactive Inspection**: Clicking the track defect dynamically reveals:
  - **Live Train Running Pointers**: Precise ground/station locations of all approaching express trains on the corridor.
  - **Time to Train Arrival**: Real-time calculated arrival minutes (`⏱️ 14 mins to Track Defect`) and estimated clock ETA.
  - **Live Conflict Detection**: Evaluates approaching trains against the proposed maintenance block possession window (marks trains as `⚠️ CRITICAL CONFLICT`, `⚠️ APPROACHING BLOCK`, or `✅ SAFE WINDOW`).
  - **AI Recommended Maintenance Window**: Automatically calculates a shifted, conflict-free maintenance window after the conflicting train clears the section.
  - **Multi-Level Role Directives**: Adapts tactical instructions dynamically based on the logged-in railway official (Level 4/5 SSE Field Gangs, Level 3 Chief Controller, Level 2 DRM, Level 0/1 CRB).

---

## 🔒 RapidAPI Integration Architecture

To ensure enterprise-grade security for the hackathon presentation, **the RapidAPI key is never exposed to browser or frontend JavaScript**. All external API calls are routed through a secure Node.js backend proxy.

### RapidAPI Provider Details
- **API**: Indian Railway IRCTC API
- **Host**: `indian-railway-irctc.p.rapidapi.com`
- **Endpoints Used**:
  - `GET https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status?departure_date=YYYYMMDD&train_number=TRAIN_NUMBER`
  - `GET https://indian-railway-irctc.p.rapidapi.com/api/trains-search/v1/train/{train_number}`
- **Security**: Key stored strictly in server environment variable `RAPIDAPI_KEY`.
- **In-Memory Caching**: Responses are cached with configurable TTL (`CACHE_TTL=60s`) to prevent rate-limiting.
- **Resilient Fallback Stream**: If an API key is not supplied or the external service experiences downtime/rate-limits, the backend automatically transitions to the validated CRIS/NTES operations telemetry stream without crashing or throwing UI errors.

---

## 🚀 Quick Setup & Demonstration Guide

### 1. RapidAPI Account Setup (Optional for Live External Queries)
1. Sign up on [RapidAPI](https://rapidapi.com/).
2. Subscribe to the **Indian Railway IRCTC** API (`indian-railway-irctc.p.rapidapi.com`).
3. Copy your RapidAPI Key (`x-rapidapi-key`).

### 2. Configure Environment Variables
Copy the template file to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and paste your key:
```env
RAPIDAPI_KEY=your_rapidapi_key_here
PORT=3000
LIVE_REFRESH_INTERVAL=60
CACHE_TTL=60
```
*(Note: If `RAPIDAPI_KEY` is left blank, RailOptAI automatically activates the high-fidelity CRIS/NTES operations feed for offline judging).*

### 3. Start the Application Server
```bash
npm start
```
The server serves both static frontend assets and the backend API on `http://localhost:3000`.

### 4. Live Map Demonstration Flow
1. Open `http://localhost:3000` in your web browser.
2. Select your role on the login page (or click **Bypass / Dev Enter**).
3. Click the **Network Map** tab on the navigation bar.
4. Select the corridor section from the dropdown:
   - **Rewari → Gurugram** (`RE-GGN`) — Featured SIH Section
   - **Ambala Cantt → Sirhind** (`UMB-SIR`)
5. On the map, click the pulsing **⚠️ Ultrasonic Track Flaw (MT-1042)** marker on the track.
6. Observe:
   - Train running pointers appear on the track with speed and direction.
   - The **Track Defect & Live Arrival HUD** slides out with train ETAs.
   - Conflict evaluation highlights trains clashing with the proposed block.
   - The AI generates a shifted, safe maintenance window.
   - The role-specific operational directive adapts if you switch between SSE, Chief Controller, DRM, or Railway Board.

---

## 📡 Backend API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Returns server health, cache stats, and RapidAPI connection status. |
| `/api/trains/live-status?trainNumber=12015` | `GET` | Fetches normalized live status for a specific train. |
| `/api/trains/corridor?section=RE-GGN&roleLevel=4` | `GET` | Returns corridor defect data, all approaching trains, arrival minutes, conflict analysis, AI recommendation, and level-adapted advisory. |

---

## 👥 Multi-Level Role Architecture

- **Level 4 / 5 (SSE P-Way)**: Trackside execution, gang deployment, caution orders (30 km/h pilot).
- **Level 3 (Chief Section Controller)**: Real-time signal slotting, loop line loop-through, single line working (SLW).
- **Level 2 (DRM / Senior DOM)**: Divisional block authorization, punctuality preservation, sectional throughput index.
- **Level 0 / 1 (CRB / Railway Board)**: Apex HDN corridor slot concurrency index, zero cancellations guarantee.
