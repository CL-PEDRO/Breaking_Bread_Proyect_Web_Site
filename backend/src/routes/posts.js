import express from "express";
import { allPost, getLikes, infoPost } from "../controllers/posts.js";
const router = express.Router();

//Obtener todas las publicaciones
router.get("/publicaciones", allPost);

router.get("/postdata/:id_post",infoPost);

//Obtener todos los likes de un publicacion
router.get("/getLikes/:id_post", getLikes);

export default router;

