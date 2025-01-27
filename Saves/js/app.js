class Application {
    constructor() {
        console.log('Application initialized');
        this.BASE_URL = 'http://localhost:5000';
    }

    run() {
        console.log('Application running');
        this.getProducts();
    }

    addProduct(product) {

        console.log('this.BASE_URL', this.BASE_URL,'/products');
        fetch(`${this.BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                this.getProducts();
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    }

    getProducts() {
        fetch(`${this.BASE_URL}/products`)
            .then(response => response.json())
             .then(data => {

                console.log(data);
                const producsList = document.getElementById('products');
                producsList.innerHTML = '';

                data.forEach(product => {
                    console.log(product);
                    this.renderProduct(product);
                });
            });
    }

    renderProduct(product) {
        const producsList = document.getElementById('products');
        const productElement = document.createElement('li');
        productElement.className = 'product';
        productElement.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">${product.name}</div>
                ${product.description}
              </div>
              <span class="badge text-bg-primary rounded-pill">${product.id}</span>
            </li>
        `;
        producsList.appendChild(productElement);
    }
}