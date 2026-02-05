import { NavLink } from 'react-router-dom';
import { Home, Map, Users, Calculator, BookOpen } from 'lucide-react';
import './BottomNav.css';

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Início</span>
      </NavLink>
      <NavLink to="/terrenos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Map size={24} />
        <span>Terrenos</span>
      </NavLink>
      <NavLink to="/animais" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Users size={24} />
        <span>Animais</span>
      </NavLink>
      <NavLink to="/calculadora" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Calculator size={24} />
        <span>Cálculos</span>
      </NavLink>
      <NavLink to="/educacional" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BookOpen size={24} />
        <span>Aprender</span>
      </NavLink>
    </nav>
  );
}
