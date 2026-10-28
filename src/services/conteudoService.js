import api from './api';

export async function criarConteudos(dados) {

  console.log(dados)

  const { data } = await api.post('conteudos', dados);

  console.log(data)
}
