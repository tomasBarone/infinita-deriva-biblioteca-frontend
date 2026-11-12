import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libroService from '../../services/libroService';
import tapaBase from '../../assets/tapaBase.jpg';
import './VistaLibros.css';


import SeccionImagenParallax from '../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoCatalogoHero from '../../assets/Salas/estanterias2.jpg'; 

const VistaLibros = () => {
 
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  
  const [queryText, setQueryText] = useState('');
  const [anioInicio, setAnioInicio] = useState('');
  const [anioFin, setAnioFin] = useState('');


  const [librosPage, setLibrosPage] = useState(null);
  const [paginaActual, setPaginaActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const fetchLibros = async (page = 0) => {
    setCargando(true);
    try {
      let data;
      if (libroService.filtrarAvanzado) {
        data = await libroService.filtrarAvanzado(queryText, anioInicio, anioFin, page);
      } else {
        data = await libroService.obtenerTodos(page);
      }
      setLibrosPage(data);
      setPaginaActual(page);
      setError(null);
    } catch (err) {
      console.error("Error al cargar libros:", err);
      setError("No se pudieron cargar los libros del catálogo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchLibros(0);
  }, []);

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchLibros(0);
  };

  const handleLimpiar = () => {
    setQueryText('');
    setAnioInicio('');
    setAnioFin('');
    setTimeout(() => {
      fetchLibros(0);
    }, 0);
  };

  const listaLibros = librosPage?.content || (Array.isArray(librosPage) ? librosPage : []);
  const totalPaginas = librosPage?.totalPages || 1;

  console.log(listaLibros);
  const hayFiltrosActivos = queryText.trim() !== '' || anioInicio !== '' || anioFin !== '';

  return (
    <div style={{ backgroundColor: '#fcfaf2', minHeight: '100vh', fontFamily: '"Playfair Display", Georgia, serif', margin: 0, color: '#1a1917' }}>


      <SeccionImagenParallax
        imagenUrl={fotoCatalogoHero}
        subtitulo="acervo bibliográfico"
        alt="Catálogo de Obras - Infinita Deriva"
        fullHeight={true}
      />

      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '400', margin: '0 0 10px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Catálogo de Obras
          </h2>
          <p style={{ color: '#70695d', fontSize: '0.95rem', fontFamily: 'system-ui, sans-serif', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>
            Explorá nuestra colección académica y literaria
          </p>

       
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5c3a21',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.8rem',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px'
            }}
          >
            <span>{mostrarFiltros ? 'Ocultar Filtros' : 'Filtrar Obras'}</span>
            <span style={{ 
              transform: mostrarFiltros ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.2s ease',
              fontSize: '0.9rem'
            }}>
              ↓
            </span>
            {hayFiltrosActivos && !mostrarFiltros && (
              <span style={{ 
                width: '6px', 
                height: '6px', 
                backgroundColor: '#5c3a21', 
                borderRadius: '50%', 
                marginLeft: '4px' 
              }} title="Filtros activos" />
            )}
          </button>
        </div>

       
        {mostrarFiltros && (
          <form 
            onSubmit={handleFiltrar}
            style={{ 
              backgroundColor: 'transparent', 
              padding: '10px 0 30px 0', 
              marginBottom: '40px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              alignItems: 'flex-end',
              justifyContent: 'center',
              borderBottom: '1px solid #e5dec9',
              fontFamily: 'system-ui, sans-serif',
              animation: 'fadeIn 0.3s ease-in-out'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 280px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#70695d', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Buscar por Título o Autor
              </label>
              <input 
                type="text" 
                placeholder="Ej: Dostoievski, El Aleph..." 
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                style={{ 
                  padding: '9px 14px', 
                  borderRadius: '2px', 
                  border: '1px solid #d4cebd', 
                  fontSize: '0.9rem', 
                  backgroundColor: '#ffffff', 
                  color: '#1a1917',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '0 1 130px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#70695d', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Año Desde
              </label>
              <input 
                type="number" 
                placeholder="Ej: 1900" 
                value={anioInicio}
                onChange={(e) => setAnioInicio(e.target.value)}
                style={{ 
                  padding: '9px 14px', 
                  borderRadius: '2px', 
                  border: '1px solid #d4cebd', 
                  fontSize: '0.9rem', 
                  backgroundColor: '#ffffff', 
                  color: '#1a1917',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '0 1 130px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#70695d', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Año Hasta
              </label>
              <input 
                type="number" 
                placeholder="Ej: 2000" 
                value={anioFin}
                onChange={(e) => setAnioFin(e.target.value)}
                style={{ 
                  padding: '9px 14px', 
                  borderRadius: '2px', 
                  border: '1px solid #d4cebd', 
                  fontSize: '0.9rem', 
                  backgroundColor: '#ffffff', 
                  color: '#1a1917',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', height: '38px', alignItems: 'center' }}>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#2c1810', 
                  color: '#fcfaf2', 
                  border: 'none', 
                  padding: '0 20px', 
                  height: '38px',
                  borderRadius: '2px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Aplicar
              </button>

              <button 
                type="button"
                onClick={handleLimpiar}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#2c1810', 
                  border: '1px solid #2c1810', 
                  padding: '0 16px', 
                  height: '38px',
                  borderRadius: '2px', 
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Limpiar
              </button>
            </div>
          </form>
        )}

       
        {cargando ? (
          <div style={{ padding: '80px', textAlign: 'center', minHeight: '30vh', fontFamily: 'system-ui, sans-serif', color: '#70695d' }}>
            Cargando acervo bibliográfico...
          </div>
        ) : error ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#c62828', fontFamily: 'system-ui, sans-serif' }}>
            {error}
          </div>
        ) : (
          <>
           
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '40px 24px',
              alignItems: 'start'
            }}>
              {listaLibros.length > 0 ? (
                listaLibros.map((libro) => {
                  const anioMostrado = libro.anioPublicacion || libro.ano || '2024';

                  return (
                    <Link 
                      key={libro.id}
                      to={`/libro/${libro.id}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                    >
                      <div 
                        style={{ 
                          backgroundImage: `url(${tapaBase})`, 
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          height: '260px', 
                          borderRadius: '2px 4px 4px 2px', 
                          boxShadow: '3px 4px 12px rgba(0,0,0,0.15)',
                          padding: '24px 20px 20px 26px', 
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          marginBottom: '14px',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '5px 8px 18px rgba(0,0,0,0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '3px 4px 12px rgba(0,0,0,0.15)';
                        }}
                      >
                        <div style={{ 
                          position: 'absolute', top: 0, left: 0, bottom: 0, width: '10px', 
                          background: 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1))', 
                          borderRadius: '2px 0 0 2px',
                          pointerEvents: 'none' 
                        }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
                          <span style={{ fontSize: '0.6rem', color: '#c2b8a3', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
                            Infinita Deriva · Vol. {libro.id}
                          </span>
                          
                        </div>

                        <div style={{ height: '40px' }}></div>

                        <div style={{ zIndex: 2 }}>
                          <span style={{ fontSize: '0.6rem', color: '#9e9482', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'system-ui, sans-serif' }}>
                            Edición Crítica
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#70695d', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'system-ui, sans-serif', fontWeight: '600' }}>
                          {libro.autor}
                        </span>
                        <h3 className="libro-titulo">
                          {libro.titulo}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'system-ui, sans-serif', marginTop: '2px' }}>
                          {anioMostrado} · {libro.corrienteNombre || 'Desconocida'}
                         
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#70695d', padding: '60px 0', fontStyle: 'italic', fontFamily: 'system-ui, sans-serif' }}>
                  No se encontraron obras que coincidan con los criterios ingresados.
                </p>
              )}
            </div>

            {/* PAGINACIÓN */}
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
                  onClick={() => fetchLibros(paginaActual - 1)}
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
                  onClick={() => fetchLibros(paginaActual + 1)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default VistaLibros;