import { useEffect, useState } from 'react'

export default function ListaConteudos() {
    const [conteudos, setConteudos] = useState([])

    useEffect(() => {
        getListaConteudos()
            .then((resposta) => setConteudos(resposta.data ?? resposta))
            .catch((erro) => console.error('Erro ao carregar conteúdos:', erro))
    }, [])

    return (
        <div>
            {conteudos.map((conteudo, index) => (
                <div key={conteudo.id ?? index}>
                    {conteudo.titulo ?? conteudo.nome ?? String(conteudo)}
                </div>
            ))}
        </div>

    )
}