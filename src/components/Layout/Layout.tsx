import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

export function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <nav className="layout__nav">
          <NavLink to="/cep" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Busca de CEP
          </NavLink>
          <NavLink
            to="/noticias"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Notícias
          </NavLink>
        </nav>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}