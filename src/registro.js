document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Evita que se recargue la página al enviar el formulario
  
      // Obtiene los datos del formulario
      const formData = new FormData(form);
      const userData = {
        name: formData.get('fullname'),
        email: formData.get('email'),
        password: formData.get('password'),
      };
  
      try {
        // Realiza una solicitud POST al servidor
        const response = await fetch('http://192.168.137.186:5000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
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
  