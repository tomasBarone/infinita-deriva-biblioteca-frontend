import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import libroService from '../services/libroService';
import analisisService from '../services/analisisService';
import BotonGuardarLectura from '../components/Guardar/BotonGuardarLectura';

const DetalleLibro = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [libro, setLibro] = useState(null);
    const [contextoHistorico, setContextoHistorico] = useState(null);
    const [acordeonContextoAbierto, setAcordeonContextoAbierto] = useState(false);
    
    const [cargando, setCargando] = useState(true);
    const [errorImagen, setErrorImagen] = useState(false);
    const [ultimoReservado, setUltimoReservado] = useState(null);

    useEffect(() => {
        const obtenerDatosCompletos = async () => {
            setCargando(true);
            try {
                
                const [dataLibro, dataAnalisis] = await Promise.all([
                    libroService.obtenerPorId(id),
                    analisisService.obtenerPorLibroId(id).catch(() => null)
                ]);

                setLibro(dataLibro);
                setErrorImagen(false);

                if (dataAnalisis && dataAnalisis.contextoHistorico) {
                    setContextoHistorico(dataAnalisis.contextoHistorico);
                } else {
                    setContextoHistorico(null);
                }
            } catch (error) {
                console.error("Error al cargar el detalle del libro:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerDatosCompletos();
    }, [id]);

   const agregarAReservasLocales = (libroObjeto) => {
        const reservasActuales = JSON.parse(localStorage.getItem('reservas_pendientes')) || [];
        const existeIndex = reservasActuales.findIndex(item => item.libro.id === libroObjeto.id);
        
        
        if (existeIndex >= 0) {
         
            reservasActuales[existeIndex].cantidad = 1; 
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
            <div style={{ padding: '80px', textAlign: 'center', background: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', color: '#544f46' }}>
                Consultando cédula de archivo...
            </div>
        );
    }

    if (!libro) {
        return (
            <div style={{ padding: '80px', textAlign: 'center', background: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', color: '#544f46' }}>
                Obra no encontrada en el acervo.
            </div>
        );
    }

    const mostrarImagenReal = Boolean(libro.imagenUrl) && !errorImagen;
    const tieneStock = libro.ejemplares > 0;

    return (
        <div style={{ backgroundColor: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', margin: 0, position: 'relative', paddingBottom: '90px' }}>
            
         
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

            {/* CABECERA NEGRA INSTITUCIONAL */}
            <div style={{ backgroundColor: '#0f0e0c', color: '#fcfaf2', padding: '55px 10%' }}>
                <Link to="/catalogo" style={{ color: '#a8a297', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '18px', fontFamily: 'system-ui' }}>
                    ← Catálogo
                </Link>
                
                <p style={{ color: '#a8a297', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                    {libro.corrienteNombre || 'LITERATURA UNIVERSAL'} {libro.anioPublicacion ? `· ${libro.anioPublicacion}` : ''}
                </p>
                
                <h1 style={{ fontSize: '3.4rem', fontWeight: '400', margin: '0 0 12px 0', fontFamily: '"Playfair Display", Georgia, serif', lineHeight: '1.15' }}>
                    {libro.titulo}
                </h1>
                
                <p style={{ color: '#e5dec9', fontSize: '1.25rem', fontStyle: 'italic', margin: 0, maxWidth: '700px', fontWeight: '300' }}>
                    {libro.autor}
                </p>
            </div>

            {/* 1. VITRINA CENTRAL */}
            <div style={{
                backgroundColor: '#efefec',
                padding: '65px 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid #e2dfd7'
            }}>
                <div style={{
                    width: '320px',
                    height: '460px',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#292524'
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
                            background: 'linear-gradient(135deg, #3c3834 0%, #1f1d1b 100%)',
                            width: '100%',
                            height: '100%',
                            padding: '35px 28px',
                            boxSizing: 'border-box',
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <span style={{ color: '#fcfaf2', fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '10px', fontFamily: 'system-ui' }}>
                                    {libro.anioPublicacion}
                                </span>
                                <h2 style={{ color: '#fcfaf2', fontSize: '1.9rem', margin: 0, fontWeight: '400', lineHeight: '1.2' }}>
                                    {libro.titulo}
                                </h2>
                            </div>
                            <span style={{ color: '#fcfaf2', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, fontFamily: 'system-ui' }}>
                                {libro.autor}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. COLUMNA CENTRAL DE LECTURA Y CÉDULA CURATORIAL */}
            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '65px 24px 0 24px' }}>
                
                {/* TÍTULO DE SECCIÓN */}
                <h2 style={{
                    fontSize: '2.2rem',
                    fontWeight: '400',
                    color: '#1a1917',
                    margin: '0 0 8px 0',
                    fontFamily: '"Playfair Display", Georgia, serif'
                }}>
                   Una Aproximación
                </h2>

                <p style={{
                    fontSize: '0.9rem',
                    color: '#70695d',
                    margin: '0 0 28px 0',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {libro.autor} {libro.anioPublicacion ? `(${libro.anioPublicacion})` : ''}
                </p>

                {/* SINOPSIS */}
                <p style={{
                    fontSize: '1.08rem',
                    lineHeight: '1.8',
                    color: '#2c2925',
                    marginBottom: '45px',
                    whiteSpace: 'pre-line'
                }}>
                    {libro.sinopsis && libro.sinopsis.length > 5 
                        ? libro.sinopsis 
                        : 'Sin descripción disponible para esta edición en el acervo actual.'}
                </p>

                {/* RECURSO ACADÉMICO  */}
                <div style={{
                    backgroundColor: '#f3efe4',
                    borderLeft: '3px solid #5c3a21',
                    padding: '18px 24px',
                    marginBottom: '45px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#70695d', fontWeight: '700', display: 'block', fontFamily: 'system-ui' }}>
                            RECURSO ACADÉMICO
                        </span>
                        <span style={{ fontSize: '1.02rem', fontWeight: '500', color: '#1a1917', display: 'block', marginTop: '3px' }}>
                            Análisis filosófico, estructura y guía de lectura
                        </span>
                    </div>
                    <button 
                        onClick={() => navigate(`/libro/${libro.id}/analisis`)}
                        style={{
                            backgroundColor: '#5c3a21',
                            color: '#fcfaf2',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '2px',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            fontFamily: 'system-ui'
                        }}
                    >
                        Ver Análisis
                    </button>
                </div>

                {/* 3. FICHA TÉCNICA  */}
                <div style={{ borderTop: '1px solid #dfd9c8', marginBottom: '45px', fontFamily: 'system-ui, sans-serif' }}>
                    <FilaMetadato etiqueta="Autor" valor={libro.autor} />
                    <FilaMetadato etiqueta="Corriente Literaria" valor={libro.corrienteNombre || 'Literatura Universal'} />
                    <FilaMetadato etiqueta="Género" valor={libro.generoNombre || '-'} />
                    <FilaMetadato etiqueta="Subgénero" valor={libro.subgeneroNombre || '-'} />
                    <FilaMetadato etiqueta="Año de Publicación" valor={libro.anioPublicacion || '-'} />
                    <FilaMetadato etiqueta="ISBN" valor={libro.isbn || '-'} />
                    <FilaMetadato 
                        etiqueta="Registro de Archivo" 
                        valor={`REF: ID-${libro.id}${libro.isbn ? ` · ISBN ${libro.isbn}` : ''}`} 
                    />
                    <FilaMetadato 
                        etiqueta="Disponibilidad" 
                        valor={
                            <span style={{ color: tieneStock ? '#2e7d32' : '#c62828', fontWeight: '600' }}>
                                {tieneStock 
                                    ? `Disponible (${libro.ejemplares} ${libro.ejemplares === 1 ? 'unidad' : 'unidades'})` 
                                    : 'Ejemplares agotados'}
                            </span>
                        } 
                    />
                </div>

                {/* 4. BOTONES DE ACCIÓN (RESERVA Y GUARDADO) */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '60px' }}>
                    <button
                        disabled={!tieneStock}
                        onClick={handleAgregarAReservas}
                        style={{
                            backgroundColor: tieneStock ? '#5c3a21' : '#a39e93',
                            color: '#fcfaf2',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '2px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: tieneStock ? 'pointer' : 'not-allowed',
                            fontFamily: 'system-ui'
                        }}
                    >
                        Reservar Ejemplar
                    </button>

                    <BotonGuardarLectura libroId={libro.id} variante="texto" />
                </div>

                {/* 5. ACORDEÓN DE CONTEXTO HISTÓRICO (CERRADO POR DEFECTO) */}
                {contextoHistorico && (
                    <div style={{ borderTop: '1px solid #d4cebd', borderBottom: '1px solid #d4cebd' }}>
                        <button
                            type="button"
                            onClick={() => setAcordeonContextoAbierto(!acordeonContextoAbierto)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                padding: '22px 4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontFamily: 'system-ui, sans-serif'
                            }}
                        >
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: '#2c1810'
                            }}>
                                Contexto Histórico
                            </span>
                            <span style={{
                                fontSize: '1.3rem',
                                fontWeight: '300',
                                color: '#5c3a21',
                                lineHeight: 1
                            }}>
                                {acordeonContextoAbierto ? '−' : '+'}
                            </span>
                        </button>

                        {acordeonContextoAbierto && (
                            <div style={{
                                padding: '4px 4px 28px 4px',
                                fontSize: '1.02rem',
                                lineHeight: '1.8',
                                color: '#2c2925',
                                fontFamily: '"Playfair Display", Georgia, serif',
                                whiteSpace: 'pre-line'
                            }}>
                                {contextoHistorico}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

/* Componente auxiliar para cada fila de la cédula técnica */
const FilaMetadato = ({ etiqueta, valor }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: '190px 1fr',
        gap: '16px',
        padding: '14px 0',
        borderBottom: '1px solid #dfd9c8',
        fontSize: '0.9rem',
        alignItems: 'baseline'
    }}>
        <span style={{ color: '#70695d', fontWeight: '500' }}>
            {etiqueta}
        </span>
        <span style={{ color: '#1a1917' }}>
            {valor}
        </span>
    </div>
);

const popupOverlayStyle = {
    position: 'fixed',
    top: '75px',
    right: '40px',
    zIndex: 2500
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