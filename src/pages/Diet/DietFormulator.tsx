import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Leaf, ArrowRightLeft, Check, AlertTriangle } from 'lucide-react';
import { Button, Card, Header, Select, Input, InfoCard, NutrientProgress } from '../../components/ui';
import { PartnersInline } from '../../components/ui/PartnersInline/PartnersInline';
import { useApp } from '../../context/AppContext';
import './DietFormulator.css';

const GOAL_OPTIONS = [
  { value: 'leite_15', label: 'Produção de 15L de leite/dia' },
  { value: 'leite_20', label: 'Produção de 20L de leite/dia' },
  { value: 'leite_25', label: 'Produção de 25L de leite/dia' },
  { value: 'gmd_1', label: 'Ganho de 1,0 kg/dia' },
  { value: 'gmd_1_5', label: 'Ganho de 1,5 kg/dia' },
  { value: 'mantenca', label: 'Manutenção' },
];

const AVAILABLE_RESIDUES = [
  { id: 'cervejaria', name: 'Resíduo de Cervejaria', pbPercent: 25, ndtPercent: 65 },
  { id: 'soja_casca', name: 'Casca de Soja', pbPercent: 12, ndtPercent: 77 },
  { id: 'milho', name: 'Milho Moído', pbPercent: 9, ndtPercent: 88 },
  { id: 'farelo_soja', name: 'Farelo de Soja', pbPercent: 46, ndtPercent: 84 },
  { id: 'farelo_trigo', name: 'Farelo de Trigo', pbPercent: 16, ndtPercent: 70 },
  { id: 'torta_algodao', name: 'Torta de Algodão', pbPercent: 38, ndtPercent: 72 },
];

