export interface Partner {
  id: string;
  name: string;
  description: string;
  services: string[]; // e.g. ['cursos','consultoria','analise_solo','venda_palmas','atendimento_personalizado']
  region: string; // e.g. 'Nordeste', 'Sudeste'
  url?: string;
}

export const PARTNERS: Partner[] = [
  {
    id: 'cursos_agro',
    name: 'Cursos AgroPro',
    description: 'Cursos práticos de manejo, plantio e comercialização de palma',
    services: ['cursos'],
    region: 'Nordeste',
    url: 'https://example.com/cursos-agro'
  },
  {
    id: 'consultoria_rural',
    name: 'Consultoria Rural Ltda',
    description: 'Consultoria presencial e projetos de manejo',
    services: ['consultoria','atendimento_personalizado'],
    region: 'Sudeste',
    url: 'https://example.com/consultoria'
  },
  {
    id: 'solo_check',
    name: 'SoloCheck Análises',
    description: 'Coleta e análise de solo com laudo e recomendações',
    services: ['analise_solo','atendimento_personalizado'],
    region: 'Sul',
    url: 'https://example.com/solo-check'
  },
  {
    id: 'palma_vendas',
    name: 'Vendas de Palmas SA',
    description: 'Fornecimento de raquetes e mudas de palma forrageira',
    services: ['venda_palmas'],
    region: 'Centro-Oeste',
    url: 'https://example.com/palma-vendas'
  }
];

// Adicionar mais empresas para variedade por região
export const PARTNERS_EXTRA: Partner[] = [
  { id: 'cursos_nordeste2', name: 'AgroCursos NE', description: 'Cursos intensivos regionais', services: ['cursos'], region: 'Nordeste', url: 'https://example.com/agrocursos-ne' },
  { id: 'consultoria_se2', name: 'GestãoAgro SE', description: 'Consultoria e implementação de projetos', services: ['consultoria'], region: 'Sudeste', url: 'https://example.com/gestaoagro' },
  { id: 'solo_sul2', name: 'AnalisaSolo Sul', description: 'Análises rápidas com retirada de amostras', services: ['analise_solo'], region: 'Sul', url: 'https://example.com/analisa-solo' },
  { id: 'venda_palmas_norte', name: 'Palmas Norte', description: 'Venda e logística de mudas para regiões remotas', services: ['venda_palmas'], region: 'Norte', url: 'https://example.com/palmas-norte' },
  { id: 'mentoria_central', name: 'Mentoria Agro Central', description: 'Atendimento personalizado e mentoria técnica', services: ['atendimento_personalizado','consultoria'], region: 'Centro-Oeste', url: 'https://example.com/mentoria-central' },
];

export const ALL_PARTNERS = [...PARTNERS, ...PARTNERS_EXTRA];
