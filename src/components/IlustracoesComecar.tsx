/**
 * Ilustrações da seção "Como começamos", portadas do slide da apresentação comercial.
 * Grupos marcados para o hover da etapa: `data-pulsa` (respira), `data-flutua` (sobe e desce), `data-gira` (engrenagem).
 * Os ids de <defs> levam o prefixo "cc" para não colidir com outros SVGs da página.
 */

/** Fundo claro comum às três ilustrações das etapas */
function Bolha() {
  return <ellipse cx="152" cy="104" rx="146" ry="88" fill="#EAF8FE" />;
}

const CLARO = "#E6EFF6";
const MEDIO = "#CFE0EC";
const MARCADO = "#0A84FF";
/** Dias do calendário por linha: a = claro, b = médio, c = o dia marcado */
const DIAS = ["aabaa", "bacab", "abaaa", "aab"];
const COR_DIA: Record<string, string> = { a: CLARO, b: MEDIO, c: MARCADO };

export function IlustracaoCalendario() {
  return (
    <svg viewBox="0 0 304 196" className="h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="cc2-topo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#29C5FF" />
          <stop offset="1" stopColor="#0A84FF" />
        </linearGradient>
        <filter id="cc2-sombra" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0A84FF" floodOpacity="0.2" />
        </filter>
      </defs>
      <Bolha />
      <rect x="76" y="26" width="152" height="152" rx="18" fill="#FFFFFF" filter="url(#cc2-sombra)" />
      <path d="M76,62 V44 A18,18 0 0 1 94,26 H210 A18,18 0 0 1 228,44 V62 Z" fill="url(#cc2-topo)" />
      <rect x="106" y="12" width="12" height="28" rx="6" fill="#0B1F2E" />
      <rect x="186" y="12" width="12" height="28" rx="6" fill="#0B1F2E" />
      {DIAS.map((linha, l) =>
        [...linha].map((c, i) => (
          <rect key={`${l}-${i}`} x={91 + i * 27} y={78 + l * 26} width="18" height="14" rx="4" fill={COR_DIA[c]} />
        )),
      )}
      <g data-pulsa="">
        <ellipse cx="154" cy="111" rx="20" ry="16" fill="none" stroke="#0A84FF" strokeWidth="3" transform="rotate(-8 154 111)" />
      </g>
      <g data-flutua="">
        <rect x="14" y="106" width="84" height="46" rx="16" fill="#29C5FF" filter="url(#cc2-sombra)" />
        <path d="M30,150 L24,168 L48,150 Z" fill="#29C5FF" />
        <rect x="28" y="119" width="54" height="7" rx="3.5" fill="#FFFFFF" />
        <rect x="28" y="132" width="36" height="7" rx="3.5" fill="#FFFFFF" opacity="0.8" />
      </g>
      <g data-flutua="">
        <rect x="208" y="118" width="86" height="48" rx="16" fill="#0B1F2E" />
        <path d="M270,164 L282,182 L256,164 Z" fill="#0B1F2E" />
        <circle cx="233" cy="142" r="5" fill="#FFFFFF" />
        <circle cx="251" cy="142" r="5" fill="#FFFFFF" />
        <circle cx="269" cy="142" r="5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/** Linhas de código do editor: [x, y, largura, cor] */
const CODIGO: [number, number, number, string][] = [
  [54, 62, 14, "#29C5FF"],
  [74, 62, 58, "#7DD3FC"],
  [138, 62, 38, "#5B7C93"],
  [68, 80, 40, "#7DD3FC"],
  [114, 80, 64, "#4ADE80"],
  [68, 98, 30, "#7DD3FC"],
  [104, 98, 86, "#FBBF24"],
  [68, 116, 48, "#7DD3FC"],
  [122, 116, 44, "#4ADE80"],
  [54, 134, 14, "#29C5FF"],
  [74, 134, 62, "#7DD3FC"],
];

export function IlustracaoAutomacao() {
  return (
    <svg viewBox="0 0 304 196" className="h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="cc3-engrenagem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#29C5FF" />
          <stop offset="1" stopColor="#0A84FF" />
        </linearGradient>
        <filter id="cc3-sombra" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0B1F2E" floodOpacity="0.22" />
        </filter>
      </defs>
      <Bolha />
      <rect x="40" y="20" width="196" height="142" rx="14" fill="#0B1F2E" filter="url(#cc3-sombra)" />
      <path d="M40,48 V34 A14,14 0 0 1 54,20 H222 A14,14 0 0 1 236,34 V48 Z" fill="#17384F" />
      <circle cx="56" cy="34" r="5" fill="#F87171" />
      <circle cx="72" cy="34" r="5" fill="#FBBF24" />
      <circle cx="88" cy="34" r="5" fill="#34D399" />
      {CODIGO.map(([x, y, w, cor]) => (
        <rect key={`${x}-${y}`} data-linha-codigo="" x={x} y={y} width={w} height="8" rx="4" fill={cor} />
      ))}
      <rect x="142" y="132" width="3" height="12" rx="1.5" fill="#FFFFFF" />
      <g transform="translate(232 144)" filter="url(#cc3-sombra)">
        <g data-gira="">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect key={a} x="-9" y="-46" width="18" height="20" rx="4" fill="#0A84FF" transform={a ? `rotate(${a})` : undefined} />
          ))}
          <circle cx="0" cy="0" r="36" fill="url(#cc3-engrenagem)" />
          <circle cx="0" cy="0" r="14" fill="#EAF8FE" />
        </g>
      </g>
      <g data-flutua="">
        <rect x="12" y="142" width="110" height="40" rx="20" fill="#FFFFFF" filter="url(#cc3-sombra)" />
        <circle cx="34" cy="162" r="9" fill="#0A84FF" />
        <circle cx="56" cy="162" r="9" fill="#29C5FF" />
        <circle cx="78" cy="162" r="9" fill="#0B1F2E" />
        <circle cx="100" cy="162" r="9" fill="#FBBF24" />
      </g>
    </svg>
  );
}

