import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Search } from 'lucide-react';
import { Button, Input, Header } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './ProducerRegistration.css';

export function ProducerRegistration() {
  const navigate = useNavigate();
  const { setProducer } = useApp();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [producerData, setProducerData] = useState<{
    name: string;
    address: string;
    city: string;
    state: string;
  } | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSearch = async () => {
    if (cpf.length < 14) return;

    setLoading(true);
    // Simula chamada à API governamental
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dados simulados
    setProducerData({
      name: 'José da Silva Santos',
      address: 'Fazenda Boa Vista, Zona Rural',
      city: 'Petrolina',
      state: 'PE',
    });
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!producerData) return;

    setProducer({
      cpf: cpf.replace(/\D/g, ''),
      ...producerData,
    });

    navigate('/home');
  };

  return (
    <div className="producer-page">
      <Header title="Cadastro do Produtor" subtitle="Informe seu CPF para começar" />

      <div className="page-content">
        <div className="producer-illustration">
          <div className="illustration-icon">
            <User size={64} />
          </div>
        </div>

        <div className="producer-form">
          <div className="cpf-input-group">
            <Input
              label="CPF do Produtor"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCPFChange}
              maxLength={14}
              leftIcon={<User size={20} />}
              hint="Digite seu CPF para buscar seus dados automaticamente"
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              loading={loading}
              disabled={cpf.length < 14}
              icon={<Search size={20} />}
            >
              Buscar
            </Button>
          </div>

          {producerData && (
            <div className="producer-data">
              <h3>Dados Encontrados</h3>
              <div className="data-card">
                <div className="data-item">
                  <User size={20} />
                  <div className="data-content">
                    <span className="data-label">Nome Completo</span>
                    <span className="data-value">{producerData.name}</span>
                  </div>
                </div>
                <div className="data-item">
                  <MapPin size={20} />
                  <div className="data-content">
                    <span className="data-label">Endereço</span>
                    <span className="data-value">{producerData.address}</span>
                    <span className="data-value">
                      {producerData.city} - {producerData.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {producerData && (
        <div className="sticky-bottom">
          <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
            Confirmar e Continuar
          </Button>
        </div>
      )}
    </div>
  );
}
