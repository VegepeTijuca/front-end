import { useEffect, useState } from 'react';

export default function FormTimer({
	aberto = true,
	onFechar = () => {},
	listarTimers,
	criarTimer,
	removerTimer,
	definirTimerPadrao,
}) {
	const [timers, setTimers] = useState([]);
	const [erro, setErro] = useState('');
	const [nome, setNome] = useState('');
	const [foco, setFoco] = useState('25');
	const [pausa, setPausa] = useState('5');
	const [saindo, setSaindo] = useState(false);
	const [visivel, setVisivel] = useState(aberto);

	useEffect(() => {
		if (aberto) {
			setSaindo(false);
			setVisivel(true);
			return undefined;
		}

		setSaindo(true);
		const temporizador = setTimeout(() => setVisivel(false), 180);
		return () => clearTimeout(temporizador);
	}, [aberto]);

	useEffect(() => {
		if (!visivel || !listarTimers) return undefined;
		let cancelado = false;
		listarTimers()
			.then((lista) => !cancelado && setTimers(lista))
			.catch(() => !cancelado && setErro('Não foi possível carregar seus timers.'));
		return () => {
			cancelado = true;
		};
	}, [visivel, listarTimers]);

	useEffect(() => {
		if (!visivel) return undefined;
		function fecharComEscape(evento) {
			if (evento.key === 'Escape') onFechar();
		}
		window.addEventListener('keydown', fecharComEscape);
		return () => window.removeEventListener('keydown', fecharComEscape);
	}, [visivel, onFechar]);

	if (!visivel && !aberto) return null;

	async function adicionar(dados) {
		setErro('');
		try {
			const novo = await criarTimer(dados);
			setTimers((lista) => [...lista, novo]);
			return true;
		} catch {
			setErro('Não foi possível salvar o timer.');
			return false;
		}
	}

	async function remover(id) {
		const anterior = timers;
		setTimers((lista) => lista.filter((timer) => timer.id !== id));
		try {
			await removerTimer(id);
		} catch {
			setTimers(anterior);
			setErro('Não foi possível remover o timer.');
		}
	}

	async function tornarPadrao(id) {
		const anterior = timers;
		setTimers((lista) => lista.map((timer) => ({ ...timer, padrao: timer.id === id })));
		try {
			await definirTimerPadrao(id);
		} catch {
			setTimers(anterior);
			setErro('Não foi possível mudar o timer padrão.');
		}
	}

	async function criar(evento) {
		evento.preventEventDefault?.();
		evento.preventDefault();
		const minutosFoco = Number(foco);
		const minutosPausa = Number(pausa || 0);

		if (!nome.trim() || minutosFoco < 1 || minutosPausa < 0) {
			setErro('Dê um nome e informe os minutos de foco.');
			return;
		}

		if (await adicionar({ nome: nome.trim(), foco: minutosFoco, pausa: minutosPausa })) {
			setNome('');
		}
	}

	const campo = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#004A8F] focus:bg-white focus:ring-4 focus:ring-[#004A8F]/10';
	const botaoPrimario = 'rounded-xl bg-[#004A8F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00396f] active:translate-y-px';

	return (
		<section
			role="dialog"
			aria-modal="true"
			aria-labelledby="form-timer-titulo"
			className={`w-full max-w-3xl rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.20)] ring-1 ring-slate-200 transition-opacity duration-180 sm:p-6 ${saindo ? 'opacity-0' : 'opacity-100'}`}
		>
			<header className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#004A8F]">Agenda</p>
					<h2 id="form-timer-titulo" className="mt-1 text-2xl font-bold text-slate-800">Configurar timers</h2>
				</div>
				<button type="button" onClick={onFechar} aria-label="Fechar" className="grid size-10 cursor-pointer place-items-center rounded-full text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">×</button>
			</header>

			<div className="space-y-6">
				<section>
					<h3 className="text-base font-semibold text-slate-800">Seus timers</h3>
					<p className="mt-1 text-sm text-slate-500">Aparecem como atalhos no timer da Visão Geral e o padrão começa selecionado ao abrir o app.</p>

					{timers.length === 0 ? (
						<p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">Você ainda não salvou nenhum timer. Crie o seu abaixo.</p>
					) : (
						<ul className="mt-4 space-y-3">
							{timers.map((timer) => (
								<li key={timer.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
									<div className="min-w-0 flex-1">
										<p className="font-semibold text-slate-800">
											{timer.nome}
											{timer.padrao && <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6b5400]">padrão</span>}
										</p>
										<p className="text-sm text-slate-500">{timer.foco} min de foco{timer.pausa > 0 ? `, ${timer.pausa} min de pausa` : ', sem pausa'}</p>
									</div>
									<div className="ml-auto flex items-center gap-3">
										{!timer.padrao && <button type="button" onClick={() => tornarPadrao(timer.id)} className="cursor-pointer text-sm font-semibold text-[#004A8F] hover:underline">Tornar padrão</button>}
										<button type="button" onClick={() => remover(timer.id)} className="cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-800">Remover</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<form onSubmit={criar} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<h3 className="text-base font-semibold text-slate-800">Criar o seu</h3>
					<div className="mt-3 grid gap-3 sm:grid-cols-[1fr_110px_110px_auto]">
						<input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome (ex.: Revisão)" aria-label="Nome do timer" className={`${campo} cursor-text`} />
						<input type="number" min="1" value={foco} onChange={(event) => setFoco(event.target.value)} aria-label="Minutos de foco" title="Minutos de foco" className={`${campo} cursor-text`} />
						<input type="number" min="0" value={pausa} onChange={(event) => setPausa(event.target.value)} aria-label="Minutos de pausa" title="Minutos de pausa" className={`${campo} cursor-text`} />
						<button type="submit" className={`${botaoPrimario} cursor-pointer`}>Salvar</button>
					</div>
					<p className="mt-2 text-xs text-slate-500">Foco e pausa em minutos. Com pausa zero, não aparece o botão de pausa no fim.</p>
				</form>

				{erro && <p role="alert" className="rounded-xl border border-[#F3D9A6] bg-[#FFF7E6] px-3 py-2 text-sm text-[#A85A00]">{erro}</p>}
			</div>
		</section>
	);
}