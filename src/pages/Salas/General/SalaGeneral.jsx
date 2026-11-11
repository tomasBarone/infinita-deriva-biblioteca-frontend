import React from 'react';
import { Link } from 'react-router-dom';
import './SalaGeneral.css';
import SeccionImagenParallax from '../../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoSalaGeneral from '../../../assets/Salas/hallInfinitaDeriva.jpg';
import fotoSalaGeneralSec from '../../../assets/Salas/infinita-deriva-hall-secundario.jpg';
import pausaCafe from '../../../assets/Salas/cafePausa.jpg';
import sede from '../../../assets/Salas/sedeSanIsidro.jpg';
import AccesosInstitucionales from '../../../components/AccesosInstitucionales/AccesosInstitucionales';
import garden from '../../../assets/Salas/garden2.jpg';
const accesosRelacionados = [
    { 
        titulo: 'LA PAUSA DEL CAFÉ & ESPACIO DE ESTUDIO',
        descripcion: 'Un momento de quietud para la reflexión y la conexión entre mente, cuerpo y espíritu.',
        link: '/salas/cafe',
        imagen: pausaCafe,
    },
    {
        titulo: 'SEDE SAN ISIDRO & HORARIOS',
        descripcion: 'Información sobre la ubicación de la sede, horarios de atención y servicios disponibles para los lectores.',
        link: '/salas/sede',
        imagen: sede,
    }
];

function SalaGeneral() {
    return (
        <div className="sala-general-page">
           
            <SeccionImagenParallax
             imagenUrl={fotoSalaGeneral}
             subtitulo="sede san isidro"
             alt="Imagen de la Sala General"
             fullHeight={true}
            />
          
            <section className="sala-content-container">
                <div className="infinita-deriva-fullwidth-card-general">
                    <h2 className="infinita-deriva-heading-general">SALAS GENERALES DE LECTURA</h2>

                    
                    <div className="infinita-deriva-frame-box-general"> 
                        <h3 className="infinita-deriva-subheading-general">
                            MISION
                        </h3> 
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '30px' }}>
                             El espacio principal de lectura de Infinita Deriva cumple un rol vital en la misión de 
                             fomentar el estudio de las corrientes literarias clásicas y contemporáneas. Sus colecciones 
                             de libre acceso, mesas de madera noble y luz focalizada ofrecen un entorno óptimo para la 
                             investigación prolongada. Como parte del sistema de archivos de la Sede San Isidro, la sala 
                             brinda acceso tanto a ejemplares físicos como a fuentes catalogadas para socios y visitantes.
                        </p>
                        
                        <div className="divider-line" style={{ width: '40px', height: '1px', margin: '30px auto' }}></div>

                        <h3 className="infinita-deriva-subheading-general">
                            PAUTAS DE CONVIVENCIA Y CONSULTA
                        </h3>
                        
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '20px' }}>
                            Se solicita mantener los dispositivos en modo silencioso. Las conversaciones están reservadas para las áreas comunes externas.
                        </p>
                        
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '20px' }}>
                          Se permite el uso de ordenadores portátiles y toma de notas. El uso de marcadores o notas adhesivas tipo <em>post-it</em> está estrictamente prohibido sobre los libros del acervo.
                        </p>

                        <p className="infinita-deriva-description-general"style={{ marginBottom: '20px' }}>
                         Solo es permitido el consumo de alimentos en la cafeteria de Infinita Deriva. La cafeteria cuenta con una pequeña cocina equipada con cafetera, fuente de agua, microondas y refrigerador. En caso de que las puertas esten cerradas solicite una tarjeta de acceso al personal de seguridad en la entrada de la biblioteca para el posterior ingreso a la cafeteria. Los usuarios solo pueden introducir agua en la biblioteca utilizando botellas que proporciona Infinita Deriva, las cuales pueden solicitarse en el mostrador de recepcion.
                        </p>
                    </div>
                </div>

               
                <SeccionImagenParallax
                 imagenUrl={fotoSalaGeneralSec}
                 subtitulo="sede san isidro"
                 alt="Imagen secundaria de la Sala General"
                />
                 
                <AccesosInstitucionales 
                    tituloSeccion="SECCIONES RELACIONADAS"
                    items={accesosRelacionados}
                />  


              <SeccionImagenParallax
                 imagenUrl={garden}
                />
                
              
            </section>
        </div>
    );
} 

export default SalaGeneral;