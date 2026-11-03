import { useState } from 'react';
import { Link } from 'react-router-dom';

// ATENÇÃO: ainda não existe rota de recuperação de senha na API.
// Por enquanto a tela só simula o envio (texto fixo). Quando o backend tiver a rota,
// chame-a dentro de enviar() no lugar da linha marcada.
export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // <- troque pela chamada à API
    setEnviando(false);
    setEnviado(true);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#F4F6FA] p-6 font-['Nunito',sans-serif]">
      <div className="w-full max-w-md rounded-4xl bg-white p-8 shadow-xl shadow-slate-900/10 sm:p-10">
        <p className="text-3xl font-semibold tracking-tight text-[#004A8F]">clʌss.me</p>

        {enviado ? (
          <div className="mt-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Verifique seu e-mail</h1>
            <p className="mt-3 text-slate-500">
              Se existir uma conta com <strong className="text-slate-700">{email}</strong>, enviaremos as
              instruções para criar uma nova senha.
            </p>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-8 space-y-5">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Recuperar senha</h1>
              <p className="mt-2 text-sm text-slate-500">
                Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:bg-white focus:ring-4 focus:ring-[#004A8F]/15"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-2xl bg-[#004A8F] px-5 py-3.5 font-semibold text-white transition hover:bg-[#003B73] disabled:opacity-60"
            >
              {enviando ? 'Enviando...' : 'Enviar link'}
            </button>
          </form>
        )}

        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-[#004A8F] hover:underline">
          ← Voltar para o login
        </Link>
      </div>
    </div>
  );
}
