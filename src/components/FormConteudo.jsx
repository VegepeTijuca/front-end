import { useId, useState } from 'react';
import { criarConteudos } from '../services/conteudoService';

const campoClasses =
    'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

export default function FormConteudo() {
    const idBase = useId();
    const [dadosConteudo, setDadosConteudo] = useState({
        name: '',
        descricao: '',
    });
    const [enviando, setEnviando] = useState(false);
    const [status, setStatus] = useState(null); // null | { tipo: 'sucesso' | 'erro', texto }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosConteudo((antigos) => ({ ...antigos, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setStatus(null);

        try {
            await criarConteudos(dadosConteudo);
            setDadosConteudo({ name: '', descricao: '', dataConclusao: '' });
            setStatus({ tipo: 'sucesso', texto: 'Conteúdo criado com sucesso!' });
        } catch (err) {
            const erro = err.response?.data?.error;

            setStatus({
                tipo: 'erro',
                texto:
                    (typeof erro === 'string' ? erro : erro?.message) ??
                    'Não foi possível criar o conteúdo.',
            });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form
            className="mx-auto w-full max-w-xl space-y-6 rounded-xl bg-white p-6 shadow-md sm:p-8"
            onSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-semibold text-gray-900">Criar conteúdo</h2>

            <div className="space-y-2">
                <label htmlFor={`${idBase}-name`} className="block text-sm font-medium text-gray-700">
                    Insira o título do conteúdo
                </label>
                <input
                    id={`${idBase}-name`}
                    type="text"
                    name="name"
                    value={dadosConteudo.name}
                    onChange={handleChange}
                    required
                    className={campoClasses}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor={`${idBase}-descricao`} className="block text-sm font-medium text-gray-700">
                    Insira a descrição do conteúdo
                </label>
                <input
                    id={`${idBase}-descricao`}
                    type="text"
                    name="descricao"
                    value={dadosConteudo.descricao}
                    onChange={handleChange}
                    className={campoClasses}
                />
            </div>

            {status && (
                <p
                    role={status.tipo === 'erro' ? 'alert' : 'status'}
                    className={`text-sm ${status.tipo === 'erro' ? 'text-red-600' : 'text-green-700'}`}
                >
                    {status.texto}
                </p>
            )}

            <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {enviando ? 'Criando...' : 'Criar conteúdo'}
            </button>
        </form>
    );
}