export function DietFormulator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { animalGroups, calculateDiet } = useApp();

  const group = animalGroups.find((g) => g.id === id);

  // Filtrar metas disponíveis conforme a finalidade do grupo
  const filteredGoals = group?.purpose === 'engorda'
    ? GOAL_OPTIONS.filter(g => !g.value.startsWith('leite'))
    : GOAL_OPTIONS;

  const [goal, setGoal] = useState('');
  const [productionTarget, setProductionTarget] = useState('');
  const [selectedResidues, setSelectedResidues] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calculateDiet> | null>(null);

  if (!group) {
    return (
      <div className="diet-page">
        <Header title="Formulador de Dieta" showBack />
        <div className="page-content">
          <div className="empty-state">
            <p>Grupo de animais não encontrado</p>
            <Button variant="primary" onClick={() => navigate('/animais')}>
              Voltar para Animais
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleResidue = (residueId: string) => {
    setSelectedResidues((prev) =>
      prev.includes(residueId)
        ? prev.filter((r) => r !== residueId)
        : [...prev, residueId]
    );
    setResult(null);
  };

  const handleCalculate = () => {
    if (!goal) return;

    // Extrair o valor numérico do objetivo
    let target = 0;
    if (goal.includes('leite')) {
      target = parseInt(goal.split('_')[1]);
    } else if (goal.includes('gmd')) {
      target = parseFloat(goal.replace('gmd_', '').replace('_', '.'));
    }

    const dietResult = calculateDiet(group.id, goal, target || parseFloat(productionTarget) || 1);
    setResult(dietResult);
  };

  // Calcular progresso nutricional simulado
  const proteinProgress = result ? Math.min(95 + Math.random() * 10, 100) : 0;
  const energyProgress = result ? Math.min(92 + Math.random() * 12, 100) : 0;

  return (
    <div className="diet-page">
      <Header
        title="Formulador de Dieta"
        subtitle={group.name}
        showBack
      />

      <div className="page-content">
        {/* Informações do Grupo */}
        <Card variant="outlined" padding="md">
          <div className="group-summary">
            <span className="group-emoji">
              {group.species === 'bovino' ? '🐄' : group.species === 'ovino' ? '🐑' : group.species === 'caprino' ? '🐐' : '🐴'}
            </span>
            <div className="group-info">
              <strong>{group.quantity} cabeças</strong>
              <span>Peso médio: {group.averageWeight} kg</span>
            </div>
          </div>
        </Card>

        {/* Seleção de Meta */}
        <section className="diet-section">
          <h3>Meta de Desempenho</h3>
          <Select
            options={filteredGoals}
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value);
              setResult(null);
            }}
            placeholder="Selecione a meta de produção"
          />
          {goal === 'mantenca' && (
            <Input
              label="Meta personalizada"
              type="number"
              placeholder="Informe o valor"
              value={productionTarget}
              onChange={(e) => setProductionTarget(e.target.value)}
            />
          )}
        </section>

        {/* Ingredientes Disponíveis */}
        <section className="diet-section">
          <h3>Ingredientes Disponíveis</h3>
          <p className="section-hint">Selecione os insumos que você possui na propriedade:</p>
          <div className="residues-grid">
            {AVAILABLE_RESIDUES.map((residue) => (
              <button
                key={residue.id}
                className={`residue-item ${selectedResidues.includes(residue.id) ? 'selected' : ''}`}
                onClick={() => handleToggleResidue(residue.id)}
              >
                <span className="residue-name">{residue.name}</span>
                <span className="residue-info">
                  PB: {residue.pbPercent}% | NDT: {residue.ndtPercent}%
                </span>
                {selectedResidues.includes(residue.id) && (
                  <Check size={16} className="check-icon" />
                )}
              </button>
            ))}
          </div>
        </section>

        <Button
          variant="primary"
          fullWidth
          onClick={handleCalculate}
          disabled={!goal}
          icon={<Leaf size={20} />}
        >
          Calcular Dieta
        </Button>

        {/* Resultado */}
        {result && (
          <>
            <section className="diet-result">
              <h3>Dieta Formulada</h3>

              {/* Palma - Componente Obrigatório */}
              <Card variant="action" padding="lg">
                <div className="palma-result">
                  <div className="palma-icon">🌵</div>
                  <div className="palma-info">
                    <h4>Palma Forrageira (Base Obrigatória)</h4>
                    <div className="palma-values">
                      <div className="palma-value">
                        <span className="value-number">{result.palmaKgPerDay.toFixed(1)}</span>
                        <span className="value-unit">kg MO/animal/dia</span>
                      </div>
                      <div className="palma-divider">≈</div>
                      <div className="palma-value">
                        <span className="value-number">{result.raquetesPerDay}</span>
                        <span className="value-unit">raquetes/animal/dia</span>
                      </div>
                    </div>
                    <p className="palma-note">
                      Conversão: 1 raquete ≈ 2,5 kg de Matéria Original
                    </p>
                  </div>
                </div>
              </Card>

              {/* Suplementação */}
              <div className="supplements-list">
                <h4>Suplementação Recomendada</h4>
                {result.supplements.map((supplement, index) => (
                  <Card key={index} variant="outlined" padding="md">
                    <div className="supplement-item">
                      <div className="supplement-main">
                        <strong>{supplement.name}</strong>
                        <span className="supplement-amount">
                          {supplement.kgPerDay.toFixed(2)} kg/animal/dia
                        </span>
                      </div>
                      {supplement.alternatives.length > 0 && (
                        <div className="supplement-alternatives">
                          <div className="alternatives-header">
                            <ArrowRightLeft size={14} />
                            <span>Alternativas:</span>
                          </div>
                          {supplement.alternatives.map((alt, altIndex) => (
                            <div key={altIndex} className="alternative-item">
                              <span>{alt.name}</span>
                              <span>{alt.kgPerDay.toFixed(2)} kg/dia</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Barra de Progresso Nutricional */}
              <Card variant="default" padding="lg">
                <h4>Balanço Nutricional</h4>
                <NutrientProgress protein={proteinProgress} energy={energyProgress} />
                {(proteinProgress < 100 || energyProgress < 100) && (
                  <div className="nutrient-warning">
                    <AlertTriangle size={16} />
                    <span>Ajuste a suplementação para atingir 100% das exigências</span>
                  </div>
                )}
              </Card>

              {/* Explicação ao Produtor */}
              <Card variant="outlined" padding="md">
                <div className="producer-note">
                  <strong>💡 Nota ao Produtor:</strong>
                  <p>
                    Caso você não possua o Resíduo de Cervejaria, o Farelo de Soja pode ser usado como substituto 
                    na quantidade indicada, garantindo o mesmo balanceamento proteico da sua dieta com Palma.
                  </p>
                </div>
              </Card>

              {/* Total para o Rebanho */}
              <Card variant="elevated" padding="lg">
                <h4>Total Diário para o Rebanho ({group.quantity} cabeças)</h4>
                <div className="total-grid">
                  <InfoCard
                    icon={<Leaf size={20} />}
                    label="Palma Total"
                    value={(result.palmaKgPerDay * group.quantity).toFixed(0)}
                    unit="kg/dia"
                  />
                  <InfoCard
                    icon={<Leaf size={20} />}
                    label="Total Raquetes"
                    value={result.raquetesPerDay * group.quantity}
                    unit="unid./dia"
                  />
                </div>
              </Card>
            </section>
          </>
        )}
      </div>
      <PartnersInline />
    </div>
  );
}
