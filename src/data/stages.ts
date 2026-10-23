/**
 * KUARAHY — Stage Definitions and Visual Palettes
 */
import { StageDefinition, StageId } from '../types/game';

export const STAGES: Record<StageId, StageDefinition> = {
  assuncao: {
    id: 'assuncao',
    name: 'Assunção Colonial',
    subtitle: 'El Cabildo & Palacio de los López',
    region: 'Distrito Capital',
    description: 'Coração histórico da capital paraguaia, ladeada por edifícios neoclássicos, bandeiras tricolores e lampiões antigos sob um céu crepuscular.',
    palette: {
      skyTop: '#1e1b4b',
      skyBottom: '#4338ca',
      ground: '#334155',
      groundAccent: '#475569',
      horizon: '#6366f1',
    },
  },

  chaco_stage: {
    id: 'chaco_stage',
    name: 'Quebrachais do Chaco',
    subtitle: 'O Sertão Boreal Indomável',
    region: 'Boquerón / Chaco',
    description: 'Vasta planície árida repleta de árvores quebracho milenares, areia avermelhada e um sol escaldante que projeta poeira no ar.',
    palette: {
      skyTop: '#7c2d12',
      skyBottom: '#ea580c',
      ground: '#78350f',
      groundAccent: '#9a3412',
      horizon: '#fb923c',
    },
  },

  itaipu_stage: {
    id: 'itaipu_stage',
    name: 'Barragem de Itaipu',
    subtitle: 'Monumento de Energia Hidroelétrica',
    region: 'Alto Paraná / Rio Paraná',
    description: 'Passarela de concreto e aço suspensa sobre o vertedouro aberto, onde milhões de litros de água rugem com força elétrica e névoa cintilante.',
    palette: {
      skyTop: '#0c4a6e',
      skyBottom: '#0284c7',
      ground: '#1e293b',
      groundAccent: '#334155',
      horizon: '#38bdf8',
    },
  },

  rio_paraguai: {
    id: 'rio_paraguai',
    name: 'Margens do Rio Paraguai',
    subtitle: 'Águas Serenas ao Entardecer',
    region: 'Concepción / Villeta',
    description: 'Porto tradicional de madeira com barcos de pescadores balançando suavemente nas águas calmas, juncos verdes e reflexos dourados do sol.',
    palette: {
      skyTop: '#4c1d95',
      skyBottom: '#c026d3',
      ground: '#3f2c20',
      groundAccent: '#713f12',
      horizon: '#f43f5e',
    },
  },

  encarnacion: {
    id: 'encarnacion',
    name: 'Costanera de Encarnación',
    subtitle: 'A Pérola do Sul',
    region: 'Itapúa',
    description: 'Calçadão beira-rio vibrante com palmeiras tropicais, areia fina e um horizonte aberto onde o pôr do sol doura as águas do Paraná.',
    palette: {
      skyTop: '#831843',
      skyBottom: '#db2777',
      ground: '#ca8a04',
      groundAccent: '#a16207',
      horizon: '#fbbf24',
    },
  },

  arena_cultural: {
    id: 'arena_cultural',
    name: 'Salão do Ñandutí & Harpas',
    subtitle: 'Herança e Riqueza Artesanal',
    region: 'Itauguá / Ypacaraí',
    description: 'Templo de celebração cultural decorado com mandalas gigantes de renda ñandutí colorida, harpas de 36 cordas em pedestal e lamparinas quentes.',
    palette: {
      skyTop: '#311042',
      skyBottom: '#581c87',
      ground: '#451a03',
      groundAccent: '#78350f',
      horizon: '#a855f7',
    },
  },
};
