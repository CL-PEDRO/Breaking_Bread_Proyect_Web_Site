document.addEventListener('DOMContentLoaded', async () => {

  
    try {
      const response = await fetch('http://localhost:5000/posts/info/publicaciones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const publicaciones = await response.json();
        const postContainer = document.getElementById('search-results');
  
        // Inserta cada publicación en el contenedor
        publicaciones.forEach((post) => {
          const postElement = document.createElement('li');
          postElement.classList.add('col-md-4', 'mb-4');
          console.table(post);
          postElement.innerHTML = `
          <a href= 'http://localhost:4200/html/showPost.html?q=${post.id_publicacion}'>
          <div class="card">
              <img src="${post.imagen}" class="card-img-top" alt="${post.titulo}">
              <div class="card-body">
                <h5 class="card-title">${post.titulo}</h5>
                <p class="card-text">${post.descripcion}</p>
                <p class="card-text"><small class="text-muted">Publicado por: ${post.usuario}</small></p>
              </div>
            </div>
            </a>  
          `;
          postContainer.appendChild(postElement);
        });
      } else {
        console.error('Error al cargar las publicaciones:', await response.text());
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  });
  

