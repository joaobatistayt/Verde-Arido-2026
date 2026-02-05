import { useState } from 'react';
import { Calendar, Map, Users, Sun, Droplets, Leaf } from 'lucide-react';
import { Button, Card, Header, BottomNav, Select, InfoCard } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './GrazingManagement.css';

// Dados de forragem por tipo
const FORAGE_DATA: Record<string, { massPerHa: number; growthRate: number }> = {
  palma: { massPerHa: 60000, growthRate: 0 }, // Palma é o padrão fixo
};

// Novas opções de suplementação para maior adaptabilidade
const SUPPLEMENT_OPTIONS = [
  { id: 'residuo_cervejaria', name: 'Resíduo de Cervejaria' },
  { id: 'farelo_soja', name: 'Farelo de Soja' },
  { id: 'torta_algodao', name: 'Torta de Algodão' },
  { id: 'milho', name: 'Milho Moído' },
  { id: 'sal_mineral', name: 'Sal Mineral' },
];

const MINERAL_RECOMMENDATIONS: Record<string, string> = {
  buffel: 'Sal Mineral com alto teor de Fósforo (8-10%) - Capim Buffel é deficiente em P',
  brachiaria: 'Sal Mineral padrão (6-8% P) + Cobre e Zinco - Atenção à fotossensibilização',
  andropogon: 'Sal Mineral com boa relação Ca:P + Enxofre',
  capim_nativo: 'Sal Mineral completo com micronutrientes - Forragem variável',
};

