import { ALL_PARTNERS } from '../../data/partners';
import { Card, Header, BottomNav, Button } from '../../components/ui';
import './Partners.css';
import { useNavigate, useLocation } from 'react-router-dom';

export function Partners() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const servicesParam = params.get('services'); // e.g. 'consultoria,cursos'
  const regionParam = params.get('region');

  // If services query present, show flat list of partners matching any of those services
  let partnersToShow = ALL_PARTNERS;
  if (servicesParam) {
    const services = servicesParam.split(',').map(s => s.trim()).filter(Boolean);
    partnersToShow = ALL_PARTNERS.filter(p => p.services.some(s => services.includes(s)));
    if (regionParam) {
      partnersToShow = partnersToShow.filter(p => p.region === regionParam);
    }
  }

  // Group by region only when no services filter is provided
  const byRegion = !servicesParam
    ? ALL_PARTNERS.reduce<Record<string, typeof ALL_PARTNERS>>((acc, p) => {
        (acc[p.region] = acc[p.region] || []).push(p);
        return acc;
      }, {} as Record<string, typeof ALL_PARTNERS>)
    : {} as Record<string, typeof ALL_PARTNERS>;

  return (
    <div className="partners-page">
      <Header title="Parceiros e Serviços" subtitle="Empresas privadas e prestadores" showBack />

      <div className="page-content">
        {servicesParam ? (
          <section className="partners-flat">
            <h3>Resultados ({partnersToShow.length})</h3>
            <div className="partners-grid">
              {partnersToShow.map(p => (
                <Card key={p.id} variant="outlined" padding="md" onClick={() => window.open(p.url || '#', '_blank')}>
                  <div className="partner-card">
                    <h4>{p.name} <span style={{ fontSize: 12, color: '#888' }}>({p.region})</span></h4>
                    <p>{p.description}</p>
                    <div className="partner-services">{p.services.map(s => s.replace('_',' ')).join(' • ')}</div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          Object.keys(byRegion).map(region => (
            <section key={region} className="partners-region">
              <h3>{region} ({byRegion[region].length})</h3>
              <div className="partners-grid">
                {byRegion[region].map(p => (
                  <Card key={p.id} variant="outlined" padding="md" onClick={() => window.open(p.url, '_blank')}>
                    <div className="partner-card">
                      <h4>{p.name}</h4>
                      <p>{p.description}</p>
                      <div className="partner-services">{p.services.map(s => s.replace('_',' ')).join(' • ')}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}

        <div style={{ marginTop: 16 }}>
          <Button variant="ghost" onClick={() => navigate('/educacional')}>Voltar para Central Educacional</Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
