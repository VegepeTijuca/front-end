import { useEffect, useState } from 'react';
import { atualizarConteudo, getListaConteudos, removerConteudo } from '../services/conteudoService';

const botaoPequeno = 'rounded px-2 py-1 text-xs font-semibold transition-colors disabled:opacity-60';

// "versao" muda quando um conteúdo novo é criado, e isso refaz a busca
export default function ListaConteudos({ disciplinaId, versao = 0, cor = '#004A8F' }) {
    const [conteudos, setConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // "recarga" muda depois de editar ou excluir, e isso também refaz a busca
    const [recarga, setRecarga] = useState(0);
    const [editandoId, setEditandoId] = useState(null);
    const [nomeEditado, setNomeEditado] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erroAcao, setErroAcao] = useState('');

    useEffect(() => {
        let cancelado = false;
        setCarregando(true);

        getListaConteudos(disciplinaId)
            .then((dados) => { if (!cancelado) { setConteudos(dados); setErro(null); } })
            .catch(() => { if (!cancelado) setErro('Não foi possível carregar os conteúdos.'); })
            .finally(() => { if (!cancelado) setCarregando(false); });

        return () => { cancelado = true; };
    }, [disciplinaId, versao, recarga]);

    function comecarEdicao(c) {
        setErroAcao('');
        setEditandoId(c.id);
        setNomeEditado(c.name);
    }

    async function salvar(e, c) {
        e.preventDefault();
        if (!nomeEditado.trim()) return;

        setSalvando(true);
        setErroAcao('');
        try {
            await atualizarConteudo(c.id, { name: nomeEditado.trim(), descricao: c.descricao ?? '' });
            setEditandoId(null);
            setRecarga((n) => n + 1);
        } catch {
            setErroAcao('Não foi possível salvar o conteúdo.');
        } finally {
            setSalvando(false);
        }
    }

    async function excluir(c) {
        setSalvando(true);
        setErroAcao('');
        try {
            await removerConteudo(c.id);
            setRecarga((n) => n + 1);
        } catch {
            setErroAcao('Não foi possível excluir o conteúdo.');
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) return <p className="mt-3 text-sm text-gray-500">Carregando...</p>;
    if (erro) return <p role="alert" className="mt-3 text-sm text-[#A85A00]">{erro}</p>;
    if (conteudos.length === 0) return <p className="mt-3 text-sm text-gray-500">Nenhum conteúdo ainda.</p>;

    return (
        <>
            <ul className="listaConteudos mt-3 space-y-1 rounded-lg bg-slate-50 p-3">
                {conteudos.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2">
                        {editandoId === c.id ? (
                            <form onSubmit={(e) => salvar(e, c)} className="flex flex-1 items-center gap-2">
                                <input
                                    autoFocus
                                    value={nomeEditado}
                                    onChange={(e) => setNomeEditado(e.target.value)}
                                    aria-label="Título do conteúdo"
                                    className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-[#004A8F]"
                                />
                                <button type="submit" disabled={salvando} className={`${botaoPequeno} bg-[#004A8F] text-white hover:bg-[#003B73]`}>
                                    Salvar
                                </button>
                                <button type="button" onClick={() => setEditandoId(null)} className={`${botaoPequeno} text-gray-600 hover:bg-slate-200`}>
                                    Cancelar
                                </button>
                            </form>
                        ) : (
                            <>
                                <span className="flex min-w-0 flex-1 items-start gap-2 break-words">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cor }} aria-hidden="true" />
                                    {c.name}
                                </span>
                                <span className="flex shrink-0 gap-1">
                                    <button type="button" onClick={() => comecarEdicao(c)} className={`${botaoPequeno} text-[#004A8F] hover:bg-slate-200`}>
                                        Editar
                                    </button>
                                    <button type="button" onClick={() => excluir(c)} disabled={salvando} className={`${botaoPequeno} text-slate-600 hover:bg-slate-200`}>
                                        Excluir
                                    </button>
                                </span>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {erroAcao && <p role="alert" className="mt-2 text-sm text-[#A85A00]">{erroAcao}</p>}
        </>
    );
}
