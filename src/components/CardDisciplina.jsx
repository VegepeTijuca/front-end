import { useState } from "react";
import FormConteudo from "./FormConteudo";
import ListaConteudos from "./ListaConteudos";
import { atualizarDisciplina, removerDisciplina } from "../services/disciplinaService";

// botão de texto pequeno em formato de pílula (usado em Editar, Excluir, Salvar...)
const botaoPequeno =
    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60";

// campo do modo de edição (fundo cinza claro, vira branco ao focar)
const campoEdicao =
    "block w-full rounded-xl border border-transparent bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#004A8F] focus:bg-white";

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
        // sem borda nem sombra: quem separa os itens é o filete (divide-y) da lista da página
        <div className="py-5">
            {editando ? (
                <form onSubmit={salvarEdicao} className="space-y-3">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-label="Nome da disciplina"
                        required
                        className={campoEdicao}
                    />
                    <input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        aria-label="Descrição da disciplina"
                        placeholder="Descrição (opcional)"
                        className={campoEdicao}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={salvando}
                            className={`${botaoPequeno} bg-[#00264D] text-white hover:bg-[#003B73]`}
                        >
                            {salvando ? "Salvando..." : "Salvar"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditando(false)}
                            className={`${botaoPequeno} text-slate-600 hover:bg-slate-100`}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                // flex-wrap = em telas pequenas os botões descem para a linha de baixo
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        {/* o ✦ colorido ao lado do título é a cor da disciplina (como as estrelinhas da referência) */}
                        <h2 className="flex items-center gap-2 text-lg font-bold text-[#00264D]">
                            {nomeDisciplina}
                            <span style={{ color: cor }} aria-hidden="true">✦</span>
                        </h2>
                        {descricao && <p className="mt-0.5 text-sm text-slate-500">{descricao}</p>}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1">
                        {confirmandoExclusao ? (
                            <>
                                <span className="text-sm text-slate-600">Excluir com os conteúdos?</span>
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
                                    className={`${botaoPequeno} text-slate-600 hover:bg-slate-100`}
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

            {/* botão "contornado" em pílula, igual aos "Priority" e "Repeat" da referência */}
            <button
                type="button"
                aria-expanded={formConteudoAberto}
                className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-[#00264D] transition hover:bg-slate-50 active:scale-[0.98]"
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