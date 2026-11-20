import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PaseLector = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreCompleto: '',
        email: '',
        documento: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        sedePreferida: 'Sede Central - Sala de Estudio',
        categoriaLector: 'Lector General',
        aceptaReglamento: true
    });

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [solicitudEnviada, setSolicitudEnviada] = useState(false);
    const [codigoReferencia, setCodigoReferencia] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError('');

        try {
            const response = await api.post('/pase-lector/solicitar', formData);
            const referencia =
                response?.data?.numeroReferencia ||
                response?.data?.id ||
                `SOL-${Date.now().toString().slice(-6)}`;

            setCodigoReferencia(referencia);
            setSolicitudEnviada(true);
        } catch (err) {
            console.error('Error al remitir solicitud de Pase Lector:', err);
            setError(
                err.response?.data?.message ||
                'No fue posible procesar la solicitud en este momento. Por favor, intente nuevamente.'
            );
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', color: '#1a1917', paddingBottom: '90px' }}>
            
            {/* HERO CON IMAGEN DE FONDO INSTITUCIONAL */}
            <div style={{
                position: 'relative',
                backgroundImage: `linear-gradient(rgba(15, 14, 12, 0.72), rgba(15, 14, 12, 0.85)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fcfaf2',
                padding: '65px 10%'
            }}>
                <Link
                    to="/catalogo"
                    style={{
                        color: '#c8c0b0',
                        fontSize: '0.8rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        fontFamily: 'system-ui, sans-serif',
                        display: 'inline-block',
                        marginBottom: '18px'
                    }}
                >
                    ← Volver al Catálogo
                </Link>

                <p style={{
                    color: '#d8cfb8',
                    fontSize: '0.82rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    margin: '0 0 10px 0',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    ACREDITACIÓN Y MEMBRESÍA · ARCHIVO INFINITA DERIVA
                </p>

                <h1 style={{ fontSize: '3.2rem', fontWeight: '400', margin: '0 0 12px 0', lineHeight: '1.15' }}>
                    Solicitud de Pase Lector
                </h1>

                <p style={{ color: '#e5dec9', fontSize: '1.05rem', margin: 0, maxWidth: '680px', fontFamily: 'system-ui, sans-serif', fontWeight: '300', lineHeight: '1.6' }}>
                    Registrá tus datos de socio para habilitar préstamos domiciliarios por 14 días, reservas en sala de lectura y acceso a fondos especiales.
                </p>
            </div>

            {/* CUERPO PRINCIPAL */}
            <div style={{ maxWidth: '1200px', margin: '50px auto 0 auto', padding: '0 5%' }}>
                {solicitudEnviada ? (
                    <div style={{
                        backgroundColor: '#f5f0e6',
                        border: '1px solid #d4cebd',
                        borderLeft: '4px solid #2c1810',
                        padding: '40px',
                        maxWidth: '680px',
                        margin: '0 auto'
                    }}>
                        <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5c3a21', fontWeight: '700', fontFamily: 'system-ui, sans-serif', display: 'block', marginBottom: '8px' }}>
                            REGISTRO DE SOLICITUD · REF. {codigoReferencia}
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0 0 16px 0', color: '#1a1917' }}>
                            Solicitud remitida a Secretaría de Archivo
                        </h2>
                        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', color: '#443f38', lineHeight: '1.65', marginBottom: '26px' }}>
                            Su solicitud de Pase Lector ha sido recibida y derivada para su evaluación y alta en el padrón de socios. Nos pondremos en contacto a través del correo electrónico registrado.
                        </p>

                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/catalogo')}
                                style={primaryBtnStyle}
                            >
                                Explorar Catálogo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSolicitudEnviada(false);
                                    setCodigoReferencia('');
                                }}
                                style={secondaryBtnStyle}
                            >
                                Completar Otra Solicitud
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 390px)', gap: '45px', alignItems: 'start' }}>
                        
                        {/* FORMULARIO DE MEMBRESÍA / PASE LECTOR */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                            
                            {error && (
                                <div style={{
                                    backgroundColor: '#fde8ec',
                                    color: '#a93226',
                                    border: '1px solid #e6b8c0',
                                    padding: '14px 18px',
                                    borderRadius: '2px',
                                    fontSize: '0.88rem',
                                    fontFamily: 'system-ui, sans-serif'
                                }}>
                                    {error}
                                </div>
                            )}

                            <section style={sectionCardStyle}>
                                <h3 style={sectionTitleStyle}>
                                    1. Datos Personales del Lector
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Nombre y Apellido</label>
                                        <input
                                            type="text"
                                            name="nombreCompleto"
                                            required
                                            value={formData.nombreCompleto}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Ej. Victoria Ocampo"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Correo Electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="lector@institucion.edu"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>DNI / Pasaporte</label>
                                        <input
                                            type="text"
                                            name="documento"
                                            required
                                            value={formData.documento}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Sin puntos"
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Teléfono de Contacto (Opcional)</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Ej. +54 11 4567-8900"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section style={sectionCardStyle}>
                                <h3 style={sectionTitleStyle}>
                                    2. Domicilio de Residencia
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Calle y Número</label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            required
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Ej. Av. del Libertador 1600"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Localidad / Ciudad</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            required
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="San Isidro / CABA"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Código Postal</label>
                                        <input
                                            type="text"
                                            name="codigoPostal"
                                            required
                                            value={formData.codigoPostal}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="1642"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section style={sectionCardStyle}>
                                <h3 style={sectionTitleStyle}>
                                    3. Sede y Categoría de Membresía
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontFamily: 'system-ui, sans-serif' }}>
                                    <div>
                                        <label style={labelStyle}>Sede Principal</label>
                                        <select
                                            name="sedePreferida"
                                            value={formData.sedePreferida}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="Sede Central - Sala de Estudio">Sede Central - Sala de Estudio</option>
                                            <option value="Sala Histórica - Filial Norte">Sala Histórica - Filial Norte</option>
                                            <option value="Anexo Investigadores">Anexo Investigadores</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Categoría de Socio</label>
                                        <select
                                            name="categoriaLector"
                                            value={formData.categoriaLector}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        >
                                            <option value="Lector General">Lector General</option>
                                            <option value="Estudiante / Docente">Estudiante / Docente</option>
                                            <option value="Investigador de Archivo">Investigador de Archivo</option>
                                        </select>
                                    </div>

                                    <div style={{ gridColumn: 'span 2', marginTop: '6px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#443f38', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="aceptaReglamento"
                                                checked={formData.aceptaReglamento}
                                                onChange={handleChange}
                                                required
                                            />
                                            Acepto el reglamento de circulación y devolución de obras (plazo estándar de 14 días).
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={enviando}
                                style={primaryBtnStyle}
                            >
                                {enviando ? 'Enviando Solicitud...' : 'Solicitar Pase Lector →'}
                            </button>
                        </form>

                        {/* FICHA LATERAL INFORMATIVA DEL PASE */}
                        <aside style={{
                            backgroundColor: '#f5f0e6',
                            border: '1px solid #d4cebd',
                            padding: '28px',
                            borderRadius: '2px',
                            position: 'sticky',
                            top: '120px',
                            fontFamily: 'system-ui, sans-serif'
                        }}>
                            <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#2c1810',
                                margin: '0 0 18px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                borderBottom: '1px solid #e2ded7',
                                paddingBottom: '12px',
                                fontFamily: '"Playfair Display", Georgia, serif'
                            }}>
                                Alcance del Pase Lector
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#443f38' }}>
                                <div>
                                    <span style={metaCaptionStyle}>Categoría Seleccionada</span>
                                    <strong style={{ color: '#1a1917' }}>{formData.categoriaLector}</strong>
                                </div>

                                <div>
                                    <span style={metaCaptionStyle}>Sede de Acreditación</span>
                                    <strong style={{ color: '#1a1917' }}>{formData.sedePreferida}</strong>
                                </div>

                                <div style={{ borderTop: '1px solid #e2ded7', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#544f46', lineHeight: '1.5' }}>
                                    <span>• Préstamo domiciliario hasta 14 días renovables.</span>
                                    <span>• Solicitud de consulta en salas de lectura y estudio.</span>
                                    <span>• Cuaderno personal de lecturas y fichas críticas.</span>
                                </div>
                            </div>
                        </aside>

                    </div>
                )}
            </div>
        </div>
    );
};

const sectionCardStyle = {
    backgroundColor: '#f5f0e6',
    border: '1px solid #e2ded7',
    padding: '26px',
    borderRadius: '2px'
};

const sectionTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#2c1810',
    margin: '0 0 20px 0',
    borderBottom: '1px solid #e2ded7',
    paddingBottom: '10px'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#70695d',
    marginBottom: '6px',
    fontFamily: 'system-ui, sans-serif'
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '2px',
    border: '1px solid #d4cebd',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
    color: '#1a1917',
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box',
    outline: 'none'
};

const metaCaptionStyle = {
    fontSize: '0.7rem',
    color: '#70695d',
    textTransform: 'uppercase',
    display: 'block',
    letterSpacing: '0.06em',
    marginBottom: '2px'
};

const primaryBtnStyle = {
    backgroundColor: '#2c1810',
    color: '#fcfaf2',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '2px',
    fontSize: '0.82rem',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif'
};

const secondaryBtnStyle = {
    backgroundColor: 'transparent',
    color: '#2c1810',
    border: '1px solid #2c1810',
    padding: '14px 24px',
    borderRadius: '2px',
    fontSize: '0.82rem',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif'
};

export default PaseLector;