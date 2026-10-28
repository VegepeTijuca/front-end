import api from './api';

export async function criarConteudos({ dados }) {

  console.log(dados)

  const { data } = await api.post('conteudos', dados);

  console.log(data)
}

export async function getListaConteudos() {
    const { data } = await api.get('conteudos');
    return data;
}
