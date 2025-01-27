document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
  
    // // Verifica si el usuario está autenticado
    // if (!userId || !userName) {
    //   alert('Por favor, inicia sesión para acceder al foro.');
    //   window.location.href = '/login.html';
    //   return;
    // }
  
    // Personaliza la interfaz para el usuario
    //document.getElementById('profile-link').textContent = `Mi perfil (${userName})`;
  
    // Carga las publicaciones del foro
    async function loadPosts(filter = 'all') {
      try {
        const response = await fetch(`http://localhost:3000/foros/${filter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const posts = await response.json();
          const postsContainer = document.getElementById('posts-container');
          postsContainer.innerHTML = '';
  
          posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('container1');
  
            postElement.innerHTML = `
              <img src="${post.imagen}" alt="usuario" class="recipe-image">
              <div class="recipe-content">
                <div class="user-info">@${post.usuario}
                  <small class="date">${post.fecha}</small>
                </div>
                <small>${post.descripcion}</small>
                <div class="barlikecom">
                  <a class="like-com" href="#">Like</a>
                  <a class="like-com" href="#">Comentar</a>
                </div>
                <div class="comment">
                  <input type="text" placeholder="Añade un comentario..." class="add-comment">
                </div>
              </div>
            `;
            postsContainer.appendChild(postElement);
          });
        } else {
          console.error('Error al cargar las publicaciones:', await response.text());
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    }
  
    // Carga la descripción del foro
    async function loadForumDescription() {
      try {
        const response = await fetch('http://localhost:3000/foro/descripcion', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const description = await response.json();
          const descriptionContainer = document.getElementById('forum-description');
  
          descriptionContainer.innerHTML = `
            <img src="${description.imagen}" alt="foro" class="descript-image">
            <div class="info">${description.texto}</div>
          `;
        } else {
          console.error('Error al cargar la descripción del foro:', await response.text());
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    }
  
    // Filtros para las publicaciones
    document.getElementById('filter-all').addEventListener('click', () => loadPosts('all'));
    document.getElementById('filter-recipes').addEventListener('click', () => loadPosts('recipes'));
    document.getElementById('filter-members').addEventListener('click', () => loadPosts('members'));
  
    // Acción para unirse al foro
    document.getElementById('join-forum').addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/foro/unirse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
  
        if (response.ok) {
          alert('Te has unido al foro con éxito.');
        } else {
          console.error('Error al unirse al foro:', await response.text());
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    });
  
    // Carga inicial
    loadPosts();
    loadForumDescription();
  });
  