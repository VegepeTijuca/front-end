import FormConteudo from "./FormConteudo";
import { useState } from "react";

export default function CardDisciplina({ id, name, conteudos = [] }) {
    const [formConteudoAberto, setFormConteudoAberto] = useState(false);

    return (
        <div data-id={id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{name}</h2>

            <ul className="listaConteudos mt-3 space-y-1 rounded bg-amber-100 p-3">
                {conteudos.map((conteudo) => (
                    <li key={conteudo.id ?? conteudo.name ?? conteudo.nome}>
                        {typeof conteudo === "string" ? conteudo : conteudo.name ?? conteudo.nome}
                    </li>
                ))}
            </ul>

            <button
                className="mt-3 rounded bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                onClick={() => setFormConteudoAberto(!formConteudoAberto)}
            >
                Adicionar conteúdo
            </button>
            {formConteudoAberto && <FormConteudo nomeDisciplina={name} idDisciplina={id} />}
        </div>
    )
}