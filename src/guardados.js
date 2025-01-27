document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const navLinks = document.querySelector(".nav-links");
    const searchBar = document.querySelector(".search-bar");

    // Simulación de datos obtenidos del servidor
    const recentPosts = [
        { title: "Tortitas de calabaza", type: "Receta", img: "img/1135w-DmtotYZsiss.webp" },
        { title: "Esta receta la aprendí de un restaurante", type: "Publicación", img: "img/1135w-DmtotYZsiss.webp" },
        { title: "Chamoy casero", type: "Receta", img: "img/1135w-DmtotYZsiss.webp" },
        { title: "Calabazas rellenas", type: "Receta", img: "img/1135w-DmtotYZsiss.webp" },
    ];

    const collections = [
        { name: "Recetas navidad", img: "img/1135w-DmtotYZsiss.webp" },
        { name: "Bebidas preferidas", img: "img/1135w-DmtotYZsiss.webp" },
        { name: "Postres de chocolate", img: "img/1135w-DmtotYZsiss.webp" },
        { name: "Comidas sencillas", img: "img/1135w-DmtotYZsiss.webp" },
    ];

    // Elementos de destino
    const recentContainer = document.getElementById("recent-posts-container");
    const collectionsContainer = document.getElementById("collections-container");

    // Renderización de publicaciones recientes
    recentPosts.forEach(post => {
        const card = document.createElement("div");
        card.classList.add("recent-card", "mb-3");
        card.innerHTML = `
            <img src="${post.img}" alt="${post.title}">
            <div>
                <div class="title">${post.title}</div>
                <small>${post.type}</small>
            </div>
        `;
        recentContainer.appendChild(card);
    });

    // Renderización de colecciones
    collections.forEach(collection => {
        const col = document.createElement("div");
        col.classList.add("col-6");
        col.innerHTML = `
            <div class="collection-card">
                <img src="${collection.img}" alt="${collection.name}">
                <div class="mt-2">${collection.name}</div>
            </div>
        `;
        collectionsContainer.appendChild(col);
    });

    // Funcionalidad de la barra de búsqueda
    searchButton.addEventListener("click", (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del enlace
        navLinks.classList.toggle("hidden");
        searchBar.classList.toggle("active");
    });

    // Cierra la barra de búsqueda si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) && e.target !== searchButton) {
            navLinks.classList.remove("hidden");
            searchBar.classList.remove("active");
        }
    });
});
