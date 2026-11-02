import { useCallback, useEffect, useState } from "react";
import FormDisciplina from "../components/FormDisciplina";
import CardDisciplina from "../components/CardDisciplina";
import { getListaDisciplinas } from "../services/disciplinaService";

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
      <FormDisciplina onCriada={carregar} />

      {erro && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      {carregando && <p className="text-sm text-slate-500">Carregando disciplinas...</p>}

      {!carregando && !erro && disciplinas.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
          Nenhuma disciplina cadastrada ainda. Use o formulário acima para criar a primeira.
        </p>
      )}

      {disciplinas.map((d) => (
        <CardDisciplina
          key={d.id}
          id={d.id}
          nomeDisciplina={d.name}
          descricao={d.descricao}
          onAlterada={carregar}
        />
      ))}
    </main>
  );
}
