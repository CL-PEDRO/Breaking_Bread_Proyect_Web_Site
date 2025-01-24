const API = 'https://api.chucknorris.io/jokes/random';

const buttonMas = document.getElementById('mas');



buttonMas.addEventListener('click', () => {
    fetch(API)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const joke = document.getElementById('joke');
            joke.innerHTML = data.value;
        });
});