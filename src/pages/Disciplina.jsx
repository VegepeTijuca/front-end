import { useCallback, useEffect, useState } from "react";
import FormDisciplina from "../components/FormDisciplina";
import CardDisciplina from "../components/CardDisciplina";
import CabecalhoPagina from "../components/CabecalhoPagina";
import { IconeLivro } from "../components/icones";
import { getListaDisciplinas } from "../services/disciplinaService";

// cores que se repetem entre as disciplinas (paleta Tijuca)
const PALETA = ['#004A8F', '#00A651', '#F49624', '#FFC800'];

// Cada card busca os próprios conteúdos (ListaConteudos), então aqui só carregamos as disciplinas.
export default function Disciplina() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

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

  return (
    <main className="space-y-6 px-6 py-8 md:px-12">
      <CabecalhoPagina
        titulo="Disciplinas"
        descricao="Cadastre suas matérias e, dentro de cada uma, os conteúdos que quer estudar."
        ajuda="disciplinas"
      />

      <div className="animate-fade-up">
        <FormDisciplina onCriada={carregar} />
      </div>

      {erro && (
        <p role="alert" className="rounded-xl bg-tj-orange/10 px-4 py-3 text-sm text-[#A85A00]">
          {erro}
        </p>
      )}

      {carregando && <p className="text-sm text-slate-500">Carregando disciplinas...</p>}

      {!carregando && !erro && disciplinas.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#004A8F]/10 text-[#004A8F]">
            <IconeLivro className="h-6 w-6" />
          </span>
          <p className="mt-3 font-semibold text-slate-800">Nenhuma disciplina ainda</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Preencha o formulário acima para criar a primeira. Depois, adicione os conteúdos dentro dela.
          </p>
        </div>
      )}

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
    </main>
  );
}
