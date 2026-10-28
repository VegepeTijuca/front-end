import { useEffect, useState } from 'react';
import { getListaConteudos } from '../services/conteudoService';

// "versao" muda quando um conteúdo novo é criado, e isso refaz a busca
export default function ListaConteudos({ disciplinaId, versao = 0 }) {
    const [conteudos, setConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let cancelado = false;
        setCarregando(true);

        getListaConteudos(disciplinaId)
            .then((dados) => { if (!cancelado) { setConteudos(dados); setErro(null); } })
            .catch(() => { if (!cancelado) setErro('Não foi possível carregar os conteúdos.'); })
            .finally(() => { if (!cancelado) setCarregando(false); });

        return () => { cancelado = true; };
    }, [disciplinaId, versao]);

    if (carregando) return <p className="mt-3 text-sm text-gray-500">Carregando...</p>;
    if (erro) return <p role="alert" className="mt-3 text-sm text-red-600">{erro}</p>;
    if (conteudos.length === 0) return <p className="mt-3 text-sm text-gray-500">Nenhum conteúdo ainda.</p>;

    return (
        <ul className="listaConteudos mt-3 space-y-1 rounded bg-amber-100 p-3">
            {conteudos.map((c) => <li key={c.id}>{c.name}</li>)}
        </ul>
    );
}