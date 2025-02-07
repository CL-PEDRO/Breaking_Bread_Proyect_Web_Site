document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos todos los enlaces de navegación
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Evita que el enlace siga su acción predeterminada
            
            const target = this.textContent.trim().toLowerCase(); // Obtenemos el texto del enlace en minúsculas
            
            switch (target) {
                case "inicio":
                    window.location.href = "http://localhost:4200/index.html";
                    break;
                case "foro":
                    window.location.href = "http://localhost:4200/html/foro.html";
                    break;
                case "mi perfil":

                     isLogged();
                    
                    break;
                case "buscar":
                    document.querySelector(".search-bar").classList.toggle("active");
                    break;
                default:
                    console.warn("Página no encontrada para:", target);
            }
        });
    });
});


function isLogged() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
  
    // Asegúrate de que el usuario esté autenticado
    if (!userId || !userName) {
      alert('Por favor, inicia sesión para continuar.');
      window.location.href = 'http://localhost:4200/html/Login.html';
      return;
    }else
    {
        window.location.href = "http://localhost:4200/html/perfil.html";
    }

}