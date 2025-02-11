import pool from '../db/connect.js'
import fs from 'fs/promises'




const allComments =  async (req, res) => {
    const id_post = req.params.id_post;
  
    if (!id_post)
      return res
        .status(500)
        .json({
          message:
            "Error al obtener los commentarios id incorrecto/inexistene ni se escribir ;-; :D",
        });
  
    try {
      const queryGetComments = `SELECT Usuario.nombre_Usuario, Usuario.foto_perfil, Comentarios_Publicaciones.comentario,Comentarios_Publicaciones.fecha
           FROM Comentarios_Publicaciones
          JOIN Usuario on Usuario.id_user = Comentarios_Publicaciones.id_usuario        
          WHERE Comentarios_Publicaciones.id_publicacion = ${id_post}
          ORDER BY Comentarios_Publicaciones.fecha DESC;`;
  
      const response = await pool.query(queryGetComments);
  
      res.json(response[0]);
    } catch (error) {
      console.error("Error al obtener comentarios :D:", error);
      res
        .status(500)
        .json({
          message:
            "Error al obtener los commentarios id incorrecto/inexistene ni se escribir ;-; :D fucckk ",
        });
    }
  }

const createComment = async (req, res) => {
    console.table(req.body);
    const id_post = req.params.id_publicacion;
    const { id_user, text_comentario, fecha } = req.body;
  
    console.table(req.body);
  
    try {
      const [result] = await pool.query(
        "INSERT INTO Comentarios_Publicaciones (id_usuario, id_publicacion, comentario, fecha) VALUES (?, ?, ?, ?)",
        [id_user, id_post, text_comentario, fecha]
      );
      res.json({ Data: result, message: "Comentario agregado", code: "router-01" });
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      res.status(500).json({ message: "Error al agregar comentario" });
    }
  }

const addLikeAuth =  async (req, res) => {
    try {
      const id_post = req.params.id_post;
      const id_user = req.params.id_user;
  
      const [existingLike] = await pool.query(
        "SELECT id_like FROM Likes_Publicaciones WHERE id_usuario = ? AND id_publicacion = ?;",
        [id_user, id_post]
      );
  
      if (existingLike.length > 0) {
        const response = await pool.query(
          "DELETE FROM Likes_Publicaciones WHERE id_usuario = ? AND id_publicacion = ?;",
          [id_user, id_post]
        );
  
        return res
          .status(200)
          .json({ mensaje: "Like eliminado", isLiked: false });
      } else {
        const response = await pool.query(
          "INSERT INTO Likes_Publicaciones(id_like, id_usuario, id_publicacion) VALUES (NULL, ?, ?);",
          [id_user, id_post]
        );
  
        if (response[0].affectedRows > 0) {
          return res
            .status(200)
            .json({ mensaje: "Like agregado", isLiked: true });
        } else {
          return res
            .status(500)
            .json({ mensaje: "No se pudo agregar el like", code: "APP-04" });
        }
      }
    } catch (error) {
      console.error("Error en la operación de like:", error);
      return res
        .status(500)
        .json({ mensaje: "Internal server error likes :C", code: "APP-03" });
    }
}


const removePost = async (req, res) => {
  try {
      const id_post = req.params.id_post;

      // 🔍 Obtener la ruta de la imagen desde la BD
      const queryGetUrlImage =` SELECT Recetas.url_image FROM Publicaciones
      JOIN Contenidos ON Publicaciones.id_contenido = Contenidos.id_contenido
      JOIN Recetas ON Recetas.id_receta = Contenidos.id_receta WHERE Publicaciones.id_publicacion = ?;`
      const [rows] = await pool.query(queryGetUrlImage, [id_post]);

      if (rows.length === 0) {
          return res.status(404).json({ mensaje: "Post no encontrado" });
      }

      const rutaImagen = rows[0].ruta_imagen; // Ejemplo: "uploads/images/archivo.png"

      // 🗑️ Eliminar el post de la base de datos
      await pool.query('DELETE FROM Publicaciones WHERE id_publicacion = ?', [id_post]);

      // 🖼️ Eliminar la imagen del servidor (si existe)
      if (rutaImagen) {
          try {
              const rutaAbsoluta = path.resolve('/app', rutaImagen); // Ajustado para Docker
              console.log(`Eliminando imagen en: ${rutaAbsoluta}`);
              await fs.unlink(rutaAbsoluta);
          } catch (error) {
              console.error(`Error al eliminar la imagen: ${rutaImagen}`, error);
              return `Error al eliminar la imagen: ${rutaImagen}`
          }
      }

      res.status(200).json({ mensaje: "Post eliminado correctamente" });

  } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      res.status(500).json({ mensaje: "Error al eliminar el post" });
  }
};


const createForum = async (req,res)=>{

  try{
    const {tittle_forum, forum_description, topic_forum, id_user_own} = req.body;
    console.table(req.body);

    const image_forum_path = req.file
    ? `uploads/images/${req.file.filename}`
    : null;


    const response = await pool.query('INSERT INTO Foro (id_foro, titulo_foro, descripcion_Foro, tema_foro, id_Usuario, image) VALUES (NULL,?,?,?,?,?);',[tittle_forum,forum_description,topic_forum,id_user_own,image_forum_path])
    
    const newId = response.insertId;  
    res.json(response);
  }catch(error)
  {
    console.log("Error al tratar de crear un nuevo foro");
    res.status(500).json({mensaje:"Error al tratar de crear un nuevo foro",error :error});
  }

};


export { allComments, createComment, addLikeAuth, removePost ,createForum};
  