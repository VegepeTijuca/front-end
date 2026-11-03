import Calendario from './Calendario';
import CabecalhoPagina from '../components/CabecalhoPagina';

// Página /calendario: o calendário em versão expandida, com painel de próximos eventos.
export default function CalendarioPagina() {
    return (
        <main className="px-6 py-8 md:px-12">
            <CabecalhoPagina
                titulo="Calendário"
                descricao="Clique em um dia para criar um evento e arraste para mudar de data."
                ajuda="calendario"
            />

            <Calendario expandido />
        </main>
    );
}
