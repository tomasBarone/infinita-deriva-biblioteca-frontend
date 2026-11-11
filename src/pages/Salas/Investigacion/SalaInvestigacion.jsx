import React from 'react';
import { Link } from 'react-router-dom';
import SeccionImagenParallax from '../../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoInvestigacion from '../../../assets/Salas/infinita-deriva-mesas-silenciosas.jpg'; 
import './SalaInvestigacion.css';
import fotoGarden from '../../../assets/Salas/garden2.jpg';




function SalaInvestigacion() {

    
    return (
        <div className="sala-investigacion-page">
            {/* Banner Parallax Principal Fullscreen */}
            <SeccionImagenParallax
             imagenUrl={fotoInvestigacion}
             subtitulo="sede san isidro"
             titulo="MESAS DE INVESTIGACIÓN"
             fullHeight={true}
            />
             
            {/* contenido principal */}
         <section className="sala-content-container">
            <div className="infinita-deriva-fullwidth-card-general">
               <h2 className="infinita-deriva-heading-general" >ESTUDIO ACADÉMICO Y RESERVA ESPECIAL</h2>
                 
                <div className="infinita-deriva-frame-box-general">  
                    <h3 className="infinita-deriva-subheading-general" >
                       MESAS DE INVESTIGACION
                    </h3>
                     <p className="infinita-deriva-description-general">
                            Las Mesas de Investigación Silenciosa están destinadas a investigadores acreditados, académicos y estudiantes avanzados que requieren un espacio reservado para el análisis de fuentes primarias, manuscritos y colecciones especiales. Dotadas de iluminación focal de alta precisión y puestos de trabajo aislados, garantizan el rigor necesario para proyectos editoriales y de investigación de larga duración.
                     </p>
               
                  
                   <div className="divider-line" style={{ width: '40px', height: '50px', margin: '30px auto' }}></div>

                 <h3 className="infinita-deriva-subheading-general" >
                        CONDICIONES DE ACCESO Y RESERVA
                    </h3>
                   
                    <p className="infinita-deriva-description-general"  >
                         El uso de este sector requiere contar con un <Link className="link" to="/pase-lector" style={{ color: '#990707', textDecoration: 'none',  }}>Pase Lector</Link> activo de categoría Investigador o haber tramitado la autorización de acceso a colecciones especiales.
                    </p>
                    <p className="infinita-deriva-description-general" style={{ marginBottom: '90px' }}>
                       Los ejemplares de archivo y reserva deben solicitarse con un mínimo de veinticuatro horas hábiles de anticipación para su correcta preservación y entrega en sala.
                    </p>
                </div>
                </div>

               
                   
              

                      <SeccionImagenParallax
             imagenUrl={fotoGarden}
          
            />
                
            </section>
        </div>
    );
}

export default SalaInvestigacion;