# 🇵🇾 KUARAHY — Projeto de Jogo de Luta Pixel Art

> **Conceito:** jogo de luta 2D em pixel art, inspirado nas mecânicas clássicas dos jogos de luta de arcade e de *Mortal Kombat*, mas com identidade própria baseada no Paraguai.
>
> **Objetivo:** criar um jogo enxuto, divertido e tecnicamente viável, com 6 personagens distintos, modo 1v1 local pela mesma rede Wi‑Fi e modo 1vBot.

---

# 1. Visão geral

**KUARAHY** é um jogo de luta 2D em pixel art com partidas **1 contra 1**.

A proposta combina:

- Combate lateral em arena;
- Rodadas;
- Barra de vida;
- Ataques normais;
- Ataques especiais;
- Combos simples;
- Defesa;
- Agarrão;
- Pulo e agachamento;
- Sistema de vitória;
- Personagens com estilos diferentes;
- Modo contra bot;
- Modo multiplayer pela mesma rede Wi‑Fi;
- Cenários inspirados em diferentes regiões e elementos do Paraguai.

O jogo deve parecer um **arcade de luta clássico**, e não um RPG ou jogo de ação.

---

# 2. Identidade do projeto

## Tema

A identidade visual e narrativa será inspirada no Paraguai, utilizando referências culturais, geográficas e urbanas de forma respeitosa.

Elementos possíveis:

- Assunção;
- Ciudad del Este;
- Encarnación;
- Chaco;
- Rio Paraguai;
- Itaipu;
- Ñandutí;
- Tereré;
- Harpa paraguaia;
- Música e instrumentos tradicionais;
- Arquitetura e paisagens locais;
- Cores e símbolos nacionais.

> As referências devem aparecer principalmente em personagens, cenários, objetos, nomes e interface. O jogo não precisa transformar cada elemento cultural em um "poder mágico".

---

# 3. Estilo visual

## Pixel Art

Todo o jogo deve utilizar pixel art consistente.

### Características

- Sprites desenhados em baixa resolução;
- Escala de pixels consistente;
- Sem blur;
- Sem suavização excessiva;
- Animações quadro a quadro;
- Cores bem definidas;
- Silhuetas fáceis de reconhecer;
- Efeitos de impacto em pixel art.

### Direção visual

O visual deve lembrar jogos de luta arcade clássicos, porém com acabamento moderno.

Evitar:

- 3D realista;
- Personagens genéricos;
- Excesso de partículas;
- Interfaces futuristas sem relação com o tema;
- Efeitos que escondam os personagens.

---

# 4. Estrutura da partida

Cada partida acontece em uma arena 2D.

```text
┌─────────────────────────────────────────────┐
│ JOGADOR 1                  JOGADOR 2        │
│ ████████████               ████████████     │
│                                             │
│              TEMPO: 72                     │
│                                             │
│       PERSONAGEM A       PERSONAGEM B       │
│            ◀──────────────▶                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Objetivo

Reduzir a barra de vida do adversário até derrotá-lo.

O vencedor precisa ganhar **2 rounds**.

Configuração padrão:

- Melhor de 3 rounds;
- 60 segundos por round;
- Se o tempo acabar, vence quem tiver mais vida;
- Empate pode iniciar um pequeno desempate configurável.

---

# 5. Controles

Os controles devem ser simples.

## Movimentação

- Esquerda — andar para trás;
- Direita — andar para frente;
- Cima — pular;
- Baixo — agachar.

## Combate

- Soco;
- Chute;
- Defesa;
- Agarrão;
- Especial.

Uma configuração possível:

```text
A = Soco
B = Chute
X = Especial
Y = Agarrão
L/R = Defesa ou funções auxiliares
```

No teclado:

```text
W = Pular
A = Esquerda
S = Agachar
D = Direita

J = Soco
K = Chute
L = Especial
U = Agarrão
I = Defesa
```

Os controles devem ser configuráveis.

---

# 6. Sistema de combate

O combate será baseado em quatro grupos principais:

## Ataques normais

Cada personagem terá:

- Soco parado;
- Chute parado;
- Ataque agachado;
- Ataque no ar;
- Ataque forte;
- Ataques direcionais.

## Ataques especiais

Cada personagem terá **2 especiais principais**.

Eles serão executados por combinações simples de direção + botão.

Exemplo:

```text
↓ → + Especial
```

ou

```text
↓ ← + Especial
```

## Agarrão

O agarrão funciona a curta distância.

Se acertar:

```text
Agarrão
   ↓
