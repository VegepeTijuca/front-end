import { useState } from "react";
import FormConteudo from "./FormConteudo";
import ListaConteudos from "./ListaConteudos";
import { atualizarDisciplina, removerDisciplina } from "../services/disciplinaService";

const botaoPequeno =
    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60";

// onAlterada: avisa a página para recarregar a lista depois de editar ou excluir
export default function CardDisciplina({ id, nomeDisciplina, descricao = "", onAlterada }) {
    const [formConteudoAberto, setFormConteudoAberto] = useState(false);
    const [versao, setVersao] = useState(0);

    const [editando, setEditando] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [nome, setNome] = useState(nomeDisciplina);
    const [desc, setDesc] = useState(descricao);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    function abrirEdicao() {
        setNome(nomeDisciplina);
        setDesc(descricao);
        setErro("");
        setEditando(true);
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        if (!nome.trim()) {
            setErro("Informe o nome da disciplina.");
            return;
        }

        setSalvando(true);
        setErro("");
        try {
            await atualizarDisciplina(id, { name: nome.trim(), descricao: desc.trim() });
            setEditando(false);
            onAlterada?.();
        } catch {
            setErro("Não foi possível salvar as alterações.");
        } finally {
            setSalvando(false);
        }
    }

    async function excluir() {
        setSalvando(true);
        setErro("");
        try {
            await removerDisciplina(id);
            onAlterada?.();
        } catch {
            setErro("Não foi possível excluir a disciplina.");
            setConfirmandoExclusao(false);
            setSalvando(false);
        }
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            {editando ? (
                <form onSubmit={salvarEdicao} className="space-y-3">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-label="Nome da disciplina"
                        required
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                    />
                    <input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        aria-label="Descrição da disciplina"
                        placeholder="Descrição (opcional)"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={salvando}
                            className={`${botaoPequeno} bg-indigo-600 text-white hover:bg-indigo-700`}
                        >
                            {salvando ? "Salvando..." : "Salvar"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditando(false)}
                            className={`${botaoPequeno} text-gray-600 hover:bg-gray-100`}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold">{nomeDisciplina}</h2>
                        {descricao && <p className="text-sm text-gray-500">{descricao}</p>}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {confirmandoExclusao ? (
                            <>
                                <span className="text-sm text-gray-600">Excluir?</span>
                                <button
                                    type="button"
                                    onClick={excluir}
                                    disabled={salvando}
                                    className={`${botaoPequeno} bg-red-600 text-white hover:bg-red-700`}
                                >
                                    Sim
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmandoExclusao(false)}
                                    className={`${botaoPequeno} text-gray-600 hover:bg-gray-100`}
                                >
                                    Não
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={abrirEdicao}
                                    className={`${botaoPequeno} text-indigo-600 hover:bg-indigo-50`}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmandoExclusao(true)}
                                    className={`${botaoPequeno} text-red-600 hover:bg-red-50`}
                                >
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {erro && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {erro}
                </p>
            )}

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
