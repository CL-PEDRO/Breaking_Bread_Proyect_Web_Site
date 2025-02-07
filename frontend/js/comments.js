document.addEventListener("DOMContentLoaded", function ()  {
    const textComment = document.getElementsByClassName('comment-input');
    const submitButton = document.getElementById('submit-button');
    const ShowCommentarios = document.getElementById('commentarios');

    // Asegurarse de que los elementos existen antes de continuar
    if (submitButton && textComment) {

        const urlParameters = new URLSearchParams(window.location.search);
        const searchTerm = urlParameters.get('q');
        const id_post = urlParameters.get('q');
        //console.log(searchTerm);


        getComments();
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();  // Evitar acción por defecto (enviar formulario)
            
            

            const comment = textComment[0].value;

            //console.log(comment);
            if (comment.length > 0 ) {  
                const id_user = localStorage.getItem('userId');
                
                const data = {
                    id_user: id_user,
                    fecha:  obtenerFechaHoraActual(),
                    text_comentario: comment
                };
                textComment[0].value = ' ';
                //console.table(data);
                postComment(data);
                
            } else {
                console.log('El comentario está vacío');
            }
        });

        // Función para obtener comentarios
        async function getComments() {
            const id_post = urlParameters.get('q');
            const response = await fetch(`http://localhost:5000/publicaciones/${id_post}/getComments`);
            const data = await response.json();


            
            ShowCommentarios.innerHTML = '';
            data.forEach(comentario => {
                //console.log("Comentarios :D");
                const writtenTime = extraerHoraMinutos(comentario.fecha)
                const newComment = document.createElement('li');
                
                newComment.innerHTML= `
                <div id="commentsBox">
                <img class="ImagenComentario" src="${comentario.foto_perfil}"></img>
                <span><strong>${comentario.nombre_Usuario}:<br></strong></span>
                <span>${comentario.comentario}</span>
                <span><p id="dateTime">${writtenTime}</p></span>
                </div>`;

                ShowCommentarios.appendChild(newComment);

                
            });
            
            //console.log(data);
        }

        // Función para enviar el comentario
        async function postComment(data) {
            const id_post = urlParameters.get('q');
            const response = await fetch(`http://localhost:5000/publicaciones/${id_post}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();  // Cambié la variable de 'data' a 'result' para evitar confusión
            //console.log(result);
            getComments();
        }
    } else {
        console.error('El botón o el campo de comentario no existen en el DOM');
    }
});


function obtenerFechaHoraActual() {
    const fecha = new Date();
    
    
    const fechaHoraFormateada = fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1).padStart(2, '0') + "-" +
        String(fecha.getDate()).padStart(2, '0') + " " +
        String(fecha.getHours()).padStart(2, '0') + ":" +
        String(fecha.getMinutes()).padStart(2, '0') + ":" +
        String(fecha.getSeconds()).padStart(2, '0');

    return fechaHoraFormateada;
}

function extraerHoraMinutos(datetimeString) {
    
    const fecha = new Date(datetimeString.replace(" ", "T"));
    

    ////console.log("La fecha anterior:", fecha);

    const currentDate = new Date();
    ////console.log("Fecha y hora actual:", currentDate);

    
    const diferenciaMs = currentDate - fecha;
    const diferenciaMinutos = Math.floor(diferenciaMs / (1000 * 60));
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    
    if (diferenciaDias > 0) {
        return (`Hace ${diferenciaDias} días`);
    } else if (diferenciaHoras > 0) {
        return (`Hace ${diferenciaHoras} horas`);
    } else if (diferenciaMinutos > 1) { 
        return (`Hace ${diferenciaMinutos} minutos`);
    }else if(diferenciaMinutos>0){
        return (`Hace ${diferenciaMinutos} minuto`);
    }else{
        return ("Hace menos de un minuto");
    }
     
    
    
    

}


