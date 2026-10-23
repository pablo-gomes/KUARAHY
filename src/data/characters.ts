/**
 * KUARAHY — Fighter Definitions and Frame Data
 */
import { FighterDefinition, FighterId, AttackFrameData } from '../types/game';

export const FIGHTERS: Record<FighterId, FighterDefinition> = {
  terere: {
    id: 'terere',
    name: 'O Tereré',
    title: 'O Guardião da Guampa',
    origin: 'Tradição Yvyrarendá',
    style: 'Equilibrado e Fluido',
    quote: '¡Bien helado para refrescar el alma!',
    bio: 'Inspirado na mais pura tradição do tereré paraguaio com erva-mate fresca e água cristalina com gelo. Um mestre ágil com sua guampa de chifre esculpido e bombilla de prata, equilibrando ataques velozes com rajadas revigorantes.',
    stats: {
      damage: 3,
      speed: 3,
      defense: 3,
      reach: 3,
    },
    colorTheme: {
      primary: '#10b981',    // Herb green
      secondary: '#065f46',  // Deep forest green
      accent: '#38bdf8',     // Icy light blue
      energy: '#6ee7b7',     // Mint glow
    },
    special1Name: 'Jato Gelado',
    special2Name: 'Giro da Guampa',
    superName: 'Tereré Turbo',
    special1Desc: 'Dispara um jato de água gelada pressurizada de médio alcance.',
    special2Desc: 'Gira rapidamente com a guampa desferindo múltiplos golpes giratórios.',
    superDesc: 'Sobrecarga de erva-mate: dispara uma tempestade de água com pedras de gelo.',
    moves: [
      { name: 'Soco Rápido', command: 'J (Soco)', desc: 'Jab rápido de bombilla', type: 'Normal' },
      { name: 'Chute Médio', command: 'K (Chute)', desc: 'Chute lateral veloz', type: 'Normal' },
      { name: 'Ataque Forte', command: 'O (Forte)', desc: 'Golpe pesado com a guampa', type: 'Normal' },
      { name: 'Jato Gelado', command: '↓ → + L (Especial)', desc: 'Projétil de água fria pressurizada', type: 'Especial' },
      { name: 'Giro da Guampa', command: '↓ ← + L (Especial)', desc: 'Ataque giratório 360 graus', type: 'Especial' },
      { name: 'Agarrão do Mate', command: 'U (Agarrão)', desc: 'Arremesso curto seguido de empurrão', type: 'Normal' },
      { name: 'Tereré Turbo', command: 'Espaço ou U+O (100% Barra)', desc: 'Tempestade de gelo e erva super veloz', type: 'Técnica de Energia' },
    ],
  },

  harpa: {
    id: 'harpa',
    name: 'A Harpa',
    title: 'A Virtuosa das Cordas',
    origin: 'Félix Pérez Cardozo',
    style: 'Controle de Distância (Zoner)',
    quote: '¡Escucha el acorde del viento paraguayo!',
    bio: 'Lutadora inspirada na lendária harpa paraguaia de 36 cordas. Mantém os oponentes à distância com ondas harmônicas cortantes e acordes ressonantes que vibram no ar.',
    stats: {
      damage: 3,
      speed: 3,
      defense: 2,
      reach: 5,
    },
    colorTheme: {
      primary: '#d97706',    // Warm cedar wood
      secondary: '#78350f',  // Mahogany
      accent: '#fbbf24',     // Golden strings
      energy: '#fde047',     // Luminous sonic gold
    },
    special1Name: 'Nota Cortante',
    special2Name: 'Acorde Reverso',
    superName: 'Concerto Guaraní',
    special1Desc: 'Dispara um feixe harmônico musical em alta velocidade.',
    special2Desc: 'Explosão sônica radial que afasta adversários que se aproximam.',
    superDesc: 'Executa um arpejo divino disparando dezenas de lâminas sonoras luminosas.',
    moves: [
      { name: 'Toque de Madeira', command: 'J (Soco)', desc: 'Golpe direto com a haste da harpa', type: 'Normal' },
      { name: 'Chute Harmônico', command: 'K (Chute)', desc: 'Chute alto de longo alcance', type: 'Normal' },
      { name: 'Ressonância Alta', command: 'O (Forte)', desc: 'Pancada pesada de cordas vibrantes', type: 'Normal' },
      { name: 'Nota Cortante', command: '↓ → + L (Especial)', desc: 'Projétil musical cortante à distância', type: 'Especial' },
      { name: 'Acorde Reverso', command: '↓ ← + L (Especial)', desc: 'Onda de repulsão defensiva', type: 'Especial' },
      { name: 'Pájarocamping', command: 'U (Agarrão)', desc: 'Gira o oponente nas cordas e joga longe', type: 'Normal' },
      { name: 'Concerto Guaraní', command: 'Espaço ou U+O (100% Barra)', desc: 'Sequência majestosa de ondas sonoras cortantes', type: 'Técnica de Energia' },
    ],
  },

  chaco: {
    id: 'chaco',
    name: 'O Chaco',
    title: 'O Colosso dos Quebrachais',
    origin: 'Gran Chaco Boreal',
    style: 'Tanque Pesado e Impacto',
    quote: '¡Duro como el quebracho colorado!',
    bio: 'Guerreiro indomável forjado na aridez e no calor inclemente do Chaco paraguaio. Possui resistência extraordinária, punhos de pedra e investidas devastadoras que quebram qualquer defesa desatenta.',
    stats: {
      damage: 5,
      speed: 2,
      defense: 5,
      reach: 3,
    },
    colorTheme: {
      primary: '#b45309',    // Earth red/amber
      secondary: '#451a03',  // Dark soil
      accent: '#fb923c',     // Dust orange
      energy: '#f97316',     // Fiery clay
    },
    special1Name: 'Investida do Chaco',
    special2Name: 'Impacto Terrestre',
    superName: 'Força do Chaco',
    special1Desc: 'Avança com o ombro armado que absorve golpes e esmaga o alvo.',
    special2Desc: 'Esmaga o solo com os dois punhos criando uma fenda sísmica.',
    superDesc: 'Adquire armadura impenetrável e desfere um golpe titânico que explode o chão.',
    moves: [
      { name: 'Punho do Quebracho', command: 'J (Soco)', desc: 'Jab pesado e denso', type: 'Normal' },
      { name: 'Chute do Deserto', command: 'K (Chute)', desc: 'Pisada firme que abala a base', type: 'Normal' },
      { name: 'Marreta Rústica', command: 'O (Forte)', desc: 'Golpe descendente de alto impacto', type: 'Normal' },
      { name: 'Investida do Chaco', command: '↓ → + L (Especial)', desc: 'Carga com armadura de ombro', type: 'Especial' },
      { name: 'Impacto Terrestre', command: '↓ ← + L (Especial)', desc: 'Fenda de terra que atinge perto e no chão', type: 'Especial' },
      { name: 'Abraço de Urso', command: 'U (Agarrão)', desc: 'Esmagamento brutal de costelas', type: 'Normal' },
      { name: 'Força do Chaco', command: 'Espaço ou U+O (100% Barra)', desc: 'Armadura absoluta e soco demolidor', type: 'Técnica de Energia' },
    ],
  },

  nanduti: {
    id: 'nanduti',
    name: 'Ñandutí',
    title: 'A Tecelã da Teia de Prata',
    origin: 'Itauguá',
    style: 'Velocidade e Rushdown',
    quote: '¡Cada hilo es un golpe tejido con primor!',
    bio: 'Inspirada na milenar arte da renda ñandutí (teia de aranha em guarani). Seus movimentos são os mais rápidos do torneio, tecendo sequências de acrobacias, fios aprisionadores e combos relâmpago.',
    stats: {
      damage: 2,
      speed: 5,
      defense: 3,
      reach: 3,
    },
    colorTheme: {
      primary: '#ec4899',    // Vibrant magenta
      secondary: '#831843',  // Deep wine
      accent: '#f43f5e',     // Coral pink
      energy: '#fbcfe8',     // Shimmering silk
    },
    special1Name: 'Laço de Ñandutí',
    special2Name: 'Dança do Fio',
    superName: 'Trama Sagrada',
    special1Desc: 'Lança fios de seda que imobilizam temporariamente o rival.',
    special2Desc: 'Rolamento evasivo veloz que passa pelas costas com chute giratório.',
    superDesc: 'Tece uma teia gigante cintilante ao redor do oponente e desfere 10 golpes fulminantes.',
    moves: [
      { name: 'Toque de Agulha', command: 'J (Soco)', desc: 'Golpe ultra rápido com as pontas dos dedos', type: 'Normal' },
      { name: 'Chute Tecido', command: 'K (Chute)', desc: 'Chute aéreo chicoteado', type: 'Normal' },
      { name: 'Dança Circular', command: 'O (Forte)', desc: 'Pirueta dupla com impacto cruzado', type: 'Normal' },
      { name: 'Laço de Ñandutí', command: '↓ → + L (Especial)', desc: 'Fio de seda que prende e atordoa', type: 'Especial' },
      { name: 'Dança do Fio', command: '↓ ← + L (Especial)', desc: 'Esquiva ágil seguida de contra-ataque', type: 'Especial' },
      { name: 'Enrosco da Aranha', command: 'U (Agarrão)', desc: 'Envolve o inimigo e atira contra a borda', type: 'Normal' },
      { name: 'Trama Sagrada', command: 'Espaço ou U+O (100% Barra)', desc: 'Teia de seda gigantesca e combo letal', type: 'Técnica de Energia' },
    ],
  },

  itaipu: {
    id: 'itaipu',
    name: 'Itaipu',
    title: 'A Força das Turbinas',
    origin: 'Hernandarias / Foz',
    style: 'Eletricidade e Peso Brutal',
    quote: '¡Catorce mil megawatts de pura potencia!',
    bio: 'Inspirado na monumental usina hidrelétrica de Itaipu, uma das maiores geradoras de energia limpa da humanidade. Canaliza descargas de alta tensão e a inércia colossal de toneladas de água sob pressão.',
    stats: {
      damage: 5,
      speed: 1,
      defense: 4,
      reach: 4,
    },
    colorTheme: {
      primary: '#0284c7',    // Hydro cyan
      secondary: '#1e293b',  // Heavy industrial steel
      accent: '#38bdf8',     // High voltage blue
      energy: '#67e8f9',     // Arc flash
    },
    special1Name: 'Descarga Elétrica',
    special2Name: 'Pressão da Barragem',
    superName: 'Sobrecarga de Turbina',
    special1Desc: 'Dispara um arco voltaico elétrico crepitante de médio alcance.',
    special2Desc: 'Avança com punhos engrenados desferindo um impacto hidráulico devastador.',
    superDesc: 'Abre comportas de energia: erupção elétrica de 500kV em toda a tela.',
    moves: [
      { name: 'Martelo Hidráulico', command: 'J (Soco)', desc: 'Soco de alta inércia', type: 'Normal' },
      { name: 'Chute Dinâmico', command: 'K (Chute)', desc: 'Golpe pesado com a bota de aço', type: 'Normal' },
      { name: 'Quebra-Válvula', command: 'O (Forte)', desc: 'Duplo gancho energizado', type: 'Normal' },
      { name: 'Descarga Elétrica', command: '↓ → + L (Especial)', desc: 'Raio elétrico contínuo de médio alcance', type: 'Especial' },
      { name: 'Pressão da Barragem', command: '↓ ← + L (Especial)', desc: 'Investida com onda de choque pesada', type: 'Especial' },
      { name: 'Eletrocussão', command: 'U (Agarrão)', desc: 'Prende pelo pescoço e descarrega choques', type: 'Normal' },
      { name: 'Sobrecarga de Turbina', command: 'Espaço ou U+O (100% Barra)', desc: 'Tempestade de relâmpagos e choque total', type: 'Técnica de Energia' },
    ],
  },

  guarani: {
    id: 'guarani',
    name: 'Guarani',
    title: 'O Guerreiro da Terra Sem Mal',
    origin: 'Tekoha Ancestral',
    style: 'Técnico, Esquivas e Parries',
    quote: '¡Mba\'éichapa! ¡Nuestra fuerza vive en la tierra!',
    bio: 'Personagem fictício que homenageia a nobreza, a bravura e a rica cosmologia dos povos originários Guarani. Um lutador versátil e estratégico, mestre em contra-ataques precisos e passos ágeis que confundem os oponentes.',
    stats: {
      damage: 3,
      speed: 4,
      defense: 3,
      reach: 3,
    },
    colorTheme: {
      primary: '#dc2626',    // Crimson urucum
      secondary: '#7f1d1d',  // Deep ochre
      accent: '#facc15',     // Sun gold feather
      energy: '#fde047',     // Solar spirit
    },
    special1Name: 'Passo Guarani',
    special2Name: 'Golpe da Terra',
    superName: 'Espírito do Jaguarete',
    special1Desc: 'Teletransporte veloz como sombra para reaparecer atrás do adversário.',
    special2Desc: 'Golpe de palma ascendente que projeta terra e arremessa o oponente no ar.',
    superDesc: 'Invoca o espírito ancestral da onça-pintada (Jaguarete) para uma sequência feroz.',
    moves: [
      { name: 'Palma do Jaguar', command: 'J (Soco)', desc: 'Golpe rápido de mão aberta', type: 'Normal' },
      { name: 'Chute do Falcão', command: 'K (Chute)', desc: 'Chute reto perfurante', type: 'Normal' },
      { name: 'Golpe Ancestral', command: 'O (Forte)', desc: 'Cotovelada de corte com impacto concentrado', type: 'Normal' },
      { name: 'Passo Guarani', command: '↓ → + L (Especial)', desc: 'Esquiva mística rápida para flanquear', type: 'Especial' },
      { name: 'Golpe da Terra', command: '↓ ← + L (Especial)', desc: 'Palma no chão que ergue o adversário', type: 'Especial' },
      { name: 'Arremesso Mbarete', command: 'U (Agarrão)', desc: 'Rasteira giratória que derruba com força', type: 'Normal' },
      { name: 'Espírito do Jaguarete', command: 'Espaço ou U+O (100% Barra)', desc: 'Fúria ancestral com 5 golpes certeiros', type: 'Técnica de Energia' },
    ],
  },
};

