/* =========================================================
   NÔMADE — icons.js
   Ícones SVG compartilhados pelo layout e pelos componentes.
   ========================================================= */

const NOMADE_ICONS = {

  grid: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <rect x="3" y="3" width="8" height="8" rx="1.5"/>
      <rect x="13" y="3" width="8" height="8" rx="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="1.5"/>
      <rect x="13" y="13" width="8" height="8" rx="1.5"/>

    </svg>
  `,


  box: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M3 7l9-4 9 4-9 4-9-4z"/>
      <path d="M3 7v10l9 4 9-4V7"/>
      <path d="M12 11v10"/>

    </svg>
  `,


  cart: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <circle cx="9" cy="20" r="1.4"/>
      <circle cx="18" cy="20" r="1.4"/>

      <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H5.2"/>

    </svg>
  `,


  users: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <circle cx="9" cy="8" r="3.2"/>

      <path d="M2.5 20c.6-3.6 3.2-5.8 6.5-5.8s5.9 2.2 6.5 5.8"/>

      <circle cx="17.5" cy="8.5" r="2.6"/>

      <path d="M16 14.4c2.6.4 4.4 2.3 4.9 5.1"/>

    </svg>
  `,


  doc: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M6 2.5h8l4 4V21a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5z"/>

      <path d="M14 2.5V7h4"/>
      <path d="M8 12h8M8 15.5h8M8 8.5h3"/>

    </svg>
  `,


  gear: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <circle cx="12" cy="12" r="3.2"/>

      <path d="M19.4 13.2a7.6 7.6 0 0 0 0-2.4l2-1.5-2-3.5-2.4.6a7.7 7.7 0 0 0-2-1.2L14.5 3h-5l-.5 2.2a7.7 7.7 0 0 0-2 1.2l-2.4-.6-2 3.5 2 1.5a7.6 7.6 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-.6c.6.5 1.3.9 2 1.2L9.5 21h5l.5-2.2c.7-.3 1.4-.7 2-1.2l2.4.6 2-3.5z"/>

    </svg>
  `,


  help: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <circle cx="12" cy="12" r="9.2"/>

      <path d="M9.2 9.3a2.8 2.8 0 1 1 3.9 2.6c-.9.4-1.4 1-1.4 2.1"/>

      <path d="M12 17.3h.01"/>

    </svg>
  `,


  logout: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>

      <path d="M16 17l5-5-5-5"/>

      <path d="M21 12H9"/>

    </svg>
  `,


  search: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.9">

      <circle cx="10.5" cy="10.5" r="6.5"/>

      <path d="M20 20l-4.3-4.3"/>

    </svg>
  `,


  bell: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/>

      <path d="M10 19a2.1 2.1 0 0 0 4 0"/>

    </svg>
  `,


  wifi: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M4.5 9.8a12 12 0 0 1 15 0"/>

      <path d="M7.6 13.2a7.6 7.6 0 0 1 8.8 0"/>

      <path d="M10.7 16.6a3.4 3.4 0 0 1 2.6 0"/>

      <path d="M12 19.5h.01"/>

    </svg>
  `,


  menu: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.9">

      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"/>

    </svg>
  `,


  close: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.9">

      <path d="M5 5l14 14M19 5L5 19"/>

    </svg>
  `,


  plus: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.1">

      <path d="M12 5v14M5 12h14"/>

    </svg>
  `,


  filter: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M4 5h16l-6.2 7.2V19l-3.6 2v-8.8z"/>

    </svg>
  `,


  qr: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>

      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01"/>

    </svg>
  `,


  arrowUp: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.4">

      <path d="M12 19V5M6 11l6-6 6 6"/>

    </svg>
  `,


  arrowDown: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.4">

      <path d="M12 5v14M6 13l6 6 6-6"/>

    </svg>
  `,


  spark: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>

    </svg>
  `,


  check: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.2">

      <path d="M4 12.5l5 5L20 6"/>

    </svg>
  `,


  scan: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <path d="M3 8V5a2 2 0 0 1 2-2h3"/>

      <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>

      <path d="M3 16v3a2 2 0 0 0 2 2h3"/>

      <path d="M21 16v3a2 2 0 0 1-2 2h-3"/>

      <path d="M3 12h18"/>

    </svg>
  `,


  image: `
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8">

      <rect x="3" y="3.5" width="18" height="17" rx="2"/>

      <circle cx="8.5" cy="9" r="1.6"/>

      <path d="M21 16l-5.5-5.5L8 18"/>

    </svg>
  `,
};
