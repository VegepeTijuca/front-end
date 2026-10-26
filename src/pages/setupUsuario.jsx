import { Navigate } from 'react-router-dom';
import FormSetupUsuario from '../components/FormSetupUsuario';
import useAuth from '../hooks/useAuth';

// Em desenvolvimento a página abre direto (link "Setup do usuário" na nav).
// Mude para false para testar a proteção: só chega aqui quem acabou de se cadastrar.
const PULAR_GUARDA_EM_DEV = true;

export default function SetupUsuario() {
    const { autenticado } = useAuth();

    if (!autenticado && !(import.meta.env.DEV && PULAR_GUARDA_EM_DEV)) {
        return <Navigate to="/cadastro" replace />;
    }

    return (
        <div className="grid min-h-screen place-items-center bg-[#F4F6FA] p-6">
            <FormSetupUsuario />
        </div>
    );
}
