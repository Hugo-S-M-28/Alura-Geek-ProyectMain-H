import { formatPrice } from './utils.js';

// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// Obtenemos los elementos de la ventana modal que vamos a actualizar dinámicamente con los datos de cada deseo.
const modal = document.getElementById('modal');                         // El contenedor principal de la ventana modal
const modalImage = document.getElementById('modal-image');                 // La etiqueta de imagen del modal
const modalTitle = document.getElementById('modal-title');                 // El título (nombre del deseo)
const modalDescription = document.getElementById('modal-description');     // Párrafo de la descripción del deseo
const modalPrice = document.getElementById('modal-price');                 // Párrafo para mostrar el precio formateado
const modalStatus = document.getElementById('modal-status');               // Estado de reserva (quién lo reservó)
const modalLink = document.getElementById('modal-link');                   // Enlace de compra para ver el producto en tienda
const modalClose = document.getElementById('modal-close');                 // El botón 'x' para cerrar el modal

// Guardará el elemento que tenía el foco antes de abrir el modal para restaurarlo al cerrar
let activeElementBeforeModal = null;

// 2. FUNCIÓN PARA ABRIR EL MODAL (MOSTRAR DETALLES)
// Recibe un objeto 'deseo' con toda su información.
export function openModal(deseo) {
    activeElementBeforeModal = document.activeElement;

    // Inyectamos la información del deseo en los elementos HTML correspondientes.
    modalImage.src = deseo.imagen;
    modalImage.alt = deseo.nombre;
    modalTitle.textContent = deseo.nombre;
    modalDescription.textContent = deseo.descripcion || 'Sin descripción';
    modalPrice.textContent = formatPrice(deseo.precio);

    // Operador Ternario: Condición ? Si_Verdadero : Si_Falso
    modalStatus.textContent = deseo.reservado_por
        ? `Reservado por ${deseo.reservado_por}`
        : 'Disponible para reservar';

    modalLink.href = deseo.enlace || '#';
    // Si no hay enlace, le agregamos la clase CSS 'disabled' para que se vea deshabilitado
    modalLink.classList.toggle('disabled', !deseo.enlace);

    // Mostramos el modal agregando la clase CSS 'show' (que en style.css tiene transiciones de visibilidad)
    modal.classList.add('show');
    // Actualizamos atributos de accesibilidad para lectores de pantalla
    modal.setAttribute('aria-hidden', 'false');

    // Situamos el foco automáticamente en el botón de cierre para iniciar la navegación accesible
    modalClose.focus();
}

// 3. FUNCIÓN PARA CERRAR EL MODAL
export function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');

    // Restauramos el foco al elemento original (ej. la tarjeta del deseo)
    if (activeElementBeforeModal) {
        activeElementBeforeModal.focus();
    }
}

// 4. CONTROL DE EVENTOS PARA CERRAR EL MODAL
// A) Cerrar al hacer clic fuera del recuadro blanco (en el fondo oscuro/backdrop).
modal.addEventListener('click', (event) => {
    // Si el elemento clicado es directamente el contenedor gris oscuro (modal) y no el contenido blanco (modal-content)
    if (event.target === modal) {
        closeModal();
    }
});

// B) Cerrar al hacer clic en la "x"
modalClose.addEventListener('click', closeModal);

// C) Cerrar al presionar la tecla 'Escape' del teclado físico.
document.addEventListener('keydown', (event) => {
    // Si el modal está visible en pantalla (tiene la clase 'show') y la tecla presionada es 'Escape'
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

// D) Atrapado de Foco (Focus Trap) para accesibilidad por teclado (WCAG 2.1)
modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && modal.classList.contains('show')) {
        // Obtenemos los elementos enfocables del modal que estén activos en este momento
        const focusables = [modalClose];
        if (!modalLink.classList.contains('disabled')) {
            focusables.push(modalLink);
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey) { // Shift + Tab (retroceso)
            if (document.activeElement === first) {
                last.focus();
                event.preventDefault();
            }
        } else { // Tab (avance)
            if (document.activeElement === last) {
                first.focus();
                event.preventDefault();
            }
        }
    }
});
