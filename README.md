# Drone Swarm MCP — Frontend Simulation

A browser-based simulation dashboard for drone swarm Search-and-Rescue (SAR) missions. This is a **front-end-only simulation** of a **leader-follower & CTDE (Centralized Training, Decentralized Execution) combination** architecture — no backend or real drone hardware is required. It demonstrates how a swarm of UAVs can be coordinated to sweep a grid, locate survivors, manage battery charging, deploy backup drones, and respond to hazards, all driven by client-side logic.

![SwarmSAR Dashboard](src/assets/hero.png)

## Features

- Real-time grid visualization of drone positions, scanned cells, hazards, and located survivors
- Multiple pre-configured mission scenarios (Standard, Drone Failure, High Risk, Dynamic Fleet)
- Live mission KPIs: area coverage %, active/charging/failed drone counts, average battery
- Fleet status panel per drone with battery level and current status
- Mission log with reasoning traces, tool call simulations, and alerts
- Configurable parameters: drone count, grid size, backup drone count, target count
- Critical battery alerts with modal notifications

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS v4**

## Setup

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install & Run

```bash
# Clone the repository
git clone <repo-url>
cd drone-swarm-mcp-fe

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other Scripts

```bash
npm run build    # Type-check and build for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Architecture Overview

The simulation models a **leader-follower & CTDE hybrid** architecture:

- **Centralized Training**: mission parameters, sector assignments, and risk maps are configured centrally (simulated via the config panel and scenario presets).
- **Decentralized Execution**: each drone agent executes its assigned sweep path independently, making local decisions (return to charge, avoid hazards, report survivors) without a central coordinator at runtime.
- **Leader-Follower**: a designated lead drone initializes the sector sweep; follower drones inherit sector boundaries and adjust dynamically as drones fail or run low on battery.
- **Backup Drone Deployment**: standby drones are deployed automatically at a configurable step threshold to replace failed or low-battery units.

## Future Improvements

- **MCP (Model Context Protocol) Integration**: connect the simulation to a real MCP server so that an AI agent (e.g. Claude) can issue tool calls — `get_active_drones()`, `assign_sector()`, `get_risk_map()` — against live drone state rather than simulated log entries. This will turn the dashboard into a true human-in-the-loop MCP client for swarm coordination.
- Real pathfinding algorithms (A*, boustrophedon coverage planning)
- WebSocket backend for multi-user mission monitoring
- Persistent mission history and replay
- Mobile-responsive layout
