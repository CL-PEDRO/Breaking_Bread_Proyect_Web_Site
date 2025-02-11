document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Evita que se recargue la página al enviar el formulario
  
      // Obtiene los datos del formulario
      const formData = new FormData(form);

      try {
        // Realiza una solicitud POST al servidor
        const response = await fetch('http://localhost:5000/user/info/createUser', {
            method: 'POST',
            body: formData, // Enviar el FormData directamente
        });
  
        if (response.ok) {
          const result = await response.json();
          //alert('Registro exitoso: ' + result.message);
          window.location.href = './Login.html';
          form.reset(); // Limpia el formulario después del registro
        } else {
          const error = await response.json();
          alert('Error en el registro: ' + error.message);
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un problema al conectarse con el servidor.');
      }
    });
  });
  