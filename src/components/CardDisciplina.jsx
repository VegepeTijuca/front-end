import { useState } from "react";
import FormConteudo from "./FormConteudo";
import ListaConteudos from "./ListaConteudos";
import { atualizarDisciplina, removerDisciplina } from "../services/disciplinaService";

const botaoPequeno =
    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60";

// onAlterada: avisa a página para recarregar a lista depois de editar ou excluir
export default function CardDisciplina({ id, nomeDisciplina, descricao = "", cor = "#004A8F", onAlterada }) {
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
        <div
            style={{ borderLeftColor: cor }}
            className="rounded-lg border border-l-4 border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
            {editando ? (
                <form onSubmit={salvarEdicao} className="space-y-3">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-label="Nome da disciplina"
                        required
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-[#004A8F]"
                    />
                    <input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        aria-label="Descrição da disciplina"
                        placeholder="Descrição (opcional)"
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-[#004A8F]"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={salvando}
                            className={`${botaoPequeno} bg-[#004A8F] text-white hover:bg-[#003B73]`}
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
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#00264D]">
                            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: cor }} aria-hidden="true" />
                            {nomeDisciplina}
                        </h2>
                        {descricao && <p className="text-sm text-gray-500">{descricao}</p>}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {confirmandoExclusao ? (
                            <>
                                <span className="text-sm text-gray-600">Excluir com os conteúdos?</span>
                                <button
                                    type="button"
                                    onClick={excluir}
                                    disabled={salvando}
                                    className={`${botaoPequeno} bg-[#00264D] text-white hover:bg-[#003B73]`}
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
                                    title="Mudar nome e descrição"
                                    className={`${botaoPequeno} text-[#004A8F] hover:bg-[#004A8F]/5`}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmandoExclusao(true)}
                                    title="Apaga a disciplina e os conteúdos dela"
                                    className={`${botaoPequeno} text-slate-600 hover:bg-slate-100`}
                                >
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {erro && (
                <p role="alert" className="mt-2 text-sm text-[#A85A00]">
                    {erro}
                </p>
            )}

            <ListaConteudos disciplinaId={id} versao={versao} cor={cor} />

            <button
                className="mt-3 rounded-lg bg-[#004A8F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#003B73] active:scale-[0.98]"
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
