// Función para manejar el envío del formulario
export async function handleFormSubmit(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').value;

    const newProduct = { nombre, precio, imagen };

    try {
        const response = await fetch('http://localhost:3001/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });

        if (response.ok) {
            const savedProduct = await response.json();
            renderProduct(savedProduct);
            document.getElementById('add-product-form').reset();
        } else {
            console.error('Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error de conexión', error);
    }
}

// Función para validar y formatear el precio
export function validatePriceInput() {
    const precioInput = document.getElementById('precio');
    precioInput.addEventListener('input', function () {
        let value = this.value.replace(/[^0-9.,]/g, '');
        const parts = value.split(/[,|.]/);
        if (parts.length > 2) {
            value = parts[0] + '.' + parts[1];
        }
        this.value = value ? `US$${value}` : '';
    });

    precioInput.addEventListener('focus', function () {
        if (!this.value.startsWith('US$')) {
            this.value = 'US$' + this.value;
        }
    });
}
