import { openModal } from './modal.js';

// Función para cargar productos desde el servidor
export async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3001/productos');
        if (response.ok) {
            const productos = await response.json();
            productos.forEach(renderProduct);
        } else {
            console.error('Error al cargar los productos');
        }
    } catch (error) {
        console.error('Error de conexión', error);
    }
}

// Función para renderizar un producto en la página
export function renderProduct(product) {
    const template = document.querySelector('.producto-nuevo');
    const newProduct = template.cloneNode(true);

    newProduct.classList.remove('producto-nuevo');
    newProduct.removeAttribute('hidden');
    newProduct.classList.add('producto');

    newProduct.querySelector('img').src = product.imagen;
    newProduct.querySelector('img').alt = product.nombre;
    newProduct.querySelector('h3').textContent = product.nombre;
    newProduct.querySelector('p').textContent = product.precio;

    newProduct.querySelector('img').addEventListener('click', function () {
        openModal(product.imagen, product.nombre, product.precio);
    });

    newProduct.querySelector('.eliminar').addEventListener('click', async function () {
        try {
            const response = await fetch(`http://localhost:3001/productos/${product.id}`, { method: 'DELETE' });
            if (response.ok) {
                newProduct.remove();
            } else {
                console.error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error de conexión', error);
        }
    });

    document.querySelector('.grid-productos').appendChild(newProduct);
}
