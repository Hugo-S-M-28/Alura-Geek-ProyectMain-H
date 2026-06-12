const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalStatus = document.getElementById('modal-status');
const modalLink = document.getElementById('modal-link');
const modalClose = document.getElementById('modal-close');

export function openModal(deseo) {
    modalImage.src = deseo.imagen;
    modalImage.alt = deseo.nombre;
    modalTitle.textContent = deseo.nombre;
    modalDescription.textContent = deseo.descripcion || 'Sin descripción';
    modalPrice.textContent = formatPrice(deseo.precio);
    modalStatus.textContent = deseo.reservado_por
        ? `Reservado por ${deseo.reservado_por}`
        : 'Disponible para reservar';
    modalLink.href = deseo.enlace || '#';
    modalLink.classList.toggle('disabled', !deseo.enlace);

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
}

export function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

function formatPrice(value) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return 'Precio por confirmar';
    }

    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
