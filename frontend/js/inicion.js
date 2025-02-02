// Init JS
  console.log("click busqueda :d22222222222");
  document.addEventListener('DOMContentLoaded', async () => {

    console.log("click busqueda :d3333333333333333333");
    try {
      const response = await fetch('http://localhost:5000/publicaciones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const publicaciones = await response.json();
        const postContainer = document.getElementById('post-container');
  
        // Inserta cada publicación en el contenedor
        publicaciones.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.classList.add('col-md-4', 'mb-4');
          console.log(post.url_image);
          postElement.innerHTML = `
            <div class="card">
            <a href="">  <img id="imma"src="${post.url_image}" class="card-img-top" alt="${post.titulo}"></a>
              <div class="card-body">
                <h5 class="card-title">${post.titulo}</h5>
                <p class="card-text">${post.descripcion}</p>
                <p class="card-text"><small class="text-muted">Publicado por: ${post.usuario}</small></p>
              </div>
            </div>
            
          `;
          postContainer.appendChild(postElement);
        });
      } else {
        console.error('Error al cargar las publicaciones:', await response.text());
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }});
  
