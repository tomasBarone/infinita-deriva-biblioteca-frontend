import React, { useState, useEffect } from 'react';
import libroService from '../services/libroService';
import corrienteLiterariaService from '../services/corrienteLiterariaService';
import subgeneroLiterarioService from '../services/subgeneroService';

const FormularioLibro = ({ cerrarModal, refrescarLista, libroAEditar }) => {
  const [corrientes, setCorrientes] = useState([]);
  const [subgeneros, setSubgeneros] = useState([]);


  const [formData, setFormData] = useState({
    isbn: '',
    titulo: '',
    autor: '',
    ejemplares: 1,
    corrienteId: '',
    subgeneroId: '',
    anioPublicacion: '',
    sinopsis: ''
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);

  useEffect(() => {
    Promise.all([
      corrienteLiterariaService.obtenerTodos(),
      subgeneroLiterarioService.obtenerTodos ? subgeneroLiterarioService.obtenerTodos() : Promise.resolve([])
    ])
      .then(([dataCorrientes, dataSubgeneros]) => {
        setCorrientes(dataCorrientes);
        setSubgeneros(dataSubgeneros);
      })
      .catch(err => console.error("Error al cargar catalogaciones iniciales:", err));

    if (libroAEditar) {
      setFormData({
        isbn: libroAEditar.isbn || '',
        titulo: libroAEditar.titulo || '',
        autor: libroAEditar.autor || '',
        ejemplares: libroAEditar.ejemplares || 1,
        corrienteId: libroAEditar.corrienteId || libroAEditar.corrienteLiterariaId || '',
        subgeneroId: libroAEditar.subgeneroId || libroAEditar.subgeneroLiterarioId || '',
        anioPublicacion: libroAEditar.anioPublicacion || libroAEditar.ano || '',
        sinopsis: libroAEditar.sinopsis || ''
      });
    }
  }, [libroAEditar]);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const libroData = {
        isbn: formData.isbn,
        titulo: formData.titulo,
        autor: formData.autor,
        ejemplares: parseInt(formData.ejemplares, 10) || 1,
        corrienteId: formData.corrienteId ? parseInt(formData.corrienteId, 10) : null,
        subgeneroId: formData.subgeneroId ? parseInt(formData.subgeneroId, 10) : null,
        anioPublicacion: formData.anioPublicacion ? parseInt(formData.anioPublicacion, 10) : null,
        sinopsis: formData.sinopsis
      };

      if (libroAEditar) {
       
        await libroService.actualizarConFoto(libroAEditar.id, libroData, imagenArchivo);
      } else {
        await libroService.crearConFoto(libroData, imagenArchivo);
      }

      cerrarModal();
      refrescarLista();
    } catch (err) {
      console.error("Error al guardar libro en el archivo:", err);
    }
  };

  return (
    <div className="panel-admin-modal-overlay">
      <div className="panel-admin-modal-card">
        
        <div className="panel-admin-modal-header">
          <div>
            <span className="panel-admin-modal-eyebrow">REGISTRO BIBLIOGRÁFICO OFICIAL</span>
            <h3 className="panel-admin-modal-title">
              {libroAEditar ? 'Modificar Ficha de Obra' : 'Catalogar Nueva Obra'}
            </h3>
          </div>
          <button onClick={cerrarModal} className="panel-admin-modal-close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="panel-admin-form-grid">
          
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
              min="1"
              required
              value={formData.ejemplares}
              onChange={(e) => setFormData({ ...formData, ejemplares: e.target.value })}
              className="panel-admin-form-input"
            />
          </div>

          <div className="panel-admin-form-group">
            <label className="panel-admin-form-label">Corriente Literaria *</label>
            <select
              required
              value={formData.corrienteId}
              onChange={(e) => setFormData({ ...formData, corrienteId: e.target.value })}
              className="panel-admin-form-select"
            >
              <option value="">Seleccione corriente</option>
              {corrientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="panel-admin-form-group">
            <label className="panel-admin-form-label">Subgénero *</label>
            <select
              required
              value={formData.subgeneroId}
              onChange={(e) => setFormData({ ...formData, subgeneroId: e.target.value })}
              className="panel-admin-form-select"
            >
              <option value="">Seleccione subgénero</option>
              {subgeneros.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div className="panel-admin-form-group">
            <label className="panel-admin-form-label">Año de Publicación *</label>
            <input
              type="number"
              min="1450"
              required
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
              onClick={cerrarModal}
              className="btn-modal-cancelar"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-modal-guardar"
            >
              {libroAEditar ? 'Actualizar Ficha' : 'Registrar en Archivo'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FormularioLibro;