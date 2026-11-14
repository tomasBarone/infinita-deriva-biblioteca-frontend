import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import libroService from '../../services/libroService';
import corrienteLiterariaService from '../../services/corrienteLiterariaService';
import FormularioLibro from '../../components/FormularioLibro';
import './AdminDashboard.css'

const PanelAdmin = () => {
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [corrientes, setCorrientes] = useState([]);
  const [cargando, setCargando] = useState(true);


  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [anioInicio, setAnioInicio] = useState('');
  const [anioFin, setAnioFin] = useState('');
  const [corrienteFiltro, setCorrienteFiltro] = useState('');


  const [paginaActual, setPaginaActual] = useState(0);
  const elementosPorPagina = 6;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [libroEditar, setLibroEditar] = useState(null);

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

  const handleAbrirModalCrear = () => {
    setLibroEditar(null);
    setIsModalOpen(true);
  };

  const handleAbrirModalEditar = (libro) => {
    setLibroEditar(libro);
    setIsModalOpen(true);
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
    setPaginaActual(0);
  };

  const handleLimpiar = () => {
    setQueryText('');
    setAnioInicio('');
    setAnioFin('');
    setCorrienteFiltro('');
    setPaginaActual(0);
  };

  // Filtrado de libros
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

  // Paginación
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

      {/* MODAL / FICHA DE CATALOGACIÓN USANDO EL COMPONENTE EXTERNO */}
      {isModalOpen && (
        <FormularioLibro 
          cerrarModal={() => { setIsModalOpen(false); setLibroEditar(null); }} 
          refrescarLista={cargarDatos}
          libroAEditar={libroEditar}
        />
      )}

    </div>
  );
};

export default PanelAdmin;