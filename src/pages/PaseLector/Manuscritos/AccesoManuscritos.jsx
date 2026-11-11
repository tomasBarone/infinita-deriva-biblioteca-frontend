import React from 'react';
import { Link } from 'react-router-dom';
import SeccionImagenParallax from '../../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoManuscritos from '../../../assets/Salas/manuscritos.jpg';
import './AccesoManuscritos.css';

function AccesoManuscritos() {
    return (
        <div className="manuscritos-page-container">
            <SeccionImagenParallax
             imagenUrl={fotoManuscritos}
             subtitulo="Colecciones Especiales"
             titulo="FONDOS Y MANUSCRITOS RAROS"
             fullHeight={true}
            />
             
            <section className="manuscritos-content-container">
                <div className="infinita-deriva-fullwidth-card-general">
                    <h2 className="infinita-deriva-heading-general">ACCESO A COLECCIONES ESPECIALES</h2>

                    <div className="infinita-deriva-frame-box-general">  
                        <h3 className="infinita-deriva-subheading-general">Acreditación y Categorías de Usuarios</h3>
                        <p className="infinita-deriva-description" style={{ marginBottom: '20px' }}>
                            El archivo de Infinita Deriva recibe a una comunidad diversa de investigadores, académicos y visitantes con razones legítimas para consultar nuestro acervo de obras raras y manuscritos históricos.
                        </p>

                        <h3 className="infinita-deriva-subheading-general" style={{ marginTop: '35px' }}>Condiciones de Consulta en Sala Especial</h3>
                        <p className="infinita-deriva-description" style={{ marginBottom: '20px' }}>
                            La consulta de documentos de la reserva especial requiere una cita previa formalizada con anticipación. El material se pone a disposición exclusivamente dentro de las Mesas de Investigación Silenciosa bajo supervisión del archivero de turno.
                        </p>

                        <h3 className="infinita-deriva-subheading-general" style={{ marginTop: '35px' }}>Credencial de Lector Obligatoria</h3>
                        <p className="infinita-deriva-description">
                            Todo usuario que desee consultar las colecciones especiales debe registrarse previamente y contar con su credencial o <Link to="/pase-lector" style={{ color: '#990707', textDecoration: 'none',  }}>Pase Lector</Link> activo, tramitado con al menos cinco días hábiles de antelación a la visita.
                        </p>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default AccesoManuscritos;