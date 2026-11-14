import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import analisisService from '../../services/analisisService';
import './AdminAnalisisForm.css';

function AdminAnalisisForm() {
    const { id } = useParams(); // ID del libro
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        introduccionTeorica: '',
        ejePsicologico: '',
        sustratoFilosofico: '',
        mapaSensaciones: ''
    });

    // Control de acordeones abiertos (todos abiertos por defecto o puedes alternar)
    const [seccionesAbiertas, setSeccionesAbiertas] = useState({
        conceptual: true,
        introduccion: true,
        sensaciones: true
    });

    const toggleSeccion = (seccion) => {
        setSeccionesAbiertas(prev => ({
            ...prev,
            [seccion]: !prev[seccion]
        }));
    };

    const [esEdicion, setEsEdicion] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        setCargando(true);
        analisisService.obtenerPorLibroId(id)
            .then(data => {
                if (data) {
                    setFormData({
                        introduccionTeorica: data.introduccionTeorica || '',
                        ejePsicologico: data.ejePsicologico || '',
                        sustratoFilosofico: data.sustratoFilosofico || '',
                        mapaSensaciones: data.mapaSensaciones || ''
                    });
                    setEsEdicion(true);
                }
                setCargando(false);
            })
            .catch(() => {
                setEsEdicion(false);
                setCargando(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        const payload = {
            id: parseInt(id),
            introduccionTeorica: formData.introduccionTeorica,
            ejePsicologico: formData.ejePsicologico,
            sustratoFilosofico: formData.sustratoFilosofico,
            mapaSensaciones: formData.mapaSensaciones
        };

        try {
            if (esEdicion) {
                await analisisService.actualizarAnalisis(payload);
                setMensaje({ texto: '¡Ficha de análisis actualizada con éxito en el archivo!', tipo: 'exito' });
            } else {
                await analisisService.crearAnalisis(payload);
                setMensaje({ texto: '¡Análisis crítico dado de alta y vinculado con éxito!', tipo: 'exito' });
                setEsEdicion(true);
            }
        } catch (error) {
            setMensaje({ texto: 'Hubo un error al resguardar la información académica.', tipo: 'error' });
            console.error('Error al enviar el formulario de análisis:', error);
        }
    };

    if (cargando) return <div className="loading-analisis">Consultando anales críticos de la obra...</div>;

    return (
        <div className="admin-analisis-container">
            
            {/* CABECERA INSTITUCIONAL */}
            <header className="admin-analisis-hero">
                <div className="admin-analisis-hero-inner">
                    <button className="btn-volver-dashboard" onClick={() => navigate('/admin')}>
                        ← Volver al Archivo Central
                    </button>
                    <div>
                        <p className="admin-analisis-eyebrow">ESTUDIO CRÍTICO DE LA OBRA — REF. #{id}</p>
                        <h1 className="admin-analisis-title">
                            {esEdicion ? 'Edición de Análisis Literario' : 'Redacción de Nuevo Análisis'}
                        </h1>
                    </div>
                </div>
            </header>

            {/* CUERPO DEL ESTUDIO EN FORMATO ACORDEÓN */}
            <div className="admin-analisis-content">

                {mensaje.texto && (
                    <div className={`alerta-mensaje ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-cuaderno-critico">
                    
                    {/* ACORDEÓN 1: MARCO CONCEPTUAL */}
                    <div className="acordeon-seccion">
                        <button 
                            type="button" 
                            className="acordeon-header" 
                            onClick={() => toggleSeccion('conceptual')}
                        >
                            <h3 className="acordeon-titulo">I. Marco Conceptual (Sustrato Filosófico y Eje Psicológico)</h3>
                            <span className="acordeon-icono">{seccionesAbiertas.conceptual ? '−' : '+'}</span>
                        </button>

                        {seccionesAbiertas.conceptual && (
                            <div className="acordeon-contenido">
                                <div className="form-row-dual">
                                    <div className="form-field-group">
                                        <label className="form-field-label" htmlFor="sustratoFilosofico">Sustrato Filosófico</label>
                                        <input
                                            type="text"
                                            id="sustratoFilosofico"
                                            name="sustratoFilosofico"
                                            value={formData.sustratoFilosofico}
                                            onChange={handleChange}
                                            placeholder="Ej: Existencialismo, Nihilismo..."
                                            required
                                            className="form-input-clasico"
                                        />
                                    </div>

                                    <div className="form-field-group">
                                        <label className="form-field-label" htmlFor="ejePsicologico">Eje Psicológico</label>
                                        <input
                                            type="text"
                                            id="ejePsicologico"
                                            name="ejePsicologico"
                                            value={formData.ejePsicologico}
                                            onChange={handleChange}
                                            placeholder="Ej: Dualidad de la psique, Melancolía..."
                                            required
                                            className="form-input-clasico"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACORDEÓN 2: INTRODUCCIÓN TEÓRICA */}
                    <div className="acordeon-seccion">
                        <button 
                            type="button" 
                            className="acordeon-header" 
                            onClick={() => toggleSeccion('introduccion')}
                        >
                            <h3 className="acordeon-titulo">II. Introducción Teórica y Enfoque Crítico</h3>
                            <span className="acordeon-icono">{seccionesAbiertas.introduccion ? '−' : '+'}</span>
                        </button>

                        {seccionesAbiertas.introduccion && (
                            <div className="acordeon-contenido">
                                <div className="form-field-group">
                                    <textarea
                                        id="introduccionTeorica"
                                        name="introduccionTeorica"
                                        value={formData.introduccionTeorica}
                                        onChange={handleChange}
                                        rows="7"
                                        placeholder="Desarrolle el marco teórico, referencias a fuentes primarias o análisis contextual de la obra..."
                                        required
                                        className="form-textarea-clasico"
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACORDEÓN 3: MAPA DE SENSACIONES */}
                    <div className="acordeon-seccion">
                        <button 
                            type="button" 
                            className="acordeon-header" 
                            onClick={() => toggleSeccion('sensaciones')}
                        >
                            <h3 className="acordeon-titulo">III. Arquitectura Sensorial y Mapa de Sensaciones</h3>
                            <span className="acordeon-icono">{seccionesAbiertas.sensaciones ? '−' : '+'}</span>
                        </button>

                        {seccionesAbiertas.sensaciones && (
                            <div className="acordeon-contenido">
                                <div className="form-field-group">
                                    <textarea
                                        id="mapaSensaciones"
                                        name="mapaSensaciones"
                                        value={formData.mapaSensaciones}
                                        onChange={handleChange}
                                        rows="7"
                                        placeholder="Describa el viaje atmosférico, estilístico o la evolución conceptual de los personajes..."
                                        required
                                        className="form-textarea-clasico"
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Barra de Acciones Final */}
                    <div className="form-actions-bar">
                        <button type="submit" className="btn-guardar-analisis">
                            {esEdicion ? 'Actualizar Ficha de Análisis' : 'Consolidar Análisis en el Archivo'}
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn-ver-publico" 
                            onClick={() => navigate(`/libro/${id}/analisis`)}
                        >
                            Vista Previa de Lectura ↗
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AdminAnalisisForm; 