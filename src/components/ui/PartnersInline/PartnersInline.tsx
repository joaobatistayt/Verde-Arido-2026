import { Card, Button } from '../index';
import { useState } from 'react';
import { ALL_PARTNERS } from '../../../data/partners';
import './PartnersInline.css';
import { useNavigate } from 'react-router-dom';

export function PartnersInline({ limit = 2 }: { limit?: number }) {
  const navigate = useNavigate();
  const regions = Array.from(new Set(ALL_PARTNERS.map(p => p.region))).sort();
  const defaultRegion = regions.includes('Nordeste') ? 'Nordeste' : 'All';
  const [region, setRegion] = useState<string>(defaultRegion);

  const filtered = region === 'All' ? ALL_PARTNERS : ALL_PARTNERS.filter(p => p.region === region);
  const items = filtered.slice(0, limit);

  return (
    <div className="partners-inline">
      <h4>Parceiros & Serviços</h4>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 13 }}>Região:</label>
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="All">Todas</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="partners-row">
        {items.map(p => (
          <Card key={p.id} variant="outlined" padding="sm" onClick={() => window.open(p.url || '#', '_blank')}>
            <div className="partner-item">
              <div className="partner-name">{p.name} <span style={{ fontSize: 11, color: '#888' }}>({p.region})</span></div>
              <div className="partner-desc">{p.description}</div>
              <div className="partner-services">{p.services.map(s => s.replace('_',' ')).join(' • ')}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/parceiros')}>Ver mais parceiros</Button>
      </div>
    </div>
  );
}
