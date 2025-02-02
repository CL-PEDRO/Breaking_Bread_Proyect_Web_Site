document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage
    console.log(userId);
    if (!userId) {
      console.error("No se encontró el ID del usuario en localStorage.");
      return;
    }

    try {
      // Obtener datos del usuario
      const urlUsuario = `http://localhost:5000/perfilUser/${userId}`;
      console.log(urlUsuario);
      const userResponse = await fetch(urlUsuario);

      if (!userResponse.ok) {
        throw new Error("Error al obtener datos del usuario.");
      }
      
      const userData = await userResponse.json();
      console.table(userData);
      const userNameElement = document.getElementById("user-name");
      const userDescriptionElement = document.getElementById("user-description");
      const userFollowersElement = document.getElementById("user-followers");
      const userFollowingElement = document.getElementById("user-following");

      // Asignar datos al perfil
      userNameElement.textContent = userData.nombre_Usuario || "Usuario sin nombre";
      userDescriptionElement.textContent = userData.descripcion || `Hoal soy ${userData.nombre_Usuario} y me gusta cocinar`;
      userFollowersElement.textContent = userData.seguidores || 1;
      userFollowingElement.textContent = userData.seguidos || 1;

      // Obtener publicaciones del usuario
      const urlPublicaciones = `http://localhost:5000/publicacionesUser/${userId}`;
      console.log(urlPublicaciones);
      const postsResponse = await fetch(urlPublicaciones)

      if (!postsResponse.ok) {
        throw new Error("Error al obtener publicaciones.");
      }

      const postsData = await postsResponse.json();
      const postsContainer = document.getElementById("posts-container");

      // Limpiar publicaciones existentes
      postsContainer.innerHTML = "<h2>Publicaciones Recientes</h2>";

      postsData.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const postTitle = document.createElement("h4");
        postTitle.textContent = post.titulo || "Título no disponible";

        const postText = document.createElement("p");
        postText.textContent = post.texto || "Texto no disponible";

        const postRecipe = document.createElement("p");
        postRecipe.textContent = `Receta: ${post.nombre_Receta || "No disponible"} - ${post.descripcion_Reseta || "Sin descripción"}`;

        postElement.appendChild(postTitle);
        postElement.appendChild(postText);
        postElement.appendChild(postRecipe);

        postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error al cargar el perfil o las publicaciones:", error);
    }
  });

  // Navegación
  document.getElementById("follow-button").addEventListener("click", () => {
    window.location.href = "./publicacion.html";
  });