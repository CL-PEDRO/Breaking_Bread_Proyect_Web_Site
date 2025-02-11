import pool from "../db/connect.js";


const getPostByIdUser =  async (req, res) => {
    try {
      const { id_user } = req.params;
      const [user] = await pool.query(
        "SELECT Publicaciones.id_publicacion,Publicaciones.titulo, Contenidos.texto , Recetas.nombre_Receta,Recetas.descripcion_Reseta from Publicaciones,Contenidos,Recetas, Usuario WHERE Recetas.id_receta = Contenidos.id_receta and Contenidos.id_contenido = Publicaciones.id_contenido and Usuario.id_user = Publicaciones.id_usuario and Usuario.id_user =?;",
        [id_user]
      );
      res.json(user);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res
        .status(500)
        .json({ message: "Error al obtener publicaciones del usuario" });
    }
  }

const dataPerfil = async (req, res) => {
    try {
      // Log para depuración
      const { id_user } = req.params;
      console.log("Solicitud recibida en /perfilUser/:id_user", id_user); // Log para depuración
      const [user] = await pool.query(
        "SELECT Usuario.nombre_Usuario, Usuario.foto_perfil FROM Usuario WHERE Usuario.id_user = ?;",
        [id_user]
      );
      res.json(user[0]);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  }
const createUser =  async (req, res) => {
  try{

    console.log(req.body);
    const perfilImage = req.file;
    console.log("Imagen subida",perfilImage);
    const imagePath = req.file
      ? `uploads/images/${req.file.filename}`
      : null;

    const { fullname, email, password } = req.body;
    await pool.query(
      "INSERT INTO Usuario (nombre_Usuario, email, foto_perfil,contrasena) VALUES (?, ?,?, ?)",
      [fullname, email,imagePath, password]
    );
    res.json({ message: "User created", code: "APP-01" });

  }catch(error)
  {
    res.status(500).json({ message: "Usuario No creado", code: "APP-02" });
  } 

}
const userAuth = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validación de entrada
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required", code: "AUTH-01" });
      }
  
      // Consultar el usuario por correo electrónico
      const [result] = await pool.query(
        "SELECT Usuario.id_user, Usuario.email, Usuario.contrasena FROM Usuario WHERE Usuario.email = ?",
        [email]
      );
  
      // Verificar si el usuario existe
      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found", code: "AUTH-02" });
      }
  
      const user = result[0];
      console.log(user);
      console.log("Stored password:", user.contrasena);
      // Comparar la contraseña proporcionada con la almacenada en texto plano
      if (password !== user.contrasena) {
        return res
          .status(401)
          .json({ message: "Invalid password", code: "AUTH-04" });
      }
  
      // Responder con éxito
      res.json({
        message: "Authentication successful",
        user: { email: user.email, id_user: user.id_user },
      });
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ message: "Internal server error", code: "AUTH-03" });
    }
  }
export {
    getPostByIdUser,
    dataPerfil,
    createUser,
    userAuth
}