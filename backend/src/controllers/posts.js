import pool from "../db/connect.js";

const allPost = async (req, res) => {
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
      console.error("Error al obtener publicaciones:", error);
      res.status(500).json({ message: "Error al obtener publicaciones" });
    }
}

const infoPost = async (req, res) => {
    try {
      const { id_post } = req.params;
      console.log("Solicitud recibida en /postdata/:id_post", id_post); // Log para depuración
      const queryPost = `SELECT Publicaciones.id_publicacion, Publicaciones.titulo, Usuario.nombre_Usuario,
     Contenidos.texto , Recetas.nombre_Receta,Recetas.descripcion_Reseta,Recetas.url_image,Usuario.foto_perfil,Usuario.id_user
     ,Recetas.ingredientes,Recetas.procedimiento
      from Publicaciones,Contenidos,Recetas, Usuario
    WHERE Recetas.id_receta = Contenidos.id_receta and
     Contenidos.id_contenido = Publicaciones.id_contenido and
      Usuario.id_user = Publicaciones.id_usuario and Publicaciones.id_publicacion=${id_post};`;
  
      const [post] = await pool.query(queryPost);
  
      if (post.length === 0) {
        return res
          .status(404)
          .json({
            message:
              "No se encontraron publicaciones para el usuario especificado",
            code: "APP-04",
          });
      } else {
        res.json(post);
      }
    } catch (error) {
      console.error("Error al obtener publicacion:", error);
      res.status(500).json({ message: "Error al obtener publicacion" });
    }
  }

const getLikes =async (req, res) => {
    try {
      const id_post = req.params.id_post;
  
      if (isNaN(id_post)) {
        return res
          .status(400)
          .json({ mensaje: "El ID de la publicación debe ser un número" });
      }
      console.log("Vamos a ver.5s");
  
      const [response] = await pool.query(
        "SELECT COUNT(Likes_Publicaciones.id_like) AS total_likes FROM Likes_Publicaciones  WHERE Likes_Publicaciones.id_publicacion = ?;",
        [id_post]
      );
  
      res.json(response[0]);
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Error al obtener los likes", error: error.message });
    }
  }


export {allPost,infoPost,getLikes}
