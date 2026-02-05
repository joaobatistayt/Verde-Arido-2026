import { useNavigate } from 'react-router-dom';
import { Map, Plus, Leaf, Users, Calculator, BookOpen, ChevronRight, LogOut } from 'lucide-react';
import { Card, Button, BottomNav, Header } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const { producer, terrains, talhoes, animalGroups, logout } = useApp();

  const hasTerrains = terrains.length > 0;
  const hasTalhoes = talhoes.length > 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home-page">
      <Header
        title={`Olá, ${producer?.name.split(' ')[0] || 'Produtor'}!`}
        subtitle="Bem-vindo ao Verde Árido"
        rightAction={
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        }
      />

      <div className="page-content">
        {!hasTerrains ? (
          // Estado vazio - Sem terrenos cadastrados
          <div className="empty-state">
            <Card
              variant="action"
              padding="lg"
              onClick={() => navigate('/mapeamento')}
              icon={<Plus size={24} />}
              title="Cadastrar Meu Primeiro Terreno"
              subtitle="Comece mapeando sua propriedade"
            >
              <p className="empty-card-text">
                Para acessar todas as funcionalidades de manejo, primeiro cadastre um terreno utilizando arquivo CAR, desenho sobre satélite ou medição via GPS.
              </p>
              <div className="empty-card-cta">
                <span>Começar Agora</span>
                <ChevronRight size={20} />
              </div>
            </Card>

            <div className="locked-features">
              <h3>Funcionalidades Disponíveis Após o Cadastro</h3>
              <div className="locked-grid">
                <div className="locked-item">
                  <Leaf size={24} />
                  <span>Plantio de Palma</span>
                </div>
                <div className="locked-item">
                  <Users size={24} />
                  <span>Gestão de Animais</span>
                </div>
                <div className="locked-item">
                  <Calculator size={24} />
                  <span>Cálculo de Dieta</span>
                </div>
                <div className="locked-item">
                  <Map size={24} />
                  <span>Manejo de Pastejo</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard com terrenos
          <div className="dashboard">
            {/* Resumo Rápido */}
            <section className="dashboard-summary">
              <div className="summary-card">
                <div className="summary-icon bg-primary">
                  <Map size={24} />
                </div>
                <div className="summary-content">
                  <span className="summary-value">{terrains.length}</span>
                  <span className="summary-label">Terrenos</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon bg-secondary">
                  <Leaf size={24} />
                </div>
                <div className="summary-content">
                  <span className="summary-value">{talhoes.length}</span>
                  <span className="summary-label">Talhões</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon bg-accent">
                  <Users size={24} />
                </div>
                <div className="summary-content">
                  <span className="summary-value">{animalGroups.length}</span>
                  <span className="summary-label">Grupos</span>
                </div>
              </div>
            </section>

            {/* Ações Rápidas */}
            <section className="quick-actions">
              <h3>Ações Rápidas</h3>
              <div className="actions-grid">
                <Card
                  variant="outlined"
                  padding="md"
                  onClick={() => navigate('/mapeamento')}
                  icon={<Map size={20} />}
                  title="Novo Terreno"
                >
                  {null}
                </Card>
                {hasTalhoes ? (
                  <Card
                    variant="outlined"
                    padding="md"
                    onClick={() => navigate('/calculadora')}
                    icon={<Calculator size={20} />}
                    title="Calcular Plantio"
                  >
                    {null}
                  </Card>
                ) : (
                  <Card
                    variant="outlined"
                    padding="md"
                    onClick={() => navigate('/terrenos')}
                    icon={<Leaf size={20} />}
                    title="Criar Talhão"
                  >
                    {null}
                  </Card>
                )}
                <Card
                  variant="outlined"
                  padding="md"
                  onClick={() => navigate('/animais')}
                  icon={<Users size={20} />}
                  title="Gerenciar Animais"
                >
                  {null}
                </Card>
                <Card
                  variant="outlined"
                  padding="md"
                  onClick={() => navigate('/educacional')}
                  icon={<BookOpen size={20} />}
                  title="Central Educacional"
                >
                  {null}
                </Card>
              </div>
            </section>

            {/* Lista de Terrenos */}
            <section className="terrains-section">
              <div className="section-header">
                <h3>Meus Terrenos</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/terrenos')}>
                  Ver todos
                </Button>
              </div>
              <div className="terrains-list">
                {terrains.slice(0, 3).map((terrain) => {
                  const terrainTalhoes = talhoes.filter((t) => t.terrainId === terrain.id);
                  return (
                    <Card
                      key={terrain.id}
                      variant="default"
                      padding="md"
                      onClick={() => navigate(`/terrenos/${terrain.id}`)}
                    >
                      <div className="terrain-card-content">
                        <div className="terrain-info">
                          <h4>{terrain.name}</h4>
                          <span className="terrain-area">{terrain.area.toFixed(2)} hectares</span>
                        </div>
                        <div className="terrain-stats">
                          <span className="terrain-talhoes">
                            {terrainTalhoes.length} talhões
                          </span>
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        )}
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

      <BottomNav />
    </div>
  );
}
