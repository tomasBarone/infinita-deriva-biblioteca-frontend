import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import libroService from '../../services/libroService';
import corrienteLiterariaService from '../../services/corrienteLiterariaService';
import subgeneroLiterarioService from '../../services/subgeneroService';
import './AdminDashboard.css';

const PanelAdmin = () => {
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [corrientes, setCorrientes] = useState([]);
  const [subgeneros, setSubgeneros] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados de control de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [anioInicio, setAnioInicio] = useState('');
  const [anioFin, setAnioFin] = useState('');
  const [corrienteFiltro, setCorrienteFiltro] = useState('');

  // Estado de Paginación (6 por página)
  const [paginaActual, setPaginaActual] = useState(0);
  const elementosPorPagina = 6;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditar, setLibroEditar] = useState(null);

  const [formData, setFormData] = useState({
    isbn: '',
    titulo: '',
    autor: '',
    ejemplares: 1,
    corrienteLiterariaId: '',
    subgeneroLiterarioId: '',
    anioPublicacion: '',
    sinopsis: ''
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [dataLibros, dataCorrientes] = await Promise.all([
        libroService.obtenerTodosSinPaginacion ? libroService.obtenerTodosSinPaginacion() : libroService.obtenerTodos(0),
        corrienteLiterariaService.obtenerTodos()
      ]);
      
      const listaLibros = dataLibros?.content || (Array.isArray(dataLibros) ? dataLibros : []);
      setLibros(listaLibros);
      setCorrientes(dataCorrientes);
    } catch (error) {
      console.error("Error al cargar datos del panel:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCorrienteChangeModal = async (e) => {
    const idCorr = e.target.value;
    setFormData(prev => ({ ...prev, corrienteLiterariaId: idCorr, subgeneroLiterarioId: '' }));
    if (idCorr) {
      try {
        const subData = await subgeneroLiterarioService.obtenerPorCorriente(idCorr);
        setSubgeneros(subData);
      } catch (err) {
        console.error("Error al cargar subgéneros:", err);
      }
    } else {
      setSubgeneros([]);
    }
  };

  const handleAbrirModalCrear = () => {
    setLibroEditar(null);
    setFormData({
      isbn: '',
      titulo: '',
      autor: '',
      ejemplares: 1,
      corrienteLiterariaId: '',
      subgeneroLiterarioId: '',
      anioPublicacion: '',
      sinopsis: ''
    });
    setImagenArchivo(null);
    setMostrarModal(true);
  };

  const handleAbrirModalEditar = async (libro) => {
    setLibroEditar(libro);
    setFormData({
      isbn: libro.isbn || '',
      titulo: libro.titulo || '',
      autor: libro.autor || '',
      ejemplares: libro.ejemplares || 1,
      corrienteLiterariaId: libro.corrienteLiterariaId || libro.corrienteId || '',
      subgeneroLiterarioId: libro.subgeneroLiterarioId || libro.subgeneroId || '',
      anioPublicacion: libro.anioPublicacion || libro.ano || '',
      sinopsis: libro.sinopsis || ''
    });

    if (libro.corrienteLiterariaId || libro.corrienteId) {
      try {
        const subData = await subgeneroLiterarioService.obtenerPorCorriente(libro.corrienteLiterariaId || libro.corrienteId);
        setSubgeneros(subData);
      } catch (err) {
        console.error(err);
      }
    }

    setImagenArchivo(null);
    setMostrarModal(true);
  };

  const handleGuardarLibro = async (e) => {
    e.preventDefault();
    try {
      const dataPayload = new FormData();
      dataPayload.append('libro', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
      if (imagenArchivo) {
        dataPayload.append('imagen', imagenArchivo);
      }

      if (libroEditar) {
        await libroService.actualizar(libroEditar.id, dataPayload);
      } else {
        await libroService.crear(dataPayload);
      }

      setMostrarModal(false);
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar libro:", err);
    }
  };

  const handleEliminarLibro = async (id) => {
    if (window.confirm("¿Está seguro de remover esta obra del registro de archivo?")) {
      try {
        await libroService.eliminar(id);
        cargarDatos();
      } catch (err) {
        console.error("Error al eliminar libro:", err);
      }
    }
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    setPaginaActual(0); // Reiniciar a la página 1 al filtrar
  };

  const handleLimpiar = () => {
    setQueryText('');
    setAnioInicio('');
    setAnioFin('');
    setCorrienteFiltro('');
    setPaginaActual(0);
  };

  // 1. Filtrado completo de libros
  const librosFiltrados = libros.filter(libro => {
    const cumpleTexto = queryText.trim() === '' || 
      libro.titulo?.toLowerCase().includes(queryText.toLowerCase()) || 
      libro.autor?.toLowerCase().includes(queryText.toLowerCase());

    const anio = parseInt(libro.anioPublicacion || libro.ano || 0);
    const cumpleAnioInicio = anioInicio === '' || anio >= parseInt(anioInicio);
    const cumpleAnioFin = anioFin === '' || anio <= parseInt(anioFin);

    const cumpleCorriente = corrienteFiltro === '' || 
      libro.corrienteId?.toString() === corrienteFiltro || 
      libro.corrienteLiterariaId?.toString() === corrienteFiltro || 
      libro.corrienteNombre === corrientes.find(c => c.id.toString() === corrienteFiltro)?.nombre;

    return cumpleTexto && cumpleAnioInicio && cumpleAnioFin && cumpleCorriente;
  });

  // 2. Cálculos de Paginación
  const totalPaginas = Math.ceil(librosFiltrados.length / elementosPorPagina) || 1;
  
 
  useEffect(() => {
    if (paginaActual >= totalPaginas) {
      setPaginaActual(0);
    }
  }, [totalPaginas, paginaActual]);

  const indiceInicio = paginaActual * elementosPorPagina;
  const librosPaginados = librosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

  const hayFiltrosActivos = queryText.trim() !== '' || anioInicio !== '' || anioFin !== '' || corrienteFiltro !== '';

  return (
    <div className="panel-admin-container">
      
      {/* CABECERA INSTITUCIONAL */}
      <div className="panel-admin-hero">
        <div className="panel-admin-hero-inner">
          <div>
            <p className="panel-admin-eyebrow">ARCHIVO CENTRAL DE ACERVO</p>
            <h1 className="panel-admin-title">Panel de Control</h1>
          </div>

          <button onClick={handleAbrirModalCrear} className="btn-registrar-obra">
            + Incorporar Nueva Obra
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="panel-admin-content">
        
        {/* BOTÓN DESPLEGABLE DE FILTROS */}
        <div className="panel-admin-filter-toggle-container">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="btn-toggle-filtros"
          >
            <span>{mostrarFiltros ? 'Ocultar Filtros' : 'Filtrar Obras'}</span>
            <span className={`filter-arrow ${mostrarFiltros ? 'rotated' : ''}`}>
              ↓
            </span>
            {hayFiltrosActivos && !mostrarFiltros && (
              <span className="filter-active-dot" title="Filtros activos" />
            )}
          </button>
        </div>

        {/* PANEL DE FILTROS AVANZADOS DESPLEGABLE */}
        {mostrarFiltros && (
          <form onSubmit={handleFiltrar} className="panel-admin-filter-form">
            
            <div className="filter-field-group search">
              <label className="filter-field-label">Buscar por Título o Autor</label>
              <input 
                type="text" 
                placeholder="Ej: Dostoievski, El Aleph..." 
                value={queryText}
                onChange={(e) => { setQueryText(e.target.value); setPaginaActual(0); }}
                className="filter-input-classic"
              />
            </div>

            <div className="filter-field-group select">
              <label className="filter-field-label">Corriente Literaria</label>
              <select
                value={corrienteFiltro}
                onChange={(e) => { setCorrienteFiltro(e.target.value); setPaginaActual(0); }}
                className="filter-select-classic"
              >
                <option value="">Todas las Corrientes</option>
                {corrientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="filter-field-group year">
              <label className="filter-field-label">Año Desde</label>
              <input 
                type="number" 
                placeholder="Ej: 1900" 
                value={anioInicio}
                onChange={(e) => { setAnioInicio(e.target.value); setPaginaActual(0); }}
                className="filter-input-classic"
              />
            </div>

            <div className="filter-field-group year">
              <label className="filter-field-label">Año Hasta</label>
              <input 
                type="number" 
                placeholder="Ej: 2000" 
                value={anioFin}
                onChange={(e) => { setAnioFin(e.target.value); setPaginaActual(0); }}
                className="filter-input-classic"
              />
            </div>

            <div className="filter-actions-group">
              <button 
                type="button"
                onClick={handleLimpiar}
                className="btn-filter-limpiar"
              >
                Limpiar
              </button>
            </div>
          </form>
        )}

        {/* CONTADOR DE REGISTROS */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <span className="panel-admin-counter">
            Mostrando registros en inventario: <strong>{librosFiltrados.length}</strong> (Página {paginaActual + 1} de {totalPaginas})
          </span>
        </div>

        {/* LISTADO EN FORMATO FICHERO DE ARCHIVO */}
        {cargando ? (
          <div className="panel-admin-empty">Consultando registros del archivo central...</div>
        ) : (
          <div className="fichero-list">
            {librosPaginados.length > 0 ? (
              librosPaginados.map((libro) => (
                <div key={libro.id} className="fichero-card">
                  <div className="fichero-info">
                    <div className="fichero-meta-top">
                      <span>REF. #{libro.id}</span>
                      <span>•</span>
                      <span className="fichero-badge">{libro.corrienteNombre || 'LITERATURA'}</span>
                      <span>•</span>
                      <span>Ejemplares: {libro.ejemplares !== undefined ? `${libro.ejemplares} disp.` : '-'}</span>
                    </div>
                    <h3 className="fichero-titulo">{libro.titulo}</h3>
                    <p className="fichero-autor">{libro.autor}</p>
                  </div>

                  <div className="fichero-actions">
                    <button onClick={() => navigate(`/admin/analisis/${libro.id}`)} className="btn-fichero btn-fichero-analisis">
                      Análisis
                    </button>
                    <button onClick={() => handleAbrirModalEditar(libro)} className="btn-fichero btn-fichero-editar">
                      Modificar
                    </button>
                    <button onClick={() => handleEliminarLibro(libro.id)} className="btn-fichero btn-fichero-eliminar">
                      Retirar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="panel-admin-empty">
                No se encontraron registros bibliográficos que coincidan con los filtros seleccionados.
              </div>
            )}
          </div>
        )}

        {/* PAGINACIÓN INFERIOR */}
        {totalPaginas > 1 && (
          <div style={{ 
            marginTop: '60px', 
            paddingTop: '20px',
            borderTop: '1px solid #e5dec9',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '20px',
            fontFamily: 'system-ui, sans-serif'
          }}>
            <button 
              disabled={paginaActual === 0}
              onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: 'transparent',
                color: paginaActual === 0 ? '#b5ab9a' : '#2c1810',
                border: '1px solid ' + (paginaActual === 0 ? '#b5ab9a' : '#2c1810'),
                borderRadius: '2px',
                cursor: paginaActual === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              ← Anterior
            </button>

            <span style={{ fontSize: '0.85rem', color: '#544f46', fontWeight: '500' }}>
              Página <strong>{paginaActual + 1}</strong> de <strong>{totalPaginas}</strong>
            </span>

            <button 
              disabled={paginaActual + 1 >= totalPaginas}
              onClick={() => setPaginaActual(prev => Math.min(totalPaginas - 1, prev + 1))}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: 'transparent',
                color: (paginaActual + 1 >= totalPaginas) ? '#b5ab9a' : '#2c1810',
                border: '1px solid ' + ((paginaActual + 1 >= totalPaginas) ? '#b5ab9a' : '#2c1810'),
                borderRadius: '2px',
                cursor: (paginaActual + 1 >= totalPaginas) ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Siguiente →
            </button>
          </div>
        )}

      </div>

      {/* MODAL / FICHA DE CATALOGACIÓN */}
      {mostrarModal && (
        <div className="panel-admin-modal-overlay">
          <div className="panel-admin-modal-card">
            
            <div className="panel-admin-modal-header">
              <div>
                <span className="panel-admin-modal-eyebrow">REGISTRO BIBLIOGRÁFICO OFICIAL</span>
                <h3 className="panel-admin-modal-title">
                  {libroEditar ? 'Modificar Ficha de Obra' : 'Catalogar Nueva Obra'}
                </h3>
              </div>
              <button onClick={() => setMostrarModal(false)} className="panel-admin-modal-close">
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarLibro} className="panel-admin-form-grid">
              
              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">ISBN *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 9789501239251"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="panel-admin-form-input"
                />
              </div>

              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">Título *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: El Aleph"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="panel-admin-form-input"
                />
              </div>

              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">Autor *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Jorge Luis Borges"
                  value={formData.autor}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  className="panel-admin-form-input"
                />
              </div>

              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">Ejemplares Disponibles *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.ejemplares}
                  onChange={(e) => setFormData({ ...formData, ejemplares: parseInt(e.target.value) || 0 })}
                  className="panel-admin-form-input"
                />
              </div>

              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">Corriente Literaria *</label>
                <select
                  required
                  value={formData.corrienteLiterariaId}
                  onChange={handleCorrienteChangeModal}
                  className="panel-admin-form-select"
                >
                  <option value="">Seleccione corriente</option>
                  {corrientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">Subgénero</label>
                <select
                  value={formData.subgeneroLiterarioId}
                  onChange={(e) => setFormData({ ...formData, subgeneroLiterarioId: e.target.value })}
                  className="panel-admin-form-select"
                >
                  <option value="">Seleccione subgénero</option>
                  {subgeneros.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="panel-admin-form-group">
                <label className="panel-admin-form-label">Año de Publicación</label>
                <input
                  type="number"
                  placeholder="Ej: 1949"
                  value={formData.anioPublicacion}
                  onChange={(e) => setFormData({ ...formData, anioPublicacion: e.target.value })}
                  className="panel-admin-form-input"
                />
              </div>

              <div className="panel-admin-form-group-full">
                <label className="panel-admin-form-label">Sinopsis</label>
                <textarea
                  rows="3"
                  placeholder="Breve descripción analítica de la obra..."
                  value={formData.sinopsis}
                  onChange={(e) => setFormData({ ...formData, sinopsis: e.target.value })}
                  className="panel-admin-form-textarea"
                />
              </div>

              <div className="panel-admin-form-group-full">
                <label className="panel-admin-form-label">Portada Personalizada (Opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenArchivo(e.target.files[0])}
                  className="panel-admin-form-file"
                />
              </div>

              <div className="panel-admin-form-actions">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="btn-modal-cancelar"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-modal-guardar"
                >
                  {libroEditar ? 'Actualizar Ficha' : 'Registrar en Archivo'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PanelAdmin;