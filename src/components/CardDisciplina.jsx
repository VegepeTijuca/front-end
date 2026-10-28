import FormConteudo from "./FormConteudo";
import { useState } from "react";

export default function CardDisciplina({ nomeDisciplina = "Matemática" }) {
    const [formConteudoAberto, setFormConteudoAberto] = useState(false);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{nomeDisciplina}</h2>
            <p className="mt-2 font-medium">Anotações:</p>
            <p>Um, dois, três</p>

            <ul className="listaConteudos mt-3 space-y-1 rounded bg-amber-100 p-3">
                <li>Trigonometria</li>
                <li>Geometria</li>
                <li>Área e perímetro de formas</li>
            </ul>

            <button
                className="mt-3 rounded bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                onClick={() => setFormConteudoAberto(!formConteudoAberto)}
            >
                Adicionar conteúdo
            </button>
            {formConteudoAberto && <FormConteudo nomeDisciplina={nomeDisciplina} />}
        </div>
    )
}