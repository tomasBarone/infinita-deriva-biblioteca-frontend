import React from 'react';
import {Link} from 'react-router-dom';
import SeccionImagenParallax from '../../components/SeccionImagenParallax/SeccionImagenParallax';
import fotoPaseLector from '../../assets/Salas/estanterias.jpg';
import './PaseLectorObtener.css';
import fotoHistorical from '../../assets/Salas/historical.jpg';


function PaseLectorObtener(){

    return(

   <div className="pase-page-container">

    <SeccionImagenParallax
                imagenUrl={fotoPaseLector}
                subtitulo="Acreditación"
               titulo="¿CÓMO OBTENER EL PASE LECTOR?"
                fullHeight={true}
            />

    <section className="pase-content-container">
        <div className="infinita-deriva-fullwidth-card-general">
            <h2 className="infinita-deriva-heading-general">PROCESO DE ACREDITACIÓN INSTITUCIONAL</h2>
             <div className="infinita-deriva-frame-box-general">
                <h3 className="infinita-deriva-subheading-general">
                            REGISTRO Y SOLICITUD DE PASE LECTOR
                        </h3>   
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '30px' }}>
                            El Pase Lector es la credencial oficial que otorga derechos de acceso a la Sede San Isidro, préstamo domiciliario de ejemplares y reserva de puestos de estudio en las salas de lectura.
                        </p>
                        <p className="infinita-deriva-description-general" style={{ marginBottom: '30px' }}>
                           
                            Complete el formulario de inscripción con sus datos académicos y de contacto. Se recomienda iniciar el trámite al menos cinco días hábiles antes de su primera visita prevista<br />   
                            
                        </p>
                        <p className="infinita-deriva-description-general" style={{ marginTop: '20px' }}>
                            El comité de archivo evaluará su solicitud y emitirá su habilitación de lector asociado.<br />
                            Retire su credencial física presentándose en el mostrador de recepción de la Sede San Isidro.
                        </p>
                    </div>

           </div>

           
</section>


    <SeccionImagenParallax imagenUrl={fotoHistorical}/>

   </div>

    )

}


export default PaseLectorObtener;