Animação curta
   ↓
Dano
   ↓
Adversário afastado
```

O agarrão não deve causar dano exagerado.

## Defesa

Ao segurar defesa:

- O dano recebido diminui;
- Alguns ataques podem causar pequeno dano residual;
- O jogador não pode atacar enquanto estiver defendendo;
- Ataques fortes/especiais podem abrir espaço para punição.

---

# 7. Combos

O sistema de combos deve ser simples e acessível.

Exemplo:

```text
Soco → Soco → Chute
```

ou:

```text
Soco → Chute → Especial
```

O objetivo não é criar um sistema extremamente complexo.

### Regras

- Combos curtos;
- Janela de entrada tolerante;
- Cada personagem possui sequências próprias;
- Combos maiores exigem domínio maior;
- O jogador deve conseguir aprender os comandos rapidamente.

---

# 8. Sistema de energia

Cada personagem possui uma barra de energia abaixo da vida.

A energia aumenta quando o personagem:

- Acerta golpes;
- Recebe golpes;
- Defende ataques;
- Mantém o combate ativo.

Exemplo:

```text
ENERGIA
████████████░░░░░░░░
```

A energia pode ser usada para:

- Ataques especiais aprimorados;
- Contra-ataque;
- Uma técnica especial de maior impacto.

Não adicionar dezenas de recursos diferentes. A barra deve complementar o combate, não substituí-lo.

---

# 9. Mecânica adicional: Contra

Uma mecânica extra simples será o **Contra**.

Se o jogador defender um ataque no momento correto e pressionar o botão de contra:

```text
Defesa precisa
      ↓
Janela curta
      ↓
Contra
      ↓
