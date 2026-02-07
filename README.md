# AEROMINE 3D Viewer (App Logo)

## Project Overview

This repository contains a lightweight 3D model viewer application built with React, Vite, and Three.js (via @react-three/fiber and @react-three/drei). The viewer is designed to load glTF models from the local `public/models` folder, automatically center and scale them, and provide interactive controls for rotate, pan and zoom.

The project is intended as a reusable component for previewing 3D assets (logos, product models, scene previews) during design and development.

## Key Features

- Loads glTF models and associated assets (binary files and textures) from `public/models`.
- Automatic centering, scaling and grounding of imported models so they fit the viewport.
- Orbit-style interaction: rotate, pan and zoom using mouse/touch controls.
- Optional auto-rotation for presentation or demo modes.
- Toggleable grid helper for spatial reference.
- Multiple background presets (gradients and solid colors) to preview models against different themes.
- Environment lighting (studio preset) for improved material/reflectance rendering.
- Loading progress indicator and error handling with user-friendly messages.

## Architecture / Important Files

- `package.json` — project metadata and scripts (dev/build/preview). Uses `vite`, `react`, `three`, `@react-three/fiber` and `@react-three/drei`.
- `src/` — application source code.
	- `src/main.jsx` — application entry point.
	- `src/App.jsx` — top-level UI, controls and state for viewer options.
	- `src/components/ModelViewer.jsx` — Canvas, camera, lighting, controls, environment and the loading/error handling wrapper.
	- `src/components/Model.jsx` — model loader using `useGLTF`, auto-scaling and centering logic, optional auto-rotation.
- `public/models/` — place your `.gltf`/`.glb` files, `.bin` assets and textures here. Example: `color_logo.gltf`, `color_logo.bin`, `textures/...`.

## Supported Formats

The viewer currently loads models via `useGLTF` and therefore supports files and assets compatible with glTF/glb: `.gltf`, `.glb`, `.bin` and common texture image formats (PNG, JPG, etc.).

## Installation

Prerequisites: Node.js LTS (recommended) and a package manager (`npm` or `pnpm`).

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open the app in your browser at the address shown by Vite (usually `http://localhost:5173`).

## Usage

- Place your model files in `public/models/`. By default the app uses `/models/color_logo.gltf` as the initial demo model.
- Use the UI controls to toggle auto-rotation and grid visibility, or to switch background presets.
- Mouse controls:
	- Left drag: rotate
	- Right drag: pan
	- Scroll: zoom

## Development Notes

- The `Model` component automatically computes bounding boxes and rescales/re-centers the model so it fits in a roughly 2-unit viewing space and sits on the ground plane (y = 0).
- Error handling is implemented via a React error boundary around the model load; errors display a short explanation and a hint to verify model assets are present under `public/models/`.
- Preloading: the `preloadModel(path)` helper is provided to prime asset loading when desired.

## Build & Deployment

Build the static site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

You can deploy the `dist/` output to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).

## Git / Safety Notes

- Commit the lockfile: keep `package-lock.json` under version control to ensure reproducible installs.
- Do not commit large dependency directories or sensitive files. Recommended `.gitignore` entries include `node_modules/`, `.env*`, `.vite/`, build artifacts (`dist/`, `build/`), editor config folders and private keys.
- Example of what to push: `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `ARCHITECTURE.md`, `src/` and vetted `public/` assets (models/textures that are intended to be public). Avoid pushing `node_modules/`.

## Contributing

Contributions are welcome. When submitting changes:

- Open a concise issue describing the bug or requested feature.
- Create a branch per change: `git checkout -b feat/describe-change`.
- Keep commits focused and include tests or detailed reproduction steps when possible.

## Troubleshooting

- If a model fails to load, check the browser console for 404s or CORS errors and ensure the `.gltf` references to `.bin` and texture paths are relative and present in `public/models/`.
- If visualization looks incorrect, confirm the model includes proper material/texture references and try alternative environment presets.

## Licensing & Contact

This repository is private by default (`private: true` in `package.json`). Add a license file if you plan to make the project public. For questions or support, contact the AEROMINE R&D team.

