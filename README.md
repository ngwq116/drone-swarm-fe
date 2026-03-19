# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Architecture Overview

The simulation models a **leader-follower & CTDE hybrid** architecture:

- **Centralized Training**: mission parameters, sector assignments, and risk maps are configured centrally (simulated via the config panel and scenario presets).
- **Decentralized Execution**: each drone agent executes its assigned sweep path independently, making local decisions (return to charge, avoid hazards, report survivors) without a central coordinator at runtime.
- **Leader-Follower**: a designated lead drone initializes the sector sweep; follower drones inherit sector boundaries and adjust dynamically as drones fail or run low on battery.
- **Backup Drone Deployment**: standby drones are deployed automatically at a configurable step threshold to replace failed or low-battery units.

## Future Improvements

- **MCP (Model Context Protocol) Integration**: connect the simulation to a real MCP server so that an AI agent (e.g. Claude, Mistral 7B) can issue tool calls — `get_active_drones()`, `assign_sector()`, `get_risk_map()` — against live drone state rather than simulated log entries. This will turn the dashboard into a true human-in-the-loop MCP client for swarm coordination.
- **Self-hosted LLM Support**: integrate a self-hosted model (e.g. Mistral 7B) as the swarm reasoning agent, removing dependency on external APIs and enabling fully offline mission planning
- Real pathfinding algorithms (A*, boustrophedon coverage planning)
- WebSocket backend for multi-user mission monitoring
- Persistent mission history and replay
