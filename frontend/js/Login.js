document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Evita que se recargue la página al enviar el formulario
  
      // Obtiene los datos del formulario
      const formData = new FormData(form);
      const credentials = {
        email: formData.get('username'),
        password: formData.get('password'),
      };
  
      try {
        // Realiza una solicitud POST al servidor
        const response = await fetch('http://localhost:5000/user/info/usersAuthentication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        if (response.ok) {
            console.log(response);
            const result = await response.json();
            console.log('Datos del backend:', result);
        
            // Extrae correctamente los valores del objeto 'user'
            const id_user = result.user.id_user;
            const nombre_Usuario = result.user.email; 
        
            console.log('ID Usuario:', id_user);
            console.log('Nombre Usuario:', nombre_Usuario);
        
            // Guarda en localStorage/sessionStorage
            localStorage.setItem('userId', id_user);
            localStorage.setItem('userName', nombre_Usuario);
        
          // Redirige a la pantalla de inicio
          window.location.href = 'http://localhost:4200/index.html';
        } else {
          const error = await response.json();
          alert('Error al iniciar sesión: ' + error.message);
        }
      } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un problema al conectarse con el servidor.');
      }
    });
  });
  