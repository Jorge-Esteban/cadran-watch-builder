# Cadran Atelier — Configurador de relojes

Configurador modular 2D de relojes: React 18 + TypeScript + Vite, Tailwind CSS v4, Framer Motion y Zustand.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run deploy   # build + publica dist/ en la rama gh-pages (GitHub Pages)
```

En vivo: https://jorge-esteban.github.io/cadran-watch-builder/

## Arquitectura

```
src/
├─ types/watch.ts            Modelo de dominio (WatchConfig, ids de cada pieza)
├─ data/
│  ├─ catalog.ts             Catálogo: opciones, precios, colores y paletas de metal
│  └─ steps.ts               Pasos del configurador (vista + encuadre de cámara) y config por defecto
├─ store/
│  ├─ useWatchStore.ts       Estado central (config, paso, vista, zoom, diseños guardados) — persistido
│  └─ useUiStore.ts          Estado efímero de interfaz (modales, toasts, hora real)
├─ lib/
│  ├─ geometry.ts            Sistema de coordenadas común (viewBox 400×600, centro 200,300) y helpers
│  ├─ pricing.ts             computeQuote(config) → desglose + total (función pura)
│  ├─ share.ts               Serializa la config en la URL (#d=…) para compartir sin backend
│  └─ format.ts              Formato de moneda
├─ hooks/useClock.ts         Hora local a 6 Hz (barrido de 21 600 A/h)
└─ components/
   ├─ watch/
   │  ├─ WatchSvgDefs.tsx    Gradientes de metal, patrones (tapisserie, perlage, Côtes de Genève…) y filtros
   │  ├─ WatchRender.tsx     Composición por capas Z + fundidos al cambiar cada pieza
   │  ├─ MiniWatch.tsx       Miniaturas de opciones con las mismas capas (recorte por viewBox)
   │  └─ layers/             Strap(0) · Case(1) · Bezel(2) · Dial(3) · Indices(4) · Hands(5) · Crystal(6) · Caseback
   ├─ preview/PreviewStage   Giro 3D frontal/trasera, cámara por paso, zoom (botones/rueda/doble clic), arrastre, inclinación
   ├─ configurator/          Pestañas + navegación paso a paso, controles reutilizables y un panel por categoría
   ├─ summary/               Precio animado, resumen (lateral en desktop / hoja inferior en móvil), modales
   └─ layout/Header.tsx
```

### Principios

- **Una fuente de verdad.** `config` en `useWatchStore` alimenta el render, las miniaturas y el presupuesto.
- **Capas que encajan.** Todas las capas SVG comparten las constantes de `lib/geometry.ts`; cada estilo de caja
  declara su geometría (`CASE_GEOMETRY`) y el resto de capas se adaptan (ancho de correa, forma del bisel…).
- **Añadir una pieza** = una entrada en `catalog.ts` (+ su dibujo en la capa correspondiente).
  **Añadir una categoría** = tipo en `WatchConfig`, paso en `STEPS`, panel en `panels/index.ts` y su capa.

## Pendiente / siguientes pasos

- Conectar "Pedir presupuesto" a un backend (hoy genera una referencia local; ver `QuoteModal`).
- Complicaciones (fecha, GMT), tallas de caja y exportar ficha en PDF.
