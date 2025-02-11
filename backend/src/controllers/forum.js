import pool from "../db/connect.js";


const getInfo = async (req,res)=>{

    const title = req.params.title;

    try{
        const [response] = await pool.query(
            `SELECT Foro.id_foro, Foro.titulo_foro, Foro.descripcion_Foro, Foro.tema_foro, Foro.id_Usuario, Foro.image 
             FROM Foro 
             WHERE Foro.titulo_foro LIKE ?;`,
            [`%${title}%`] // Agregamos los % al valor antes de pasarlo como parámetro
          );
          

        res.json(response);

    }catch(error)
    {
        console.log("No se a podido encontrar el foro");
        res.status(500).json({error:error});

    }  
};

const getInfoById = async (req,res) =>{
    const id_forum = req.params.id_forum;

    try{
        const [response] = await pool.query(
            `SELECT Foro.id_foro, Foro.titulo_foro, Foro.descripcion_Foro, Foro.tema_foro, Foro.id_Usuario, Foro.image 
             FROM Foro 
             WHERE Foro.id_foro = ?;`,
            [id_forum]
        );

        res.json(response);
    }catch(error)
    {
        console.log("No se a podido encontrar el foro por id");
        res.status(500).json({error:error});
    }
}

const getPostsFromForum = async (req,res)=>{
    const id_forum = req.params.id_forum;

    try{
        const [response] = await pool.query(
            `SELECT Publicaciones.id_publicacion, Foro.id_foro FROM Foro
            JOIN post_Foro ON post_Foro.id_foro = Foro.id_foro
            JOIN Publicaciones ON post_Foro.id_post = Publicaciones.id_publicacion
            WHERE Foro.id_foro = ?;`,
            [id_forum]
        );

        res.json(response);
    }catch(error)
    {
        console.log("No se a podido encontrar el foro por id");
        res.status(500).json({error:error});
    }

}

const insertDupla = async(req,res)=>
{
    try{
        const id_forum = req.params.id_forum;
        const id_post = req.params.id_post;

        
        const [response] = await pool.query(`INSERT INTO post_Foro(id_post, id_foro)
             VALUES (?,?)`,[id_post,id_forum] );

        res.json(response);
    }catch(error)
    {
        console.log("No se insertar el par");
        res.status(500).json({error:error});
    }
}


export {
    getInfo,
    getInfoById,
    getPostsFromForum,
    insertDupla
}