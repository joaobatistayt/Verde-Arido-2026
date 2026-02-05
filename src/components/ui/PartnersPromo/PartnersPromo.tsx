import { ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PartnersPromo.css';

export function PartnersPromo() {
  const navigate = useNavigate();
  const location = useLocation();

  // Não mostrar o botão flutuante na tela de login (`/`) nem na tela de cadastro do produtor (`/cadastro-produtor`)
  if (location.pathname === '/' || location.pathname === '/cadastro-produtor') return null;

  return (
    <div className="partners-promo" onClick={() => navigate('/educacional')}>
      <div className="promo-text">Cursos & Consultoria — Veja parcerias</div>
      <ExternalLink size={16} />
    </div>
  );
}