export function IlustracaoNoAr() {
  return (
    <svg viewBox="0 0 304 196" className="h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="cc4-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#E0F2FE" />
        </linearGradient>
        <filter id="cc4-sombra" x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0B1F2E" floodOpacity="0.24" />
        </filter>
      </defs>
      <Bolha />
      <rect x="106" y="4" width="96" height="188" rx="20" fill="#0B1F2E" filter="url(#cc4-sombra)" />
      <rect x="113" y="14" width="82" height="168" rx="13" fill="url(#cc4-ceu)" />
      <rect x="138" y="8" width="32" height="5" rx="2.5" fill="#24445C" />
      <circle cx="182" cy="34" r="8" fill="#FDE68A" />
      <circle cx="154" cy="46" r="13" fill="#FFFFFF" opacity="0.92" />
      <path d="M150,39 L150,53 L161,46 Z" fill="#0A84FF" />
      <polygon points="124,96 154,70 184,96" fill="#0272A6" />
      <rect x="130" y="94" width="48" height="36" fill="#FFFFFF" />
      <rect x="149" y="110" width="11" height="20" fill="#0A84FF" />
      <rect x="135" y="102" width="9" height="9" fill="#BAE6FD" />
      <rect x="165" y="102" width="9" height="9" fill="#BAE6FD" />
      <rect x="113" y="130" width="82" height="14" fill="#A7F3D0" />
      <path d="M113,144 H195 V169 A13,13 0 0 1 182,182 H126 A13,13 0 0 1 113,169 Z" fill="#183044" />
      <rect x="121" y="151" width="46" height="6" rx="3" fill="#FFFFFF" />
      <rect x="121" y="161" width="62" height="5" rx="2.5" fill="#9DB4C4" />
      <rect x="121" y="170" width="30" height="6" rx="3" fill="#29C5FF" />
      <g data-pulsa="">
        <circle cx="206" cy="30" r="20" fill="#087A55" filter="url(#cc4-sombra)" />
        <path d="M197,30 L203,36 L215,24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g data-flutua="">
        <rect x="26" y="64" width="70" height="38" rx="19" fill="#FFFFFF" filter="url(#cc4-sombra)" />
        <path
          d="M46,91 C37,85 37,77 42,76 C44.5,75.5 46,77.5 46,79 C46,77.5 47.5,75.5 50,76 C55,77 55,85 46,91 Z"
          fill="#F43F5E"
        />
        <rect x="60" y="80" width="24" height="6" rx="3" fill="#DCE8F1" />
      </g>
      <g data-flutua="">
        <rect x="18" y="120" width="78" height="40" rx="20" fill="#0A84FF" filter="url(#cc4-sombra)" />
        <circle cx="40" cy="140" r="4.5" fill="#FFFFFF" />
        <circle cx="57" cy="140" r="4.5" fill="#FFFFFF" />
        <circle cx="74" cy="140" r="4.5" fill="#FFFFFF" />
      </g>
      <g data-flutua="">
        <circle cx="238" cy="124" r="22" fill="#FFFFFF" filter="url(#cc4-sombra)" />
        <path d="M227,126 L250,115 L243,137 L238,129 Z" fill="#0A84FF" />
        <path d="M238,129 L250,115" fill="none" stroke="#0272A6" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Prendedor de metal da prancheta (recorte do SVG do slide) */
export function Prendedor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="184 2 192 94" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cc1-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F7FA" />
          <stop offset="0.55" stopColor="#C3D0DC" />
          <stop offset="1" stopColor="#8399AC" />
        </linearGradient>
        <filter id="cc1-suave" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#06131D" floodOpacity="0.22" />
        </filter>
      </defs>
      <rect x="246" y="10" width="68" height="44" rx="22" fill="none" stroke="url(#cc1-metal)" strokeWidth="10" />
      <rect x="190" y="30" width="180" height="58" rx="16" fill="url(#cc1-metal)" filter="url(#cc1-suave)" />
      <rect x="204" y="40" width="152" height="6" rx="3" fill="#FFFFFF" opacity="0.7" />
      <circle cx="214" cy="66" r="7" fill="#7F95A8" />
      <circle cx="346" cy="66" r="7" fill="#7F95A8" />
      <rect x="256" y="60" width="48" height="12" rx="6" fill="#6E8597" />
    </svg>
  );
}

