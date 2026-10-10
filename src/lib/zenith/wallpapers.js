export const WALLPAPERS = [
  {
    id: 'aurora',
    name: 'Aurora',
    base: 'radial-gradient(120% 120% at 12% 8%, #2a1259 0%, #0b0620 55%, #05030f 100%)',
    orbs: [
      { color: 'rgba(168,85,247,0.75)', w: 620, h: 620, x: '-8%', y: '-12%' },
      { color: 'rgba(217,70,239,0.55)', w: 520, h: 520, x: '58%', y: '6%' },
      { color: 'rgba(56,189,248,0.42)', w: 560, h: 560, x: '22%', y: '52%' },
    ],
  },
  {
    id: 'nebula',
    name: 'Nebula',
    base: 'radial-gradient(120% 120% at 80% 10%, #0b2545 0%, #071427 55%, #03060f 100%)',
    orbs: [
      { color: 'rgba(59,130,246,0.7)', w: 640, h: 640, x: '42%', y: '-16%' },
      { color: 'rgba(45,212,191,0.45)', w: 520, h: 520, x: '-6%', y: '38%' },
      { color: 'rgba(129,140,248,0.5)', w: 480, h: 480, x: '66%', y: '56%' },
    ],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    base: 'radial-gradient(120% 120% at 20% 90%, #4a1226 0%, #200a1c 55%, #0a0410 100%)',
    orbs: [
      { color: 'rgba(251,146,60,0.6)', w: 560, h: 560, x: '-4%', y: '46%' },
      { color: 'rgba(244,63,94,0.55)', w: 600, h: 600, x: '46%', y: '24%' },
      { color: 'rgba(253,224,71,0.32)', w: 420, h: 420, x: '68%', y: '-8%' },
    ],
  },
  {
    id: 'emerald',
    name: 'Emerald',
    base: 'radial-gradient(120% 120% at 14% 12%, #043a2f 0%, #04211f 55%, #020f0e 100%)',
    orbs: [
      { color: 'rgba(16,185,129,0.6)', w: 600, h: 600, x: '-6%', y: '-10%' },
      { color: 'rgba(34,211,238,0.45)', w: 540, h: 540, x: '52%', y: '34%' },
      { color: 'rgba(132,204,22,0.32)', w: 420, h: 420, x: '30%', y: '60%' },
    ],
  },
  {
    id: 'graphite',
    name: 'Graphite',
    base: 'radial-gradient(120% 120% at 50% 0%, #232634 0%, #12141d 55%, #08090e 100%)',
    orbs: [
      { color: 'rgba(148,163,184,0.35)', w: 620, h: 620, x: '8%', y: '-14%' },
      { color: 'rgba(100,116,139,0.4)', w: 520, h: 520, x: '54%', y: '46%' },
      { color: 'rgba(203,213,225,0.18)', w: 420, h: 420, x: '70%', y: '10%' },
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    base: 'radial-gradient(120% 120% at 70% 8%, #101a3a 0%, #070b1c 52%, #02030a 100%)',
    orbs: [
      { color: 'rgba(96,165,250,0.5)', w: 640, h: 640, x: '50%', y: '-18%' },
      { color: 'rgba(168,85,247,0.36)', w: 520, h: 520, x: '-8%', y: '42%' },
      { color: 'rgba(56,189,248,0.28)', w: 460, h: 460, x: '62%', y: '58%' },
    ],
  },
  {
    id: 'porcelain',
    name: 'Porcelain',
    base: 'radial-gradient(120% 120% at 24% 10%, #ffffff 0%, #eef1fb 52%, #dfe4f5 100%)',
    orbs: [
      { color: 'rgba(167,139,250,0.42)', w: 600, h: 600, x: '-6%', y: '-12%' },
      { color: 'rgba(125,211,252,0.4)', w: 540, h: 540, x: '54%', y: '30%' },
      { color: 'rgba(251,207,232,0.42)', w: 460, h: 460, x: '26%', y: '62%' },
    ],
  },
  {
    id: 'sand',
    name: 'Sand',
    base: 'radial-gradient(120% 120% at 16% 88%, #fff3e2 0%, #f3e3d4 52%, #e2cfc0 100%)',
    orbs: [
      { color: 'rgba(251,191,36,0.34)', w: 560, h: 560, x: '-4%', y: '44%' },
      { color: 'rgba(244,114,182,0.28)', w: 520, h: 520, x: '52%', y: '16%' },
      { color: 'rgba(253,224,71,0.24)', w: 420, h: 420, x: '70%', y: '58%' },
    ],
  },
];

export const ACCENTS = [
  { id: 'violet', name: 'Violet', h: '270 91% 66%', hex: '#a855f7' },
  { id: 'magenta', name: 'Magenta', h: '292 84% 61%', hex: '#d946ef' },
  { id: 'blue', name: 'Azure', h: '217 91% 60%', hex: '#3b82f6' },
  { id: 'cyan', name: 'Cyan', h: '189 94% 43%', hex: '#06b6d4' },
  { id: 'emerald', name: 'Emerald', h: '160 84% 39%', hex: '#10b981' },
  { id: 'amber', name: 'Amber', h: '38 92% 50%', hex: '#f59e0b' },
  { id: 'rose', name: 'Rose', h: '347 77% 50%', hex: '#f43f5e' },
];

export { DEFAULT_SETTINGS, mergeSettings } from './settings';

export const accentOf = (id) => ACCENTS.find((a) => a.id === id) || ACCENTS[0];
export const wallpaperOf = (id) => WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0];