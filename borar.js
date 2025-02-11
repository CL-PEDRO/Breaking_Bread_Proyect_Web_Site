    app.post('/publicaciones/addLike/:id_post/:id_user', async(req,res) =>{
      try
      {
        const id_post = req.params.id_post;
        const id_user = req.params.id_user;   
             
        const response1 = await pool.query('INSERT INTO Likes_Publicaciones(id_like, id_usuario, id_publicacion) VALUES (null,?,?);',[id_user,id_post]);

        console.log(response1.affectedRows)
        console.log(response1.insertId)
        
        if(response1.insertId  != null)
        {
          res.status(200).json({mensaje:"Like agregado", isLiked: true });
        }else
        {
          const response2 = await pool.query('DELETE FROM Likes_Publicaciones WHERE Likes_Publicaciones.id_usuario = ? and Likes_Publicaciones.id_publicacion = ?;',[id_user,id_post]);
          res.status(200).json({mensaje:"Like eliminado ", isLiked: false });

        }
      }catch(error)
      {
        console.error('Error agregando like:', error);
        res.status(500).json({ message: 'Internal server error likes :C', code: 'APP-03' });
      }
    });