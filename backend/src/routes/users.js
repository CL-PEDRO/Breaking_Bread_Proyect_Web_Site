import express from "express";
import {getPostByIdUser,dataPerfil,createUser,userAuth} from '../controllers/users.js';
const router = express.Router();


import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: '/app/uploads/images', 
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);  
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; 
      cb(null, uniqueName);
    }
  });
  
  
  //Configuraciones 
const upload = multer({ storage: storage });

//Publicaciones por id_user

router.get("/publicacionesUser/:id_user",getPostByIdUser);

//Buscar Usuario por id_user

router.get("/perfilUser/:id_user", dataPerfil);

//Añadir usuario
router.post("/createUser",upload.single("perfilImage"),createUser);

//Obtener usuario y contraseña usando el nombre de usuario /:name
router.post("/usersAuthentication", userAuth);

export default router;
