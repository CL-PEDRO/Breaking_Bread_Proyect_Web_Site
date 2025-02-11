document.addEventListener("DOMContentLoaded", () => {
    const botonCrear = document.getElementById("crear-publicacion");

    botonCrear.addEventListener("click", async () => {
        
        const titulo = document.getElementById("titulo").value.trim();
        const texto = document.getElementById("texto").value.trim();
        const fotos = document.getElementById("fotos").files;
        const nombreReceta = document.getElementById("nombre-receta").value.trim();
        const descripcionReceta = document.getElementById("descripcion-receta").value.trim();
        const ingredientes = document.getElementById("ingredientes").value.trim();
        const procedimiento = document.getElementById("procedimiento").value.trim();

        
        const usuarioId = localStorage.getItem("userId");
        if (!usuarioId) {
            alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión.");
            return;
        }

        
        if (!titulo || !texto || !nombreReceta || !descripcionReceta || !ingredientes || !procedimiento) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

      
        try {
           
           

           
            const datos = {
                titulo: titulo,
                id_usuario: usuarioId,
                image: imagenesBase64,
                texto: texto,
                id_img: 1, //  formato Base64
                name: nombreReceta,
                description: descripcionReceta,
                ingredients: ingredientes,
                preparation: procedimiento
            };

            
            const respuesta = await fetch("http://localhost:5000/recipe/CreateRecipePublication", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.message || "Error al crear la publicación.");
            }

            const data = await respuesta.json();
            alert("Publicación creada con éxito.");
            console.log("Datos de la respuesta:", data);

            
            window.location.href = 'http://localhost:4200/html/perfil.html';
            limpiarFormulario();

        } catch (error) {
            console.error("Error al enviar la publicación:", error);
            alert("Hubo un error al crear la publicación. Inténtalo nuevamente.");
        }
    });

    
    function limpiarFormulario() {
        document.getElementById("titulo").value = "";
        document.getElementById("texto").value = "";
        document.getElementById("fotos").value = "";
        document.getElementById("nombre-receta").value = "";
        document.getElementById("descripcion-receta").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("procedimiento").value = "";
    }
});
