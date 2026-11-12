import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import libroService from '../services/libroService';
import BotonGuardarLectura from '../components/Guardar/BotonGuardarLectura';

const DetalleLibro = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [libro, setLibro] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [errorImagen, setErrorImagen] = useState(false);

    
    const [ultimoReservado, setUltimoReservado] = useState(null);

    useEffect(() => {
        const obtenerDatosLibro = async () => {
            setCargando(true);
            try {
                const data = await libroService.obtenerPorId(id); 
                setLibro(data);
                setErrorImagen(false);
            } catch (error) {
                console.error("Error al cargar el detalle del libro:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerDatosLibro();
    }, [id]);

   
    const agregarAReservasLocales = (libroObjeto) => {
        const reservasActuales = JSON.parse(localStorage.getItem('reservas_pendientes')) || [];
        const existeIndex = reservasActuales.findIndex(item => item.libro.id === libroObjeto.id);
        
        if (existeIndex >= 0) {
            reservasActuales[existeIndex].cantidad += 1;
        } else {
            reservasActuales.push({ libro: libroObjeto, cantidad: 1 });
        }

        localStorage.setItem('reservas_pendientes', JSON.stringify(reservasActuales));
        window.dispatchEvent(new Event('reservas_updated'));
    };

    const handleAgregarAReservas = () => {
        if (!libro) return;
        agregarAReservasLocales(libro);
        setUltimoReservado(libro);
    };

    if (cargando) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', background: '#fcfaf2', minHeight: '100vh', fontFamily: 'serif' }}>
                Cargando obra...
            </div>
        );
    }

    if (!libro) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', background: '#fcfaf2', minHeight: '100vh', fontFamily: 'serif' }}>
                Obra no encontrada.
            </div>
        );
    }

    const mostrarImagenReal = Boolean(libro.imagenUrl) && !errorImagen;
    const tieneStock = libro.ejemplares > 0;

    return (
        <div style={{ backgroundColor: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', margin: 0, position: 'relative' }}>
            
            {/* MINI POPUP FLOTANTE (CONFIRMACIÓN DE RESERVA) */}
            {ultimoReservado && (
                <div style={popupOverlayStyle}>
                    <div style={popupCardStyle}>
                        <div style={popupHeaderStyle}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a1917', fontFamily: 'system-ui', paddingRight: '10px'}}>
                                Agregado a Reservas
                            </span>
                            <button 
                                onClick={() => setUltimoReservado(null)} 
                                style={popupCloseBtnStyle}
                                title="Cerrar"
                            >
                                ✕
                            </button>
                        </div>

                        <div style={popupBodyStyle}>
                            <img 
                                src={ultimoReservado.imagenUrl} 
                                alt={ultimoReservado.titulo} 
                                style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #e5dec9' }} 
                            />
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#2c1810', fontWeight: '500' }}>
                                    {ultimoReservado.titulo}
                                </h4>
                                <span style={{ fontSize: '0.85rem', color: '#70695d', display: 'block', fontFamily: 'system-ui' }}>
                                    {ultimoReservado.autor}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginTop: '4px', fontFamily: 'system-ui' }}>
                                    Préstamo renovable (14 días)
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '15px 20px', borderTop: '1px solid #efebe0' }}>
                            <button 
                                onClick={() => { setUltimoReservado(null); navigate('/reservas'); }}
                                style={popupActionBtnStyle}
                            >
                                Ver Reservas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HERO BLACK HEADER (Estilo unificado con Corrientes Literarias) */}
            <div style={{ backgroundColor: '#0f0e0c', color: '#fcfaf2', padding: '60px 10%' }}>
                <Link to="/catalogo" style={{ color: '#a8a297', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '20px' }}>
                    ← Catálogo
                </Link>
                
                <p style={{ color: '#a8a297', fontSize: '0.9rem', margin: '0 0 8px 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {libro.corrienteNombre || 'LITERATURA UNIVERSAL'} {libro.anioPublicacion ? `· ${libro.anioPublicacion}` : ''}
                </p>
                
                <h1 style={{ fontSize: '3.8rem', fontWeight: '400', margin: '0 0 16px 0', fontFamily: 'serif', lineHeight: '1.1' }}>
                    {libro.titulo}
                </h1>
                
                <p style={{ color: '#e5dec9', fontSize: '1.3rem', fontStyle: 'italic', margin: 0, maxWidth: '700px', fontWeight: '300' }}>
                    {libro.autor}
                </p>
            </div>

            {/* CUERPO PRINCIPAL DEL DETALLE */}
            <div style={{ padding: '60px 10%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: '60px', alignItems: 'start' }}>
                    
                    {/* PORTADA FÍSICA 3D */}
                    <div style={{ 
                        position: 'relative',
                        height: '520px', 
                        borderRadius: '3px 6px 6px 3px', 
                        boxShadow: '4px 4px 0px #1a1917, 12px 20px 35px rgba(44, 24, 16, 0.25)',
                        overflow: 'hidden',
                        backgroundColor: '#44403c'
                    }}>
                        {mostrarImagenReal ? (
                            <img 
                                src={libro.imagenUrl} 
                                alt={`Portada de ${libro.titulo}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                onError={() => setErrorImagen(true)}
                            />
                        ) : (
                            <div style={{
                                background: 'linear-gradient(135deg, #44403c 0%, #292524 100%)',
                                width: '100%',
                                height: '100%',
                                padding: '40px 30px',
                                boxSizing: 'border-box',
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <span style={{ color: '#fcfaf2', fontSize: '0.85rem', opacity: 0.6, fontWeight: 'bold', display: 'block', marginBottom: '10px', fontFamily: 'system-ui' }}>
                                        {libro.anioPublicacion}
                                    </span>
                                    <h2 style={{ color: '#fcfaf2', fontSize: '2.2rem', margin: 0, fontWeight: '400', lineHeight: '1.2' }}>
                                        {libro.titulo}
                                    </h2>
                                </div>
                                <span style={{ color: '#fcfaf2', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, fontWeight: 'bold', fontFamily: 'system-ui' }}>
                                    {libro.autor}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DETALLES Y ACCIONES */}
                    <div style={{ padding: '10px 0' }}>
                        
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#1a1917', marginBottom: '35px', maxWidth: '650px' }}>
                            {libro.sinopsis && libro.sinopsis.length > 5 ? libro.sinopsis : 'Sin descripción disponible para esta edición en el acervo actual.'}
                        </p>

                        {/* BLOQUE RECURSO ACADÉMICO / ANÁLISIS */}
                        <div style={{
                            backgroundColor: '#efebe0',
                            borderLeft: '4px solid #5c3a21',
                            padding: '18px 22px',
                            borderRadius: '4px',
                            marginBottom: '35px',
                            maxWidth: '650px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#70695d', fontWeight: 'bold', display: 'block', fontFamily: 'system-ui' }}>
                                        RECURSO ACADÉMICO
                                    </span>
                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1917', display: 'block', marginTop: '2px' }}>
                                        Análisis filosófico, estructura y guía de lectura
                                    </span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/libro/${libro.id}/analisis`)}
                                    style={{
                                        backgroundColor: '#5c3a21',
                                        color: '#fcfaf2',
                                        border: 'none',
                                        padding: '10px 18px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'system-ui'
                                    }}
                                >
                                    Ver Análisis
                                </button>
                            </div>
                        </div>

                        {/* METADATOS TÉCNICOS */}
                        <div style={{ borderTop: '1px solid #e5dec9', borderBottom: '1px solid #e5dec9', padding: '15px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px', fontFamily: 'system-ui', maxWidth: '650px' }}>
                            <div>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#70695d', display: 'block', marginBottom: '4px' }}>Género</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{libro.generoNombre || '-'}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#70695d', display: 'block', marginBottom: '4px' }}>Subgénero</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{libro.subgeneroNombre || '-'}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#70695d', display: 'block', marginBottom: '4px' }}>Año</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{libro.anioPublicacion || '-'}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#70695d', display: 'block', marginBottom: '4px' }}>ISBN</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{libro.isbn || '-'}</span>
                            </div>
                        </div>

                        {/* REGISTRO DE ARCHIVO Y DISPONIBILIDAD */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #e5dec9',
                            padding: '16px 0',
                            marginBottom: '35px',
                            fontFamily: 'system-ui',
                            maxWidth: '650px'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#70695d', display: 'block', marginBottom: '2px' }}>
                                    Registro de Archivo
                                </span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1a1917' }}>
                                    REF: ID-{libro.id} {libro.isbn ? `· ISBN ${libro.isbn}` : ''}
                                </span>
                            </div>

                            <span style={{
                                fontSize: '0.8rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                color: tieneStock ? '#2e7d32' : '#c62828',
                                fontWeight: 'bold'
                            }}>
                                {tieneStock ? `✓ DISPONIBLE (${libro.ejemplares} ${libro.ejemplares === 1 ? 'UNIDAD' : 'UNIDADES'})` : '✕ EJEMPLARES AGOTADOS'}
                            </span>
                        </div>

                        {/* BOTONES DE ACCIÓN */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <button
                                disabled={!tieneStock}
                                onClick={handleAgregarAReservas}
                                style={{
                                    backgroundColor: tieneStock ? '#5c3a21' : '#a39e93',
                                    color: '#fcfaf2',
                                    border: 'none',
                                    padding: '14px 28px',
                                    borderRadius: '30px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    cursor: tieneStock ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontFamily: 'system-ui'
                                }}
                            >
                                Reservar Ejemplar
                            </button>

                            <BotonGuardarLectura libroId={libro.id} variante="texto" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const popupOverlayStyle = {
    position: 'fixed',
    top: '75px',
    right: '40px',
    zIndex: 2500,
    animation: 'fadeIn 0.2s ease-out'
};

const popupCardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e2d5',
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    width: '320px',
    fontFamily: '"Playfair Display", Georgia, serif'
};

const popupHeaderStyle = {
    padding: '14px 18px',
    borderBottom: '1px solid #efebe0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const popupCloseBtnStyle = {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    color: '#70695d',
    cursor: 'pointer',
    padding: '2px'
};

const popupBodyStyle = {
    padding: '16px 18px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
};

const popupActionBtnStyle = {
    width: '100%',
    backgroundColor: '#1a1917',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '2px',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif'
};

export default DetalleLibro;