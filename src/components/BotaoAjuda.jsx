import { useState } from 'react';
import Modal from './Modal';
import {
  Move, Calendar, Info, BookOpen,
  Plus, House, Clock, Bell, SquareCheckBig,
} from 'lucide-react';

// Um tópico da ajuda: título + explicação.
function Topico({ icone: Icone, titulo, children }) {
  return (
    <li className="flex gap-3">
      <Icone className="mt-0.5 h-5 w-5 shrink-0 text-[#004A8F]" />
      <div>
        <p className="font-semibold text-slate-800">{titulo}</p>
        <p className="text-sm text-slate-600">{children}</p>
      </div>
    </li>
  );
}

// Textos de ajuda de cada tela (a chave é o que se passa em <CabecalhoPagina ajuda="..." />).
// Para mudar um texto, edite aqui mesmo.
const AJUDA = {
  dashboard: {
    titulo: 'Como usar a Visão Geral',
    intro: 'É a sua tela inicial: tudo o que importa hoje em um só lugar.',
    topicos: (
      <>
        <Topico icone={House} titulo="Resumo do dia">
          Os quatro cartões do topo contam os eventos de hoje, as tarefas a fazer, as favoritas e as concluídas. Eles se atualizam sozinhos.
        </Topico>
        <Topico icone={Calendar} titulo="Calendário">
          Clique em um dia para criar um evento. Clique em um evento para editar ou excluir. Em "Expandir" você abre a versão grande.
        </Topico>
        <Topico icone={Clock} titulo="Timer de estudo">
          Escreva o que vai estudar, escolha até quando quer focar e inicie. Dá para pausar e retomar. O estado aparece escrito, com um ícone: ▶ em andamento, ❚❚ pausado, ✓ concluído.
        </Topico>
        <Topico icone={SquareCheckBig} titulo="To-do list">
          Use o botão quadrado para concluir: a tarefa concluída ganha um ✓ e o texto riscado. Use o botão de estrela para favoritar: a estrela fica preenchida.
        </Topico>
      </>
    ),
  },

  calendario: {
    titulo: 'Como usar o Calendário',
    intro: 'Aqui você vê e organiza todos os seus compromissos.',
    topicos: (
      <>
        <Topico icone={Plus} titulo="Criar evento">
          Clique em um dia ou use o botão "+ Novo evento". Sem horário, o evento vale o dia todo.
        </Topico>
        <Topico icone={Move} titulo="Mudar de dia ou horário">Arraste o evento para outro lugar. Ele é salvo sozinho.</Topico>
        <Topico icone={Calendar} titulo="Mês, semana, dia ou lista">Troque a visualização nos botões do topo do calendário.</Topico>
        <Topico icone={Bell} titulo="Próximos eventos">
          No painel ao lado, cada evento mostra a data escrita ("Hoje", "Amanhã" ou o dia da semana) e o horário. Cada evento também tem um ícone: sino para hoje, relógio para os próximos 7 dias, calendário para mais adiante e ✓ para os que já passaram. A legenda fica no fim do painel.
        </Topico>
      </>
    ),
  },

  disciplinas: {
    titulo: 'Como usar as Disciplinas',
    intro: 'Cada disciplina é uma matéria. Dentro dela ficam os conteúdos que você quer estudar.',
    topicos: (
      <>
        <Topico icone={BookOpen} titulo="1. Crie a disciplina">Use o formulário do topo: nome da matéria e, se quiser, uma descrição.</Topico>
        <Topico icone={Plus} titulo="2. Adicione conteúdos">
          Em cada card, clique em "Adicionar conteúdo" para listar os assuntos da matéria.
        </Topico>
        <Topico icone={Info} titulo="3. Edite quando precisar">
          "Editar" muda o nome e a descrição. "Excluir" pede confirmação e apaga também os conteúdos.
        </Topico>
      </>
    ),
  },
};

// Botão "Como funciona" que abre um modal com a explicação da tela.
export default function BotaoAjuda({ tela, className = '' }) {
  const [aberto, setAberto] = useState(false);
  const ajuda = AJUDA[tela];
  if (!ajuda) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-haspopup="dialog"
        className={`inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-[#004A8F] transition hover:border-[#004A8F]/50 hover:bg-[#004A8F]/5 ${className}`}
      >
        Como funciona
      </button>

      {aberto && (
        <Modal
          titulo={ajuda.titulo}
          onFechar={() => setAberto(false)}
          largura="max-w-xl"
          rodape={
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003B73] active:scale-[0.98]"
            >
              Entendi
            </button>
          }
        >
          <p className="mb-4 text-sm text-slate-600">{ajuda.intro}</p>
          <ul className="space-y-4">{ajuda.topicos}</ul>
        </Modal>
      )}
    </>
  );
}