Pequeno atordoamento
```

O Contra deve exigir timing.

Não deve funcionar automaticamente.

---

# 10. Personagens

O jogo terá exatamente **6 personagens jogáveis**.

Cada um deverá possuir:

- Nome;
- Silhueta própria;
- História curta;
- Estilo de luta;
- Ataques normais;
- 2 ataques especiais;
- 1 técnica de energia;
- Atributos próprios.

Os personagens não devem ser apenas "skins".

---

# 11. Personagem 1 — O Tereré

## Conceito

Um personagem inspirado na cultura do tereré, tratado de maneira estilizada.

## Estilo

Personagem equilibrado.

### Características

- Velocidade média;
- Dano médio;
- Defesa média;
- Alcance médio.

### Especiais

**Jato Gelado**

Utiliza uma rajada de água fria de curto alcance.

**Giro da Guampa**

Ataque giratório próximo.

### Técnica de energia

**Tereré Turbo**

Aumenta temporariamente a velocidade de recuperação de movimentos.

---

# 12. Personagem 2 — A Harpa

## Conceito

Lutador inspirado na harpa paraguaia.

## Estilo

Controle de distância.

### Características

- Dano médio;
- Baixa resistência;
- Excelente alcance;
- Velocidade média.

### Especiais

**Nota Cortante**

Projétil musical.

**Acorde Reverso**

Ataque que cria espaço entre os lutadores.

### Técnica de energia

**Concerto**

Uma sequência curta de ondas sonoras.

---

# 13. Personagem 3 — O Chaco

## Conceito

Guerreiro inspirado na região do Chaco paraguaio.

## Estilo

Tanque.

### Características

- Alta resistência;
- Alto dano;
- Baixa velocidade;
- Ataques mais lentos.

### Especiais

**Investida do Chaco**

Avança rapidamente e golpeia o adversário.

**Impacto Terrestre**

Golpe no chão que atinge o oponente próximo.

### Técnica de energia

**Força do Chaco**

Durante pouco tempo, recebe menos dano, mas fica mais lento.

---

# 14. Personagem 4 — Ñandutí

## Conceito

Personagem inspirado no tradicional tecido rendado ñandutí.

## Estilo

Velocidade e controle.

### Características

- Alta velocidade;
- Baixo dano individual;
- Combos rápidos;
- Defesa moderada.

### Especiais

**Laço de Ñandutí**

Cria um ataque de curto alcance que prende o adversário por um instante.

**Dança do Fio**

Movimento evasivo seguido de golpe.

### Técnica de energia

**Trama**

Cria uma pequena área temporária que dificulta a aproximação do adversário.

---

# 15. Personagem 5 — Itaipu

## Conceito

Personagem inspirado na força e na escala da Usina de Itaipu.

## Estilo

Força e ataques pesados.

### Características

- Dano alto;
- Velocidade baixa;
- Grande alcance em ataques fortes;
- Recuperação lenta.

### Especiais

**Descarga**

Ataque elétrico de médio alcance.

**Pressão da Barragem**

Golpe pesado para frente.

### Técnica de energia

**Sobrecarga**

Carrega energia por um instante e executa um ataque elétrico mais forte.

---

# 16. Personagem 6 — Guarani

## Conceito

Um personagem fictício inspirado na força histórica e cultural dos povos Guarani.

O personagem deve ser tratado com respeito, evitando estereótipos.

## Estilo

Equilibrado e técnico.

### Características

- Velocidade média/alta;
- Dano médio;
- Bons contra-ataques;
- Excelente mobilidade.

### Especiais

**Passo Guarani**

Movimento rápido para reposicionamento.

**Golpe da Terra**

Ataque próximo com forte impacto.

### Técnica de energia

**Espírito da Terra**

Aumenta temporariamente a resistência a interrupções durante ataques.

---

# 17. Balanceamento

Nenhum personagem deve ser claramente superior.

Tabela inicial:

| Personagem | Dano | Velocidade | Defesa | Alcance |
|---|---:|---:|---:|---:|
| Tereré | 3/5 | 3/5 | 3/5 | 3/5 |
| Harpa | 3/5 | 3/5 | 2/5 | 5/5 |
| Chaco | 5/5 | 2/5 | 5/5 | 3/5 |
| Ñandutí | 2/5 | 5/5 | 3/5 | 3/5 |
| Itaipu | 5/5 | 1/5 | 4/5 | 4/5 |
| Guarani | 3/5 | 4/5 | 3/5 | 3/5 |

Esses valores são apenas uma base inicial e devem ser ajustados através de testes.

---

# 18. Arenas

O jogo deve ter aproximadamente **6 arenas**, uma associada a cada identidade/personagem.

## Arena de Assunção

- Área urbana;
- Arquitetura local;
- Movimento de pessoas ao fundo;
- Placas e elementos urbanos.

## Arena do Chaco

- Paisagem seca;
- Vegetação característica;
- Céu amplo;
- Poeira durante alguns impactos.

## Arena de Itaipu

- Estrutura inspirada na usina;
- Água ao fundo;
- Elementos industriais.

## Arena do Rio Paraguai

- Margem do rio;
- Barcos ao fundo;
- Vegetação;
- Movimento da água.

## Arena de Encarnación

- Paisagem urbana;
- Área próxima ao rio;
- Iluminação de fim de tarde.

## Arena Cultural

- Elementos inspirados em artesanato;
- Padrões de ñandutí;
- Decoração tradicional.

Os cenários devem ser **2D em pixel art** e não precisam possuir objetos interativos complexos.

---

# 19. Interface — UI

A interface deve ser inspirada nos arcades clássicos.

## HUD

No topo:

```text
┌─────────────────────────────────────────────┐
│ PLAYER 1              60              PLAYER 2 │
│ ████████████          ⚡          ████████████ │
│                                             │
│                                             │
│                                             │
│                                             │
│              COMBATE                       │
│                                             │
│                                             │
│                                             │
│ ████████ Energia                 Energia ████████ │
└─────────────────────────────────────────────┘
```

### Elementos

- Nome do personagem;
- Barra de vida;
- Barra de energia;
- Temporizador;
- Indicador de round;
- Contador de combo;
- Mensagens de vitória.

---

# 20. Menu principal

Visual inspirado em fliperamas antigos.

```text
╔══════════════════════════════╗
║          KUARAHY             ║
║                              ║
║        1V1 LOCAL             ║
║        1V BOT                ║
║        TREINAMENTO            ║
║        OPÇÕES                 ║
║        SAIR                   ║
╚══════════════════════════════╝
```

O menu deve possuir:

- Navegação simples;
- Animações leves;
- Música de fundo;
- Sons de seleção;
- Transições rápidas.

---

# 21. Seleção de personagem

Tela com os 6 personagens.

```text
┌─────────────────────────────────┐
│       ESCOLHA SEU LUTADOR       │
│                                 │
│  [01] [02] [03]                 │
│  [04] [05] [06]                 │
│                                 │
│       PERSONAGEM SELECIONADO    │
│                                 │
│      DANO     ███░░              │
│      VELOC.   ████░              │
│      DEFESA   ███░░              │
└─────────────────────────────────┘
```

O personagem selecionado deve apresentar:

- Nome;
- Sprite maior;
- Pequena descrição;
- Atributos;
- Animação de idle.

---

# 22. UX

A experiência deve ser direta.

Fluxo:

```text
Menu
 ↓
