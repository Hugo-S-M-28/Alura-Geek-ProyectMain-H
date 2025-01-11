// Función para abrir el modal
export function openModal(imageSrc, title, price) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');

    modalImage.src = imageSrc;
    modalTitle.textContent = title;

    modal.classList.add('show');
}

// Función para cerrar el modal
export function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
}

// Evento para cerrar el modal al hacer clic fuera del contenido
document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === document.getElementById('modal')) {
        closeModal();
    }
});
