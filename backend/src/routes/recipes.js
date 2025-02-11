import express from "express";
import {recipeByType,recipeByName,createPost} from '../controllers/recipes.js';
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
  
  
//Configuraciones 
const upload = multer({ storage: storage });
//Buscar Receta por tipo de receta

router.get("/recetastipo/:id_tipo", recipeByType);

//Buscar Receta por nombre de receta
router.get("/recetasPorNombre/:nombre_Receta",recipeByName);

//Crear receta, contenido, y publicación
router.post("/CreateRecipePublication",upload.single("image"),createPost);


export default router;