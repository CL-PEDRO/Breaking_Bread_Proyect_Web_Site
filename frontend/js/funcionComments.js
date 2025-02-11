let currentPostId = null;


const comentariosModal = document.getElementById('comentariosModal');
comentariosModal.addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;

  currentPostId = button.getAttribute('data-post-id') || button.id;
  console.log("Abriendo modal para el post:", currentPostId);

  getComments(currentPostId);
});

document.addEventListener("DOMContentLoaded", function () {
  const textComment = document.getElementsByClassName('comment-input');
  const submitButton = document.getElementById('submit-button');
  const ShowCommentarios = document.getElementById('commentarios');

  if (submitButton && textComment) {


    submitButton.addEventListener('click', function(event) {
      event.preventDefault();

      
      isLogged();

      const comment = textComment[0].value.trim();
      if (comment.length > 0) {  
        const id_user = localStorage.getItem('userId');
        const data = {
          id_user: id_user,
          fecha: obtenerFechaHoraActual(),
          text_comentario: comment
        };
        
        textComment[0].value = '';
        
        postComment(currentPostId, data);
      } else {
        console.log('El comentario está vacío');
      }
    });

    
    async function getComments(postId) {
      try {
        const response = await fetch(`http://localhost:5000/posts/userActions/${postId}/getComments`);
        const data = await response.json();
        ShowCommentarios.innerHTML = '';
        data.forEach(comentario => {
          const writtenTime = extraerHoraMinutos(comentario.fecha);
          const newComment = document.createElement('li');
          newComment.classList.add('list-group-item');
          newComment.innerHTML= `
            <div id="commentsBox">
              <img class="ImagenComentario" src="/${comentario.foto_perfil}" alt="Imagen del usuario">
              <div>
                <span><strong>${comentario.nombre_Usuario}</strong></span><br>
                <span>${comentario.comentario}</span><br>
                <small id="dateTime">${writtenTime}</small>
              </div>
            </div>`;
          ShowCommentarios.appendChild(newComment);
        });
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    }

    
    async function postComment(postId, data) {
      try {
        const response = await fetch(`http://localhost:5000/posts/userActions/${postId}/postComment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        
        getComments(postId);
      } catch (error) {
        console.error("Error al publicar el comentario:", error);
      }
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
  const currentDate = new Date();
  const diferenciaMs = currentDate - fecha;
  const diferenciaMinutos = Math.floor(diferenciaMs / (1000 * 60));
  const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
  const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

  if (diferenciaDias > 0) {
      return `Hace ${diferenciaDias} días`;
  } else if (diferenciaHoras > 0) {
      return `Hace ${diferenciaHoras} horas`;
  } else if (diferenciaMinutos > 1) { 
      return `Hace ${diferenciaMinutos} minutos`;
  } else if (diferenciaMinutos > 0) {
      return `Hace ${diferenciaMinutos} minuto`;
  } else {
      return "Hace menos de un minuto";
  }
}


function isLogged() {

  // Por ejemplo, si no está logueado, puedes redirigirlo o mostrar un mensaje.
  if (!localStorage.getItem('userId')) {
    console.log("Usuario no logueado");
    // Aquí podrías redirigir al login o mostrar una alerta.
  }
}
