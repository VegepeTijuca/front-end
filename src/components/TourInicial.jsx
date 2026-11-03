import { useState } from 'react';
import Modal from './Modal';
import {
  CircleQuestionMark, Calendar, BookOpen, House, Clock, LogOut, SquareCheckBig, User,
} from 'lucide-react';

// um item da lista do tour: ícone + texto
function Ponto({ icone: Icone, children }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
      <Icone className="h-5 w-5 shrink-0 text-[#004A8F]" />
      {children}
    </li>
  );
}

// chave do localStorage (tour já visto) e evento que abre o tour de novo
export const CHAVE_TOUR = 'classme:tour-visto';
export const EVENTO_TOUR = 'classme:abrir-tour';

// Tour de boas-vindas em passos. Abre sozinho na primeira visita (ver AppLayout)
// e pode ser aberto de novo pelo menu do perfil. Os textos de cada passo estão aqui mesmo.
const PASSOS = [
  {
    titulo: 'Bem-vindo ao clʌss.me',
    conteudo: (
      <>
        <p className="text-slate-600">Um jeito rápido de ver o que o app tem. Leva menos de um minuto.</p>
        <ul className="mt-4 space-y-2">
          <Ponto icone={Calendar}>Calendário para provas, entregas e revisões</Ponto>
          <Ponto icone={Clock}>Timer para focar até a hora que você escolher</Ponto>
          <Ponto icone={SquareCheckBig}>To-do list para o que precisa ser feito</Ponto>
          <Ponto icone={BookOpen}>Disciplinas com os conteúdos de cada matéria</Ponto>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Menu lateral',
    conteudo: (
      <>
        <p className="text-slate-600">
          Para trocar de tela, use o menu à esquerda. No celular, abra pelo botão de três linhas no topo.
        </p>
        <ul className="mt-4 space-y-2">
          <Ponto icone={House}>Visão Geral: seu dia em um só lugar</Ponto>
          <Ponto icone={Calendar}>Calendário: versão grande, com lista de próximos eventos</Ponto>
          <Ponto icone={BookOpen}>Disciplinas: matérias e conteúdos</Ponto>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Precisou de ajuda? Procure "Como funciona"',
    conteudo: (
      <p className="text-slate-600">
        Cada tela tem um botão "Como funciona" ao lado do título. Ele explica o que cada parte da tela faz.
      </p>
    ),
  },
  {
    titulo: 'Seu perfil fica no topo',
    conteudo: (
      <>
        <p className="text-slate-600">Clique no seu nome, no canto direito, para abrir o menu do perfil.</p>
        <ul className="mt-4 space-y-2">
          <Ponto icone={User}>Perfil e configurações: suas respostas, timers salvos e matérias prontas</Ponto>
          <Ponto icone={CircleQuestionMark}>Ver este tour de novo quando quiser</Ponto>
          <Ponto icone={LogOut}>Sair da conta</Ponto>
        </ul>
      </>
    ),
  },
];

export default function TourInicial({ onFechar }) {
  const [passo, setPasso] = useState(0);
  const atual = PASSOS[passo];
  const ultimo = passo === PASSOS.length - 1;

  return (
    <Modal
      titulo={`Passo ${passo + 1} de ${PASSOS.length}`}
      onFechar={onFechar}
      largura="max-w-lg"
      rodape={
        <>
          {!ultimo && (
            <button type="button" onClick={onFechar} className="mr-auto text-sm font-semibold text-slate-600 hover:text-slate-800">
              Pular
            </button>
          )}
          {passo > 0 && (
            <button
              type="button"
              onClick={() => setPasso(passo - 1)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Voltar
            </button>
          )}
          <button
            type="button"
            onClick={() => (ultimo ? onFechar() : setPasso(passo + 1))}
            className="rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003B73] active:scale-[0.98]"
          >
            {ultimo ? 'Começar' : 'Próximo'}
          </button>
        </>
      }
    >
      <div key={passo} className="animate-fade-in">
        <h3 className="text-2xl font-bold text-[#00264D]">{atual.titulo}</h3>
        <div className="mt-2">{atual.conteudo}</div>
      </div>
    </Modal>
  );
}