Modo de jogo
 ↓
Escolha do personagem
 ↓
Escolha da arena
 ↓
Contagem regressiva
 ↓
FIGHT!
 ↓
Combate
 ↓
Round
 ↓
Vitória
 ↓
Próxima luta / Menu
```

A quantidade de menus deve ser pequena.

O jogador deve conseguir começar uma partida rapidamente.

---

# 23. Animações

Cada personagem deve possuir pelo menos:

- Idle;
- Andar;
- Andar para trás;
- Pular;
- Agachar;
- Soco;
- Chute;
- Ataque forte;
- Defesa;
- Agarrão;
- Receber golpe;
- Atordoamento;
- Ataque especial 1;
- Ataque especial 2;
- Técnica de energia;
- Vitória;
- Derrota.

As animações não precisam ter centenas de frames.

Priorizar **timing, leitura visual e sensação de impacto**.

---

# 24. Efeitos de impacto

Quando um golpe acertar:

- Pequeno flash;
- Partículas em pixel art;
- Pequena vibração da câmera;
- Som de impacto;
- Animação de reação;
- Pequeno efeito de hit-stop.

O hit-stop deve ser curto.

Exemplo:

```text
Golpe
 ↓
Impacto
 ↓
0,05–0,10 s de pausa visual
 ↓
Animação continua
```

Isso aumenta a sensação de força sem exagerar.

---

# 25. Sistema de rounds

Cada luta terá:

```text
ROUND 1
   ↓
Jogador vence
   ↓
ROUND 2
   ↓
Jogador vence
   ↓
VICTORY
```

O HUD deve mostrar:

```text
PLAYER 1 ● ● ○

PLAYER 2 ○ ○ ○
```

Cada círculo representa um round vencido.

---

# 26. Modo 1VBot

O jogador enfrenta um personagem controlado pela IA.

## Dificuldades

### Fácil

- Poucos ataques;
- Reação lenta;
- Poucos combos.

### Normal

- Utiliza defesa;
- Utiliza especiais;
- Faz combos simples.

### Difícil

- Melhor posicionamento;
- Reação mais rápida;
- Pune erros;
- Utiliza especiais com maior frequência.

A IA não deve trapacear lendo diretamente os comandos do jogador.

Ela deve tomar decisões com base no estado da luta.

---

# 27. IA do Bot

Estados básicos:

```text
IDLE
 ↓
APROXIMAR
 ↓
ATACAR
 ↓
DEFENDER
 ↓
RECUAR
 ↓
ESPECIAL
 ↓
RECUPERAR
```

O bot deve analisar:

- Distância;
- Vida;
- Energia;
- Estado do adversário;
- Tempo;
- Situação do round.

---

# 28. Multiplayer pela mesma rede Wi‑Fi

O jogo terá um modo:

**1V1 LAN**

Dois dispositivos conectados à mesma rede Wi‑Fi poderão jogar entre si.

## Fluxo

```text
JOGADOR 1
   ↓
CRIAR SALA
   ↓
Código/IP local
   ↓
JOGADOR 2
   ↓
ENTRAR NA SALA
   ↓
Escolha dos personagens
   ↓
