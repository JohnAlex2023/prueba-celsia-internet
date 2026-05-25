import { NavLink } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="navbar">
      <h1>Celsia Internet</h1>
      <nav>
        <NavLink to="/" end>
          Clientes
        </NavLink>
        <NavLink to="/clientes/nuevo">Nuevo cliente</NavLink>
        <NavLink to="/servicios/contratar">Contratar servicio</NavLink>
        <NavLink to="/consultar">Consultar por ID</NavLink>
      </nav>
    </header>
  );
}
