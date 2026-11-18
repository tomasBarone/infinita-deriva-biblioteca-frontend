import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';



const SolicitudReserva = () => {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [sedeRetiro, setSedeRetiro] = useState('Sede Central - Sala de Estudio');
    const [motivoConsulta, setMotivoConsulta] = useState('');
    const [modalidades, setModalidades] = useState({});

    useEffect(() => {
        
        const guardadas = JSON.parse(localStorage.getItem('reservas_pendientes')) || [];
        setReservas(guardadas);

        
        const modsIniciales = {};
        guardadas.forEach((item, index) => {
            modsIniciales[item.libro.id || index] = 'Préstamo Domiciliario (14 días)';
        });
        setModalidades(modsIniciales);
    }, []);

    const handleEliminarItem = (idLibro) => {
        const actualizadas = reservas.filter(item => item.libro.id !== idLibro);
        setReservas(actualizadas);
        localStorage.setItem('reservas_pendientes', JSON.stringify(actualizadas));
        window.dispatchEvent(new Event('reservas_updated'));
    };

    const handleCambiarModalidad = (idLibro, valor) => {
        setModalidades(prev => ({ ...prev, [idLibro]: valor }));
    };

    const handleEmitirSolicitud = (e) => {
        e.preventDefault();
        if (reservas.length === 0) return;

       
        alert("¡Solicitud de consulta emitida con éxito al Archivo Central!");
        localStorage.removeItem('reservas_pendientes');
        window.dispatchEvent(new Event('reservas_updated'));
        navigate('/catalogo');
    };

    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 14);
    const fechaDevolucionStr = fechaActual.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    if (reservas.length === 0) {
        return (
            <div style={{ backgroundColor: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', padding: '80px 10%', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '400', color: '#1a1917', marginBottom: '15px' }}>Boletín de Solicitud de Consulta</h1>
                <p style={{ color: '#70695d', fontSize: '1.05rem', marginBottom: '30px', fontFamily: 'system-ui' }}>No hay obras seleccionadas en el registro de archivo actual.</p>
                <Link to="/catalogo" style={{ backgroundColor: '#5c3a21', color: '#fcfaf2', padding: '12px 26px', textDecoration: 'none', borderRadius: '2px', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                    Explorar Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', paddingBottom: '90px' }}>
            
            {/* CABECERA INSTITUCIONAL */}
            <div style={{ backgroundColor: '#0f0e0c', color: '#fcfaf2', padding: '55px 10%' }}>
                <Link to="/libros" style={{ color: '#a8a297', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '18px', fontFamily: 'system-ui' }}>
                    ← Catálogo
                </Link>
                <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: '0 0 10px 0', fontFamily: 'serif' }}>
                    Boletín de Solicitud de Consulta
                </h1>
                <p style={{ color: '#a8a297', fontSize: '1rem', margin: 0, fontFamily: 'system-ui', fontWeight: '300' }}>
                    Revisá las obras seleccionadas y definí la modalidad de estudio antes de emitir tu ficha.
                </p>
            </div>

            {/* CONTENEDOR PRINCIPAL EN GRILLA */}
            <div style={{ maxWidth: '1200px', margin: '50px auto 0 auto', padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
                
                {/* COLUMNA IZQUIERDA: LISTADO DE FICHAS DE OBRA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reservas.map(({ libro }) => {
                        const id = libro.id;
                        const modalidadActual = modalidades[id] || 'Préstamo Domiciliario (14 días)';

                        return (
                            <div key={id} style={{
                                backgroundColor: '#f5f0e6',
                                border: '1px solid #e2ded7',
                                borderLeft: '4px solid #2c1810',
                                padding: '24px 28px',
                                display: 'grid',
                                gridTemplateColumns: '110px 1fr auto',
                                gap: '24px',
                                alignItems: 'start',
                                position: 'relative'
                            }}>
                                {/* PORTADA O MINIATURA */}
                                <div style={{ width: '110px', height: '150px', backgroundColor: '#332922', borderRadius: '2px', overflow: 'hidden', boxShadow: '2px 3px 10px rgba(0,0,0,0.15)' }}>
                                    {libro.imagenUrl ? (
                                        <img src={libro.imagenUrl} alt={libro.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ padding: '10px', color: '#fcfaf2', fontSize: '0.7rem', fontFamily: 'system-ui' }}>{libro.titulo}</div>
                                    )}
                                </div>

                                {/* INFORMACIÓN BIBLIOGRÁFICA */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontFamily: 'system-ui', fontSize: '0.7rem', letterSpacing: '1px', color: '#70695d', textTransform: 'uppercase' }}>
                                        <span>REF. #{libro.id}</span>
                                        <span>•</span>
                                        <span style={{ backgroundColor: '#efebe0', padding: '2px 6px', borderRadius: '2px', border: '1px solid #d4cebd', color: '#2c1810' }}>
                                            {libro.corrienteNombre || 'LITERATURA UNIVERSAL'}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.35rem', fontWeight: '600', color: '#1a1917', margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>
                                        {libro.titulo}
                                    </h3>
                                    
                                    <p style={{ fontSize: '0.95rem', color: '#544f46', fontStyle: 'italic', margin: 0 }}>
                                        {libro.autor}
                                    </p>

                                    <p style={{ fontSize: '0.82rem', color: '#70695d', margin: '4px 0 10px 0', fontFamily: 'system-ui' }}>
                                        Ubicación: <strong>Sala Principal - Estantería B</strong>
                                    </p>

                                    {/* SELECTOR DE MODALIDAD */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '4px', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'system-ui' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#544f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modalidad:</span>
                                            <select 
                                                value={modalidadActual}
                                                onChange={(e) => handleCambiarModalidad(id, e.target.value)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '2px',
                                                    border: '1px solid #d4cebd',
                                                    backgroundColor: '#ffffff',
                                                    fontSize: '0.82rem',
                                                    color: '#1a1917',
                                                    fontFamily: 'system-ui',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Préstamo Domiciliario (14 días)">Préstamo Domiciliario (14 días)</option>
                                                <option value="Consulta en Sala de Lectura">Consulta en Sala de Lectura</option>
                                                <option value="Investigación Especial (Sala Reservada)">Investigación Especial (Sala Reservada)</option>
                                            </select>
                                        </div>

                                        <button 
                                            onClick={() => navigate(`/libro/${libro.id}/analisis`)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#5c3a21',
                                                fontSize: '0.78rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                fontFamily: 'system-ui',
                                                textDecoration: 'underline',
                                                padding: 0
                                            }}
                                        >
                                            Ver ficha de análisis ↗
                                        </button>
                                    </div>
                                </div>

                                {/* BOTÓN RETIRAR / ELIMINAR */}
                                <button 
                                    onClick={() => handleEliminarItem(id)}
                                    title="Remover del boletín"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a93226',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        fontFamily: 'system-ui'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>

               {/* COLUMNA DERECHA: FICHA DE SOLICITUD BIBLIOGRÁFICA (SIDEBAR) */}
                    <div style={{
                        backgroundColor: '#f5f0e6',
                        border: '1px solid #d4cebd',
                        padding: '30px',
                        borderRadius: '2px',
                        boxShadow: '0 4px 15px rgba(44, 24, 16, 0.04)',
                        position: 'sticky',
                        top: '30px',
                        fontFamily: 'system-ui, sans-serif'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2c1810', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #e2ded7', paddingBottom: '12px', fontFamily: '"Playfair Display", Georgia, serif' }}>
                            Ficha de Solicitud Bibliográfica
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#443f38', marginBottom: '25px' }}>
                           <div>
                                <span style={{ fontSize: '0.7rem', color: '#70695d', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Titular</span>
                                <strong style={{ color: '#1a1917' }}>
                                    {(() => {
                                       
                                        const userEmail = localStorage.getItem('nombreUsuario') || 'Lector Académico';
                                      
                                        const paseId = localStorage.getItem('userId') || '0042';
                                        return `${userEmail} (Pase #${paseId.length > 6 ? '0042' : paseId.padStart(4, '0')})`;
                                    })()}
                                </strong>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#70695d', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px', marginBottom: '4px' }}>Sede de Retiro</label>
                                <select 
                                    value={sedeRetiro}
                                    onChange={(e) => setSedeRetiro(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '2px',
                                        border: '1px solid #d4cebd',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                        color: '#1a1917',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="Sede Central - Sala de Estudio">Sede Central - Sala de Estudio</option>
                                    <option value="Sala Histórica - Filial Norte">Sala Histórica - Filial Norte</option>
                                    <option value="Anexo Investigadores">Anexo Investigadores</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2ded7', paddingTop: '12px' }}>
                                <span style={{ color: '#70695d' }}>Obras solicitadas:</span>
                                <strong style={{ color: '#1a1917' }}>{reservas.length} {reservas.length === 1 ? 'título' : 'títulos'}</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#70695d' }}>Devolución estimada:</span>
                                <strong style={{ color: '#1a1917' }}>{fechaDevolucionStr}</strong>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#70695d', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px', marginBottom: '4px' }}>Motivo de consulta (Opcional)</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Ej. Tesis de grado, seminario, investigación doctoral..."
                                    value={motivoConsulta}
                                    onChange={(e) => setMotivoConsulta(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '2px',
                                        border: '1px solid #d4cebd',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                        color: '#1a1917',
                                        outline: 'none',
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                        fontFamily: 'system-ui'
                                    }}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleEmitirSolicitud}
                            style={{
                                width: '100%',
                                backgroundColor: '#2c1810',
                                color: '#fcfaf2',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '2px',
                                fontSize: '0.78rem',
                                fontWeight: '600',
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            Emitir Solicitud de Consulta →
                        </button>
                    </div>

            </div>
        </div>
    );
};

export default SolicitudReserva;