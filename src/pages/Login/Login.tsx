import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo.svg';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    // TODO: integrar com API Google (OAuth) — atualmente é um stub
    login();
    navigate('/cadastro-produtor');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Por favor informe e-mail e senha.');
      return;
    }
    // Aqui podemos validar estrutura do e-mail ou chamar API real.
    login();
    navigate('/cadastro-produtor');
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay" />
      </div>

      <div className="login-content">
        <div className="login-logo">
          <div className="logo-icon">
            <img src={logo} alt="Verde Árido" style={{ width: 72, height: 72 }} />
          </div>
          <h1 className="logo-title">Verde Árido</h1>
          <p className="logo-subtitle">Gestão Inteligente de Palma Forrageira</p>
        </div>

        <div className="login-actions">
          <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc' }}
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <Button variant="primary" size="lg" fullWidth type="submit">
              Entrar
            </Button>
          </form>

          <div style={{ marginTop: 12 }}>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleGoogleLogin}
            >
              Entrar com Google
            </Button>
          </div>

          <p className="login-terms">
            Ao entrar, você concorda com nossos{' '}
            <a href="#termos">Termos de Uso</a> e{' '}
            <a href="#privacidade">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}
