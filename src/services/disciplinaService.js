import api from './api';

const disciplinas = [];

export async function criarDisciplinas(dados) {

  console.log(dados)

  const { data } = await api.post('disciplinas', dados);

  console.log(data)

  return data

  
}

export async function getListaDisciplinas() {
    const { data } = await api.get('disciplinas');
    return data;
}