Partida
```

## Requisitos

- Ambos os dispositivos na mesma rede local;
- Um dispositivo atua como host;
- O outro entra como cliente;
- O jogo sincroniza os estados necessários da partida.

---

# 29. Sincronização LAN

Não enviar a tela inteira pela rede.

Enviar principalmente:

- Comandos;
- Estado do personagem;
- Posição;
- Ação atual;
- Vida;
- Energia;
- Resultado do round.

Exemplo conceitual:

```text
PLAYER 1
input = ATTACK
direction = RIGHT
frame = 1024
```

O outro dispositivo interpreta o comando e mantém a simulação sincronizada.

---

# 30. Segurança e estabilidade do multiplayer

O host deve validar:

- Comandos recebidos;
- Estado da partida;
- Vida;
- Resultado dos rounds.

Evitar que o cliente simplesmente envie:

```text
vida = 9999
```

e altere a partida.

Também devem existir:

- Indicador de conexão;
- Reconexão simples;
- Mensagem de jogador desconectado;
- Limite de espera para conexão.

---

# 31. Sons

Cada ação importante deve possuir feedback sonoro.

### Sons

- Soco;
- Chute;
- Defesa;
- Agarrão;
- Impacto;
- Especial;
- Menu;
- Seleção;
- Vitória;
- Derrota;
- Contagem regressiva.

A trilha sonora pode misturar:

- Instrumentos tradicionais;
- Percussão;
- Música eletrônica;
- Elementos de arcade.

A música deve reforçar a identidade paraguaia sem transformar o jogo em uma caricatura.

---

# 32. Sistema de vitória

Ao vencer:

```text
VICTORY!
```

Depois:

- Personagem faz animação de vitória;
- Música muda;
- Pontuação aparece;
- O jogador pode continuar ou voltar ao menu.

---

# 33. Finalizações

Para manter a identidade de jogo de luta sem depender de violência gráfica, o projeto pode usar **finalizações estilizadas**.

Exemplo:

```text
FINISH!
     ↓
Animação especial
     ↓
Efeito de tela
     ↓
Pose de vitória
```

As finalizações podem destacar o estilo de cada personagem sem mostrar conteúdo gráfico.

---

# 34. Treinamento

Um modo simples de treinamento é recomendado.

Deve permitir:

- Vida infinita;
- Energia configurável;
- Bot parado;
- Bot defendendo;
- Mostrar comandos;
- Mostrar combo;
- Resetar posição.

Exemplo:

```text
COMBO: 7 HITS
DANO: 82
```

---

# 35. Sistema de pontuação

A pontuação pode considerar:

```text
+ Vitória
+ Round vencido
+ Combo
+ Vida restante
+ Tempo restante
+ Contra bem executado
```

Evitar recompensas exageradas.

O foco continua sendo o combate.

---

# 36. Arquitetura recomendada

Uma estrutura lógica possível:

```text
game/
│
├── characters/
│   ├── terere/
│   ├── harpa/
│   ├── chaco/
│   ├── nanduti/
│   ├── itaipu/
│   └── guarani/
│
├── stages/
│
├── sprites/
│
├── animations/
│
├── audio/
│
├── ui/
│
├── combat/
│
├── ai/
│
├── network/
│
└── game/
```

---

# 37. Sistemas principais

O projeto deve ser dividido em sistemas independentes:

### Character System

Controla:

- Vida;
- Energia;
- Movimento;
- Ataques;
- Animações;
- Estado atual.

### Combat System

Controla:

- Hitboxes;
- Hurtboxes;
- Dano;
- Combos;
- Defesa;
- Agarrões;
- Especiais.

### Round System

Controla:

- Tempo;
- Vitória;
- Derrota;
- Transição entre rounds.

### AI System

Controla os bots.

### Network System

Controla partidas LAN.

### UI System

Controla:

- HUD;
- Menus;
- Seleção;
- Mensagens.

---

# 38. Hitbox e Hurtbox

O combate deve utilizar áreas invisíveis.

## Hurtbox

Área onde o personagem pode ser atingido.

## Hitbox

Área ativa de um ataque.

Exemplo:

```text
PERSONAGEM
┌───────────┐
│  HURTBOX  │
│    🧍     │
└───────────┘

ATAQUE
       ┌───────┐
       │HITBOX │
       └───────┘
