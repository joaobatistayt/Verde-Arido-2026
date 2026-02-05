import { useNavigate } from 'react-router-dom';
import { Leaf, Users, Map, ChevronRight } from 'lucide-react';
import { Card, Header, BottomNav } from '../../components/ui';
import './CalculatorHub.css';

export function CalculatorHub() {
  const navigate = useNavigate();

  const calculators = [
    {
      id: 'plantio',
      title: 'Calculadora de Plantio',
      description: 'Calcule a quantidade de raquetes necessárias para sua área',
      icon: Leaf,
      color: '#2C8B57',
      path: '/calculadora/plantio',
    },
    {
      id: 'dieta',
      title: 'Formulador de Dieta',
      description: 'Monte a dieta ideal com base na palma forrageira',
      icon: Users,
      color: '#E77E21',
      path: '/animais',
    },
    {
      id: 'pastejo',
      title: 'Manejo de Pastejo',
      description: 'Calcule tempo de ocupação e suplementação mineral',
      icon: Map,
      color: '#5C4033',
      path: '/calculadora/pastejo',
    },
  ];

  return (
    <div className="hub-page">
      <Header
        title="Calculadoras"
        subtitle="Ferramentas de gestão"
        showBack
      />

      <div className="page-content">
        <div className="calculators-list">
          {calculators.map((calc) => (
            <Card
              key={calc.id}
              variant="default"
              padding="lg"
              onClick={() => navigate(calc.path)}
            >
              <div className="calculator-card">
                <div
                  className="calculator-icon"
                  style={{ backgroundColor: calc.color }}
                >
                  <calc.icon size={28} />
                </div>
                <div className="calculator-info">
                  <h4>{calc.title}</h4>
                  <p>{calc.description}</p>
                </div>
                <ChevronRight size={24} className="calculator-chevron" />
              </div>
            </Card>
          ))}
        </div>

        <div className="info-box">
          <div className="info-header">
            <span>💡</span>
            <strong>Dica</strong>
          </div>
          <p>
            Todos os cálculos são baseados em recomendações técnicas e na
            conversão padrão de 1 raquete ≈ 2,5 kg de Matéria Original.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
