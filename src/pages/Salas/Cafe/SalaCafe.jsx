import React from 'react';
import { Link } from 'react-router-dom';
import SeccionImagenParallax from '../../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoCafe from '../../../assets/Salas/cafePausa.jpg'; 
import fotoCafe2 from '../../../assets/Salas/pausaDelCafePic.jpg';
import seccionCafe from '../../../assets/Salas/coffe2.jpg';
import './SalaCafe.css';
import coffe from '../../../assets/Salas/cafeRain.jpg';
import AccesosInstitucionales from '../../../components/AccesosInstitucionales/AccesosInstitucionales';
import fotoGarden from '../../../assets/Salas/garden2.jpg';
import fotoGeneral from '../../../assets/Salas/hallInfinitaDeriva.jpg';
import fotoInvestigacion from '../../../assets/Salas/infinita-deriva-mesas-silenciosas.jpg';

const accesosRelacionados = [
      {
           titulo: 'SALAS GENERALES DE LECTURA',
           descripcion: 'Consulta las instalaciones de la Sede, horarios de atención presencial y las salas generales de estudio.',
           link: '/salas/generales',
           imagen: fotoGeneral,
         },
     {
       titulo: 'MESAS DE INVESTIGACION SILENCIOSA',
       descripcion: 'Acceso a espacios de estudio y consulta en sala para investigadores y socios con credencial activa.',
       link: '/salas/investigacion',
       imagen: fotoInvestigacion,
     }
  ];


function SalaCafe() {
    return (
        <div className="sala-cafe-page">
           
            <SeccionImagenParallax
             imagenUrl={fotoCafe}
            
             fullHeight={true}
            />
             
            {/* contenido principal  */}


            
            <section className="sala-content-container">
                <div className="infinita-deriva-fullwidth-card">
                <h2 className="infinita-deriva-heading-general">La Pausa Del Cafe</h2>

                  <div className="infinita-deriva-frame-box-general">  
                      <p className="infinita-deriva-description-general">
                        La calma mental o en sanscrito samatha, es una necesidad para encontrar armonia entre mente, cuerpo y espiritu. La pausa del café nos invita a parar un momento, a respirar y a disfrutar de un tiempo que invite a la quietud y reflexión.
                     </p>
                    </div>
                </div>

                      <SeccionImagenParallax
             imagenUrl={fotoCafe2}
            
             
            />
            

              <div className="infinita-deriva-fullwidth-card">
                <h2 className="infinita-deriva-heading-general">ENCUENTRO E INTERCAMBIO</h2>

                  <div className="infinita-deriva-frame-box-general">  
                      <p className="infinita-deriva-description-general">
                            El Gabinete y Café de Lectores está concebido como un espacio de distensión y debate académico para los socios e investigadores de la Sede San Isidro. Provisto de máquinas de café, fuentes de agua purificada y áreas de descanso, es el único sector habilitado dentro del complejo para el consumo de alimentos ligeros y la conversación relajada entre colegas.
                     </p>
                    </div>
                </div>

          

      <SeccionImagenParallax
             imagenUrl={seccionCafe}
            
             
            />

   
                {/* Bloque de normativas del espaci */}
                <div className="infinita-deriva-fullwidth-card-general">
                    <h3 className="infinita-deriva-heading-general">
                        NORMAS DEL GABINETE
                    </h3>
                <div className="infinita-deriva-frame-box-general"> 
                  

                    <h3 className="infinita-deriva-subheading-general">
                        ALIMENTOS Y BEBIDAS
                    </h3>
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '20px' }} >
                        El consumo de refrigerios y infusiones se encuentra estipulado exclusivamente dentro de este gabinete o en la piazzetta externa, prohibiéndose su ingreso a las salas de lectura. 
                        Los usuarios podran disponer de diferentes variedades de cafe, desde capsulas con diferentes intensidades, hasta cafe molido y cafe en grano. Para su consumo, contamos con una cafetera profesional de capsulas, una cafetera de goteo y una prensa francesa. 
                    
                    </p>

                    <p className="infinita-deriva-description-general" style={{ marginBottom: '90px' }}>
                  En cuanto al agua, ofrecemos una fuente de agua purificada y un refrigerador para la conservacion de alimentos y bebidas, asi como un microondas para calentar alimentos. En caso de que las puertas esten cerradas solicite una tarjeta de acceso al personal de seguridad en la entrada de la biblioteca para el posterior ingreso a la cafeteria. Los usuarios solo pueden introducir agua en la biblioteca utilizando botellas que proporciona Infinita Deriva, las cuales pueden solicitarse en el mostrador de recepcion.
                    </p>
                    
             
                   <h3 className="infinita-deriva-subheading-general">
                        USO DE DISPOSITIVOS
                    </h3>
                    <p className="infinita-deriva-description-general">
                     A diferencia de las salas de silencio académico, el uso de telefonía móvil y las conversaciones moderadas están permitidas y habilitadas en este sector.
                    </p>
                    </div>
                </div>

                <SeccionImagenParallax
             imagenUrl={coffe}
            
             
            />

                         <AccesosInstitucionales 
        tituloSeccion="SECCIONES RELACIONADAS"
        items={accesosRelacionados}
      /> 


       <SeccionImagenParallax
             imagenUrl={fotoGarden}
            
             
            />

            </section>
        </div>
    );
}

export default SalaCafe;