import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import './Navbar.css';

function Navbar({ onToggleMenu }) {
    const { user, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [cantidadReservas, setCantidadReservas] = useState(0);
    
    
    const [menuAbierto, setMenuAbierto] = useState(null);
    const navRef = useRef(null);

    useEffect(() => {
        const actualizarContador = () => {
            const pendientes = JSON.parse(localStorage.getItem('reservas_pendientes')) || [];
            const total = pendientes.reduce((acc, item) => acc + (item.cantidad || 1), 0);
            setCantidadReservas(total);
        };

        actualizarContador();
        window.addEventListener('storage', actualizarContador);
        window.addEventListener('reservas_updated', actualizarContador);

        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setMenuAbierto(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('storage', actualizarContador);
            window.removeEventListener('reservas_updated', actualizarContador);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleMenu = (menuName) => {
        setMenuAbierto(prev => (prev === menuName ? null : menuName));
    };

    const handleLogout = () => {
        cerrarSesion();
        localStorage.removeItem('nombreUsuario');
        setMenuAbierto(null);
        navigate('/login');
    };

    const esAdmin = Boolean(
        user?.roles?.includes('ROLE_ADMIN') || 
        user?.role === 'ROLE_ADMIN' ||
        user?.authorities?.some(a => a.authority === 'ROLE_ADMIN')
    );

    const nombreUsuario = localStorage.getItem('nombreUsuario') || user?.sub || user?.username || 'Lector';
    const userIdFicha = user?.id || localStorage.getItem('userId') || '0042';

    return (
        <div ref={navRef} className="navbar-wrapper">
            <header className="navbar-header">
               
                <div onClick={onToggleMenu} className="navbar-menu-trigger">
                    <span className="navbar-menu-icon">☰</span>
                    <span className="navbar-menu-text">CORRIENTES LITERARIAS</span>
                </div>

                
                <Link to="/" className="navbar-logo-link" onClick={() => setMenuAbierto(null)}>
                    <h1 className="navbar-logo-title">Infinita Deriva</h1>
                    <h3 className="navbar-logo-subtitle">Una biblioteca para lectores curiosos</h3>
                </Link>

                
                <div className="navbar-utils-inline">
                    <div className="nav-dropdown-container">
                        <button 
                            type="button" 
                            className={`nav-text-btn ${menuAbierto === 'salas' ? 'active' : ''}`}
                            onClick={() => handleToggleMenu('salas')}
                        >
                            Salas & Sede {menuAbierto === 'salas' ? '∧' : '∨'}
                        </button>
                    </div>

                    <div className="nav-dropdown-container">
                        <button 
                            type="button" 
                            className={`nav-text-btn ${menuAbierto === 'pase' ? 'active' : ''}`}
                            onClick={() => handleToggleMenu('pase')}
                        >
                            Pase Lector {menuAbierto === 'pase' ? '∧' : '∨'}
                        </button>
                    </div>

                    <span className="nav-sep">|</span>

                    <button 
                        type="button" 
                        onClick={() => { setSearchOpen(true); setMenuAbierto(null); }} 
                        className="nav-text-btn"
                    >
                        BUSCAR
                    </button>

                    <span className="nav-sep">|</span>

                    {user ? (
                        <div className="nav-dropdown-container">
                            <button 
                                type="button"
                                className={`nav-text-btn socio-trigger ${menuAbierto === 'usuario' ? 'active' : ''}`}
                                onClick={() => handleToggleMenu('usuario')}
                            >
                                SOCIO: {nombreUsuario} {cantidadReservas > 0 ? `(${cantidadReservas})` : ''} {menuAbierto === 'usuario' ? '∧' : '∨'}
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-text-btn socio-trigger" onClick={() => setMenuAbierto(null)}>
                            ACCESO SOCIO
                        </Link>
                    )}
                </div>
            </header>

            
            {menuAbierto && (
                <>
                    <div className="dropdown-overlay-backdrop" onClick={() => setMenuAbierto(null)} />

                    <div className="dropdown-drawer-panel">
                        {menuAbierto === 'salas' && (
                            <div className="drawer-content-inner-general fade-in-content">
                                <div className="drawer-main-col">
                                   
                                    <div className="drawer-links-grid">
                                        <Link to="/salas/generales" onClick={() => setMenuAbierto(null)}>Salas Generales de Lectura</Link>
                                        <Link to="/salas/investigacion" onClick={() => setMenuAbierto(null)}>Mesas de Investigación Silenciosa</Link>
                                        <Link to="/salas/cafe" onClick={() => setMenuAbierto(null)}>Gabinete y Café de Lectores</Link>
                                        <Link to="/salas/sede" onClick={() => setMenuAbierto(null)}>Horarios y Ubicación de Sede</Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {menuAbierto === 'pase' && (
                            <div className="drawer-content-inner fade-in-content">
                                <div className="drawer-main-col">
                                  
                                    <div className="drawer-links-grid">
                                        <Link to="/pase-lector" onClick={() => setMenuAbierto(null)}>¿Cómo obtener el Pase Lector?</Link>
                                        <Link to="/pase-lector/reglamento" onClick={() => setMenuAbierto(null)}>Reglamento de Préstamos (14 Días)</Link>
                                        <Link to="/pase-lector/manuscritos" onClick={() => setMenuAbierto(null)}>Acceso a Fondos y Manuscritos Raros</Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {menuAbierto === 'usuario' && (
                            <div className="drawer-content-inner fade-in-content">
                             
                              

                              
                                <div className="drawer-main-col">
                                   
                                    <div className="drawer-links-grid">
                                        <Link to="/reservas" onClick={() => setMenuAbierto(null)}>
                                            Solicitudes de Préstamo {cantidadReservas > 0 ? `(${cantidadReservas})` : ''}
                                        </Link>
                                        <Link to="/biblioteca" onClick={() => setMenuAbierto(null)}>
                                            Cuaderno de Lecturas
                                        </Link>
                                        {esAdmin && (
                                            <Link to="/admin" onClick={() => setMenuAbierto(null)}>
                                                Panel de Gestión Académica
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Acción de cierre de sesión */}
                                <div>
                                    <button type="button" onClick={handleLogout} className="nav-text-btn sesion">
                                        CERRAR SESIÓN ACTIVA →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    );
}

export default Navbar;