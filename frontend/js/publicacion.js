document.addEventListener("DOMContentLoaded", () => {
    const botonCrear = document.getElementById("crear-publicacion");

    botonCrear.addEventListener("click", async () => {
        // Obtener los datos del formulario
        const titulo = document.getElementById("titulo").value.trim();
        const texto = document.getElementById("texto").value.trim();
        const fotos = document.getElementById("fotos").files;
        const nombreReceta = document.getElementById("nombre-receta").value.trim();
        const descripcionReceta = document.getElementById("descripcion-receta").value.trim();
        const ingredientes = document.getElementById("ingredientes").value.trim();
        const procedimiento = document.getElementById("procedimiento").value.trim();

        // Obtener el ID del usuario desde localStorage
        const usuarioId = localStorage.getItem("userId");
        if (!usuarioId) {
            alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión.");
            return;
        }

        // Validar los campos obligatorios
        if (!titulo || !texto || !nombreReceta || !descripcionReceta || !ingredientes || !procedimiento) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

      
        try {
            // Procesar imágenes
            //const imagenesBase64 = await Promise.all();

            // Crear el objeto para enviar
            const datos = {
                titulo: titulo,
                id_usuario: usuarioId,
                image: imagenesBase64,
                texto: texto,
                id_img: 1, // Enviar imágenes en formato Base64
                name: nombreReceta,
                description: descripcionReceta,
                ingredients: ingredientes,
                preparation: procedimiento
            };

            // Hacer la llamada al servidor
            const respuesta = await fetch("http://localhost:5000/CreateRecipePublication", {
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

            // Limpiar el formulario
            window.location.href = 'http://localhost:4200/html/perfil.html';
            limpiarFormulario();

        } catch (error) {
            console.error("Error al enviar la publicación:", error);
            alert("Hubo un error al crear la publicación. Inténtalo nuevamente.");
        }
    });

    /**
     * Función para limpiar el formulario tras crear la publicación.
     */
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
