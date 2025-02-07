import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import multer from 'multer';
import path from 'path';

// Configurar almacenamiento con el nombre original
const storage = multer.diskStorage({
  destination: '/app/uploads/images', // Asegurar que coincide con el volumen en Docker
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Obtener extensión
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; // Nombre único
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


//const upload = multer({ storage: storage });

//import { json } from 'express';
import bcrypt from 'bcryptjs';

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
    res.send('Hello World Peter was here ° ͜ʖ ͡° jisaaaaaaaaaaaaj');
  });

  app.get('/date', async (req, res) => {
    const result = await pool.query('SELECT NOW() as date;');
    res.json(result[0]);

});


// APIS GET


//Obtener todas las publicaciones

app.get('/publicaciones', async (req, res) => {
    const query = `
      SELECT p.id_publicacion, p.titulo, u.nombre_Usuario AS usuario, c.texto AS descripcion, Recetas.url_image
      FROM Publicaciones p
      JOIN Usuario u ON p.id_usuario = u.id_user
      JOIN Contenidos c ON p.id_contenido = c.id_contenido
      JOIN Recetas ON Recetas.id_receta = c.id_receta
      ORDER BY p.id_publicacion DESC;
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
  

//Buscar Receta por tipo de receta

app.get('/recetastipo/:id_tipo', async (req, res) => {
    
  
    try {
    
  
      const { id_tipo } = req.params;
  
      // Validar que id_tipo sea un número
      if (isNaN(id_tipo)) {
        return res.status(400).json({ message: 'El id_tipo debe ser un número válido', code: 'APP-02' });
      }
  
      // Consulta a la base de datos
      const [recipe] = await pool.query(
        `SELECT Recetas.nombre_Receta, Recetas.descripcion_Reseta, Recetas.ingredientes, Recetas.procedimiento, Recetas.url_image 
         FROM Recetas
         JOIN Tipos ON Recetas.id_tipo = Tipos.id_tipo
         WHERE Tipos.id_tipo = ?;`,
        [id_tipo]
      );
  
      // Verificar si se encontraron recetas
      if (recipe.length === 0) {
        return res.status(404).json({ message: 'No se encontraron recetas para el tipo especificado', code: 'APP-04' });
      }
  
      // Enviar la primera receta encontrada
      res.json(recipe);
    } catch (error) {
      console.error('Error al obtener receta:', error);
      res.status(500).json({ message: 'Error al obtener receta', code: 'APP-03' });
    }
  });


//Buscar Receta por nombre de receta
app.get('/recetasPorNombre/:nombre_Receta', async (req, res) => {

  const { nombre_Receta } = req.params;
  console.log('Solicitud recibida en /recetasPorNombre/:nombre_Receta', nombre_Receta); // Log para depuración
  if (!nombre_Receta) {
    return res.status(400).json({ message: 'El nombre de la receta es requerido', code: 'APP-02' });
  }
  try{

    const queryByName = `SELECT Recetas.nombre_Receta, Recetas.descripcion_Reseta, Recetas.ingredientes,
     Recetas.procedimiento, Recetas.url_image,Publicaciones.id_publicacion 
     FROM Recetas JOIN Tipos ON Recetas.id_tipo = Tipos.id_tipo JOIN Contenidos ON 
     Contenidos.id_receta = Recetas.id_receta JOIN Publicaciones ON Publicaciones.id_contenido =
      Contenidos.id_contenido WHERE LOWER(Recetas.nombre_Receta) LIKE '%${nombre_Receta}%';`;
    const [recipe] = await pool.query(queryByName);
    
    if (recipe.length === 0) {
      return res.status(404).json({ message: 'No se encontraron recetas para el nombre especificado', code: 'APP-04' });
    }else
    {
      res.json(recipe);
    }

  }catch(error){
    console.error('Error al obtener receta:', error);
    res.status(500).json({ message: 'Error al obtener receta', code: 'APP-03' });
  }


});




//Publicaciones por id_user

app.get('/publicacionesUser/:id_user', async (req, res) => {
        try{
        const { id_user } = req.params;
        const [user] = await pool.query('SELECT Publicaciones.titulo, Contenidos.texto , Recetas.nombre_Receta,Recetas.descripcion_Reseta from Publicaciones,Contenidos,Recetas, Usuario WHERE Recetas.id_receta = Contenidos.id_receta and Contenidos.id_contenido = Publicaciones.id_contenido and Usuario.id_user = Publicaciones.id_usuario and Usuario.id_user =?;', [id_user]);
        res.json(user);
        }catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener publicaciones del usuario' });
        }
    
    
    } );
  
   
  
 
//Buscar Usuario por id_user

  app.get('/perfilUser/:id_user', async (req, res) => {
        try{
         // Log para depuración
        const { id_user } = req.params;
        console.log('Solicitud recibida en /perfilUser/:id_user',id_user); // Log para depuración
        const [user] = await pool.query('SELECT Usuario.nombre_Usuario, Usuario.foto_perfil FROM Usuario WHERE Usuario.id_user = ?;', [id_user]);
        res.json(user[0]);
        }catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
        }
      } );


  app.get('/postdata/:id_post', async (req, res) => {

    try {
      const {id_post} = req.params;
      console.log('Solicitud recibida en /postdata/:id_post',id_post); // Log para depuración
      const queryPost = `SELECT Publicaciones.titulo, Usuario.nombre_Usuario,
       Contenidos.texto , Recetas.nombre_Receta,Recetas.descripcion_Reseta,Recetas.url_image,Usuario.foto_perfil
       ,Recetas.ingredientes,Recetas.procedimiento
        from Publicaciones,Contenidos,Recetas, Usuario
      WHERE Recetas.id_receta = Contenidos.id_receta and
       Contenidos.id_contenido = Publicaciones.id_contenido and
        Usuario.id_user = Publicaciones.id_usuario and Publicaciones.id_publicacion=${id_post};`

      const [post] = await pool.query(queryPost);

      if (post.length === 0) {
        return res.status(404).json({ message: 'No se encontraron publicaciones para el usuario especificado', code: 'APP-04' });
      }else{
        res.json(post);
      }

      

    } catch (error) {
        console.error('Error al obtener publicacion:', error);
        res.status(500).json({ message: 'Error al obtener publicacion' });
    }

  }); 


    
//Buscar Todos los comentarios
  app.get('/publicaciones/:id_post/getComments', async(req,res) =>
  { 
    
    const id_post = req.params.id_post;
    
    if(!id_post)
      res.status(500).json({ message: 'Error al obtener los commentarios id incorrecto/inexistene ni se escribir ;-; :D' });  

    try{


      const queryGetComments = `SELECT Usuario.nombre_Usuario, Usuario.foto_perfil, Comentarios_Publicaciones.comentario,Comentarios_Publicaciones.fecha
       FROM Comentarios_Publicaciones
      JOIN Usuario on Usuario.id_user = Comentarios_Publicaciones.id_usuario        
      WHERE Comentarios_Publicaciones.id_publicacion = ${id_post}
      ORDER BY Comentarios_Publicaciones.fecha DESC;`;

      const response = await pool.query(queryGetComments);

      res.json(response[0]);

    }catch(error)
    {
      console.error('Error al obtener comentarios :D:', error);
      res.status(500).json({ message: 'Error al obtener los commentarios id incorrecto/inexistene ni se escribir ;-; :D fucckk ' });
    }
      

  });
  
  
















// APIs POST

    //Añadir usuario  INSERT INTO `Usuario` (`id_user`, `nombre_Usuario`, `foto_perfil`, `email`, `contrasena`, `id_guardados`) VALUES (NULL, 'peter', 'asda', 'mi@sadasdasd', 'conrase', NULL);
    app.post('/users', async (req, res) => {

        console.log(req.body);
        const { name, email, password } = req.body;
        await pool.query('INSERT INTO Usuario (nombre_Usuario, email, contrasena) VALUES (?, ?, ?)', [name, email, password]);
        res.json({ message: 'User created', 'code': 'APP-01' });
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

    
    //Crear receta, contenido, y publicación
    app.post('/CreateRecipePublication', upload.single('image'), async (req, res) => {
        const connection = await pool.getConnection(); // Iniciar una conexión transaccional
        try {
          const {
            titulo,
            id_usuario,
            texto,
            name: nombre_Receta,
            description: descripcion_Receta,
            ingredients,
            preparation: procedimiento,
            id_tipo
          } = req.body;
          
          console.table(req.body);
          // Validación de datos requeridos
          if (
            !titulo ||
            !id_usuario ||
            !texto ||
            !nombre_Receta ||
            !descripcion_Receta ||
            !ingredients ||
            !procedimiento
          ) {
            return res.status(400).json({ message: 'Missing required fields', code: 'APP-02' });
          }
      
          // Obtener la ruta de la imagen subida
          const imagePath = req.file ? `/uploads/images/${req.file.filename}` : null;
      
          // Iniciar transacción
          await connection.beginTransaction();
      
          // Crear la receta
          const [recipeResult] = await connection.query(
            'INSERT INTO `Recetas` (`nombre_Receta`, `descripcion_Reseta`, `ingredientes`, `procedimiento`, `url_image`, `id_tipo`) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_Receta, descripcion_Receta, ingredients, procedimiento, imagePath, id_tipo]
          );
          const id_receta = recipeResult.insertId;
      
          // Crear contenido vinculado a la receta
          const [contentResult] = await connection.query(
            'INSERT INTO `Contenidos` (`id_receta`, `texto`) VALUES (?, ?)',
            [id_receta, texto]
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
            image: imagePath
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
        
    //ingresar nueva receta deberia existir ??


    app.post('/InsertrecipesUnica', async (req, res) => {
        try {
        // Desestructuración de los datos del cuerpo de la solicitud
        const { name, description, ingredients, preparation,url_image, id_tipo } = req.body;
    
        // Validación básica de los datos recibidos
        if (!name || !description || !ingredients || !preparation || !id_tipo) {
            return res.status(400).json({ message: 'Missing required fields', code: 'APP-02' });
        }
    
        // Inserción en la base de datos
        await pool.query(
            'INSERT INTO `Recetas` (`nombre_Receta`, `descripcion_Reseta`, `ingredientes`, `procedimiento`,`url_image`, `id_tipo`) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, ingredients, preparation,url_image, id_tipo]
        );
    
        // Respuesta exitosa
        res.status(201).json({ message: 'Recipe created', code: 'APP-01' });
        } catch (error) {
        // Manejo de errores
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Internal server error', code: 'APP-03' });
        }
    });
    



    //Agregar comentario a una publicación
    app.post('/publicaciones/:id_publicacion/comentarios', async (req, res) => {
        
      console.table(req.body);
      const id_post = req.params.id_publicacion;
      const { id_user, text_comentario, fecha } = req.body;

      console.table(req.body);

      try{
        const [result] = await pool.query(
          'INSERT INTO Comentarios_Publicaciones (id_usuario, id_publicacion, comentario, fecha) VALUES (?, ?, ?, ?)',
          [id_user, id_post, text_comentario, fecha]
        );
        res.json({ Data : result,message: 'Comentario agregado', code: 'APP-01' });
      }catch(error){
        console.error('Error al agregar comentario:', error);
        res.status(500).json({ message: 'Error al agregar comentario' });
      }
    });

















console.log("Hola estoy en :D",process.env.BACKEND_PORT_EXPOSE);


const PORT = process.env.BACKEND_PORT_EXPOSE || 3000;
console.log("Hola estoy en :D",PORT);
app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});


