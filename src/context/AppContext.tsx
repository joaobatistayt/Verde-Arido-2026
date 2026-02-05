import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types
export interface Producer {
  cpf: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export interface Terrain {
  id: string;
  name: string;
  area: number; // em hectares
  carArea?: number;
  mappingMethod: 'car' | 'satellite' | 'gps' | 'manual';
  coordinates?: { lat: number; lng: number }[];
  createdAt: Date;
}

export interface Talhao {
  id: string;
  terrainId: string;
  name: string;
  area: number;
  soilType: string;
  soilTypeManual?: string;
  fragments: Fragment[];
  isPlanted: boolean;
  createdAt: Date;
}

export interface Fragment {
  id: string;
  name: string;
  area: number;
  status: 'available' | 'planted' | 'resting';
}

export interface AnimalGroup {
  id: string;
  name: string;
  species: 'bovino' | 'ovino' | 'caprino' | 'equino';
  breed: string;
  quantity: number;
  averageWeight: number;
  purpose: 'cria' | 'recria' | 'engorda' | 'leite';
  createdAt: Date;
}

export interface PlantingCalculation {
  talhaoId: string;
  fragmentId?: string;
  totalRaquetes: number;
  distanceInLine: number;
  distanceBetweenRows: number;
}

export interface DietFormulation {
  animalGroupId: string;
  goal: string;
  productionTarget: number;
  palmaKgPerDay: number;
  raquetesPerDay: number;
  supplements: {
    name: string;
    kgPerDay: number;
    alternatives: { name: string; kgPerDay: number }[];
  }[];
}

interface AppState {
  isLoggedIn: boolean;
  producer: Producer | null;
  terrains: Terrain[];
  talhoes: Talhao[];
  animalGroups: AnimalGroup[];
  currentTerrainId: string | null;
}

interface AppContextType extends AppState {
  login: () => void;
  logout: () => void;
  setProducer: (producer: Producer) => void;
  addTerrain: (terrain: Omit<Terrain, 'id' | 'createdAt'>) => void;
  updateTerrain: (id: string, terrain: Partial<Terrain>) => void;
  deleteTerrain: (id: string) => void;
  addTalhao: (talhao: Omit<Talhao, 'id' | 'createdAt' | 'fragments'>) => void;
  updateTalhao: (id: string, talhao: Partial<Talhao>) => void;
  deleteTalhao: (id: string) => void;
  addFragment: (talhaoId: string, fragment: Omit<Fragment, 'id'>) => void;
  updateFragment: (talhaoId: string, fragmentId: string, fragment: Partial<Fragment>) => void;
  deleteFragment: (talhaoId: string, fragmentId: string) => void;
  addAnimalGroup: (group: Omit<AnimalGroup, 'id' | 'createdAt'>) => void;
  updateAnimalGroup: (id: string, group: Partial<AnimalGroup>) => void;
  deleteAnimalGroup: (id: string) => void;
  setCurrentTerrain: (id: string | null) => void;
  calculatePlanting: (talhaoId: string, fragmentId?: string) => PlantingCalculation;
  calculateDiet: (animalGroupId: string, goal: string, productionTarget: number) => DietFormulation;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

// Constante de conversão: 1 Raquete ≈ 2.5 kg de Matéria Original
const RAQUETE_KG = 2.5;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    producer: null,
    terrains: [],
    talhoes: [],
    animalGroups: [],
    currentTerrainId: null,
  });

  const login = () => setState(prev => ({ ...prev, isLoggedIn: true }));
  const logout = () => setState({
    isLoggedIn: false,
    producer: null,
    terrains: [],
    talhoes: [],
    animalGroups: [],
    currentTerrainId: null,
  });

  const setProducer = (producer: Producer) => {
    setState(prev => ({ ...prev, producer }));
  };

  const addTerrain = (terrain: Omit<Terrain, 'id' | 'createdAt'>) => {
    const newTerrain: Terrain = {
      ...terrain,
      id: generateId(),
      createdAt: new Date(),
    };
    setState(prev => ({
      ...prev,
      terrains: [...prev.terrains, newTerrain],
      currentTerrainId: newTerrain.id,
    }));
  };

  const updateTerrain = (id: string, terrain: Partial<Terrain>) => {
    setState(prev => ({
      ...prev,
      terrains: prev.terrains.map(t => t.id === id ? { ...t, ...terrain } : t),
    }));
  };

  const deleteTerrain = (id: string) => {
    setState(prev => ({
      ...prev,
      terrains: prev.terrains.filter(t => t.id !== id),
      talhoes: prev.talhoes.filter(t => t.terrainId !== id),
      currentTerrainId: prev.currentTerrainId === id ? null : prev.currentTerrainId,
    }));
  };

  const addTalhao = (talhao: Omit<Talhao, 'id' | 'createdAt' | 'fragments'>) => {
    const newTalhao: Talhao = {
      ...talhao,
      id: generateId(),
      fragments: [],
      createdAt: new Date(),
    };
    setState(prev => ({
      ...prev,
      talhoes: [...prev.talhoes, newTalhao],
    }));
  };

  const updateTalhao = (id: string, talhao: Partial<Talhao>) => {
    setState(prev => ({
      ...prev,
      talhoes: prev.talhoes.map(t => t.id === id ? { ...t, ...talhao } : t),
    }));
  };

  const deleteTalhao = (id: string) => {
    setState(prev => ({
      ...prev,
      talhoes: prev.talhoes.filter(t => t.id !== id),
    }));
  };

  const addFragment = (talhaoId: string, fragment: Omit<Fragment, 'id'>) => {
    const newFragment: Fragment = {
      ...fragment,
      id: generateId(),
    };
    setState(prev => ({
      ...prev,
      talhoes: prev.talhoes.map(t =>
        t.id === talhaoId
          ? { ...t, fragments: [...t.fragments, newFragment] }
          : t
      ),
    }));
  };

  const updateFragment = (talhaoId: string, fragmentId: string, fragment: Partial<Fragment>) => {
    setState(prev => ({
      ...prev,
      talhoes: prev.talhoes.map(t =>
        t.id === talhaoId
          ? {
            ...t,
            fragments: t.fragments.map(f =>
              f.id === fragmentId ? { ...f, ...fragment } : f
            ),
          }
          : t
      ),
    }));
  };

  const deleteFragment = (talhaoId: string, fragmentId: string) => {
    setState(prev => ({
      ...prev,
      talhoes: prev.talhoes.map(t =>
        t.id === talhaoId
          ? { ...t, fragments: t.fragments.filter(f => f.id !== fragmentId) }
          : t
      ),
    }));
  };

  const addAnimalGroup = (group: Omit<AnimalGroup, 'id' | 'createdAt'>) => {
    const newGroup: AnimalGroup = {
      ...group,
      id: generateId(),
      createdAt: new Date(),
    };
    setState(prev => ({
      ...prev,
      animalGroups: [...prev.animalGroups, newGroup],
    }));
  };

  const updateAnimalGroup = (id: string, group: Partial<AnimalGroup>) => {
    setState(prev => ({
      ...prev,
      animalGroups: prev.animalGroups.map(g => g.id === id ? { ...g, ...group } : g),
    }));
  };

  const deleteAnimalGroup = (id: string) => {
    setState(prev => ({
      ...prev,
      animalGroups: prev.animalGroups.filter(g => g.id !== id),
    }));
  };

  const setCurrentTerrain = (id: string | null) => {
    setState(prev => ({ ...prev, currentTerrainId: id }));
  };

  // Cálculo de Plantio de Palma Forrageira
  const calculatePlanting = (talhaoId: string, fragmentId?: string): PlantingCalculation => {
    const talhao = state.talhoes.find(t => t.id === talhaoId);
    if (!talhao) throw new Error('Talhão não encontrado');

    let area = talhao.area;
    if (fragmentId) {
      const fragment = talhao.fragments.find(f => f.id === fragmentId);
      if (fragment) area = fragment.area;
    }

    // Cálculo baseado em espaçamento típico para palma forrageira
    // Espaçamento: 2m entre linhas e 0.5m entre plantas
    const distanceInLine = 0.5; // metros
    const distanceBetweenRows = 2; // metros
    
    // Área em m² (1 hectare = 10000 m²)
    const areaM2 = area * 10000;
    
    // Número de linhas = largura / distância entre linhas
    // Número de plantas por linha = comprimento / distância na linha
    // Considerando área quadrada para simplificação
    const lado = Math.sqrt(areaM2);
    const numLinhas = Math.floor(lado / distanceBetweenRows);
    const plantasPorLinha = Math.floor(lado / distanceInLine);
    const totalRaquetes = numLinhas * plantasPorLinha;

    return {
      talhaoId,
      fragmentId,
      totalRaquetes,
      distanceInLine,
      distanceBetweenRows,
    };
  };

  // Cálculo de Dieta (Módulo de Formulação)
  const calculateDiet = (animalGroupId: string, goal: string, productionTarget: number): DietFormulation => {
    const group = state.animalGroups.find(g => g.id === animalGroupId);
    if (!group) throw new Error('Grupo de animais não encontrado');

    // Cálculo simplificado baseado na finalidade
    let palmaKgPerDay: number;
    
    if (group.purpose === 'leite') {
      // Para produção de leite: ~3kg de palma por litro de leite
      palmaKgPerDay = productionTarget * 3;
    } else if (group.purpose === 'engorda') {
      // Para engorda: ~4% do peso vivo em matéria seca
      palmaKgPerDay = group.averageWeight * 0.04 * 0.7; // 70% da MS vem da palma
    } else {
      // Cria/Recria: ~3% do peso vivo
      palmaKgPerDay = group.averageWeight * 0.03 * 0.7;
    }

    const raquetesPerDay = Math.ceil(palmaKgPerDay / RAQUETE_KG);

    return {
      animalGroupId,
      goal,
      productionTarget,
      palmaKgPerDay,
      raquetesPerDay,
      supplements: [
        {
          name: 'Resíduo de Cervejaria',
          kgPerDay: palmaKgPerDay * 0.15,
          alternatives: [
            { name: 'Farelo de Soja', kgPerDay: palmaKgPerDay * 0.1 },
            { name: 'Torta de Algodão', kgPerDay: palmaKgPerDay * 0.12 },
          ],
        },
        {
          name: 'Casca de Soja',
          kgPerDay: palmaKgPerDay * 0.1,
          alternatives: [
            { name: 'Milho Moído', kgPerDay: palmaKgPerDay * 0.08 },
            { name: 'Farelo de Trigo', kgPerDay: palmaKgPerDay * 0.11 },
          ],
        },
        {
          name: 'Sal Mineral',
          kgPerDay: 0.08,
          alternatives: [],
        },
      ],
    };
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setProducer,
        addTerrain,
        updateTerrain,
        deleteTerrain,
        addTalhao,
        updateTalhao,
        deleteTalhao,
        addFragment,
        updateFragment,
        deleteFragment,
        addAnimalGroup,
        updateAnimalGroup,
        deleteAnimalGroup,
        setCurrentTerrain,
        calculatePlanting,
        calculateDiet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
