import express from 'express'
import {allComments,createComment,addLikeAuth, removePost, createForum} from '../controllers/userActions.js'
const router = express.Router();


import multer from 'multer';
import path from 'path';


// Configurar almacenamiento 
const storage = multer.diskStorage({
    destination: '/app/uploads/images', 
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);  
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; 
      cb(null, uniqueName);
    }
  });

const upload = multer({ storage: storage });


router.get("/:id_post/getComments",allComments);


router.post("/:id_publicacion/postComment", createComment);


router.post("/addLike2/:id_post/:id_user", async (req, res) => {
  try {
    const id_post = req.params.id_post;
    const id_user = req.params.id_user;

    await pool.query(
      "INSERT INTO Likes_Publicaciones(id_like, id_usuario, id_publicacion) VALUES (null,?,?);",
      [id_user, id_post]
    );

    res.status(200).json({ mensaje: "Like agregado " });
  } catch (error) {
    console.error("Error agregando like:", error);
    res
      .status(500)
      .json({ message: "Internal server error likes :C", code: "router-03" });
  }
});

router.post("/addLike/:id_post/:id_user",addLikeAuth);


router.delete("/removePost/:id_post",removePost);


router.post("/createForum",upload.single("image"),createForum);

export default router;