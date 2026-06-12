import { openModal } from './modal.js';

const API_URL = 'http://localhost:3001/deseos';

let deseosActuales = [];

export async function fetchDeseos() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('No se pudo cargar la lista de deseos');
    }

    return response.json();
}

export async function crearDeseo(deseo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...deseo,
            reservado_por: null,
            es_propietario: true,
        }),
    });

    if (!response.ok) {
        throw new Error('No se pudo guardar el deseo');
    }

    return response.json();
}

export async function actualizarDeseo(id, deseo) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deseo),
    });

    if (!response.ok) {
        throw new Error('No se pudo actualizar el deseo');
    }

    return response.json();
}

export async function eliminarDeseo(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el deseo');
    }
}

export async function reservarDeseo(id) {
    const deseo = deseosActuales.find((item) => String(item.id) === String(id));

    if (!deseo) {
        alert('No se encontró este deseo. Recarga la página e inténtalo otra vez.');
        return;
    }

    if (deseo.reservado_por) {
        alert(`Este deseo ya está reservado por ${deseo.reservado_por}.`);
        return;
    }

    const nombreAmigo = prompt('¿Cuál es tu nombre?');
    const nombreNormalizado = nombreAmigo ? nombreAmigo.trim() : '';

    if (!nombreNormalizado) {
        return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservado_por: nombreNormalizado }),
    });

    if (!response.ok) {
        throw new Error('No se pudo reservar el deseo');
    }
}

export function setupWishlist({ isOwner, onEdit }) {
    const grid = document.querySelector('.grid-deseos');
    const template = document.getElementById('deseo-template');
    const contador = document.getElementById('contador-deseos');

    async function refresh() {
        try {
            deseosActuales = await fetchDeseos();
            renderDeseos(deseosActuales, { grid, template, contador, isOwner, onEdit, refresh });
        } catch (error) {
            console.error(error);
            grid.innerHTML = '<p class="mensaje-vacio">No se pudo cargar la lista de deseos.</p>';
            contador.textContent = 'Sin conexión con la lista';
        }
    }

    return { refresh };
}

export function renderDeseos(deseos, options) {
    const { grid, template, contador, isOwner, onEdit, refresh } = options;
    const total = deseos.length;
    const reservados = deseos.filter((deseo) => deseo.reservado_por).length;

    grid.innerHTML = '';
    contador.textContent = `${reservados} de ${total} deseos reservados`;

    if (!total) {
        grid.innerHTML = '<p class="mensaje-vacio">Todavía no hay deseos en la lista.</p>';
        return;
    }

    deseos.forEach((deseo) => {
        const card = template.content.firstElementChild.cloneNode(true);
        const estaReservado = Boolean(deseo.reservado_por);
        const image = card.querySelector('.imagen-deseo img');
        const imageButton = card.querySelector('.imagen-deseo');
        const estado = card.querySelector('.estado-deseo');
        const reserva = card.querySelector('.reserva-deseo');
        const enlace = card.querySelector('.ver-producto');
        const reservarButton = card.querySelector('.reservar');
        const editarButton = card.querySelector('.editar');
        const eliminarButton = card.querySelector('.eliminar');

        card.classList.toggle('reservado', estaReservado);
        image.src = deseo.imagen;
        image.alt = deseo.nombre;
        card.querySelector('h3').textContent = deseo.nombre;
        card.querySelector('.descripcion-deseo').textContent = deseo.descripcion || 'Sin descripción';
        card.querySelector('.precio-deseo').textContent = formatPrice(deseo.precio);
        estado.textContent = estaReservado ? 'Reservado' : 'Disponible';
        reserva.textContent = estaReservado ? `Reservado por ${deseo.reservado_por}` : 'Disponible para reservar';
        enlace.href = deseo.enlace || '#';
        enlace.classList.toggle('disabled', !deseo.enlace);

        imageButton.addEventListener('click', () => openModal(deseo));

        reservarButton.hidden = isOwner || estaReservado;
        reservarButton.addEventListener('click', async () => {
            try {
                await reservarDeseo(deseo.id);
                await refresh();
            } catch (error) {
                console.error(error);
                alert('No se pudo reservar este deseo. Inténtalo de nuevo.');
            }
        });

        editarButton.hidden = !isOwner;
        editarButton.addEventListener('click', () => onEdit(deseo));

        eliminarButton.hidden = !isOwner;
        eliminarButton.addEventListener('click', async () => {
            const confirmar = confirm(`¿Eliminar "${deseo.nombre}" de la lista?`);

            if (!confirmar) {
                return;
            }

            try {
                await eliminarDeseo(deseo.id);
                await refresh();
            } catch (error) {
                console.error(error);
                alert('No se pudo eliminar este deseo.');
            }
        });

        grid.appendChild(card);
    });
}

export function formatPrice(value) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return 'Precio por confirmar';
    }

    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
