import { useState } from 'react';
import { Play, ChevronRight, Leaf, Shovel, Scissors, Clock, CheckCircle } from 'lucide-react';
import { Card, Header, BottomNav, Modal, Button } from '../../components/ui';
import './Educational.css';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: 'adubar' | 'plantar' | 'colher';
}

const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Como Adubar a Palma Forrageira',
    description: 'Aprenda as técnicas corretas de adubação para maximizar a produção',
    duration: '12:45',
    thumbnail: '🌿',
    category: 'adubar',
  },
  {
    id: '2',
    title: 'Adubação Orgânica com Esterco',
    description: 'Utilizando esterco bovino e caprino na cultura da palma',
    duration: '08:30',
    thumbnail: '🌾',
    category: 'adubar',
  },
  {
    id: '3',
    title: 'Plantio Correto da Palma',
    description: 'Método passo a passo para plantar suas palmas',
    duration: '15:20',
    thumbnail: '🌱',
    category: 'plantar',
  },
  {
    id: '4',
    title: 'Espaçamento Ideal para Palma',
    description: 'Entenda a importância do espaçamento correto',
    duration: '10:15',
    thumbnail: '📏',
    category: 'plantar',
  },
  {
    id: '5',
    title: 'Quando e Como Colher a Palma',
    description: 'Identificando o ponto ideal de colheita',
    duration: '14:00',
    thumbnail: '✂️',
    category: 'colher',
  },
  {
    id: '6',
    title: 'Conservação da Palma Colhida',
    description: 'Métodos de armazenamento e conservação',
    duration: '11:30',
    thumbnail: '📦',
    category: 'colher',
  },
];

const HARVEST_INFO = {
  title: 'Ponto Ideal de Colheita',
  sections: [
    {
      title: '📅 Quando Colher',
      content: `A palma forrageira atinge o ponto ideal de colheita entre 18 e 24 meses após o plantio. Neste período, as raquetes apresentam:
      
• Coloração verde intensa e uniforme
• Textura firme, sem murcha
• Espinhos bem desenvolvidos (em variedades com espinho)
• Peso médio de 2 a 3 kg por raquete`,
    },
    {
      title: '⚠️ Tolerância e Limites',
      content: `A colheita pode ser antecipada ou atrasada conforme a necessidade:

• Mínimo: 12 meses (em casos de emergência alimentar)
• Ideal: 18-24 meses
• Máximo: 36 meses (raquetes podem ficar lenhosas)

Atenção: Nunca colha mais de 50% das raquetes de uma planta de uma só vez. Deixe sempre raquetes para manter a fotossíntese e recuperação da planta.`,
    },
    {
      title: '🔪 Como Colher',
      content: `Utilize facão bem afiado ou ferramenta específica para palma:

1. Corte na base da raquete, rente à raquete-mãe
2. Faça o corte em ângulo para evitar acúmulo de água
3. Evite danificar a raquete que fica na planta
4. Deixe cicatrizar por 2-3 dias antes de fornecer aos animais (opcional)`,
    },
    {
      title: '📦 Conservação',
      content: `A palma colhida pode ser conservada de diferentes formas:

• Fresca: Até 15 dias à sombra em local ventilado
• Picada: Fornecer em até 24 horas (fermenta rapidamente)
• Silagem: Misturada com material seco (capim, farelos)
• Fenada: Cortar em fatias finas e secar ao sol

Dica: A silagem de palma com 30% de capim seco resulta em excelente volumoso conservado.`,
    },
  ],
};

export function Educational() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const categories = [
    { id: 'adubar', label: 'Como Adubar', icon: Shovel, color: '#5C4033' },
    { id: 'plantar', label: 'Como Plantar', icon: Leaf, color: '#2C8B57' },
    { id: 'colher', label: 'Como Colher', icon: Scissors, color: '#E77E21' },
  ];

  const filteredVideos = selectedCategory
    ? VIDEOS.filter((v) => v.category === selectedCategory)
    : VIDEOS;

  // Use PARTNERS data from shared source

  return (
    <div className="educational-page">
      <Header
        title="Central Educacional"
        subtitle="Aprenda sobre a palma forrageira"
        showBack
      />

      <div className="page-content">
        {/* Categories */}
        <section className="categories-section">
          <div className="categories-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <cat.icon size={24} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Videos List */}
        <section className="videos-section">
          <h3>Vídeos Educativos</h3>
          <div className="videos-list">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                variant="default"
                padding="md"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="video-card">
                  <div className="video-thumbnail">
                    <span>{video.thumbnail}</span>
                    <div className="play-overlay">
                      <Play size={20} fill="white" />
                    </div>
                  </div>
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <p>{video.description}</p>
                    <span className="video-duration">
                      <Clock size={14} />
                      {video.duration}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Harvest Info Card (moved to appear directly after videos) */}
        <section className="harvest-section">
          <Card
            variant="outlined"
            padding="lg"
            onClick={() => setShowHarvestModal(true)}
          >
            <div className="harvest-card">
              <div className="harvest-icon">📚</div>
              <div className="harvest-info">
                <h4>Guia Completo de Colheita</h4>
                <p>Ponto ideal, tolerância e conservação da palma</p>
              </div>
              <ChevronRight size={20} />
            </div>
          </Card>
        </section>

        {/* Partners teaser: redirector to partners page showing all companies providing courses or consultancy */}
        <section className="partners-teaser">
          <h3>Parceiros e Cursos</h3>
          <p>Ver todas as empresas que oferecem cursos e consultoria (independente da região).</p>
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

        

        {/* Tips Section */}
        <section className="tips-section">
          <h3>Dicas Rápidas</h3>
          <div className="tips-list">
            <div className="tip-item">
              <CheckCircle size={20} />
              <span>A palma tolera seca, mas responde muito bem à irrigação</span>
            </div>
            <div className="tip-item">
              <CheckCircle size={20} />
              <span>Evite plantar em solos encharcados</span>
            </div>
            <div className="tip-item">
              <CheckCircle size={20} />
              <span>O esterco é o melhor adubo para a palma</span>
            </div>
            <div className="tip-item">
              <CheckCircle size={20} />
              <span>Nunca forneça palma como único alimento</span>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Informações de Colheita */}
      <Modal
        isOpen={showHarvestModal}
        onClose={() => setShowHarvestModal(false)}
        title={HARVEST_INFO.title}
        size="lg"
      >
        <div className="harvest-content">
          {HARVEST_INFO.sections.map((section, index) => (
            <div key={index} className="harvest-section-item">
              <h4>{section.title}</h4>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal de Vídeo */}
      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || ''}
        size="lg"
      >
        {selectedVideo && (
          <div className="video-modal">
            <div className="video-player">
              <div className="video-placeholder">
                <span>{selectedVideo.thumbnail}</span>
                <Play size={48} />
                <p>Reproduzir Vídeo</p>
              </div>
            </div>
            <div className="video-details">
              <p>{selectedVideo.description}</p>
              <span className="video-duration-large">
                <Clock size={16} />
                Duração: {selectedVideo.duration}
              </span>
            </div>
            <Button variant="primary" fullWidth>
              Assistir no YouTube
            </Button>
          </div>
        )}
      </Modal>

      <BottomNav />
    </div>
  );
}
