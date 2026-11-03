// Presets do app. Edite aqui para mudar as sugestões.

// Timers prontos. foco e pausa em minutos. "tempo" = resposta da pergunta "quanto tempo por dia"
// em que a sugestão combina melhor.
export const TIMERS_SUGERIDOS = [
  { chave: 'rapido', nome: 'Rápido', foco: 15, pausa: 0, descricao: 'Uma tarefa curta, sem pausa.', tempo: 'Até 15 minutos' },
  { chave: 'pomodoro', nome: 'Pomodoro', foco: 25, pausa: 5, descricao: 'O clássico: 25 min de foco e 5 de pausa.', tempo: 'De 15 a 30 minutos' },
  { chave: 'foco50', nome: 'Foco 50/10', foco: 50, pausa: 10, descricao: 'Um bloco maior para matérias que pedem concentração.', tempo: 'De 30 a 60 minutos' },
  { chave: 'longo', nome: 'Sessão longa', foco: 90, pausa: 15, descricao: 'Para estudo profundo ou revisão de prova.', tempo: 'Mais de 1 hora' },
];

// Matérias prontas. "combina" lista respostas das preferências que fazem o pacote aparecer primeiro.
export const PACOTES_MATERIAS = [
  {
    chave: 'ensino-medio',
    nome: 'Ensino Médio',
    descricao: 'As matérias do dia a dia da escola.',
    combina: ['Ir bem na escola ou faculdade'],
    materias: [
      { nome: 'Matemática', conteudos: ['Funções', 'Geometria plana', 'Probabilidade'] },
      { nome: 'Português', conteudos: ['Interpretação de texto', 'Gramática', 'Redação'] },
      { nome: 'Física', conteudos: ['Cinemática', 'Dinâmica', 'Eletricidade'] },
      { nome: 'Química', conteudos: ['Tabela periódica', 'Reações químicas', 'Estequiometria'] },
      { nome: 'Biologia', conteudos: ['Citologia', 'Genética', 'Ecologia'] },
      { nome: 'História', conteudos: ['Brasil Colônia', 'Revolução Industrial', 'Guerras mundiais'] },
      { nome: 'Geografia', conteudos: ['Cartografia', 'Clima e vegetação', 'Geopolítica'] },
    ],
  },
  {
    chave: 'prova',
    nome: 'Preparação para prova',
    descricao: 'Áreas que costumam cair em vestibulares e concursos.',
    combina: ['Passar em uma prova'],
    materias: [
      { nome: 'Redação', conteudos: ['Estrutura dissertativa', 'Repertório sociocultural', 'Proposta de intervenção'] },
      { nome: 'Raciocínio lógico', conteudos: ['Proposições', 'Sequências', 'Análise combinatória'] },
      { nome: 'Língua Portuguesa', conteudos: ['Sintaxe', 'Concordância', 'Interpretação'] },
      { nome: 'Atualidades', conteudos: ['Política', 'Economia', 'Meio ambiente'] },
    ],
  },
  {
    chave: 'programacao',
    nome: 'Programação',
    descricao: 'Do básico ao primeiro projeto web.',
    combina: ['Tecnologia'],
    materias: [
      { nome: 'Lógica de programação', conteudos: ['Variáveis e tipos', 'Condicionais', 'Laços', 'Funções'] },
      { nome: 'Web', conteudos: ['HTML', 'CSS', 'JavaScript', 'React'] },
      { nome: 'Banco de dados', conteudos: ['Modelagem', 'SQL básico', 'Relacionamentos'] },
      { nome: 'Git e GitHub', conteudos: ['Commits e branches', 'Pull requests'] },
    ],
  },
  {
    chave: 'ingles',
    nome: 'Inglês',
    descricao: 'As quatro habilidades de um idioma.',
    combina: ['Idiomas'],
    materias: [
      { nome: 'Gramática', conteudos: ['Tempos verbais', 'Preposições', 'Condicionais'] },
      { nome: 'Vocabulário', conteudos: ['Palavras do dia a dia', 'Phrasal verbs'] },
      { nome: 'Listening e Speaking', conteudos: ['Podcasts', 'Conversação', 'Pronúncia'] },
    ],
  },
  {
    chave: 'negocios',
    nome: 'Gestão e finanças',
    descricao: 'Base para quem quer empreender ou gerir.',
    combina: ['Negócios'],
    materias: [
      { nome: 'Finanças', conteudos: ['Fluxo de caixa', 'Juros', 'Investimentos'] },
      { nome: 'Marketing', conteudos: ['Público-alvo', 'Posicionamento', 'Canais'] },
      { nome: 'Gestão de projetos', conteudos: ['Planejamento', 'Prazos e escopo', 'Equipe'] },
    ],
  },
  {
    chave: 'habitos',
    nome: 'Hábitos e carreira',
    descricao: 'Foco, rotina e desenvolvimento profissional.',
    combina: ['Desenvolvimento pessoal', 'Mudar ou crescer na carreira'],
    materias: [
      { nome: 'Hábitos e rotina', conteudos: ['Planejamento semanal', 'Foco', 'Sono e energia'] },
      { nome: 'Carreira', conteudos: ['Currículo', 'Entrevistas', 'Networking'] },
    ],
  },
];
