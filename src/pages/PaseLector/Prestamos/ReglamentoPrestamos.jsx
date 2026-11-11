import React from 'react';
import { Link } from 'react-router-dom';
import SeccionImagenParallax from '../../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoReglamento from '../../../assets/Salas/fondo.jpg';
import './ReglamentoPrestamos.css';

function ReglamentoPrestamos() {
    return (
        <div className="reglamento-page-container">
            <SeccionImagenParallax
             imagenUrl={fotoReglamento}
             subtitulo="Normativa Institucional"
             titulo="REGLAMENTO DE PRÉSTAMOS & USO"
             fullHeight={true}
            />
             
            <section className="reglamento-content-container">
                <div className="infinita-deriva-fullwidth-card-general">
                    <h2 className="infinita-deriva-heading-general">MANEJO Y CUIDADO DEL ACERVO</h2>

                    <div className="infinita-deriva-frame-box-general">  
                        <h3 className="infinita-deriva-subheading-general">Preservación de Materiales</h3>
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '20px' }}>
                            Se solicita extrema precaución al manipular cualquier ejemplar del archivo. El uso de notas adhesivas tipo <em>post-it</em>, subrayados, anotaciones al margen o marcadores fluorescentes está estrictamente prohibido en todas las obras de la biblioteca.
                        </p>

                        <h3 className="infinita-deriva-subheading-general" style={{ marginTop: '35px' }}>Consulta Interna y Préstamo</h3>
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '20px' }}>
                            Los libros y publicaciones periódicas deben consultarse preferentemente dentro del complejo de la Sede San Isidro. Los ejemplares retirados para consulta en sala que ya no se utilicen deben depositarse en los carros asignados o devolverse en el mostrador principal.
                        </p>

                        <h3 className="infinita-deriva-subheading-general" style={{ marginTop: '35px' }}>Responsabilidad de Reposición</h3>
                        <p className="infinita-deriva-description-general">
                            Los préstamos domiciliarios no están sujetos a multas monetarias diarias por retraso; sin embargo, ante la falta de devolución tras los avisos formales, la obra se considerará extraviada y el socio responsable deberá afrontar los costos de reposición y tramitación administrativa del ejemplar.
                        </p>
                    </div>
                </div>

                
            </section>
        </div>
    );
}

export default ReglamentoPrestamos;