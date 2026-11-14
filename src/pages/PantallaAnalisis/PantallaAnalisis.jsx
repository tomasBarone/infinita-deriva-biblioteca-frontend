import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import analisisService from '../../services/analisisService';
import './PantallaAnalisis.css';

function PantallaAnalisis() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [analisis, setAnalisis] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(1.08);
    const [copiado, setCopiado] = useState(false);


    const [seccionesAbiertas, setSeccionesAbiertas] = useState({
        ejes: true,
        teoria: true,
        sensaciones: true
    });

    const toggleSeccion = (seccion) => {
        setSeccionesAbiertas(prev => ({
            ...prev,
            [seccion]: !prev[seccion]
        }));
    };

    useEffect(() => {
        setCargando(true);
        analisisService.obtenerPorLibroId(id)
            .then(data => {
                setAnalisis(data);
                setCargando(false);
            })
            .catch(() => {
                setError("No se pudo cargar el análisis académico de esta obra.");
                setCargando(false);
            });
    }, [id]);

    const calcularTiempoLectura = () => {
        if (!analisis) return 0;
        const textoTotal = `${analisis.introduccionTeorica || ''} ${analisis.mapaSensaciones || ''}`;
        const palabras = textoTotal.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(palabras / 200));
    };

    const copiarCitaAcademica = () => {
        const textoCita = `Infinita Deriva — Archivo de Estudios Críticos. Ensayo sobre "${analisis?.libro || 'Obra'}". Ref. Manuscrito N° ${id}. Consultado en línea.`;
        navigator.clipboard.writeText(textoCita);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 3000);
    };

    const parseMarkdownText = (texto) => {
        if (!texto) return null;

        return texto.split('\n').map((parrafo, idxParrafo) => {
            if (!parrafo.trim()) return null;

            const partes = parrafo.split(/(\*\*.*?\*\*)/g);

            return (
                <p key={idxParrafo} className="parrafo-analisis">
                    {partes.map((parte, idxParte) => {
                        if (parte.startsWith('**') && parte.endsWith('**')) {
                            const textoContenido = parte.slice(2, -2);
                            return (
                                <strong key={idxParte} className="keyword-highlight">
                                    {textoContenido}
                                </strong>
                            );
                        }
                        return parte;
                    })}
                </p>
            );
        });
    };

    if (cargando) return <div className="analisis-loading">Consultando ensayo académico en el archivo...</div>;
    if (error) return (
        <div className="analisis-error">
            <p>{error}</p>
            <button className="btn-volver-bottom" onClick={() => navigate(-1)}>Volver</button>
        </div>
    );

    return (
        <div className="analisis-hero-wrapper">
            
          
            <div className="analisis-hero-bg">
                <button className="btn-volver-floating" onClick={() => navigate(-1)}>
                    ← Volver a la Obra
                </button>

                <div className="analisis-hero-content-center">
                    <span className="academic-tag-hero">Estudio Crítico — Archivo Infinita Deriva</span>
                    <span className="academic-ref-code-hero">Ref. Manuscrito de Acervo — N° {id}</span>
                    <h1 className="analisis-main-title-hero">{analisis.libro}</h1>
                </div>
            </div>

            <div className="analisis-hero-spacer" />

            
            <div className="analisis-sheet-container">
                <div className="analisis-content-inner">
                
                    <div className="analisis-meta-bar">
                        <span className="tiempo-lectura">
                            Tiempo estimado de lectura: {calcularTiempoLectura()} min
                        </span>

                        <div className="controles-zoom">
                            <span>Tipografía:</span>
                            <button onClick={() => setFontSize(p => Math.max(0.9, +(p - 0.1).toFixed(2)))}>A-</button>
                            <button onClick={() => setFontSize(p => Math.min(1.35, +(p + 0.1).toFixed(2)))}>A+</button>
                        </div>
                    </div>

                
                    <main className="acordeon-lectura-wrapper" style={{ fontSize: `${fontSize}rem` }}>
                        
                 
                        <section className="acordeon-lectura-seccion">
                            <button 
                                type="button" 
                                className="acordeon-lectura-header" 
                                onClick={() => toggleSeccion('ejes')}
                            >
                                <h2 className="acordeon-lectura-titulo">Ejes de Clasificación Teórica</h2>
                                <span className="acordeon-lectura-icono">
                                    {seccionesAbiertas.ejes ? '−' : '+'}
                                </span>
                            </button>

                            {seccionesAbiertas.ejes && (
                                <div className="acordeon-lectura-contenido">
                                    <div className="ejes-teoricos-fluidos">
                                        <div className="item-eje">
                                            <strong>Sustrato Filosófico</strong>
                                            <p>{analisis.sustratoFilosofico || 'No especificado'}</p>
                                        </div>
                                        <div className="item-eje border-left-limpio">
                                            <strong>Eje Psicológico</strong>
                                            <p>{analisis.ejePsicologico || 'No especificado'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {analisis.introduccionTeorica && (
                            <section className="acordeon-lectura-seccion">
                                <button 
                                    type="button" 
                                    className="acordeon-lectura-header" 
                                    onClick={() => toggleSeccion('teoria')}
                                >
                                    <h2 className="acordeon-lectura-titulo">I. Enfoque de Teoría Literaria</h2>
                                    <span className="acordeon-lectura-icono">
                                        {seccionesAbiertas.teoria ? '−' : '+'}
                                    </span>
                                </button>

                                {seccionesAbiertas.teoria && (
                                    <div className="acordeon-lectura-contenido">
                                        {parseMarkdownText(analisis.introduccionTeorica)}
                                    </div>
                                )}
                            </section>
                        )}

                       
                        {analisis.mapaSensaciones && (
                            <section className="acordeon-lectura-seccion">
                                <button 
                                    type="button" 
                                    className="acordeon-lectura-header" 
                                    onClick={() => toggleSeccion('sensaciones')}
                                >
                                    <h2 className="acordeon-lectura-titulo">II. Arquitectura Sensorial y Mapa de Sensaciones</h2>
                                    <span className="acordeon-lectura-icono">
                                        {seccionesAbiertas.sensaciones ? '−' : '+'}
                                    </span>
                                </button>

                                {seccionesAbiertas.sensaciones && (
                                    <div className="acordeon-lectura-contenido">
                                        {parseMarkdownText(analisis.mapaSensaciones)}
                                    </div>
                                )}
                            </section>
                        )}

                    </main>

                    <div className="cita-academica-limpia">
                        <p className="cita-texto-limpio">
                            <em>Infinita Deriva</em> — Archivo de Estudios Críticos. Ensayo sobre "{analisis.libro}". Ref. Manuscrito N° {id}.
                        </p>
                        <button onClick={copiarCitaAcademica} className="btn-copiar-cita-limpia">
                            {copiado ? '¡Copiado!' : 'Copiar Cita'}
                        </button>
                    </div>

                    <footer className="analisis-footer-editorial">
                        <p>Infinita Deriva — Archivo de Estudios Críticos y Monografías</p>
                    </footer>
                  
                    <div className="analisis-bottom-actions">
                        <button className="btn-volver-bottom" onClick={() => navigate(`/libro/${id}`)}>
                            ← Regresar a la Ficha de la Obra
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PantallaAnalisis;