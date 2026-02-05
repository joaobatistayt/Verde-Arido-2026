import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Map, ChevronRight, Grid3X3, Leaf } from 'lucide-react';
import { Button, Card, Header, BottomNav, Modal, Input, Select, Switch } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './Terrains.css';

const SOIL_TYPES = [
  { value: 'arenoso', label: 'Solo Arenoso' },
  { value: 'argiloso', label: 'Solo Argiloso' },
  { value: 'siltoso', label: 'Solo Siltoso' },
  { value: 'humifero', label: 'Solo Humífero' },
  { value: 'calcario', label: 'Solo Calcário' },
];

export function Terrains() {
  const navigate = useNavigate();
  const { terrains, talhoes, addTalhao, updateTalhao, addFragment } = useApp();
  
  const [showTalhaoModal, setShowTalhaoModal] = useState(false);
  const [showFragmentModal, setShowFragmentModal] = useState(false);
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);
  const [selectedTalhao, setSelectedTalhao] = useState<string | null>(null);
  
  const [talhaoName, setTalhaoName] = useState('');
  const [talhaoArea, setTalhaoArea] = useState('');
  const [, setTalhaoError] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [useManualSoil, setUseManualSoil] = useState(false);
  const [manualSoilType, setManualSoilType] = useState('');
  
  const [fragmentName, setFragmentName] = useState('');
  const [fragmentArea, setFragmentArea] = useState('');

  const handleCreateTalhao = (terrainId: string) => {
    setSelectedTerrain(terrainId);
    setShowTalhaoModal(true);
  };

  const handleSaveTalhao = () => {
    if (!selectedTerrain || !talhaoName || !talhaoArea) return;

    // Validação: evitar nomes duplicados no mesmo terreno
    const existing = talhoes.find(t => t.terrainId === selectedTerrain && t.name === talhaoName);
    if (existing) {
      setTalhaoError('Já existe um talhão com esse nome neste terreno.');
      return;
    }

    addTalhao({
      terrainId: selectedTerrain,
      name: talhaoName,
      area: parseFloat(talhaoArea),
      soilType: selectedSoilType,
      soilTypeManual: useManualSoil ? manualSoilType : undefined,
      isPlanted: false,
    });

    // Reset form
    setTalhaoName('');
    setTalhaoArea('');
    setSelectedSoilType('');
    setUseManualSoil(false);
    setManualSoilType('');
    setShowTalhaoModal(false);
    
    // Mostrar modal de fluxo
    setShowFlowModal(true);
  };

  const handleCreateFragment = (talhaoId: string) => {
    setSelectedTalhao(talhaoId);
    setShowFragmentModal(true);
  };

  const handleSaveFragment = () => {
    if (!selectedTalhao || !fragmentName || !fragmentArea) return;

    addFragment(selectedTalhao, {
      name: fragmentName,
      area: parseFloat(fragmentArea),
      status: 'available',
    });

    setFragmentName('');
    setFragmentArea('');
    setShowFragmentModal(false);
  };

  const handleFlowAnswer = (isPlanted: boolean) => {
    const lastTalhao = talhoes[talhoes.length - 1];
    if (lastTalhao) {
      updateTalhao(lastTalhao.id, { isPlanted });
    }
    setShowFlowModal(false);
    
    if (isPlanted) {
      navigate('/calculadora');
    }
  };

  return (
    <div className="terrains-page">
      <Header
        title="Meus Terrenos"
        subtitle={`${terrains.length} terrenos cadastrados`}
        showBack
        rightAction={
          <Button variant="ghost" size="sm" onClick={() => navigate('/mapeamento')}>
            <Plus size={20} />
          </Button>
        }
      />

      <div className="page-content">
        {terrains.length === 0 ? (
          <div className="empty-terrains">
            <Map size={64} />
            <h3>Nenhum terreno cadastrado</h3>
            <p>Comece cadastrando seu primeiro terreno</p>
            <Button
              variant="primary"
              onClick={() => navigate('/mapeamento')}
              icon={<Plus size={20} />}
            >
              Cadastrar Terreno
            </Button>
          </div>
        ) : (
          <div className="terrains-list">
            {terrains.map((terrain) => {
              const terrainTalhoes = talhoes.filter((t) => t.terrainId === terrain.id);
              
              return (
                <div key={terrain.id} className="terrain-item">
                  <Card variant="default" padding="lg">
                    <div className="terrain-header">
                      <div className="terrain-info">
                        <h3>{terrain.name}</h3>
                        <span className="terrain-meta">
                          {terrain.area.toFixed(2)} ha • {terrain.mappingMethod.toUpperCase()}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateTalhao(terrain.id)}
                        icon={<Plus size={16} />}
                      >
                        Talhão
                      </Button>
                    </div>

                    {terrainTalhoes.length > 0 && (
                      <div className="talhoes-list">
                        {terrainTalhoes.map((talhao) => (
                          <div key={talhao.id} className="talhao-item">
                            <div className="talhao-info">
                              <Grid3X3 size={20} />
                              <div>
                                <span className="talhao-name">{talhao.name}</span>
                                <span className="talhao-meta">
                                  {talhao.area.toFixed(2)} ha • {talhao.soilTypeManual || SOIL_TYPES.find(s => s.value === talhao.soilType)?.label || 'Solo não definido'}
                                </span>
                              </div>
                            </div>
                            <div className="talhao-actions">
                              {talhao.isPlanted && (
                                <span className="planted-badge">
                                  <Leaf size={14} /> Plantado
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCreateFragment(talhao.id)}
                              >
                                <Plus size={16} />
                              </Button>
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Cadastro de Talhão */}
      <Modal
        isOpen={showTalhaoModal}
        onClose={() => setShowTalhaoModal(false)}
        title="Cadastrar Talhão"
        size="lg"
      >
        <div className="modal-form">
          <Input
            label="Nome do Talhão"
            placeholder="Ex: Talhão Norte"
            value={talhaoName}
            onChange={(e) => setTalhaoName(e.target.value)}
          />
          <Input
            label="Área (hectares)"
            type="number"
            placeholder="0.00"
            value={talhaoArea}
            onChange={(e) => setTalhaoArea(e.target.value)}
          />
          <Select
            label="Tipo de Solo (Sugestão da API)"
            options={SOIL_TYPES}
            value={selectedSoilType}
            onChange={(e) => setSelectedSoilType(e.target.value)}
            placeholder="Selecione o tipo de solo"
          />
          <Switch
            checked={useManualSoil}
            onChange={setUseManualSoil}
            label="Conhecimento do Produtor"
            description="Deseja informar o tipo de solo manualmente?"
          />
          {useManualSoil && (
            <Input
              label="Tipo de Solo (Manual)"
              placeholder="Descreva o tipo de solo"
              value={manualSoilType}
              onChange={(e) => setManualSoilType(e.target.value)}
            />
          )}
          <Button
            variant="primary"
            fullWidth
            onClick={handleSaveTalhao}
            disabled={!talhaoName || !talhaoArea}
          >
            Salvar Talhão
          </Button>
        </div>
      </Modal>

      {/* Modal de Fragmento */}
      <Modal
        isOpen={showFragmentModal}
        onClose={() => setShowFragmentModal(false)}
        title="Adicionar Fragmento"
        size="md"
      >
        <div className="modal-form">
          <Input
            label="Nome do Fragmento"
            placeholder="Ex: Área A"
            value={fragmentName}
            onChange={(e) => setFragmentName(e.target.value)}
          />
          <Input
            label="Área (hectares)"
            type="number"
            placeholder="0.00"
            value={fragmentArea}
            onChange={(e) => setFragmentArea(e.target.value)}
          />
          <Button
            variant="primary"
            fullWidth
            onClick={handleSaveFragment}
            disabled={!fragmentName || !fragmentArea}
          >
            Salvar Fragmento
          </Button>
        </div>
      </Modal>

      {/* Modal Direcionador de Fluxo */}
      <Modal
        isOpen={showFlowModal}
        onClose={() => setShowFlowModal(false)}
        title="O terreno já está plantado?"
        size="sm"
      >
        <div className="flow-modal">
          <p>Se o terreno já possui palma plantada, você será direcionado para a gestão de plantio.</p>
          <div className="flow-buttons">
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleFlowAnswer(true)}
            >
              Sim, já está plantado
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleFlowAnswer(false)}
            >
              Não, ainda vou plantar
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
      <section className="partners-teaser">
        <h3>Parceiros e Cursos</h3>
        <p>Ver todas as empresas que oferecem cursos e consultoria.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Card
            variant="outlined"
            padding="md"
            onClick={() => (window.location.href = '/parceiros?services=consultoria,cursos')}
            className="partners-redirect-card"
          >
            <div style={{ minWidth: 260 }}>
              <strong>Empresas de Cursos & Consultoria</strong>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
                Clique para ver todas as empresas que oferecem cursos ou consultoria.
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
