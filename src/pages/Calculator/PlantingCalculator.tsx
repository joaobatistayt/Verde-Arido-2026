import { useState } from 'react';
import { Leaf, Ruler, ArrowRight, Grid3X3 } from 'lucide-react';
import { Button, Card, Header, BottomNav, Select, InfoCard } from '../../components/ui';
import { PartnersInline } from '../../components/ui/PartnersInline/PartnersInline';
import { useApp } from '../../context/AppContext';
import './PlantingCalculator.css';

// Dados de adubação por tipo de solo
const SOIL_FERTILIZATION: Record<string, { fertilizer: string; method: string }> = {
  arenoso: {
    fertilizer: 'NPK 10-10-10 + Matéria Orgânica (esterco bovino ou caprino). Recomenda-se aplicar 2-3 kg de esterco por metro linear de sulco.',
    method: 'Solo arenoso drena muito rápido. Faça sulcos de 30cm de profundidade. Aplique o adubo orgânico no fundo do sulco, cubra com 5cm de terra e plante a raquete deitada com 2/3 enterrada.',
  },
  argiloso: {
    fertilizer: 'Calcário para correção de pH + NPK 04-14-08. O solo argiloso retém mais nutrientes.',
    method: 'Solo argiloso retém água. Faça camalhões (leirões) de 20-30cm para evitar encharcamento. Plante no topo do camalhão com a raquete inclinada a 45°.',
  },
  siltoso: {
    fertilizer: 'NPK 10-10-10 balanceado + Micronutrientes (Zinco e Boro).',
    method: 'Solo equilibrado. Sulcos de 25cm são suficientes. Plante com a raquete levemente inclinada para facilitar a drenagem.',
  },
  humifero: {
    fertilizer: 'Menor necessidade de adubação orgânica. Aplicar apenas NPK 04-14-08 para fósforo e potássio.',
    method: 'Solo rico em matéria orgânica. Cuidado com excesso de nitrogênio. Sulcos rasos de 20cm. Boa drenagem natural.',
  },
  calcario: {
    fertilizer: 'Evitar calagem. Aplicar Gesso agrícola + NPK com maior teor de Fósforo (04-30-10).',
    method: 'Solo alcalino. Fazer sulcos normais de 25cm. Monitorar pH e aplicar gesso se necessário para melhorar a estrutura.',
  },
};

export function PlantingCalculator() {
  const { talhoes, calculatePlanting } = useApp();
  const [selectedTalhao, setSelectedTalhao] = useState('');
  const [selectedFragment, setSelectedFragment] = useState('');
  const [result, setResult] = useState<{
    totalRaquetes: number;
    distanceInLine: number;
    distanceBetweenRows: number;
  } | null>(null);

  const talhao = talhoes.find((t) => t.id === selectedTalhao);
  const fragments = talhao?.fragments || [];

  const talhaoOptions = talhoes.map((t) => ({
    value: t.id,
    label: `${t.name} (${t.area.toFixed(2)} ha)`,
  }));

  const fragmentOptions = fragments.map((f) => ({
    value: f.id,
    label: `${f.name} (${f.area.toFixed(2)} ha)`,
  }));

  const handleCalculate = () => {
    if (!selectedTalhao) return;
    const calc = calculatePlanting(selectedTalhao, selectedFragment || undefined);
    setResult(calc);
  };

  const soilType = talhao?.soilTypeManual ? 'arenoso' : (talhao?.soilType || 'arenoso');
  const soilInfo = SOIL_FERTILIZATION[soilType] || SOIL_FERTILIZATION.arenoso;

  return (
    <div className="calculator-page">
      <Header
        title="Calculadora de Plantio"
        subtitle="Palma Forrageira"
        showBack
      />

      <div className="page-content">
        <section className="calculator-form">
          <Card variant="default" padding="lg">
            <h3>Selecione a Área</h3>
            <div className="form-fields">
              <Select
                label="Talhão"
                options={talhaoOptions}
                value={selectedTalhao}
                onChange={(e) => {
                  setSelectedTalhao(e.target.value);
                  setSelectedFragment('');
                  setResult(null);
                }}
                placeholder="Selecione um talhão"
              />

              {fragments.length > 0 && (
                <Select
                  label="Fragmento (Opcional)"
                  options={fragmentOptions}
                  value={selectedFragment}
                  onChange={(e) => {
                    setSelectedFragment(e.target.value);
                    setResult(null);
                  }}
                  placeholder="Área completa do talhão"
                />
              )}

              <Button
                variant="primary"
                fullWidth
                onClick={handleCalculate}
                disabled={!selectedTalhao}
                icon={<Leaf size={20} />}
              >
                Calcular Plantio
              </Button>
            </div>
          </Card>
        </section>

        {result && (
          <>
            <section className="calculator-results">
              <h3>Resultado do Cálculo</h3>
              <div className="results-grid">
                <InfoCard
                  icon={<Leaf size={24} />}
                  label="Raquetes Necessárias"
                  value={result.totalRaquetes.toLocaleString('pt-BR')}
                  unit="unid."
                  highlight
                />
                <InfoCard
                  icon={<Ruler size={24} />}
                  label="Distância na Linha"
                  value={result.distanceInLine}
                  unit="m"
                />
                <InfoCard
                  icon={<ArrowRight size={24} />}
                  label="Entre Carreiras"
                  value={result.distanceBetweenRows}
                  unit="m"
                />
                <InfoCard
                  icon={<Grid3X3 size={24} />}
                  label="Área Selecionada"
                  value={
                    selectedFragment
                      ? fragments.find((f) => f.id === selectedFragment)?.area.toFixed(2) || '0'
                      : talhao?.area.toFixed(2) || '0'
                  }
                  unit="ha"
                />
              </div>
            </section>

            <section className="fertilization-guide">
              <Card variant="outlined" padding="lg">
                <div className="guide-header">
                  <h3>Guia de Adubação</h3>
                  <span className="soil-badge">
                    {talhao?.soilTypeManual || talhao?.soilType || 'Solo Arenoso'}
                  </span>
                </div>

                <div className="guide-content">
                  <div className="guide-section">
                    <h4>🌿 Adubo Recomendado</h4>
                    <p>{soilInfo.fertilizer}</p>
                  </div>

                  <div className="guide-section">
                    <h4>🌱 Como Plantar</h4>
                    <p>{soilInfo.method}</p>
                  </div>

                  <div className="guide-tip">
                    <strong>💡 Dica:</strong> A palma forrageira se adapta bem a solos pobres, mas responde muito bem à adubação orgânica. Priorize sempre o esterco bem curtido.
                  </div>
                </div>
              </Card>
            </section>
          </>
        )}

        {talhoes.length === 0 && (
          <div className="empty-calculator">
            <Grid3X3 size={64} />
            <h3>Nenhum talhão cadastrado</h3>
            <p>Cadastre um talhão primeiro para calcular o plantio</p>
          </div>
        )}
      </div>

      <BottomNav />
      <PartnersInline />
    </div>
  );
}
