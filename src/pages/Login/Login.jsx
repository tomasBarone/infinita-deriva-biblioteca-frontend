import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './FloatingInput.css'; 

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    
    const { user, iniciarSesion, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const isLoggedIn = !!user;

   
    const esAdmin = Boolean(
        user?.roles?.includes('ROLE_ADMIN') || 
        user?.role === 'ROLE_ADMIN' ||
        user?.authorities?.some(a => a.authority === 'ROLE_ADMIN')
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const respuesta = await api.post('/auth/login', { username, password });
            const token = respuesta.data.token || respuesta.data.jwt || respuesta.data; 

            if (token) {
                iniciarSesion(token);

           
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join('')));
                    
                    const nombreExtraido = jsonPayload.sub || jsonPayload.username || username;
                    localStorage.setItem('nombreUsuario', nombreExtraido);
                    if (jsonPayload.id) {
                        localStorage.setItem('userId', jsonPayload.id);
                    }
                } catch (err) {
                    localStorage.setItem('nombreUsuario', username);
                }
               
                navigate(esAdmin ? '/admin' : '/biblioteca');
            } else {
                setError('No se recibió un token válido del servidor.');
            }
        } catch (err) {
            console.error('Error durante el login:', err);
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        } finally {
            setCargando(false);
        }
    };

    const handleLogout = () => {
        cerrarSesion();
        setUsername('');
        setPassword('');
        localStorage.removeItem('nombreUsuario');
        navigate('/login');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '85vh',
            padding: '40px 20px',
            
            backgroundImage: `linear-gradient(rgba(15, 14, 12, 0.65), rgba(15, 14, 12, 0.75)), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            {isLoggedIn ? (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #e2dacb',
                    padding: '45px 40px',
                    borderRadius: '2px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.9rem',
                        color: '#2c1810',
                        marginBottom: '16px',
                        fontWeight: '400'
                    }}>
                        Sesión Activa
                    </h2>
                    
                    <p style={{
                        fontFamily: 'system-ui, sans-serif',
                        color: '#6e6355',
                        fontSize: '0.95rem',
                        marginBottom: '32px',
                        lineHeight: '1.5'
                    }}>
                        Actualmente te encontrás autenticado como <strong>{localStorage.getItem('nombreUsuario') || user?.sub || user?.username}</strong>.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        {esAdmin ? (
                            <button 
                                onClick={() => navigate('/admin')}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    backgroundColor: '#2c1810',
                                    color: '#fdfbf7',
                                    border: 'none',
                                    borderRadius: '2px',
                                    fontFamily: 'system-ui, sans-serif',
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    fontSize: '0.82rem'
                                }}
                            >
                                Ir al Panel de Control
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate('/biblioteca')}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    backgroundColor: '#2c1810',
                                    color: '#fdfbf7',
                                    border: 'none',
                                    borderRadius: '2px',
                                    fontFamily: 'system-ui, sans-serif',
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    fontSize: '0.82rem'
                                }}
                            >
                                Ir a Mis Lecturas
                            </button>
                        )}

                        <button 
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '13px',
                                backgroundColor: 'transparent',
                                color: '#a93226',
                                border: '1px solid #a93226',
                                borderRadius: '2px',
                                fontFamily: 'system-ui, sans-serif',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontSize: '0.82rem'
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            ) : (
                <form 
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #e2dacb',
                        padding: '45px 40px',
                        borderRadius: '2px',
                        width: '100%',
                        maxWidth: '420px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <input type="text" name="prevent_autofill" style={{ display: 'none' }} tabIndex={-1} />
                    <input type="password" name="password_fake" style={{ display: 'none' }} tabIndex={-1} />

                    <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.9rem',
                        color: '#2c1810',
                        marginBottom: '24px',
                        textAlign: 'center',
                        fontWeight: '400'
                    }}>
                        Iniciar Sesión
                    </h2>

                    {error && (
                        <div style={{
                            backgroundColor: '#fde8ec',
                            color: '#a93226',
                            padding: '12px',
                            borderRadius: '2px',
                            fontSize: '0.85rem',
                            marginBottom: '20px',
                            fontFamily: 'system-ui, sans-serif'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* INPUT USUARIO */}
                    <div className="floating-group">
                        <input 
                            id="username"
                            type="text" 
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=" "
                            autoComplete="off"
                            required
                            className="floating-input"
                        />
                        <label htmlFor="username" className="floating-label">
                            Usuario o Email
                        </label>
                    </div>

                    {/* INPUT CONTRASEÑA */}
                    <div className="floating-group">
                        <input 
                            id="password"
                            type="password" 
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            autoComplete="new-password"
                            required
                            className="floating-input"
                        />
                        <label htmlFor="password" className="floating-label">
                            Contraseña
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={cargando}
                        style={{
                            width: '100%',
                            padding: '13px',
                            backgroundColor: '#2c1810',
                            color: '#fdfbf7',
                            border: 'none',
                            borderRadius: '2px',
                            fontFamily: 'system-ui, sans-serif',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.82rem',
                            opacity: cargando ? 0.7 : 1,
                            marginTop: '8px'
                        }}
                    >
                        {cargando ? 'Autenticando...' : 'Ingresar'}
                    </button>

                    {/* ACCESO DIRECTO A REGISTRO */}
                    <div style={{
                        marginTop: '26px',
                        paddingTop: '18px',
                        borderTop: '1px solid #e8e2d5',
                        textAlign: 'center',
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '0.88rem',
                        color: '#6e6355'
                    }}>
                        ¿No tenés una cuenta?{' '}
                        <Link 
                            to="/register" 
                            style={{
                                color: '#2c1810',
                                fontWeight: '600',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px'
                            }}
                        >
                            Registrate acá
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Login;