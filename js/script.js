import { openModal, closeModal } from './modal.js';
import { handleFormSubmit, validatePriceInput } from './form.js';
import { loadProducts } from './products.js';

// Inicializar eventos y funciones
document.getElementById('add-product-form').addEventListener('submit', handleFormSubmit);
validatePriceInput();
loadProducts();