/** Assinatura a caneta: os dois traços se desenham na revelação (DrawSVG) */
export function Assinatura({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 62" className={className} aria-hidden="true" data-assinatura="">
      <path
        d="M6,46 C14,22 26,10 32,20 C38,30 26,50 22,44 C18,38 34,24 44,30 C52,35 46,48 52,44 C60,38 64,26 72,30 C80,34 74,48 82,44 C92,38 96,22 104,26 C112,30 104,50 112,46 C122,40 128,24 138,28 C146,32 140,46 148,44 C160,40 166,30 176,32 C188,34 186,44 196,40 C204,37 210,36 216,36"
        fill="none"
        stroke="#1E3A8A"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30,56 C90,50 150,50 206,46" fill="none" stroke="#1E3A8A" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Caneta; a ponta fica em (20, 148) do viewBox */
export function Caneta({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 266 168" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cc1-corpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B5F8A" />
          <stop offset="0.45" stopColor="#0B1F2E" />
          <stop offset="1" stopColor="#06131D" />
        </linearGradient>
        <linearGradient id="cc1-ponta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1F5F9" />
          <stop offset="0.5" stopColor="#B8C7D4" />
          <stop offset="1" stopColor="#7F95A8" />
        </linearGradient>
        <linearGradient id="cc1-ouro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6D58A" />
          <stop offset="1" stopColor="#C9962E" />
        </linearGradient>
        <filter id="cc1-sombra-caneta" x="-10%" y="-20%" width="130%" height="150%">
          <feDropShadow dx="3" dy="7" stdDeviation="5" floodColor="#0B1F2E" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#cc1-sombra-caneta)">
        <g transform="translate(20 148) rotate(-30)">
          <path d="M0,0 L20,-5 L20,5 Z" fill="#6E8597" />
          <path d="M20,-5 L46,-11 L46,11 L20,5 Z" fill="url(#cc1-ponta)" />
          <rect x="46" y="-12" width="8" height="24" fill="url(#cc1-ouro)" />
          <rect x="54" y="-12" width="168" height="24" rx="4" fill="url(#cc1-corpo)" />
          <rect x="222" y="-12" width="8" height="24" fill="url(#cc1-ouro)" />
          <rect x="230" y="-12" width="22" height="24" rx="11" fill="url(#cc1-corpo)" />
          <rect x="150" y="-17" width="86" height="6" rx="3" fill="url(#cc1-ouro)" />
          <rect x="64" y="-8" width="150" height="3" rx="1.5" fill="#FFFFFF" opacity="0.35" />
        </g>
      </g>
    </svg>
  );
}

/** Seta tracejada em arco entre uma etapa e a próxima */
export function SetaEtapa({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 64" className={className} aria-hidden="true">
      <path d="M8,46 C22,12 54,8 70,36" fill="none" stroke="#0A84FF" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10" />
      <circle cx="8" cy="46" r="5" fill="#0A84FF" />
      <path d="M73,41.2 L58.1,31.3 L71.9,23.3 Z" fill="#0A84FF" stroke="#0A84FF" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