```

Isso permite criar golpes precisos sem depender apenas do sprite.

---

# 39. Regras para evitar exageros

O projeto deve permanecer focado.

Não adicionar inicialmente:

- 30 personagens;
- Mundo aberto;
- RPG complexo;
- Sistema de equipamentos;
- Árvore de habilidades;
- Centenas de skins;
- Crafting;
- História gigantesca;
- Multiplayer online pela internet;
- Sistema complexo de ranking.

O núcleo é:

> **6 personagens + combate sólido + 1VBot + 1V1 LAN + pixel art + identidade paraguaia.**

---

# 40. Ordem recomendada de desenvolvimento

## Fase 1 — Protótipo

Criar:

- Arena;
- 2 personagens temporários;
- Movimento;
- Pulo;
- Ataque;
- Defesa;
- Vida;
- Round.

## Fase 2 — Combate

Adicionar:

- Hitboxes;
- Hurtboxes;
- Combos;
- Agarrão;
- Especiais;
- Energia;
- Contra.

## Fase 3 — Personagens

Criar os 6 personagens completos.

## Fase 4 — Arte

Adicionar:

- Sprites;
- Animações;
- Arenas;
- Efeitos;
- Interface.

## Fase 5 — IA

Implementar:

- Fácil;
- Normal;
- Difícil.

## Fase 6 — LAN

Implementar:

- Host;
- Cliente;
- Sala;
- Sincronização;
- Reconexão.

## Fase 7 — Polimento

Testar:

- Balanceamento;
- Colisões;
- Animações;
- Sons;
- Menus;
- Performance;
- Conexão.

---

# 41. Critérios de qualidade

O jogo estará em uma boa direção quando:

- Cada personagem for reconhecível pela silhueta;
- Cada personagem possuir uma estratégia diferente;
- Os golpes tiverem bom feedback;
- Os combos forem fáceis de aprender;
- A defesa tiver importância;
- Nenhum personagem dominar todos os outros;
- O bot parecer desafiador sem trapacear;
- O multiplayer LAN permanecer sincronizado;
- A interface for fácil de entender;
- O pixel art possuir estilo consistente.

---

# 42. Resumo final

**KUARAHY** deve ser um jogo de luta 2D em pixel art com estrutura clássica de arcade.

### Conteúdo principal

- 🇵🇾 Tema paraguaio;
- 👊 6 personagens;
- ⚔️ Combate 1v1;
- 🤖 1VBot;
- 📡 1V1 pela mesma rede Wi‑Fi;
- ❤️ Barra de vida;
- ⚡ Barra de energia;
- 🥊 Ataques normais;
- 🔥 Ataques especiais;
- 🔗 Combos;
- 🛡️ Defesa;
- 🤼 Agarrão;
- ⚡ Contra;
- 🏆 Sistema de rounds;
- 🎮 Treinamento;
- 🏟️ Arenas em pixel art;
- 🎵 Trilha sonora temática;
- 🖥️ UI/UX de arcade;
- ✨ Efeitos de impacto;
- 🏁 Finalizações estilizadas.

## Princípio do projeto

> **Poucos sistemas, mas bem feitos.**

A prioridade deve ser construir primeiro um combate responsivo e divertido. Depois entram os personagens, arte, arenas, IA, multiplayer e polimento.

O resultado final deve parecer um **jogo de luta arcade completo com identidade paraguaia**, e não apenas uma cópia visual de Mortal Kombat.

---

# 43. Stack tecnológica recomendada

Para este projeto, a recomendação principal é desenvolver o jogo **para navegador usando JavaScript + Phaser**, mantendo HTML e CSS para as interfaces e utilizando **Node.js + WebSocket** para o multiplayer pela mesma rede Wi‑Fi.

## Stack oficial do projeto

```text
KUARAHY
│
├── HTML
│   └── Estrutura das páginas e elementos da interface
│
├── CSS
│   └── Menus, HUD complementar, responsividade e efeitos de interface
│
├── JavaScript
│   └── Lógica principal do jogo
│
├── Phaser
│   ├── Renderização 2D
│   ├── Sprites
│   ├── Animações
│   ├── Cenas
│   ├── Input
│   └── Recursos de jogo 2D
│
└── Node.js + WebSocket
    └── Comunicação do multiplayer LAN
```

## Por que JavaScript + Phaser?

O projeto precisa principalmente de:

- Combate 2D em tempo real;
- Pixel art;
- Animações quadro a quadro;
- Hitboxes e hurtboxes;
- Controle preciso dos personagens;
- IA para os bots;
- Gerenciamento de cenas;
- Multiplayer pela rede local.

O Phaser é mais adequado para o núcleo do jogo do que utilizar React para controlar diretamente a simulação de combate.

## Papel de cada tecnologia

| Tecnologia | Responsabilidade |
|---|---|
| HTML | Estrutura de páginas e elementos auxiliares |
| CSS | Estilização de menus, telas e componentes de interface |
| JavaScript | Regras, combate, personagens, IA e integração geral |
| Phaser | Motor 2D, sprites, cenas, animações e input |
| Node.js | Servidor local do multiplayer |
| WebSocket | Comunicação em tempo real entre jogadores |
| JSON | Dados de personagens, golpes, configurações e arenas |

---

# 44. Por que não usar React como núcleo do jogo?

React **não será utilizado para controlar o loop principal do combate**.

React é excelente para interfaces e aplicações web, mas o KUARAHY precisa de uma atualização contínua do estado do jogo, por exemplo:

```text
Input
 ↓
