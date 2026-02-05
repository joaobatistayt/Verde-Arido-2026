import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import {
  Login,
  ProducerRegistration,
  Home,
  TerrainMapping,
  Terrains,
  Animals,
  CalculatorHub,
  PlantingCalculator,
  DietFormulator,
  GrazingManagement,
  Educational,
  Partners,
} from './pages';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css';
import { PartnersPromo } from './components/ui/PartnersPromo/PartnersPromo';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/cadastro-produtor"
        element={
          <PrivateRoute>
            <ProducerRegistration />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/mapeamento"
        element={
          <PrivateRoute>
            <TerrainMapping />
          </PrivateRoute>
        }
      />
      <Route
        path="/terrenos"
        element={
          <PrivateRoute>
            <Terrains />
          </PrivateRoute>
        }
      />
      <Route
        path="/terrenos/:id"
        element={
          <PrivateRoute>
            <Terrains />
          </PrivateRoute>
        }
      />
      <Route
        path="/animais"
        element={
          <PrivateRoute>
            <Animals />
          </PrivateRoute>
        }
      />
      <Route
        path="/animais/:id/dieta"
        element={
          <PrivateRoute>
            <DietFormulator />
          </PrivateRoute>
        }
      />
      <Route
        path="/calculadora"
        element={
          <PrivateRoute>
            <CalculatorHub />
          </PrivateRoute>
        }
      />
      <Route
        path="/calculadora/plantio"
        element={
          <PrivateRoute>
            <PlantingCalculator />
          </PrivateRoute>
        }
      />
      <Route
        path="/calculadora/pastejo"
        element={
          <PrivateRoute>
            <GrazingManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/educacional"
        element={
          <PrivateRoute>
            <Educational />
          </PrivateRoute>
        }
      />
      <Route
        path="/parceiros"
        element={
          <PrivateRoute>
            <Partners />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-container">
          <ErrorBoundary>
            <AppRoutes />
            <PartnersPromo />
          </ErrorBoundary>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
