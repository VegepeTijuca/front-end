import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import AppLayout from './components/AppLayout';
import RotaPrivada from './components/RotaPrivada';
import PaginaInicial from './pages/PaginaInicial';
import Dashboard from './pages/Dashboard';
import SetupUsuario from './pages/SetupUsuario';
import Login from './pages/PaginaLogin';
import Cadastro from './pages/PaginaCadastro';
import Disciplina from './pages/Disciplina';
import EmBreve from './pages/EmBreve';
import Configuracoes from './pages/Configuracoes';
import Sobre from './pages/Sobre';
import RecuperarSenha from './pages/RecuperarSenha';
import TesteComponents from './pages/TesteComponents';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* públicas: landing page, login e cadastro */}
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />

          {/* só para quem está logado */}
          <Route element={<RotaPrivada />}>
            <Route path="/setup-usuario" element={<SetupUsuario />} />

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/disciplinas" element={<Disciplina />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/sobre" element={<Sobre />} />

              {/* página de testes: só existe em desenvolvimento */}
              {import.meta.env.DEV && (
                <Route path="/testeComponents" element={<TesteComponents />} />
              )}
            </Route>
          </Route>

          <Route path="*" element={<EmBreve titulo="Página não encontrada" tela />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
