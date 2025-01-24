import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
//import { json } from 'express';
import bcrypt from 'bcryptjs';
;

const app = express();
app.use(cors());
app.use(express.json());

const pool = createPool({
    host: 'breakingBread_db',
    user: 'root',
    database: 'breaking_bread_db',
    password: 'root123',
    port: 3306
});

app.get('/', (req, res) => {  
    res.send('Hello Worldasdaklsdnañkb');
  });



//Añadir usuario  INSERT INTO `Usuario` (`id_user`, `nombre_Usuario`, `foto_perfil`, `email`, `contrasena`, `id_guardados`) VALUES (NULL, 'peter', 'asda', 'mi@sadasdasd', 'conrase', NULL);
app.post('/users', async (req, res) => {

  console.log(req.body);
    const { name, email, password } = req.body;
    await pool.query('INSERT INTO Usuario (nombre_Usuario, email, contrasena) VALUES (?, ?, ?)', [name, email, password]);
    res.json({ message: 'User created', 'code': 'APP-01' });
  });


//ingresar nueva receta


app.post('/InsertrecipesUnica', async (req, res) => {
  try {
    // Desestructuración de los datos del cuerpo de la solicitud
    const { name, description, ingredients, preparation, id_tipo, id_pais, id_key } = req.body;

    // Validación básica de los datos recibidos
    if (!name || !description || !ingredients || !preparation || !id_tipo || !id_pais || !id_key) {
      return res.status(400).json({ message: 'Missing required fields', code: 'APP-02' });
    }

    // Inserción en la base de datos
    await pool.query(
      'INSERT INTO `Recetas` (`nombre_Receta`, `descripcion_Reseta`, `ingredientes`, `procedimiento`, `id_tipo`, `id_pais`, `id_keyword`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, ingredients, preparation, id_tipo, id_pais, id_key]
    );

    // Respuesta exitosa
    res.status(201).json({ message: 'Recipe created', code: 'APP-01' });
  } catch (error) {
    // Manejo de errores
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Internal server error', code: 'APP-03' });
  }
});






//Crear receta, contenido, y publicación
app.post('/CreateRecipePublication', async (req, res) => {
  const connection = await pool.getConnection(); // Iniciar una conexión transaccional
  try {
    const {
      titulo,
      id_usuario,
      texto,
      id_img,
      name: nombre_Receta,
      description: descripcion_Receta,
      ingredients,
      preparation: procedimiento,
    } = req.body;

    // Validación de datos requeridos
    if (
      !titulo ||
      !id_usuario ||
      !texto ||
      !id_img ||
      !nombre_Receta ||
      !descripcion_Receta ||
      !ingredients ||
      !procedimiento
    ) {
      return res.status(400).json({ message: 'Missing required fields', code: 'APP-02' });
    }

    // Iniciar transacción
    await connection.beginTransaction();

    // Crear la receta
    const [recipeResult] = await connection.query(
      'INSERT INTO `Recetas` (`nombre_Receta`, `descripcion_Reseta`, `ingredientes`, `procedimiento`) VALUES (?, ?, ?, ?)',
      [nombre_Receta, descripcion_Receta, ingredients, procedimiento]
    );
    const id_receta = recipeResult.insertId;

    // Crear contenido vinculado a la receta
    const [contentResult] = await connection.query(
      'INSERT INTO `Contenidos` (`id_receta`, `texto`, `id_img`) VALUES (?, ?, ?)',
      [id_receta, texto, id_img]
    );
    const id_contenido = contentResult.insertId;

    // Crear publicación vinculada al contenido
    await connection.query(
      'INSERT INTO `Publicaciones` (`titulo`, `id_usuario`, `id_contenido`) VALUES (?, ?, ?)',
      [titulo, id_usuario, id_contenido]
    );

    // Confirmar transacción
    await connection.commit();

    // Respuesta exitosa
    res.status(201).json({
      message: 'Recipe, content, and publication created successfully',
      code: 'APP-01',
      ids: { id_receta, id_contenido },
    });
  } catch (error) {
    // Manejo de errores
    console.error('Error creando receta, contenido, y publicación:', error);

    // Revertir transacción en caso de error
    if (connection) await connection.rollback();

    res.status(500).json({ message: 'Internal server error', code: 'APP-03' });
  } finally {
    if (connection) connection.release(); // Liberar conexión
  }
});








//Obtener usuario y contraseña usando el nombre de usuario /:name
app.post('/usersAuthentication', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', code: 'AUTH-01' });
    }

    // Consultar el usuario por correo electrónico
    const [result] = await pool.query(
      'SELECT Usuario.id_user, Usuario.email, Usuario.contrasena FROM Usuario WHERE Usuario.email = ?',
      [email]
    );

    // Verificar si el usuario existe
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found', code: 'AUTH-02' });
    }

    const user = result[0];
    console.log(user);
    console.log('Stored password:', user.contrasena);
    // Comparar la contraseña proporcionada con la almacenada en texto plano
    if (password !== user.contrasena) {
      return res.status(401).json({ message: 'Invalid password', code: 'AUTH-04' });
    }

    // Responder con éxito
    res.json({ message: 'Authentication successful', user: { email: user.email, id_user: user.id_user } });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error', code: 'AUTH-03' });
  }
});


app.get('/date', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.json(result[0]);

});



//

app.get('/products', async (req, res) => {
    const result = await pool.query('SELECT * FROM Recetas;');
    res.json(result[0]);
  });


app.post('/products', async (req, res) => {

    const { name, description } = req.body;
    console.log(req.body);
    
  
    await pool.query('INSERT INTO products (name, description) VALUES (?, ?)', [name, description]);
    res.json({ message: 'Product created', 'code': 'APP-01' });
  });



  app.get('/publicaciones', async (req, res) => {
    const query = `
      SELECT p.id_publicacion, p.titulo, u.nombre_Usuario AS usuario, c.texto AS descripcion, i.img AS imagen
      FROM Publicaciones p
      JOIN Usuario u ON p.id_usuario = u.id_user
      JOIN Contenidos c ON p.id_contenido = c.id_contenido
      LEFT JOIN Imagenes i ON c.id_img = i.id_imagen
      ORDER BY p.id_publicacion DESC
    `;
  
    try {
      // Ejecutar la consulta de forma asíncrona
      const [results] = await pool.query(query);
  
      // Responder con los resultados
      res.json(results);
    } catch (error) {
      // Manejar errores
      console.error('Error al obtener publicaciones:', error);
      res.status(500).json({ message: 'Error al obtener publicaciones' });
    }
  });
  


 
//Buscar Usuario por id_user

app.get('/perfilUser', async (req, res) => {
  try{
    const { id_user } = req.body;
  const [user] = await pool.query('SELECT Usuario.nombre_Usuario FROM Usuario WHERE Usuario.id_user = ?;', [id_user]);
  res.json(user[0]);
  }catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
} );


//Publicaciones por id_user

app.post('/publicacionesUser', async (req, res) => {
  try{
    const { id_user } = req.body;
    const [user] = await pool.query('SELECT Publicaciones.titulo, Contenidos.texto , Recetas.nombre_Receta,Recetas.descripcion_Reseta from Publicaciones,Contenidos,Recetas, Usuario WHERE Recetas.id_receta = Contenidos.id_receta and Contenidos.id_contenido = Publicaciones.id_contenido and Usuario.id_user = Publicaciones.id_usuario and Usuario.id_user =?;', [id_user]);
    res.json(user);
  }catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones del usuario' });
  }


} );

 
   
app.listen(3000);

console.log('Server running on http://localhost:5000');

