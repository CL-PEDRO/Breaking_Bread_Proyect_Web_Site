document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId"); 
    console.log(userId);
    if (!userId) {
      console.error("No se encontró el ID del usuario en localStorage.");
      return;
    }

    try {
      
      const urlUsuario = `http://localhost:5000/user/info/perfilUser/${userId}`;
      console.log(urlUsuario);
      const userResponse = await fetch(urlUsuario);

      if (!userResponse.ok) {
        throw new Error("Error al obtener datos del usuario.");
      }
      
      const {foto_perfil,nombre_Usuario} = await userResponse.json();
      //console.table(userData);
      console.log("Esta es la foto ;D",foto_perfil);
      const userNameElement = document.getElementById("user-name");
      const userDescriptionElement = document.getElementById("user-description");
      const userImageProfile = document.getElementById("user-image-profile");

      
      userNameElement.textContent = nombre_Usuario || "Usuario sin nombre";
      userDescriptionElement.textContent =  `Hola soy ${nombre_Usuario} y me gusta cocinar`;

      userImageProfile.src = "/"+foto_perfil  || "/uploads/images/1738518143870-442359402.png";


      const urlPublicaciones = `http://localhost:5000/user/info/publicacionesUser/${userId}`;
      console.log(urlPublicaciones);
      const postsResponse = await fetch(urlPublicaciones)

      if (!postsResponse.ok) {
        throw new Error("Error al obtener publicaciones.");
      }

      const postsData = await postsResponse.json();
      const postsContainer = document.getElementById("posts-container");

      
      postsContainer.innerHTML = "<h2>Publicaciones Recientes</h2>";

      postsData.forEach((post) => {
        console.log("Crear nuva piblicacion");
        const linkPost =  document.createElement('a');
        
        linkPost.href = `http://localhost:4200/html/showPost.html?q=${post.id_publicacion}`;
         ///publicacionesUser/:id_user
         //./html/showPost.html?q=${post.id_publicacion}"
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const postTitle = document.createElement("h4");
        postTitle.textContent = post.titulo || "Título no disponible";

        const postText = document.createElement("p");
        postText.textContent = post.texto || "Texto no disponible";

        const postRecipe = document.createElement("p");
        postRecipe.textContent = `Receta: ${post.nombre_Receta || "No disponible"} - ${post.descripcion_Reseta || "Sin descripción"}`;

        linkPost.appendChild(postTitle);       
        postElement.appendChild(linkPost);
        postElement.appendChild(postText);
        postElement.appendChild(postRecipe);

        postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error al cargar el perfil o las publicaciones:", error);
    }
  });

  
  document.getElementById("follow-button").addEventListener("click", () => {
    window.location.href = "./publicacion.html";
  });

  document.getElementById("log-out-button").addEventListener("click",()=>{
    
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    window.location.href = 'http://localhost:4200/html/Login.html';
  });