import { criarDisciplinas, getListaDisciplinas } from './disciplinaService';
import { criarConteudos } from './conteudoService';

// Presets definidos pelas preferências do usuário (data/presets.js): hoje, os pacotes de matérias.
// Não têm rota própria: usam as mesmas rotas da tela Disciplinas.
// (O timer não é um preset: ver timerService.js.)

// Cria no app as disciplinas e conteúdos de um pacote.
// Disciplinas que já existem (mesmo nome) são puladas. Devolve quantas foram criadas.
export async function adicionarPacote(pacote) {
  const existentes = (await getListaDisciplinas()).map((d) => d.name.trim().toLowerCase());
  let criadas = 0;

  for (const materia of pacote.materias) {
    if (existentes.includes(materia.nome.toLowerCase())) continue;
    const disciplina = await criarDisciplinas({ name: materia.nome, descricao: '' });
    const id = disciplina.id ?? disciplina._id;
    for (const conteudo of materia.conteudos) {
      await criarConteudos({ name: conteudo, descricao: '', disciplinaId: id });
    }
    criadas += 1;
  }
  return criadas;
}
