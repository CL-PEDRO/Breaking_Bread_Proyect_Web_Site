import express from "express";
import { getInfo,getInfoById, getPostsFromForum, insertDupla } from "../controllers/forum.js";

const router = express.Router();


router.get('/getInfoForum/:title',getInfo);
router.get('/getInfoForumbyID/:id_forum',getInfoById);
router.get('/getPostFromForum/:id_forum',getPostsFromForum)
router.post('/insertDupla/:id_post/:id_forum',insertDupla)




export default router