import { useEffect, useState } from 'react';
import { getListaDisciplinas } from '../services/disciplinaService';
import CardDisciplina from './CardDisciplina';

export default function ListaDisciplinas({ versao = 0 }) {
    const [disciplinas, setDisciplinas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let cancelado = false;
        setCarregando(true);

        getListaDisciplinas()
            .then((dados) => { if (!cancelado) { setDisciplinas(dados); setErro(null); } })
            .catch(() => { if (!cancelado) setErro('Não foi possível carregar as disciplinas.'); })
            .finally(() => { if (!cancelado) setCarregando(false); });

        return () => { cancelado = true; };
    }, [versao]);

    if (carregando) return <p className="text-sm text-gray-500">Carregando disciplinas...</p>;
    if (erro) return <p role="alert" className="text-sm text-red-600">{erro}</p>;
    if (disciplinas.length === 0) return <p className="text-sm text-gray-500">Nenhuma disciplina cadastrada.</p>;

    return (
        <div className="space-y-6">
            {disciplinas.map((d) => (
                <CardDisciplina key={d.id} id={d.id} nomeDisciplina={d.name} />
            ))}
        </div>
    );
}