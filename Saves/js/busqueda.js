document.getElementById("search-button").addEventListener("click", async () => {
    const searchQuery = document.getElementById("search-input").value;
  
    // Simular llamada a API o realizar fetch
    const response = await fetch(`/api/recipes?search=${searchQuery}`);
    const recipes = await response.json();
  
    const resultsList = document.getElementById("results-list");
    resultsList.innerHTML = ""; // Limpiar resultados anteriores
  
    if (recipes.length === 0) {
      resultsList.innerHTML = "<li>No recipes found</li>";
      return;
    }
  
    // Crear elementos de lista
    recipes.forEach((recipe) => {
      const listItem = document.createElement("li");
      listItem.textContent = recipe.nombre_Receta; // Nombre de la receta
      resultsList.appendChild(listItem);
    });
  });
  