import api from './api';

const conteudos = [];

export async function criarConteudos({ dados }) {

  console.log(dados)

  const { data } = await api.post('conteudos', dados);

  console.log(data)
}
