import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import AppLayout from './components/AppLayout';
import PaginaInicial from './pages/PaginaInicial';
import Dashboard from './pages/Dashboard';
import SetupUsuario from './pages/SetupUsuario';
import Login from './pages/PaginaLogin';
import Cadastro from './pages/PaginaCadastro';
import Disciplina from './pages/Disciplina';
import EmBreve from './pages/EmBreve';
import TesteComponents from './pages/TesteComponents';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<PaginaInicial />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/disciplinas" element={<Disciplina />} />
            <Route path="/testeComponents" element={<TesteComponents titulo="TesteComponents" />} />
            <Route path="/configuracoes" element={<EmBreve titulo="Configurações" />} />
            <Route path="/sobre" element={<EmBreve titulo="Sobre" />} />
          </Route>

          <Route path="/setup-usuario" element={<SetupUsuario />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<EmBreve titulo="Recuperar senha" tela />} />

          <Route path="*" element={<EmBreve titulo="Página não encontrada" tela />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}