Movimento
 ↓
Física
 ↓
Hitbox/Hurtbox
 ↓
Dano
 ↓
Animação
 ↓
IA
 ↓
Renderização
 ↓
Próximo frame
```

Esse fluxo combina melhor com uma engine 2D como o Phaser.

React poderia ser utilizado posteriormente em uma área externa ao jogo, como:

- Página oficial;
- Ranking online;
- Perfil do jogador;
- Estatísticas;
- Painel administrativo.

Mas isso não é necessário para a primeira versão.

---

# 45. Estrutura técnica sugerida

Uma organização inicial do projeto pode ser:

```text
kuarahy/
│
├── public/
│   ├── assets/
│   │   ├── sprites/
│   │   ├── backgrounds/
│   │   ├── effects/
│   │   ├── audio/
│   │   └── fonts/
│   │
│   └── index.html
│
├── src/
│   ├── main.js
│   │
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── CharacterSelectScene.js
│   │   ├── StageSelectScene.js
│   │   ├── FightScene.js
│   │   └── TrainingScene.js
│   │
│   ├── characters/
│   │   ├── Character.js
│   │   ├── Terere.js
│   │   ├── Harpa.js
│   │   ├── Chaco.js
│   │   ├── Nanduti.js
│   │   ├── Itaipu.js
│   │   └── Guarani.js
│   │
│   ├── combat/
│   │   ├── CombatSystem.js
│   │   ├── Hitbox.js
│   │   ├── Hurtbox.js
│   │   ├── ComboSystem.js
│   │   ├── DamageSystem.js
│   │   └── RoundSystem.js
│   │
│   ├── ai/
│   │   └── FighterAI.js
│   │
│   ├── network/
│   │   ├── Host.js
│   │   └── Client.js
│   │
│   ├── ui/
│   │   ├── HUD.js
│   │   ├── Menu.js
│   │   └── CharacterSelect.js
│   │
│   └── data/
│       ├── characters.json
│       ├── attacks.json
│       └── stages.json
│
├── server/
│   └── server.js
│
├── styles/
│   └── main.css
│
├── package.json
└── README.md
```

A estrutura pode mudar durante o desenvolvimento. O objetivo é apenas separar responsabilidades desde o início.

---

# 46. Princípio técnico do projeto

O KUARAHY deve ser desenvolvido primeiro como um **protótipo jogável**, e não como um projeto visual completo.

A ordem recomendada é:

```text
Movimento
 ↓
Combate básico
 ↓
Hitbox/Hurtbox
 ↓
Round
 ↓
2 personagens de teste
 ↓
IA
 ↓
Multiplayer LAN
 ↓
6 personagens
 ↓
Pixel Art final
 ↓
Interface final
 ↓
Áudio
 ↓
Polimento
```

Isso evita gastar semanas produzindo sprites e menus antes de confirmar se o combate realmente funciona.

---

# 47. Decisão tecnológica final

### Escolha principal

> **JavaScript + Phaser + HTML/CSS + Node.js + WebSocket**

### Não utilizar inicialmente

> **React no núcleo do jogo**

React poderá entrar futuramente em partes que realmente se beneficiem de uma biblioteca de interface.

### Objetivo da stack

A tecnologia deve permitir que o KUARAHY seja:

- Executado no navegador;
- Compatível com PC;
- Adaptável para dispositivos móveis posteriormente;
- Leve;
- Fácil de testar;
- Fácil de distribuir;
- Compatível com pixel art;
- Adequado para combate 2D em tempo real;
- Preparado para multiplayer LAN.

---

# 48. Decisão de escopo

A primeira versão jogável (**MVP**) deve conter apenas:

- 2 personagens de teste;
- 1 arena;
- Movimento;
- Pulo;
- Agachamento;
- Soco;
- Chute;
- Defesa;
- 1 especial por personagem;
- Barra de vida;
- Rounds;
- 1VBot básico.

Depois que esse núcleo estiver estável, adicionar:

1. Os outros personagens;
2. Todos os especiais;
3. Energia;
4. Contra;
5. Treinamento;
6. Arenas finais;
7. Multiplayer LAN;
8. Arte e áudio finais;
9. Polimento.

> **Regra principal:** não aumentar o escopo antes de o combate básico estar divertido e consistente.