/**
 * Standard frame data definitions for attacks across fighters
 */
export function getAttackData(fighterId: FighterId, moveKey: 'punch' | 'kick' | 'heavy' | 'crouch_punch' | 'crouch_kick' | 'jump_punch' | 'jump_kick' | 'special1' | 'special2' | 'super' | 'grab'): AttackFrameData {
  const stats = FIGHTERS[fighterId].stats;
  // Scalers based on character stats
  const dmgMult = 0.75 + (stats.damage * 0.15); // 0.9 to 1.5
  const spdMult = 1.3 - (stats.speed * 0.1);     // faster speed = lower startup frames
  const reachBonus = (stats.reach - 3) * 8;      // reach modifier

  switch (moveKey) {
    case 'punch':
      return {
        name: 'Soco Normal',
        type: 'punch',
        startup: Math.max(3, Math.round(5 * spdMult)),
        active: 4,
        recovery: Math.max(4, Math.round(7 * spdMult)),
        damage: Math.round(7 * dmgMult),
        energyGain: 5,
        energyCost: 0,
        hitstun: 14,
        blockstun: 9,
        knockbackX: 4,
        knockbackY: 0,
        hitboxOffset: { x: 26, y: -48, w: 26 + reachBonus, h: 22 },
        soundEffect: 'punch',
      };

    case 'kick':
      return {
        name: 'Chute Normal',
        type: 'kick',
        startup: Math.max(4, Math.round(7 * spdMult)),
        active: 5,
        recovery: Math.max(5, Math.round(9 * spdMult)),
        damage: Math.round(10 * dmgMult),
        energyGain: 7,
        energyCost: 0,
        hitstun: 17,
        blockstun: 11,
        knockbackX: 7,
        knockbackY: 0,
        hitboxOffset: { x: 30, y: -38, w: 32 + reachBonus, h: 22 },
        soundEffect: 'kick',
      };

    case 'heavy':
      return {
        name: 'Ataque Forte',
        type: 'heavy',
        startup: Math.max(7, Math.round(11 * spdMult)),
        active: 6,
        recovery: Math.max(9, Math.round(15 * spdMult)),
        damage: Math.round(16 * dmgMult),
        energyGain: 10,
        energyCost: 0,
        hitstun: 24,
        blockstun: 14,
        knockbackX: 12,
        knockbackY: -4,
        hitboxOffset: { x: 32, y: -52, w: 36 + reachBonus, h: 32 },
        soundEffect: 'heavy',
      };

    case 'crouch_punch':
      return {
        name: 'Soco Baixo',
        type: 'punch',
        startup: Math.max(3, Math.round(4 * spdMult)),
        active: 4,
        recovery: Math.max(4, Math.round(6 * spdMult)),
        damage: Math.round(6 * dmgMult),
        energyGain: 5,
        energyCost: 0,
        hitstun: 13,
        blockstun: 8,
        knockbackX: 3,
        knockbackY: 0,
        hitboxOffset: { x: 24, y: -22, w: 28 + reachBonus, h: 18 },
        soundEffect: 'punch',
      };

    case 'crouch_kick':
      return {
        name: 'Rasteira',
        type: 'kick',
        startup: Math.max(5, Math.round(8 * spdMult)),
        active: 5,
        recovery: Math.max(7, Math.round(11 * spdMult)),
        damage: Math.round(9 * dmgMult),
        energyGain: 7,
        energyCost: 0,
        hitstun: 20,
        blockstun: 10,
        knockbackX: 9,
        knockbackY: -2,
        hitboxOffset: { x: 28, y: -14, w: 34 + reachBonus, h: 16 },
        soundEffect: 'kick',
      };

    case 'jump_punch':
      return {
        name: 'Soco Aéreo',
        type: 'punch',
        startup: 4,
        active: 7,
        recovery: 6,
        damage: Math.round(8 * dmgMult),
        energyGain: 6,
        energyCost: 0,
        hitstun: 16,
        blockstun: 10,
        knockbackX: 5,
        knockbackY: 2,
        hitboxOffset: { x: 24, y: -45, w: 26, h: 24 },
        soundEffect: 'punch',
      };

    case 'jump_kick':
      return {
        name: 'Chute Aéreo',
        type: 'kick',
        startup: 5,
        active: 8,
        recovery: 8,
        damage: Math.round(11 * dmgMult),
        energyGain: 8,
        energyCost: 0,
        hitstun: 18,
        blockstun: 12,
        knockbackX: 8,
        knockbackY: 4,
        hitboxOffset: { x: 26, y: -30, w: 32, h: 26 },
        soundEffect: 'kick',
      };

    case 'grab':
      return {
        name: 'Agarrão',
        type: 'grab',
        startup: 5,
        active: 3,
        recovery: 16,
        damage: Math.round(14 * dmgMult),
        energyGain: 10,
        energyCost: 0,
        hitstun: 30,
        blockstun: 0,
        knockbackX: 14,
        knockbackY: -6,
        isUnblockable: true,
        hitboxOffset: { x: 18, y: -45, w: 24, h: 32 },
        soundEffect: 'grab',
      };

    case 'special1':
      // Distinct special 1 per character
      if (fighterId === 'terere') {
        return {
          name: 'Jato Gelado',
          type: 'special1',
          startup: 8,
          active: 8,
          recovery: 14,
          damage: 16,
          energyGain: 12,
          energyCost: 0,
          hitstun: 22,
          blockstun: 12,
          knockbackX: 11,
          knockbackY: -3,
          hitboxOffset: { x: 30, y: -50, w: 46, h: 30 },
          soundEffect: 'water',
          projectile: { speed: 8, w: 24, h: 16, lifetime: 60, type: 'water' },
        };
      } else if (fighterId === 'harpa') {
        return {
          name: 'Nota Cortante',
          type: 'special1',
          startup: 9,
          active: 6,
          recovery: 15,
          damage: 14,
          energyGain: 12,
          energyCost: 0,
          hitstun: 20,
          blockstun: 11,
          knockbackX: 10,
          knockbackY: 0,
          hitboxOffset: { x: 28, y: -48, w: 30, h: 25 },
          soundEffect: 'special',
          projectile: { speed: 10, w: 22, h: 22, lifetime: 70, type: 'note' },
        };
      } else if (fighterId === 'chaco') {
        return {
          name: 'Investida do Chaco',
          type: 'special1',
          startup: 11,
          active: 12,
          recovery: 18,
          damage: 22,
          energyGain: 15,
          energyCost: 0,
          hitstun: 26,
          blockstun: 14,
          knockbackX: 16,
          knockbackY: -4,
          hitboxOffset: { x: 32, y: -48, w: 45, h: 40 },
          soundEffect: 'heavy',
        };
      } else if (fighterId === 'nanduti') {
        return {
          name: 'Laço de Ñandutí',
          type: 'special1',
          startup: 7,
          active: 6,
          recovery: 12,
          damage: 13,
          energyGain: 14,
          energyCost: 0,
          hitstun: 32, // Stun entrapment!
          blockstun: 12,
          knockbackX: 4,
          knockbackY: 0,
          hitboxOffset: { x: 30, y: -45, w: 32, h: 24 },
          soundEffect: 'special',
          projectile: { speed: 9, w: 20, h: 20, lifetime: 55, type: 'thread' },
        };
      } else if (fighterId === 'itaipu') {
        return {
          name: 'Descarga Elétrica',
          type: 'special1',
          startup: 12,
          active: 10,
          recovery: 20,
          damage: 23,
          energyGain: 15,
          energyCost: 0,
          hitstun: 28,
          blockstun: 16,
          knockbackX: 14,
          knockbackY: -3,
          hitboxOffset: { x: 35, y: -48, w: 60, h: 36 },
          soundEffect: 'laser',
          projectile: { speed: 11, w: 34, h: 20, lifetime: 65, type: 'electricity' },
        };
      } else {
        // Guarani
        return {
          name: 'Passo Guarani',
          type: 'special1',
          startup: 5,
          active: 8,
          recovery: 10,
          damage: 15,
          energyGain: 12,
          energyCost: 0,
          hitstun: 24,
          blockstun: 12,
          knockbackX: 10,
          knockbackY: -4,
          hitboxOffset: { x: 35, y: -46, w: 42, h: 34 },
          soundEffect: 'special',
        };
      }

    case 'special2':
      if (fighterId === 'terere') {
        return {
          name: 'Giro da Guampa',
          type: 'special2',
          startup: 6,
          active: 14,
          recovery: 16,
          damage: 19,
          energyGain: 14,
          energyCost: 0,
          hitstun: 26,
          blockstun: 14,
          knockbackX: 13,
          knockbackY: -5,
          hitboxOffset: { x: 26, y: -50, w: 55, h: 45 },
          soundEffect: 'special',
        };
      } else if (fighterId === 'harpa') {
        return {
          name: 'Acorde Reverso',
          type: 'special2',
          startup: 7,
          active: 8,
          recovery: 15,
          damage: 16,
          energyGain: 12,
          energyCost: 0,
          hitstun: 24,
          blockstun: 18,
          knockbackX: 18,
          knockbackY: -3,
          hitboxOffset: { x: 20, y: -50, w: 58, h: 50 },
          soundEffect: 'special',
        };
      } else if (fighterId === 'chaco') {
        return {
          name: 'Impacto Terrestre',
          type: 'special2',
          startup: 13,
          active: 9,
          recovery: 22,
          damage: 24,
          energyGain: 16,
          energyCost: 0,
          hitstun: 32,
          blockstun: 18,
          knockbackX: 12,
          knockbackY: -8,
          hitboxOffset: { x: 30, y: -20, w: 60, h: 32 },
          soundEffect: 'heavy',
        };
      } else if (fighterId === 'nanduti') {
        return {
          name: 'Dança do Fio',
          type: 'special2',
          startup: 5,
          active: 10,
          recovery: 12,
          damage: 17,
          energyGain: 15,
          energyCost: 0,
          hitstun: 22,
          blockstun: 12,
          knockbackX: 11,
          knockbackY: -5,
          hitboxOffset: { x: 34, y: -46, w: 48, h: 36 },
          soundEffect: 'special',
        };
      } else if (fighterId === 'itaipu') {
        return {
          name: 'Pressão da Barragem',
          type: 'special2',
          startup: 14,
          active: 10,
          recovery: 24,
          damage: 26,
          energyGain: 16,
          energyCost: 0,
          hitstun: 30,
          blockstun: 19,
          knockbackX: 17,
          knockbackY: -6,
          hitboxOffset: { x: 36, y: -54, w: 58, h: 48 },
          soundEffect: 'heavy',
        };
      } else {
        // Guarani Golpe da Terra
        return {
          name: 'Golpe da Terra',
          type: 'special2',
          startup: 8,
          active: 8,
          recovery: 16,
          damage: 19,
          energyGain: 14,
          energyCost: 0,
          hitstun: 28,
          blockstun: 14,
          knockbackX: 8,
          knockbackY: -10, // Launcher!
          hitboxOffset: { x: 32, y: -30, w: 50, h: 44 },
          soundEffect: 'heavy',
        };
      }

    case 'super':
      return {
        name: FIGHTERS[fighterId].superName,
        type: 'super',
        startup: 12,
        active: 16,
        recovery: 28,
        damage: Math.round(38 * dmgMult),
        energyGain: 0,
        energyCost: 100, // consumes entire super gauge
        hitstun: 45,
        blockstun: 25,
        knockbackX: 20,
        knockbackY: -8,
        hitboxOffset: { x: 36, y: -58, w: 75, h: 65 },
        soundEffect: 'super',
      };
  }
}
