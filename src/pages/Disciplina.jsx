gitimport { useCallback, useEffect, useState } from "react";
import FormDisciplina from "../components/FormDisciplina";
import CardDisciplina from "../components/CardDisciplina";
import CabecalhoPagina from "../components/CabecalhoPagina";
import { BookOpen, Plus, X } from 'lucide-react';
import { getListaDisciplinas } from "../services/disciplinaService";

// cores que se repetem entre as disciplinas (paleta Tijuca)
const PALETA = ['#004A8F', '#00A651', '#F49624', '#FFC800'];

/**
 * Componente: Folha
 * Funcionalidade: painel que abre POR CIMA da página (como o "New Task" da referência).
 * No celular sobe de baixo (bottom sheet); no notebook aparece centralizado (modal).
 * Fecha ao clicar fora, no X ou apertando Esc.
 */
function Folha({ onFechar, children }) {
  // Esc fecha a folha
  useEffect(() => {
    const aoApertar = (e) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', aoApertar);
    return () => window.removeEventListener('keydown', aoApertar);
  }, [onFechar]);

  return (
    // fixed inset-0 = cobre a tela toda | items-end = no celular o painel fica embaixo
    // sm:items-center = a partir de 640px o painel fica no meio da tela
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      {/* fundo escurecido: clicar nele fecha */}
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40" onClick={onFechar} aria-hidden="true" />

      {/* o painel em si
          rounded-t-[2rem] = só os cantos de cima arredondados no celular | sm:rounded-[2rem] = todos no notebook
          max-h-[90vh] overflow-y-auto = se for alto demais, rola dentro dele
          sm:max-w-lg = no notebook tem largura máxima de 32rem */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nova disciplina"
        className="relative max-h-[90vh] w-full animate-fade-up overflow-y-auto rounded-t-[2rem] bg-slate-50 px-6 pb-8 pt-3 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-8"
      >
        {/* "alça" do bottom sheet: só aparece no celular (sm:hidden) */}
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-slate-300 sm:hidden" aria-hidden="true" />

        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute right-4 top-4 hidden rounded-full p-2 text-slate-500 transition hover:bg-slate-200 sm:block"
        >
          <X className="h-5 w-5" />
        </button>

        {children}
      </div>
    </div>
  );
}

// Cada card busca os próprios conteúdos (ListaConteudos), então aqui só carregamos as disciplinas.
export default function Disciplina() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  // controla se a folha com o formulário está aberta
  const [formAberto, setFormAberto] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setDisciplinas(await getListaDisciplinas());
      setErro("");
    } catch {
      setErro("Não foi possível carregar as disciplinas.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // depois de criar: recarrega a lista e fecha a folha
  function aoCriar() {
    carregar();
    setFormAberto(false);
  }

  return (
    // mx-auto + max-w-3xl = coluna centralizada (no notebook as linhas não ficam longas demais)
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 md:px-12">
      <CabecalhoPagina
        titulo="Disciplinas"
        descricao="Cadastre suas matérias e, dentro de cada uma, os conteúdos que quer estudar."
        ajuda="disciplinas"
      />

      {erro && (
        <p role="alert" className="rounded-xl bg-tj-orange/10 px-4 py-3 text-sm text-[#A85A00]">
          {erro}
        </p>
      )}

      {carregando && <p className="text-sm text-slate-500">Carregando disciplinas...</p>}

      {/* ESTADO VAZIO (pt3 da referência): círculo com ícone + estrelinhas coloridas */}
      {!carregando && !erro && disciplinas.length === 0 && (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div className="relative">
            <span className="grid h-32 w-32 place-items-center rounded-full bg-[#004A8F]/10 text-[#004A8F]">
              <BookOpen className="h-14 w-14" strokeWidth={1.5} />
            </span>
            {/* ✦ = estrelinhas decorativas (como as da ilustração) */}
            <span aria-hidden="true" className="absolute -right-3 top-2 text-4xl text-tj-orange">✦</span>
            <span aria-hidden="true" className="absolute -right-8 -top-3 text-xl text-tj-yellow">✦</span>
          </div>
          <p className="mt-8 text-2xl font-extrabold text-[#00264D]">Nenhuma disciplina ainda</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Toque no botão + para criar a primeira. Depois, adicione os conteúdos dentro dela.
          </p>
        </div>
      )}

      {/* LISTA (pt1 da referência): título da seção + linhas separadas por um filete */}
      {disciplinas.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline gap-3 px-1">
            <h2 className="text-xl font-extrabold text-[#00264D]">Suas disciplinas</h2>
            <span className="text-sm font-semibold text-slate-400">{disciplinas.length}</span>
          </div>

          {/* divide-y divide-slate-200 = uma linha fina entre cada item da lista */}
          <div className="divide-y divide-slate-200 rounded-3xl bg-white px-5 shadow-sm sm:px-8">
            {disciplinas.map((d, i) => (
              <div
                key={d.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
              >
                <CardDisciplina
                  id={d.id}
                  nomeDisciplina={d.name}
                  descricao={d.descricao}
                  cor={PALETA[i % PALETA.length]}
                  onAlterada={carregar}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BOTÃO FLUTUANTE "+" (FAB): fica fixo no canto da tela e abre a folha */}
      <button
        type="button"
        onClick={() => setFormAberto(true)}
        aria-label="Nova disciplina"
        title="Nova disciplina"
        className="fixed bottom-6 right-6 z-30 grid h-16 w-16 place-items-center rounded-full bg-[#00264D] text-white shadow-xl shadow-[#00264D]/30 transition hover:scale-105 hover:bg-[#003B73] active:scale-95 sm:bottom-8 sm:right-8"
      >
        <Plus className="h-8 w-8" />
      </button>

      {formAberto && (
        <Folha onFechar={() => setFormAberto(false)}>
          <FormDisciplina onCriada={aoCriar} />
        </Folha>
      )}
    </main>
  );
}