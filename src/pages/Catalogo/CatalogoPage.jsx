import React, {useState ,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {libroService} from  '../../services/libroService';
import './CatalogoPage.css';

export default function CatalogoPage() {
    const [queryText, setQueryText] = useState('');
    const [anioInicio , setAnioInicio] = useState('');
    const [anioFin , setAnioFin] = useState('');

    const [librosPage, setLibrosPage] = useState(null);
    const [paginaActual, setPaginaActual] = useState(0);
    const [loading, setLoading] = useState(true);


    const fecthLibros = async (page = 0) =>{
        setLoading(true);
        try {
            const data = await libroService.filtrarAvanzado(queryText, anioInicio, anioFin, page);
            setLibrosPage(data);
            setPaginaActual(page);
        } catch (error) {
            console.error('Error al cargar el catalogo', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fecthLibros(0);
    }, []);


    const handleFiltrar = (e) => {
        e.preventDefault();
        fecthLibros(0);
    }

    const handleLimpiar = () => {
        setQueryText('');
        setAnioInicio('');
        setAnioFin('');

        setTimeout(() => {
            libroService.filtrarAvanzado('', '', '', 0).then(data => {
                setLibrosPage(data);
                setPaginaActual(0);
            });
        }, 0);
    };


    return (

        <main style={{ padding: '60px 40px', maxWidth: '1600px', margin: '0 auto', backgroundColor: '#fcfaf2', minHeight: '100vh' }}>
      
      {/* ENCABEZADO INSTITUCIONAL */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontFamily: '"Playfair Display", Georgia, serif', 
          fontSize: '2.2rem', 
          color: '#2c1810',
          fontWeight: '400',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          margin: '0 0 10px 0'
        }}>
          Catálogo de Obras
        </h1>
        <p style={{ fontFamily: 'system-ui, sans-serif', color: '#70695d', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Explora nuestra colección
        </p>
      </div>

      {/* PANEL DE FILTROS EDITORIALES */}
      <form 
        onSubmit={handleFiltrar}
        style={{ 
          backgroundColor: '#f5f0e6', 
          padding: '24px 32px', 
          border: '1px solid #e2ded7',
          borderRadius: '4px', 
          marginBottom: '50px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItem: 'flex-end',
          justifyContent: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 300px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2c1810', letterSpacing: '1px', textTransform: 'uppercase' }}>Buscar por texto</label>
          <input 
            type="text" 
            placeholder="Título o Autor..." 
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '2px', border: '1px solid #dcd3be', fontSize: '0.9rem', backgroundColor: '#fff' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '0 1 150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2c1810', letterSpacing: '1px', textTransform: 'uppercase' }}>Año desde</label>
          <input 
            type="number" 
            placeholder="Ej: 1950" 
            value={anioInicio}
            onChange={(e) => setAnioInicio(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '2px', border: '1px solid #dcd3be', fontSize: '0.9rem', backgroundColor: '#fff' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '0 1 150px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2c1810', letterSpacing: '1px', textTransform: 'uppercase' }}>Año hasta</label>
          <input 
            type="number" 
            placeholder="Ej: 2000" 
            value={anioFin}
            onChange={(e) => setAnioFin(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '2px', border: '1px solid #dcd3be', fontSize: '0.9rem', backgroundColor: '#fff' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#2c1810', 
              color: '#fcfaf2', 
              border: 'none', 
              padding: '11px 24px', 
              borderRadius: '2px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.8rem',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            Aplicar Filtros
          </button>

          <button 
            type="button"
            onClick={handleLimpiar}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#2c1810', 
              border: '1px solid #2c1810', 
              padding: '11px 18px', 
              borderRadius: '2px', 
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* GRILLA DE RESULTADOS (6 Columnas Estilo Archivo) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#2c1810', fontFamily: 'system-ui, sans-serif' }}>Cargando acervo bibliográfico...</div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '40px 24px' 
          }}>
            {librosPage?.content && librosPage.content.length > 0 ? (
              librosPage.content.map((libro) => {
                // Generamos un número de volumen simulado o usamos el ID
                const anioMostrado = libro.anioPublicacion || libro.ano || '2024';
                
                return (
                  <Link 
                    key={libro.id} 
                    to={`/libro/${libro.id}`} 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                  >
                    {/* TAPA DEL LIBRO ESTILO ARCHIVO OSCURO */}
                    <div style={{ 
                      backgroundColor: '#1c2429', 
                      height: '240px', 
                      borderRadius: '2px 4px 4px 2px', 
                      border: '1px solid #3d4a52',
                      boxShadow: '3px 4px 12px rgba(0,0,0,0.15)',
                      padding: '16px',
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
                      {/* Lomo izquierdo simulado */}
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px 0 0 2px' }}></div>

                      <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#c2b8a3', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
                        Infinita Deriva · Vol. {libro.id}
                      </div>

                      <div style={{ textAlign: 'center', color: '#e8e2d5', fontSize: '1.5rem', fontWeight: '300', fontFamily: 'Georgia, serif' }}>
                        ID
                      </div>

                      <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#9e9482', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Edición Crítica
                      </div>
                    </div>

                    {/* METADATOS INFERIORES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#70695d', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'system-ui, sans-serif', fontWeight: '600' }}>
                        {libro.autor}
                      </span>
                      <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '0.95rem', color: '#2c1810', margin: 0, lineHeight: '1.3', fontWeight: '600' }}>
                        {libro.titulo}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'system-ui, sans-serif', marginTop: '2px' }}>
                        {anioMostrado} · Edición Crítica
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#777', padding: '60px 0', fontFamily: 'system-ui, sans-serif' }}>
                No se encontraron obras que coincidan con los criterios ingresados.
              </p>
            )}
          </div>

          {/* PAGINACIÓN */}
          {librosPage && librosPage.totalPages > 1 && (
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
              <button 
                disabled={paginaActual === 0}
                onClick={() => fetchLibros(paginaActual - 1)}
                style={{ padding: '8px 16px', cursor: paginaActual === 0 ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px solid #2c1810', color: '#2c1810', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                ← Anterior
              </button>
              
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: '#2c1810' }}>
                Página {paginaActual + 1} de {librosPage.totalPages}
              </span>

              <button 
                disabled={paginaActual + 1 >= librosPage.totalPages}
                onClick={() => fetchLibros(paginaActual + 1)}
                style={{ padding: '8px 16px', cursor: (paginaActual + 1 >= librosPage.totalPages) ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px solid #2c1810', color: '#2c1810', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );



}