import { useCallback, useEffect, useState } from "react";
import FormDisciplina from "../components/FormDisciplina";
import CardDisciplina from "../components/CardDisciplina";
import { getListaDisciplinas } from "../services/disciplinaService";
import { getListaConteudos } from "../services/conteudoService";

export default function Disciplina() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [conteudos, setConteudos] = useState([]);

  const carregar = useCallback(async () => {
    setDisciplinas(await getListaDisciplinas());
    setConteudos(await getListaConteudos());
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <div className="space-y-6">
      <FormDisciplina onCriada={carregar} />
      {disciplinas.map((d) => (
        <CardDisciplina
          key={d.id}
          id={d.id}
          nomeDisciplina={d.name}
          conteudos={conteudos.filter((c) => c.disciplinaId === d.id)}
          onConteudoCriado={carregar}
        />
      ))}
    </div>
  );
}