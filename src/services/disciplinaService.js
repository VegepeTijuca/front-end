import api from './api';

const disciplinas = [];

export async function criarDisciplinas(dados) {

  console.log(dados)

  const { data } = await api.post('disciplinas', dados);

  console.log(data)

  
}

export async function getListaConteudos() {
    const { data } = await api.get('conteudos');
    return data;
}