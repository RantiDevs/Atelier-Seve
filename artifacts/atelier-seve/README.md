# Atelier Sève — Luxury Beauty Studio

A high-fidelity, premium digital experience for **Atelier Sève**, a luxury beauty studio specializing in bespoke rituals and artistic makeup. This platform features advanced scroll-triggered animations, interactive 3D elements, and seamless multilingual support.

![Banner](https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop)

## ✨ Key Features

*   **Interactive Ritual Sequence:** A custom GSAP-powered pinned scroll experience that simulates the opening of a 3D makeup box and the application of a beauty ritual.
*   **Art of Makeup:** Smooth cross-fading transformation sequences showing the step-by-step application of professional makeup.
*   **Before & After Sliders:** High-performance interactive sliders for viewing real treatment transformations (Lashes, Facials, Lips).
*   **Multilingual Support:** Full localization in Italian (IT) and English (EN) with instant language switching.
*   **AI Beauty Consultant:** A functional frontend mockup for an AI-powered automated consultant.
*   **Fluid Typography & Design:** Ultra-modern aesthetics with fluid scaling and a curated "Espresso & Gold" color palette.

## 🛠️ Technology Stack

*   **Core:** React + Vite
*   **Animations:** GSAP (ScrollTrigger, Context) & Framer Motion
*   **3D Graphics:** Three.js (React Three Fiber & Drei)
*   **Styling:** TailwindCSS 4.0 + Vanilla CSS (Glassmorphism, Gradients)
*   **State:** React Context API for language management

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- pnpm (Recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/RantiDevs/Atelier-Seve.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```

## 📂 Project Structure

- `/src/components`: UI components (Ritual, Makeup, AI Bot, etc.)
- `/src/LanguageContext.tsx`: Multilingual state management.
- `/src/i18n.ts`: Translation dictionary.
- `/public/treatments`: Production-ready treatment assets (.png).
- `/public/transformations`: Before/After high-res assets (.png).

## ⚖️ License
© 2025 Atelier Sève. All rights reserved. Designed for luxury, built for performance.