export function GrazingManagement() {
  const { talhoes, animalGroups } = useApp();
  const [selectedTalhao, setSelectedTalhao] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  // Forragem fixa: Palma
  const [forageType] = useState('palma');
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [result, setResult] = useState<{
    daysInPaddock: number;
    restDays: number;
    mineralRecommendation: string;
    dailyIntake: number;
    stockingRate: number;
    supplements?: string[];
  } | null>(null);

  const talhao = talhoes.find((t) => t.id === selectedTalhao);
  const group = animalGroups.find((g) => g.id === selectedGroup);

  const talhaoOptions = talhoes.map((t) => ({
    value: t.id,
    label: `${t.name} (${t.area.toFixed(2)} ha)`,
  }));

  const groupOptions = animalGroups.map((g) => ({
    value: g.id,
    label: `${g.name} (${g.quantity} cabeças)`,
  }));

  const handleCalculate = () => {
    if (!talhao || !group) return;

    const forage = FORAGE_DATA[forageType];

    // Consumo diário de MS por animal (2.5% do peso vivo)
    const dailyIntake = group.averageWeight * 0.025;

    // Consumo total do grupo por dia (kg MS)
    const totalDailyConsumption = dailyIntake * group.quantity;

    // Massa de forragem disponível no talhão (kg MS)
    // Considera que apenas 50% pode ser consumido para não degradar o pasto
    const availableForage = (forage.massPerHa * talhao.area) * 0.5;

    // Dias de ocupação = forragem disponível / consumo diário
    const daysInPaddock = Math.floor(availableForage / totalDailyConsumption);

    // Para palma usamos descanso e lotação fixos mais conservadores
    const restDays = 30;

    // Taxa de lotação (UA/ha) - 1 UA = 450kg
    const stockingRate = (group.quantity * group.averageWeight / 450) / talhao.area;

    setResult({
      daysInPaddock: Math.min(daysInPaddock, 7),
      restDays,
      mineralRecommendation: MINERAL_RECOMMENDATIONS[forageType],
      dailyIntake,
      stockingRate,
      supplements: selectedSupplements.length ? selectedSupplements : undefined,
    });
  };

  return (
    <div className="grazing-page">
      <Header
        title="Manejo de Pastejo"
        subtitle="Rotação e suplementação em campo"
        showBack
      />

      <div className="page-content">
        <section className="grazing-form">
          <Card variant="default" padding="lg">
            <h3>Configurar Manejo</h3>
            <div className="form-fields">
              <Select
                label="Talhão/Piquete"
                options={talhaoOptions}
                value={selectedTalhao}
                onChange={(e) => {
                  setSelectedTalhao(e.target.value);
                  setResult(null);
                }}
                placeholder="Selecione o piquete"
              />

              <Select
                label="Grupo de Animais"
                options={groupOptions}
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setResult(null);
                }}
                placeholder="Selecione o grupo"
              />

              <div style={{ marginBottom: 8 }}>
                <label>Forragem: <strong>Palma (padrão)</strong></label>
                <p className="section-hint">A seleção foi simplificada — o sistema assume Palma por padrão.</p>
              </div>

              <div style={{ marginTop: 8 }}>
                <label>Suplementação (opcional)</label>
                <div className="supplement-options">
                  {SUPPLEMENT_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      className={`supplement-item ${selectedSupplements.includes(s.id) ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSupplements(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]);
                        setResult(null);
                      }}
                      type="button"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleCalculate}
                disabled={!selectedTalhao || !selectedGroup || !forageType}
                icon={<Map size={20} />}
              >
                Calcular Manejo
              </Button>
            </div>
          </Card>
        </section>

        {result && (
          <section className="grazing-results">
            <h3>Recomendações de Manejo</h3>

            <div className="results-grid">
              <InfoCard
                icon={<Calendar size={24} />}
                label="Tempo de Ocupação"
                value={result.daysInPaddock}
                unit="dias"
                highlight
              />
              <InfoCard
                icon={<Sun size={24} />}
                label="Período de Descanso"
                value={result.restDays}
                unit="dias"
              />
              <InfoCard
                icon={<Droplets size={24} />}
                label="Consumo/Animal"
                value={result.dailyIntake.toFixed(1)}
                unit="kg MS/dia"
              />
              <InfoCard
                icon={<Users size={24} />}
                label="Taxa de Lotação"
                value={result.stockingRate.toFixed(2)}
                unit="UA/ha"
              />
            </div>

            <Card variant="outlined" padding="lg">
              <div className="mineral-recommendation">
                <div className="mineral-header">
                  <Leaf size={24} />
                  <h4>Suplementação Mineral Recomendada</h4>
                </div>
                <p>{result.mineralRecommendation}</p>
                <div className="mineral-tip">
                  <strong>Consumo esperado:</strong> 60-80g/animal/dia
                </div>
              </div>
            </Card>

            {result.supplements && result.supplements.length > 0 && (
              <Card variant="outlined" padding="md">
                <h4>Suplementos Selecionados</h4>
                <ul>
                  {result.supplements.map((sId: string) => {
                    const s = SUPPLEMENT_OPTIONS.find(opt => opt.id === sId);
                    return <li key={sId}>{s ? s.name : sId}</li>;
                  })}
                </ul>
              </Card>
            )}

            <Card variant="default" padding="lg">
              <h4>Boas Práticas de Manejo</h4>
              <ul className="practices-list">
                <li>
                  <span className="practice-icon">⏰</span>
                  <span>Entre no piquete quando o capim estiver com 80-90cm</span>
                </li>
                <li>
                  <span className="practice-icon">📏</span>
                  <span>Saia quando o capim estiver com 30-40cm de altura</span>
                </li>
                <li>
                  <span className="practice-icon">💧</span>
                  <span>Garanta água limpa e fresca disponível sempre</span>
                </li>
                <li>
                  <span className="practice-icon">🧂</span>
                  <span>Mantenha o cocho de sal coberto e seco</span>
                </li>
                <li>
                  <span className="practice-icon">👀</span>
                  <span>Observe diariamente o comportamento dos animais</span>
                </li>
              </ul>
            </Card>
          </section>
        )}

        {(talhoes.length === 0 || animalGroups.length === 0) && (
          <div className="empty-grazing">
            <Map size={64} />
            <h3>Configure seu rebanho primeiro</h3>
            <p>
              {talhoes.length === 0
                ? 'Cadastre um talhão para começar'
                : 'Cadastre um grupo de animais para continuar'}
            </p>
          </div>
        )}
      </div>

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
