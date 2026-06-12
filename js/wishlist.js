// ==========================================
// CONTROLADOR DE DESEOS Y API: wishlist.js
// ==========================================
// Este archivo maneja la comunicación con el servidor (API) y la renderización en pantalla.
// Contiene las operaciones CRUD (Crear, Leer, Actualizar, Borrar) y el sistema de reservas.

import { openModal } from './modal.js';
import { API_URL } from './config.js';
import { formatPrice } from './utils.js';
import { customAlert, customConfirm, customPrompt, showToast } from './ui.js';

// Variable global para almacenar localmente la lista de deseos actual.
let deseosActuales = [];

// 1. LEER (READ): Obtiene la lista de deseos desde el servidor
export async function fetchDeseos() {
    // Realiza una petición GET por defecto al servidor
    const response = await fetch(API_URL);

    // Si la respuesta HTTP no es exitosa (código diferente a 200-299)
    if (!response.ok) {
        throw new Error('No se pudo cargar la lista de deseos');
    }

    // Convierte el cuerpo de la respuesta de JSON (texto plano estructurado) a un objeto JS
    return response.json();
}

// 2. CREAR (CREATE): Envía un nuevo deseo al servidor
export async function crearDeseo(deseo) {
    const response = await fetch(API_URL, {
        method: 'POST', // Método POST se usa para crear nuevos recursos en el servidor
        headers: { 'Content-Type': 'application/json' }, // Indicamos que enviamos datos en formato JSON
        body: JSON.stringify({
            ...deseo, // Operador Spread: copia todas las propiedades del objeto 'deseo'
            reservado_por: null, // Por defecto, al crearse no está reservado por nadie
            es_propietario: true,
        }),
    });

    if (!response.ok) {
        throw new Error('No se pudo guardar el deseo');
    }

    return response.json();
}

// 3. ACTUALIZAR (UPDATE): Modifica un deseo existente usando su ID
export async function actualizarDeseo(id, deseo) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH', // PATCH modifica solo los campos enviados, a diferencia de PUT que reemplaza todo
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deseo),
    });

    if (!response.ok) {
        throw new Error('No se pudo actualizar el deseo');
    }

    return response.json();
}

// 4. ELIMINAR (DELETE): Borra un deseo del servidor usando su ID
export async function eliminarDeseo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE' // DELETE le dice al servidor que borre ese recurso
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar el deseo');
    }
}

// 5. RESERVAR UN DESEO: Permite que un invitado reserve un regalo
export async function reservarDeseo(id) {
    // Para evitar condiciones de carrera, obtenemos el estado más reciente del producto desde el servidor
    const checkRes = await fetch(`${API_URL}/${id}`);
    if (!checkRes.ok) {
        await customAlert('No se pudo verificar el estado del deseo. Recarga la página.');
        return;
    }
    const deseo = await checkRes.json();

    if (!deseo) {
        await customAlert('No se encontró este deseo. Recarga la página e inténtalo otra vez.');
        return;
    }

    // Si ya está reservado por alguien en el servidor, mostramos una alerta y detenemos la función
    if (deseo.reservado_por) {
        await customAlert(`Este deseo ya fue reservado por ${deseo.reservado_por} hace unos momentos.`);
        return;
    }

    // Pedimos el nombre del usuario con una ventana emergente interactiva de entrada personalizada
    const nombreAmigo = await customPrompt('¿Cuál es tu nombre para realizar la reserva?');
    const nombreNormalizado = nombreAmigo ? nombreAmigo.trim() : '';

    // Si el usuario canceló el prompt o no escribió nada, salimos sin hacer nada
    if (!nombreNormalizado) {
        return;
    }

    // Hacemos una petición PATCH al servidor para actualizar únicamente el campo 'reservado_por'
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservado_por: nombreNormalizado }),
    });

    if (!response.ok) {
        throw new Error('No se pudo reservar el deseo');
    }
}

// 6. CONFIGURAR LA LISTA (WISH LIST SETUP)
// Inicializa las referencias principales y el método para refrescar el DOM.
export function setupWishlist({ isOwner, onEdit }) {
    const grid = document.querySelector('.grid-deseos');          // Contenedor donde se insertan las tarjetas
    const template = document.getElementById('deseo-template');    // Elemento HTML <template> para estructurar cada tarjeta
    const contador = document.getElementById('contador-deseos');    // Elemento de texto del contador de reservas

    // Función asíncrona que vuelve a descargar los datos del servidor y los pinta en el DOM
    async function refresh() {
        try {
            // Renderizamos Skeleton Cards de carga para dar un feedback visual premium
            grid.innerHTML = Array.from({ length: 4 }).map(() => `
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text large"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-button"></div>
                </div>
            `).join('');

            deseosActuales = await fetchDeseos(); // Descarga de datos
            // Pinta las tarjetas en el DOM con las opciones y callbacks configurados
            renderDeseos(deseosActuales, { grid, template, contador, isOwner, onEdit, refresh });
        } catch (error) {
            console.error(error);
            grid.innerHTML = '<p class="mensaje-vacio">No se pudo cargar la lista de deseos. Verifica que el servidor de la API esté corriendo.</p>';
            contador.textContent = 'Sin conexión con la lista';
        }
    }

    return { refresh };
}

