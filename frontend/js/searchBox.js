
console.log("bUSCAR ??? :D archivo");
function search(){ 

    
    let search = document.getElementById("search-button");
    search.addEventListener("click", () => {
      let search = document.querySelector(".search-bar");
      search.classList.toggle("active");
    });
    let valueSearch = document.querySelector(".search-input");
    valueSearch.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        let value = valueSearch.value;
        window.location.href = `http://localhost:4200/html/resultadosBusqueda.html?q=${value}`;
      }
    });
  }
  
  
  


  document.addEventListener("DOMContentLoaded", () => {

    console.log("Documento cargado :d");
    const searchButton = document.getElementById("search-button");
    const navLinks = document.querySelector(".nav-links");
    const searchBar = document.querySelector(".search-bar");

    console.log(searchButton);
    console.log(navLinks);
    console.log(searchBar);


    searchButton.addEventListener("click", (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del enlace


        // Alterna la visibilidad de los elementos
        navLinks.classList.toggle("hidden");
        searchBar.classList.toggle("active");
        let search = document.querySelector(".search-bar");
        search.classList.toggle("active");

        let valueSearch = document.querySelector(".search-input");
        valueSearch.addEventListener("keyup", (e) => {
          if (e.keyCode === 13) {
            let value = valueSearch.value;
            window.location.href = `http://localhost:4200/html/resultadosBusqueda.html?q=${value}`;
          }
        });
        
    });


    // Opcional: Cierra la barra de búsqueda si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) && e.target !== searchButton) {
            navLinks.classList.remove("hidden");
            searchBar.classList.remove("active");
        }
    });

    console.log("Documento cargado :d final ");
});



