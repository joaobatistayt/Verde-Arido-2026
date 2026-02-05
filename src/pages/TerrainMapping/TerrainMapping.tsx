import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Map, AlertCircle } from 'lucide-react';
import { Button, Input, Card, Header } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './TerrainMapping.css';

type MappingMethod = 'car' | 'manual';

export function TerrainMapping() {
  const navigate = useNavigate();
  const { addTerrain, terrains } = useApp();
  
  const [step, setStep] = useState<'method' | 'details' | 'mapping'>('method');
  const [method, setMethod] = useState<MappingMethod | null>(null);
  const [terrainName, setTerrainName] = useState('');
  const [carArea, setCarArea] = useState('');
  const [plantingArea, setPlantingArea] = useState('');
  const [error, setError] = useState('');
  
  const [carNumber, setCarNumber] = useState('');
  const [protocolNumber, setProtocolNumber] = useState('');

  const methods = [
    {
      id: 'car' as const,
      icon: FileText,
      title: 'Pesquisar por CAR / Protocolo',
      description: 'Informe o número do CAR ou do Protocolo para obter a área',
    },
    {
      id: 'manual' as const,
      icon: Map,
      title: 'Adicionar sem CAR',
      description: 'Inserir manualmente o tamanho do terreno (sem geolocalização)',
    },
  ];

  const validateAreas = () => {
    const carAreaNum = parseFloat(carArea);
    const plantingAreaNum = parseFloat(plantingArea);

    if (plantingAreaNum > carAreaNum) {
      setError('A área de plantio não pode ser maior que a área do CAR');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 'method' && method) {
      setStep('details');
    } else if (step === 'details') {
      if (!terrainName) return;
      if (method === 'car' && !carArea) return;
      if (method === 'manual' && !plantingArea) return;
      if (method === 'car' && !validateAreas()) return;
      setStep('mapping');
    }
  };

  // For CAR/protocol lookup we simulate an API call to fetch area
  const fetchCarInfo = async () => {
    setError('');
    if (!carNumber && !protocolNumber) {
      setError('Informe número do CAR ou do Protocolo para consulta');
      return;
    }
    // Simulação: derivar área a partir do número informado (stub)
    const seed = (carNumber + protocolNumber).replace(/\D/g, '');
    const area = seed ? ((parseInt(seed.slice(-4)) % 100) + 5) : 25;
    // definir com duas casas
    setCarArea(area.toFixed(2));
  };

  const handleSave = () => {
    // Validação: evitar nomes duplicados para o mesmo usuário
    if (terrains.some(t => t.name === terrainName)) {
      setError('Já existe um terreno com esse nome. Escolha outro nome.');
      return;
    }
    addTerrain({
      name: terrainName,
      area: parseFloat(plantingArea),
      carArea: carArea ? parseFloat(carArea) : undefined,
      mappingMethod: method === 'manual' ? 'manual' : 'car',
    });
    navigate('/home');
  };

  return (
    <div className="mapping-page">
      <Header
        title="Mapeamento de Terreno"
        subtitle={
          step === 'method'
            ? 'Escolha como mapear'
            : step === 'details'
            ? 'Informações do terreno'
            : 'Finalize o mapeamento'
        }
        showBack
      />

      <div className="page-content">
        {step === 'method' && (
          <div className="method-selection">
            <p className="selection-intro">
              Selecione o método de mapeamento que melhor se adequa às suas necessidades:
            </p>
            <div className="methods-grid">
              {methods.map((m) => (
                <Card
                  key={m.id}
                  variant={method === m.id ? 'elevated' : 'outlined'}
                  padding="md"
                  onClick={() => setMethod(m.id)}
                  className={method === m.id ? 'selected' : ''}
                >
                  <div className="method-card-content">
                    <div className={`method-icon ${method === m.id ? 'active' : ''}`}>
                      <m.icon size={24} />
                    </div>
                    <div className="method-text">
                      <h4>{m.title}</h4>
                      <p>{m.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="terrain-details">
            <Input
              label="Nome do Terreno"
              placeholder="Ex: Fazenda Boa Vista"
              value={terrainName}
              onChange={(e) => setTerrainName(e.target.value)}
              leftIcon={<Map size={20} />}
            />

            <Input
              label="Área Total do CAR (hectares)"
              type="number"
              placeholder="0.00"
              value={carArea}
              onChange={(e) => setCarArea(e.target.value)}
              hint="Área registrada no Cadastro Ambiental Rural"
            />

            <Input
              label="Área de Plantio (hectares)"
              type="number"
              placeholder="0.00"
              value={plantingArea}
              onChange={(e) => {
                setPlantingArea(e.target.value);
                setError('');
              }}
              error={error}
              hint="Área efetiva para plantio (deve ser ≤ área do CAR)"
            />

            {error && (
              <div className="area-warning">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {step === 'mapping' && (
          <div className="mapping-view">
            <div className="map-placeholder">
              <div className="map-overlay">
                {method === 'car' && (
                  <div className="car-import">
                    <FileText size={48} />
                    <p>Consulta por CAR / Protocolo</p>
                    <div style={{ marginTop: 8 }}>
                      <Input
                        label="Número do CAR"
                        placeholder="Ex: 123456789"
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                      />
                      <Input
                        label="Número do Protocolo"
                        placeholder="Ex: PROT-2024-0001"
                        value={protocolNumber}
                        onChange={(e) => setProtocolNumber(e.target.value)}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Button variant="outline" onClick={fetchCarInfo}>Consultar Área</Button>
                      </div>
                      {carArea && (
                        <div style={{ marginTop: 8 }}>
                          <strong>Área obtida:</strong> {carArea} ha
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {method === 'manual' && (
                  <div className="manual-entry">
                    <Map size={48} />
                    <p>Entrada Manual</p>
                    <span>A geolocalização não estará disponível para terrenos adicionados manualmente.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="terrain-summary">
              <h3>Resumo do Terreno</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="label">Nome:</span>
                  <span className="value">{terrainName}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Área CAR:</span>
                  <span className="value">{carArea || '-'} ha</span>
                </div>
                <div className="summary-item">
                  <span className="label">Área de Plantio:</span>
                  <span className="value">{plantingArea} ha</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky-bottom">
        {step === 'method' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            disabled={!method}
          >
            Continuar
          </Button>
        )}
        {step === 'details' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            disabled={!terrainName || (method === 'car' ? !carArea : !plantingArea)}
          >
            Próximo
          </Button>
        )}
        {step === 'mapping' && (
          <>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSave}
            >
              Salvar Terreno
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
