// Textos de ajuda do app. Edite aqui para mudar o que aparece nos modais "Como funciona".
// cor: azul = ação/navegação, verde = concluído, laranja = hoje/atenção, amarelo = favorito.

// chave do localStorage (tour já visto) e evento que abre o tour de novo
export const CHAVE_TOUR = 'classme:tour-visto';
export const EVENTO_TOUR = 'classme:abrir-tour';

export const COR = {
  azul: '#004A8F',
  verde: '#00A651',
  laranja: '#F49624',
  amarelo: '#FFC800',
  cinza: '#94a3b8',
};

// caminhos de ícones (viewBox 24x24, traço)
export const ICONES = {
  painel: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  calendario: 'M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z',
  relogio: 'M12 6v6l4 2M12 21a9 9 0 100-18 9 9 0 000 18z',
  tarefa: 'M9 11l3 3 8-8M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9',
  livro: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
  estrela: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z',
  check: 'M5 12.5l4.5 4.5L19 7',
  mais: 'M12 5v14M5 12h14',
  arrastar: 'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20',
  menu: 'M4 6h16M4 12h16M4 18h16',
  usuario: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  info: 'M12 16v-4M12 8h.01M12 21a9 9 0 100-18 9 9 0 000 18z',
  engrenagem:
    'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  sair: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  ajuda: 'M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z',
};

// descrição curta de cada item do menu lateral
export const MENU = {
  '/dashboard': { icone: ICONES.painel, dica: 'Resumo do dia, calendário, timer e tarefas' },
  '/calendario': { icone: ICONES.calendario, dica: 'Calendário em tela cheia' },
  '/disciplinas': { icone: ICONES.livro, dica: 'Matérias e conteúdos' },
  '/sobre': { icone: ICONES.info, dica: 'Sobre o clʌss.me' },
};

// legenda das cores (aparece nos modais de ajuda e no tour)
export const LEGENDA_CORES = [
  { cor: COR.azul, rotulo: 'Azul', texto: 'Ações e navegação. Botões e coisas para clicar.' },
  { cor: COR.verde, rotulo: 'Verde', texto: 'Concluído: tarefa feita ou sessão de estudo finalizada.' },
  { cor: COR.laranja, rotulo: 'Laranja', texto: 'Hoje, pausado ou algo que pede atenção (como um erro).' },
  { cor: COR.amarelo, rotulo: 'Amarelo', texto: 'Favorito: tarefas que você marcou com estrela.' },
];

