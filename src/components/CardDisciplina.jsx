import { useState } from "react";
import FormConteudo from "./FormConteudo";
import ListaConteudos from "./ListaConteudos";

export default function CardDisciplina({ id, nomeDisciplina }) {
    const [formConteudoAberto, setFormConteudoAberto] = useState(false);
    const [versao, setVersao] = useState(0);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{nomeDisciplina}</h2>

            <ListaConteudos disciplinaId={id} versao={versao} />

            <button
                className="mt-3 rounded bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                onClick={() => setFormConteudoAberto(!formConteudoAberto)}
            >
                Adicionar conteúdo
            </button>

            {formConteudoAberto && (
                <FormConteudo disciplinaId={id} onCriado={() => setVersao((v) => v + 1)} />
            )}
        </div>
    );
}