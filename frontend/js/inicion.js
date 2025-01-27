if(window.location.pathname === '/index.html')
{

  document.addEventListener('DOMContentLoaded', async () => {
    // Obtén los datos del usuario almacenados en localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
  
    // Asegúrate de que el usuario esté autenticado
    if (!userId || !userName) {
      alert('Por favor, inicia sesión para continuar.');
      window.location.href = '../html/Login.html';
      return;
    }
  
    // Personaliza la experiencia según el usuario
    //document.getElementById('profile-link').textContent = `Mi perfil (${userName})`;
  
    // Carga las publicaciones dinámicamente
    try {
      const response = await fetch('http://192.168.137.186:5000/publicaciones', {
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
  
          postElement.innerHTML = `
            <div class="card">
              <img src="${post.imagen}" class="card-img-top" alt="${post.titulo}">
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
    }
  });
  
}else{
  console.log("No es la página de inicio");
  
}

