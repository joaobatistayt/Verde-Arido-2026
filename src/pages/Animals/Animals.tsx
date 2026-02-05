import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users as UsersIcon, ChevronRight, Beef, Target } from 'lucide-react';
import { Button, Card, Header, BottomNav, Modal, Input, Select } from '../../components/ui';
import { PartnersInline } from '../../components/ui/PartnersInline/PartnersInline';
import { useApp } from '../../context/AppContext';
import type { AnimalGroup } from '../../context/AppContext';
import './Animals.css';

const SPECIES_OPTIONS = [
  { value: 'bovino', label: 'Bovino' },
  { value: 'ovino', label: 'Ovino' },
  { value: 'caprino', label: 'Caprino' },
  { value: 'equino', label: 'Equino' },
];

const PURPOSE_OPTIONS = [
  { value: 'cria', label: 'Cria' },
  { value: 'recria', label: 'Recria' },
  { value: 'engorda', label: 'Engorda' },
  { value: 'leite', label: 'Leite' },
];

const BREED_OPTIONS: Record<string, { value: string; label: string }[]> = {
  bovino: [
    { value: 'nelore', label: 'Nelore' },
    { value: 'gir', label: 'Gir' },
    { value: 'gir_leiteiro', label: 'Gir Leiteiro' },
    { value: 'holandesa', label: 'Holandesa' },
    { value: 'jersey', label: 'Jersey' },
    { value: 'brahman', label: 'Brahman' },
    { value: 'angus', label: 'Angus' },
    { value: 'tabapua', label: 'Tabapuã' },
    { value: 'outro', label: 'Outra' },
  ],
  ovino: [
    { value: 'santa_ines', label: 'Santa Inês' },
    { value: 'dorper', label: 'Dorper' },
    { value: 'suffolk', label: 'Suffolk' },
    { value: 'texel', label: 'Texel' },
    { value: 'morada_nova', label: 'Morada Nova' },
    { value: 'outro', label: 'Outra' },
  ],
  caprino: [
    { value: 'saanen', label: 'Saanen' },
    { value: 'anglo_nubiana', label: 'Anglo-Nubiana' },
    { value: 'boer', label: 'Boer' },
    { value: 'toggenburg', label: 'Toggenburg' },
    { value: 'moxoto', label: 'Moxotó' },
    { value: 'outro', label: 'Outra' },
  ],
  equino: [
    { value: 'quarto_milha', label: 'Quarto de Milha' },
    { value: 'manga_larga', label: 'Manga Larga' },
    { value: 'crioulo', label: 'Crioulo' },
    { value: 'outro', label: 'Outra' },
  ],
};

export function Animals() {
  const navigate = useNavigate();
  const { animalGroups, addAnimalGroup } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [species, setSpecies] = useState<AnimalGroup['species'] | ''>('');
  const [breed, setBreed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [averageWeight, setAverageWeight] = useState('');
  const [purpose, setPurpose] = useState<AnimalGroup['purpose'] | ''>('');

  const handleSave = () => {
    if (!groupName || !species || !breed || !quantity || !averageWeight || !purpose) return;

    // Validar nomes duplicados de grupos
    if (animalGroups.some(g => g.name === groupName)) {
      // simples feedback (poderia ser via toast)
      alert('Já existe um grupo com esse nome. Escolha outro nome.');
      return;
    }

    addAnimalGroup({
      name: groupName,
      species: species as AnimalGroup['species'],
      breed,
      quantity: parseInt(quantity),
      averageWeight: parseFloat(averageWeight),
      purpose: purpose as AnimalGroup['purpose'],
    });

    // Reset form
    setGroupName('');
    setSpecies('');
    setBreed('');
    setQuantity('');
    setAverageWeight('');
    setPurpose('');
    setShowModal(false);
  };

  const getSpeciesIcon = (spec: string) => {
    switch (spec) {
      case 'bovino':
        return '🐄';
      case 'ovino':
        return '🐑';
      case 'caprino':
        return '🐐';
      case 'equino':
        return '🐴';
      default:
        return '🐄';
    }
  };

  const getPurposeLabel = (purp: string) => {
    return PURPOSE_OPTIONS.find((p) => p.value === purp)?.label || purp;
  };

  return (
    <div className="animals-page">
      <Header
        title="Meus Animais"
        subtitle={`${animalGroups.length} grupos cadastrados`}
        showBack
        rightAction={
          <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
            <Plus size={20} />
          </Button>
        }
      />

      <div className="page-content">
        {animalGroups.length === 0 ? (
          <div className="empty-animals">
            <UsersIcon size={64} />
            <h3>Nenhum grupo cadastrado</h3>
            <p>Cadastre seus grupos de animais para gerenciar a nutrição</p>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              icon={<Plus size={20} />}
            >
              Cadastrar Grupo
            </Button>
          </div>
        ) : (
          <div className="animals-list">
            {animalGroups.map((group) => (
              <Card
                key={group.id}
                variant="default"
                padding="lg"
                onClick={() => navigate(`/animais/${group.id}/dieta`)}
              >
                <div className="animal-card">
                  <div className="animal-icon">{getSpeciesIcon(group.species)}</div>
                  <div className="animal-info">
                    <h4>{group.name}</h4>
                    <div className="animal-details">
                      <span className="animal-quantity">
                        <UsersIcon size={14} />
                        {group.quantity} cabeças
                      </span>
                      <span className="animal-weight">
                        <Beef size={14} />
                        ~{group.averageWeight} kg
                      </span>
                    </div>
                    <span className="animal-purpose">
                      <Target size={14} />
                      {getPurposeLabel(group.purpose)}
                    </span>
                  </div>
                  <ChevronRight size={20} className="animal-chevron" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cadastrar Grupo de Animais"
        size="lg"
      >
        <div className="modal-form">
          <Input
            label="Nome do Agrupamento"
            placeholder="Ex: Novilhos Engorda"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          
          <Select
            label="Espécie"
            options={SPECIES_OPTIONS}
            value={species}
            onChange={(e) => {
              setSpecies(e.target.value as AnimalGroup['species']);
              setBreed('');
            }}
            placeholder="Selecione a espécie"
          />
          
          {species && (
            <Select
              label="Raça"
              options={BREED_OPTIONS[species] || []}
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Selecione a raça"
            />
          )}
          
          <Input
            label="Quantidade de Animais"
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          
          <Input
            label="Peso Médio (kg)"
            type="number"
            placeholder="0"
            value={averageWeight}
            onChange={(e) => setAverageWeight(e.target.value)}
          />
          
          <Select
            label="Finalidade"
            options={PURPOSE_OPTIONS}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as AnimalGroup['purpose'])}
            placeholder="Selecione a finalidade"
          />
          
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            disabled={!groupName || !species || !breed || !quantity || !averageWeight || !purpose}
          >
            Salvar Grupo
          </Button>
        </div>
      </Modal>

      <BottomNav />
      <PartnersInline />
    </div>
  );
}
