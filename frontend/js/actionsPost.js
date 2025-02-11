//import { METHODS } from "http";


document.addEventListener('DOMContentLoaded',  function() {    
    const urlParamenters = new URLSearchParams(window.location.search);
    const id_post = urlParamenters.get('q');
    




    if(id_post)
    {    
        getLikes(id_post);
        const likeButton = document.getElementById("likeButton");
        likeButton.addEventListener('click', () =>{
            actionsPosts(id_post);
        });

    }
    


    else
        console.log("No se encontro el id de la publicaion :D");
    
    
} );

async function getLikes(id_post) {

    console.log("ID de publicacion para para buscar 2 ",id_post);
    try{
        const urlFetch =`http://localhost:5000/posts/info/getLikes/${id_post}`;
        const response = await fetch(urlFetch);

        if(!response.ok)
            //throw error("Erro al obtener el numero total de likes");
            return "Erro :D"

        const data = await response.json();

        const pLikes = document.getElementById("likesAmount");

        pLikes.innerText = `${data.total_likes } Likes`;

    }catch(error){
        console.log("No se pudo conectar a la base de datos :D")
    }
}


async function actionsPosts(id_post) {

    const id_user = localStorage.getItem("userId");
    console.log("ID de publicacion para para buscar",id_post," user :d",id_user);

    try{
        //
        ///publicaciones/addLike/:id_post/:id_user
        const urlFetch =`http://localhost:5000/posts/userActions/addLike/${id_post}/${id_user}`;
        const response = await fetch(urlFetch,{method: 'POST',headers: {'Content-Type': 'application/json'} });

        if(!response.ok)
            console.log("Errata por parte del usuari");
        
        getLikes(id_post);
    }catch(error){
        console.log("No se pudo conectar a la base de datos :D")
    }
}


