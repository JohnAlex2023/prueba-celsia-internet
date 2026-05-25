import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ClientesListPage } from './pages/ClientesListPage';
import { ClienteCreatePage } from './pages/ClienteCreatePage';
import { ClienteEditPage } from './pages/ClienteEditPage';
import { ContratarServicioPage } from './pages/ContratarServicioPage';
import { ConsultarPage } from './pages/ConsultarPage';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<ClientesListPage />} />
          <Route path="/clientes/nuevo" element={<ClienteCreatePage />} />
          <Route
            path="/clientes/:identificacion/editar"
            element={<ClienteEditPage />}
          />
          <Route
            path="/servicios/contratar"
            element={<ContratarServicioPage />}
          />
          <Route path="/consultar" element={<ConsultarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