// 7. RENDERIZADO DE LAS TARJETAS (DOM MANIPULATION)
// Crea dinámicamente cada tarjeta de deseo en el HTML a partir de un template.
export function renderDeseos(deseos, options) {
    const { grid, template, contador, isOwner, onEdit, refresh } = options;
    const total = deseos.length;
    // Contamos cuántos deseos tienen el campo 'reservado_por' con algún valor escrito
    const reservados = deseos.filter((deseo) => deseo.reservado_por).length;

    // Limpiamos el contenedor para evitar duplicados al repintar
    grid.innerHTML = '';
    // Actualizamos el contador de deseos reservados
    contador.textContent = `${reservados} de ${total} deseos reservados`;

    // Si no hay deseos, mostramos un mensaje amigable y salimos
    if (!total) {
        grid.innerHTML = '<p class="mensaje-vacio">Todavía no hay deseos en la lista.</p>';
        return;
    }

    // Iteramos por cada deseo para crear su tarjeta en el DOM
    deseos.forEach((deseo) => {
        // Clonamos la estructura interna del template (<template id="deseo-template"> en index.html)
        // cloneNode(true) realiza una copia profunda incluyendo todas sus etiquetas hijas
        const card = template.content.firstElementChild.cloneNode(true);
        const estaReservado = Boolean(deseo.reservado_por);

        // Seleccionamos los elementos internos de la tarjeta clonada
        const image = card.querySelector('.imagen-deseo img');
        const imageButton = card.querySelector('.imagen-deseo');
        const estado = card.querySelector('.estado-deseo');
        const reserva = card.querySelector('.reserva-deseo');
        const enlace = card.querySelector('.ver-producto');
        const reservarButton = card.querySelector('.reservar');
        const editarButton = card.querySelector('.editar');
        const eliminarButton = card.querySelector('.eliminar');

        // Si está reservado, le agregamos la clase CSS 'reservado' para cambiar su estilo visual (opacidad, colores)
        card.classList.toggle('reservado', estaReservado);

        // Asignamos los datos a las etiquetas correspondientes
        image.src = deseo.imagen;
        image.alt = deseo.nombre;
        card.querySelector('h3').textContent = deseo.nombre;
        card.querySelector('.descripcion-deseo').textContent = deseo.descripcion || 'Sin descripción';
        card.querySelector('.precio-deseo').textContent = formatPrice(deseo.precio);

        estado.textContent = estaReservado ? 'Reservado' : 'Disponible';
        reserva.textContent = estaReservado ? `Reservado por ${deseo.reservado_por}` : 'Disponible para reservar';

        enlace.href = deseo.enlace || '#';
        // Deshabilitamos el enlace en el CSS agregando la clase 'disabled' si no tiene URL válida
        enlace.classList.toggle('disabled', !deseo.enlace);

        // Agregamos evento para abrir el modal de detalles al hacer clic en la imagen
        imageButton.addEventListener('click', () => openModal(deseo));

        // El botón "Reservar" solo se muestra a los Invitados (no al propietario) y si el artículo NO está reservado
        reservarButton.hidden = isOwner || estaReservado;
        reservarButton.addEventListener('click', async () => {
            reservarButton.disabled = true;
            const originalText = reservarButton.textContent;
            reservarButton.textContent = 'Reservando...';
            try {
                await reservarDeseo(deseo.id); // Llama al servidor para reservar
                await refresh(); // Recarga la pantalla
                showToast('¡Reserva registrada con éxito!', 'success');
            } catch (error) {
                console.error(error);
                await customAlert('No se pudo completar la reserva. Inténtalo de nuevo.');
            } finally {
                reservarButton.disabled = false;
                reservarButton.textContent = originalText;
            }
        });

        // El botón "Editar" solo es visible para el propietario
        editarButton.hidden = !isOwner;
        editarButton.addEventListener('click', () => onEdit(deseo)); // Llama al formulario para edición

        // El botón "Eliminar" solo es visible para el propietario
        eliminarButton.hidden = !isOwner;
        eliminarButton.addEventListener('click', async () => {
            // Confirmación personalizada antes de realizar una acción destructiva
            const confirmar = await customConfirm(`¿Eliminar "${deseo.nombre}" de la lista?`);

            if (!confirmar) {
                return;
            }

            eliminarButton.disabled = true;
            try {
                await eliminarDeseo(deseo.id); // Borra del servidor
                await refresh(); // Recarga la pantalla
                showToast('Deseo eliminado correctamente.', 'info');
            } catch (error) {
                console.error(error);
                await customAlert('No se pudo eliminar este deseo.');
            } finally {
                eliminarButton.disabled = false;
            }
        });

        // Insertamos la tarjeta configurada en la grilla del HTML
        grid.appendChild(card);
    });
}
