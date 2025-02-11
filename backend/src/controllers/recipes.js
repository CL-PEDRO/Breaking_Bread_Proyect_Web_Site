import pool from "../db/connect.js";

const recipeByType =  async (req, res) => {
    try {
      const { id_tipo } = req.params;
  
      // Validar que id_tipo sea un número
      if (isNaN(id_tipo)) {
        return res
          .status(400)
          .json({
            message: "El id_tipo debe ser un número válido",
            code: "APP-02",
          });
      }
  
      // Consulta a la base de datos
      const [recipe] = await pool.query(
        `SELECT  Recetas.nombre_Receta, Recetas.descripcion_Reseta, Recetas.ingredientes,
       Recetas.procedimiento, Recetas.url_image,Publicaciones.id_publicacion 
       FROM Recetas JOIN Tipos ON Recetas.id_tipo = Tipos.id_tipo JOIN Contenidos ON 
       Contenidos.id_receta = Recetas.id_receta JOIN Publicaciones ON Publicaciones.id_contenido =
        Contenidos.id_contenido 
        
        WHERE Recetas.id_tipo = ?;`,
        [id_tipo]
      );
  
      // Verificar si se encontraron recetas
      if (recipe.length === 0) {
        return res
          .status(404)
          .json({
            message: "No se encontraron recetas para el tipo especificado",
            code: "APP-04",
          });
      }
  
      // Enviar la primera receta encontrada
      res.json(recipe);
    } catch (error) {
      console.error("Error al obtener receta:", error);
      res
        .status(500)
        .json({ message: "Error al obtener receta", code: "APP-03" });
    }
  }

const recipeByName = async (req, res) => {
    const { nombre_Receta } = req.params;
    console.log(
      "Solicitud recibida en /recetasPorNombre/:nombre_Receta",
      nombre_Receta
    ); // Log para depuración
    if (!nombre_Receta) {
      return res
        .status(400)
        .json({ message: "El nombre de la receta es requerido", code: "APP-02" });
    }
    try {
      const queryByName = `SELECT  Recetas.nombre_Receta, Recetas.descripcion_Reseta, Recetas.ingredientes,
       Recetas.procedimiento, Recetas.url_image,Publicaciones.id_publicacion 
       FROM Recetas JOIN Tipos ON Recetas.id_tipo = Tipos.id_tipo JOIN Contenidos ON 
       Contenidos.id_receta = Recetas.id_receta JOIN Publicaciones ON Publicaciones.id_contenido =
        Contenidos.id_contenido WHERE LOWER(Recetas.nombre_Receta) LIKE '%${nombre_Receta}%';`;
      const [recipe] = await pool.query(queryByName);
  
      if (recipe.length === 0) {
        return res
          .status(404)
          .json({
            message: "No se encontraron recetas para el nombre especificado",
            code: "APP-04",
          });
      } else {
        res.json(recipe);
      }
    } catch (error) {
      console.error("Error al obtener receta:", error);
      res
        .status(500)
        .json({ message: "Error al obtener receta", code: "APP-03" });
    }
  }

const createPost = async (req, res) => {
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
      id_tipo,
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
      return res
        .status(400)
        .json({ message: "Missing required fields", code: "APP-02" });
    }

    // Obtener la ruta de la imagen subida
    const imagePath = req.file
      ? `uploads/images/${req.file.filename}`
      : null;

    // Iniciar transacción
    await connection.beginTransaction();

    // Crear la receta
    const [recipeResult] = await connection.query(
      "INSERT INTO `Recetas` (`nombre_Receta`, `descripcion_Reseta`, `ingredientes`, `procedimiento`, `url_image`, `id_tipo`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nombre_Receta,
        descripcion_Receta,
        ingredients,
        procedimiento,
        imagePath,
        id_tipo,
      ]
    );
    const id_receta = recipeResult.insertId;

    // Crear contenido vinculado a la receta
    const [contentResult] = await connection.query(
      "INSERT INTO `Contenidos` (`id_receta`, `texto`) VALUES (?, ?)",
      [id_receta, texto]
    );
    const id_contenido = contentResult.insertId;

    // Crear publicación vinculada al contenido
    const [postInserted] = await connection.query(
      "INSERT INTO `Publicaciones` (`titulo`, `id_usuario`, `id_contenido`) VALUES (?, ?, ?)",
      [titulo, id_usuario, id_contenido]
    );

    const id_post = postInserted.insertId;

    // Confirmar transacción
    await connection.commit();

    // Respuesta exitosa
    res.status(201).json({
      message: "Recipe, content, and publication created successfully",
      code: "APP-01",
      ids: {id_post, id_receta, id_contenido },
      image: imagePath,
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error creando receta, contenido, y publicación:", error);

    // Revertir transacción en caso de error
    if (connection) await connection.rollback();

    res
      .status(500)
      .json({ message: "Internal server error", code: "APP-03" });
  } finally {
    if (connection) connection.release(); // Liberar conexión
  }
}

 
export {
    recipeByType,
    recipeByName,
    createPost
}