// ajuda por tela: aparece ao clicar no botão "Como funciona" do topo de cada página
export const AJUDA = {
  dashboard: {
    titulo: 'Como usar a Visão Geral',
    intro: 'É a sua tela inicial: tudo o que importa hoje em um só lugar.',
    itens: [
      { icone: ICONES.painel, cor: COR.azul, titulo: 'Resumo do dia', texto: 'Os quatro cartões do topo contam eventos de hoje e suas tarefas. Eles se atualizam sozinhos.' },
      { icone: ICONES.calendario, cor: COR.azul, titulo: 'Calendário', texto: 'Clique em um dia para criar um evento. Clique em um evento para editar ou excluir. Em "Expandir" você abre a versão grande.' },
      { icone: ICONES.relogio, cor: COR.azul, titulo: 'Timer de estudo', texto: 'Escreva o que vai estudar, escolha até quando quer focar e inicie. Dá para pausar e retomar.' },
      { icone: ICONES.tarefa, cor: COR.verde, titulo: 'To-do list', texto: 'Marque o quadrado para concluir. A estrela destaca o que é mais importante.' },
    ],
    legenda: true,
  },
  calendario: {
    titulo: 'Como usar o Calendário',
    intro: 'Aqui você vê e organiza todos os seus compromissos.',
    itens: [
      { icone: ICONES.mais, cor: COR.azul, titulo: 'Criar evento', texto: 'Clique em um dia (ou use o botão de novo evento). Sem horário, o evento vale o dia todo.' },
      { icone: ICONES.arrastar, cor: COR.azul, titulo: 'Mudar de dia ou horário', texto: 'Arraste o evento para outro lugar. Ele é salvo sozinho.' },
      { icone: ICONES.calendario, cor: COR.azul, titulo: 'Mês, semana, dia ou lista', texto: 'Troque a visualização nos botões do topo do calendário.' },
      { icone: ICONES.info, cor: COR.laranja, titulo: 'Cores dos eventos', texto: 'A cor mostra o quão perto o evento está. Veja a legenda ao lado.' },
    ],
    cores: [
      { cor: COR.laranja, rotulo: 'Laranja', texto: 'É hoje' },
      { cor: COR.azul, rotulo: 'Azul', texto: 'Nos próximos 7 dias' },
      { cor: COR.verde, rotulo: 'Verde', texto: 'Mais adiante' },
      { cor: COR.cinza, rotulo: 'Cinza', texto: 'Já passou' },
    ],
  },
  disciplinas: {
    titulo: 'Como usar as Disciplinas',
    intro: 'Cada disciplina é uma matéria. Dentro dela ficam os conteúdos que você quer estudar.',
    itens: [
      { icone: ICONES.livro, cor: COR.azul, titulo: '1. Crie a disciplina', texto: 'Use o formulário do topo: nome da matéria e, se quiser, uma descrição.' },
      { icone: ICONES.mais, cor: COR.azul, titulo: '2. Adicione conteúdos', texto: 'Em cada card, clique em "Adicionar conteúdo" para listar os assuntos da matéria.' },
      { icone: ICONES.info, cor: COR.azul, titulo: '3. Edite quando precisar', texto: '"Editar" muda o nome e a descrição. "Excluir" pede confirmação e apaga também os conteúdos.' },
    ],
  },
};

// passos do tour de boas-vindas
export const TOUR = [
  {
    icone: ICONES.painel,
    cor: COR.azul,
    titulo: 'Bem-vindo ao clʌss.me',
    texto: 'Um jeito rápido de ver o que o app tem. Leva menos de um minuto.',
    pontos: [
      { icone: ICONES.calendario, texto: 'Calendário para provas, entregas e revisões' },
      { icone: ICONES.relogio, texto: 'Timer para focar até a hora que você escolher' },
      { icone: ICONES.tarefa, texto: 'To-do list para o que precisa ser feito' },
      { icone: ICONES.livro, texto: 'Disciplinas com os conteúdos de cada matéria' },
    ],
  },
  {
    icone: ICONES.menu,
    cor: COR.azul,
    titulo: 'Menu lateral',
    texto: 'Para trocar de tela, use o menu à esquerda. No celular, abra pelo botão de três linhas no topo.',
    pontos: [
      { icone: ICONES.painel, texto: 'Visão Geral: seu dia em um só lugar' },
      { icone: ICONES.calendario, texto: 'Calendário: versão grande, com lista de próximos eventos' },
      { icone: ICONES.livro, texto: 'Disciplinas: matérias e conteúdos' },
    ],
  },
  {
    icone: ICONES.ajuda,
    cor: COR.laranja,
    titulo: 'Precisou de ajuda? Procure o "?"',
    texto: 'Cada tela tem um botão "Como funciona" ao lado do título. Ele explica a tela e as cores.',
    cores: true,
  },
  {
    icone: ICONES.usuario,
    cor: COR.verde,
    titulo: 'Seu perfil fica no topo',
    texto: 'Clique no seu nome, no canto direito, para abrir o menu do perfil.',
    pontos: [
      { icone: ICONES.engrenagem, texto: 'Perfil e configurações: suas respostas, timers salvos e matérias prontas' },
      { icone: ICONES.ajuda, texto: 'Ver este tour de novo quando quiser' },
      { icone: ICONES.sair, texto: 'Sair da conta' },
    ],
  },
];
