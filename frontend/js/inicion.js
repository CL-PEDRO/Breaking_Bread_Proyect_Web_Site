// Init JS
  document.addEventListener('DOMContentLoaded', async () => {
    isLogged();
    
    try {
      const response = await fetch('http://localhost:5000/posts/info/publicaciones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const publicaciones = await response.json();
        const postContainer = document.getElementById('post-container');
        console.table(publicaciones);
        // Inserta cada publicación en el contenedor
        publicaciones.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.classList.add('col-md-4', 'mb-4');
          
          postElement.innerHTML = `
            <div class="col-md-4">
            <div class="card post-card shadow-sm" onclick="window.location.href='./html/showPost.html?q=${post.id_publicacion}'">
            <img src="${post.url_image}" class="card-img-top post-img" alt="${post.titulo}">
            <div class="card-body">
            <h5 class="card-title">${post.titulo}</h5>
            <p class="card-text">${post.descripcion}</p>
            <p class="card-text"><small class="text-muted">Publicado por: ${post.usuario}</small></p>
            </div>
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
  
