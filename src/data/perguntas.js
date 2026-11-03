// Perguntas do setup e das preferências. Usadas em FormSetupUsuario e em pages/Configuracoes.

/*
 * Perguntas do setup. Para adicionar/editar uma pergunta, mexa só neste array.
 *
 * - "api: true"  -> a resposta é enviada para a API (salvarPreferencias).
 *                   Mantenha o "valor" igual ao que o backend espera.
 * - "api: false" -> a resposta ainda NÃO tem rota na API: fica salva só neste navegador
 *                   (localStorage). Quando o backend tiver o campo, troque para "api: true".
 */
export const perguntas = [
    {
        id: 'area',
        api: true,
        titulo: 'O que você gostaria de estudar?',
        ajuda: 'Escolha a área principal. Você pode estudar outras coisas depois.',
        opcoes: [
            { valor: 'Tecnologia', emoji: '💻', descricao: 'Programação, dados, redes e mais' },
            { valor: 'Idiomas', emoji: '🌎', descricao: 'Inglês, espanhol, japonês...' },
            { valor: 'Negócios', emoji: '📈', descricao: 'Gestão, finanças e empreendedorismo' },
            { valor: 'Desenvolvimento pessoal', emoji: '🌱', descricao: 'Hábitos, foco e carreira' },
            { valor: 'Outro', emoji: '✨', descricao: 'Conte para a gente o que é' },
        ],
    },
    {
        id: 'objetivo',
        api: false,
        titulo: 'Qual é o seu objetivo agora?',
        ajuda: 'Isso ajuda a entender o que você quer alcançar.',
        opcoes: [
            { valor: 'Passar em uma prova', emoji: '🎯', descricao: 'Vestibular, concurso, certificação' },
            { valor: 'Ir bem na escola ou faculdade', emoji: '🎓', descricao: 'Acompanhar as matérias do dia a dia' },
            { valor: 'Mudar ou crescer na carreira', emoji: '🚀', descricao: 'Aprender algo novo para o trabalho' },
            { valor: 'Aprender por curiosidade', emoji: '🔍', descricao: 'Sem pressão, no meu ritmo' },
        ],
    },
    {
        id: 'estilo',
        api: true,
        titulo: 'Como você prefere aprender?',
        ajuda: 'Pense no jeito em que você aprende mais rápido.',
        opcoes: [
            { valor: 'Vídeos', emoji: '🎬', descricao: 'Aulas e tutoriais em vídeo' },
            { valor: 'Textos', emoji: '📖', descricao: 'Livros, artigos e resumos' },
            { valor: 'Exercícios práticos', emoji: '🛠️', descricao: 'Aprender fazendo' },
            { valor: 'Um pouco de cada', emoji: '🔀', descricao: 'Misturar formatos' },
        ],
    },
    {
        id: 'tempo',
        api: true,
        titulo: 'Quanto tempo você pode estudar por dia?',
        ajuda: 'Seja realista: é melhor pouco todo dia do que muito de vez em quando.',
        opcoes: [
            { valor: 'Até 15 minutos', emoji: '⚡', descricao: 'Sessões rápidas' },
            { valor: 'De 15 a 30 minutos', emoji: '☕', descricao: 'O tempo de um café' },
            { valor: 'De 30 a 60 minutos', emoji: '⏱️', descricao: 'Uma sessão de foco' },
            { valor: 'Mais de 1 hora', emoji: '🔥', descricao: 'Estudo profundo' },
        ],
    },
    {
        id: 'periodo',
        api: false,
        titulo: 'Em que período do dia você rende mais?',
        ajuda: 'Vamos usar isso para sugerir bons horários de estudo.',
        opcoes: [
            { valor: 'Manhã', emoji: '🌅', descricao: 'Antes do meio-dia' },
            { valor: 'Tarde', emoji: '☀️', descricao: 'Do almoço até o fim da tarde' },
            { valor: 'Noite', emoji: '🌙', descricao: 'Depois do jantar' },
            { valor: 'Madrugada', emoji: '🦉', descricao: 'Quando tudo está silencioso' },
        ],
    },
];
