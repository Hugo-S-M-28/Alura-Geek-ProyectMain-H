import { customAlert, showToast } from './ui.js';

export function setupForm({ isOwner, onSave }) {
    // 1. SELECCIÓN DE ELEMENTOS DEL DOM (HTML)
    // Buscamos los elementos del HTML por su atributo ID para poder leer o cambiar sus valores desde JS.
    const ownerPanel = document.getElementById('owner-panel'); // Contenedor del formulario del propietario
    const form = document.getElementById('wishlist-form');       // El elemento <form>
    const idInput = document.getElementById('deseo-id');         // Input oculto para guardar el ID si estamos editando
    const nombreInput = document.getElementById('nombre');       // Input para el nombre del deseo
    const descripcionInput = document.getElementById('descripcion'); // Textarea para la descripción
    const enlaceInput = document.getElementById('enlace');       // Input para la URL del producto
    const precioInput = document.getElementById('precio');       // Input para el precio
    const imagenInput = document.getElementById('imagen');       // Input para la URL de la imagen del producto
    const submitButton = document.getElementById('submit-button'); // Botón para guardar/crear
    const cancelEditButton = document.getElementById('cancel-edit-button'); // Botón para cancelar la edición

    // 2. CONTROL DE VISIBILIDAD DEL PANEL DEL PROPIETARIO
    // Ocultamos o mostramos el panel del propietario según el rol (si es admin o no).
    // .hidden es una propiedad HTML estándar; si es true, el elemento no se renderiza.
    ownerPanel.hidden = !isOwner;

    // Si el usuario NO es el propietario, no necesitamos configurar eventos del formulario.
    // Retornamos un objeto con una función vacía para que no cause errores en script.js.
    if (!isOwner) {
        return {
            startEdit: () => {},
        };
    }

    // 3. EVENTO DE ENVÍO DEL FORMULARIO (SUBMIT)
    // Escuchamos el evento 'submit' que ocurre cuando se da clic en el botón de guardar o se presiona Enter.
    form.addEventListener('submit', async (event) => {
        // Evitamos el comportamiento por defecto del navegador (que recargaría la página por completo).
        event.preventDefault();

        // Creamos un objeto con los datos limpios de los campos usando .trim() para quitar espacios en blanco al inicio y final.
        const deseo = {
            nombre: nombreInput.value.trim(),
            descripcion: descripcionInput.value.trim(),
            enlace: enlaceInput.value.trim(),
            precio: parsePrice(precioInput.value), // Limpiamos el texto del precio y lo convertimos a número
            imagen: imagenInput.value.trim(),
        };

        // Validación básica: aseguramos que los campos obligatorios no estén vacíos.
        if (!deseo.nombre || !deseo.descripcion || !deseo.enlace || !deseo.imagen) {
            await customAlert('Completa todos los campos obligatorios del deseo.');
            return; // Detenemos la ejecución si falta algo
        }

        // Validación extra: verificar que el precio sea mayor que cero
        if (deseo.precio <= 0) {
            await customAlert('El precio debe ser un número válido mayor a cero (ej. US$10 o 10.50).');
            return;
        }

        // Deshabilitar botón durante la petición asíncrona para evitar dobles clics
        submitButton.disabled = true;
        const textoOriginal = submitButton.textContent;
        submitButton.textContent = 'Guardando...';

        try {
            // Intentamos guardar el deseo llamando a la función onSave (que definimos en script.js).
            // Si hay un ID en el input oculto, lo pasamos para editar; si no, pasamos null para crear uno nuevo.
            await onSave(idInput.value || null, deseo);
            resetForm(); // Limpiamos el formulario tras guardar correctamente
            showToast('¡Deseo guardado con éxito!', 'success');
        } catch (error) {
            console.error(error);
            await customAlert('No se pudo guardar el deseo. Revisa que el servidor de la API esté activo.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = textoOriginal;
        }
    });

    // 4. EVENTO DE LIMPIEZA (RESET)
    // Cuando el usuario presiona el botón "Limpiar", restablecemos el estado de edición.
    form.addEventListener('reset', () => {
        // Usamos setTimeout con 0ms para esperar que el navegador limpie los inputs antes de resetear el estado visual de edición.
        setTimeout(resetEditState, 0);
    });

    // Si el usuario hace clic en "Cancelar edición", restablecemos y limpiamos el formulario.
    cancelEditButton.addEventListener('click', resetForm);

    // Activamos la máscara para el input de precio (escribe automáticamente "US$")
    setupPriceMask(precioInput);

    // Retornamos funciones públicas para que otros archivos (como script.js) puedan interactuar con este formulario.
    return {
        // startEdit rellena el formulario con los datos de una tarjeta de deseo cuando el propietario quiere editarla.
        startEdit(deseo) {
            idInput.value = deseo.id; // Almacenamos el ID en el input oculto
            nombreInput.value = deseo.nombre;
            descripcionInput.value = deseo.descripcion || '';
            enlaceInput.value = deseo.enlace || '';
            precioInput.value = formatEditablePrice(deseo.precio); // Formato simple: US$50
            imagenInput.value = deseo.imagen || '';
            submitButton.textContent = 'Guardar cambios'; // Cambiamos el texto del botón
            cancelEditButton.hidden = false; // Mostramos el botón para cancelar la edición

            // Hace un scroll suave de la pantalla para llevar al usuario directamente al formulario.
            ownerPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
    };

    // FUNCIÓN AUXILIAR: Limpia el formulario y restablece los botones
    function resetForm() {
        form.reset();      // Limpia los valores de todos los inputs nativos del formulario
        resetEditState();  // Restablece el texto de los botones e inputs de control
    }

    // FUNCIÓN AUXILIAR: Restablece el estado de los controles de edición a su forma original (creación)
    function resetEditState() {
        idInput.value = '';
        submitButton.textContent = 'Guardar deseo';
        cancelEditButton.hidden = true;
    }
}

// 5. MÁSCARA Y FORMATEO DE PRECIO
// Estas funciones formatean el precio en tiempo real mientras el usuario escribe.

function setupPriceMask(input) {
    // Escucha cada tecla o cambio en el input
    input.addEventListener('input', () => {
        // Expresión Regular (RegEx):
        // /[^0-9.,]/g elimina cualquier caracter que NO sea número, punto o coma.
        // Luego reemplaza las comas por puntos para mantener formato decimal americano (ej. 50.5).
        const value = input.value.replace(/[^0-9.,]/g, '').replace(',', '.');
        // Antepone el texto "US$" si hay un valor ingresado.
        input.value = value ? `US$${value}` : '';
    });

    // Si el usuario hace clic en el campo (focus), nos aseguramos de que empiece con "US$" si ya tiene valor
    input.addEventListener('focus', () => {
        if (input.value && !input.value.startsWith('US$')) {
            input.value = `US$${input.value}`;
        }
    });
}

// Convierte un texto como "US$120.50" a un número real de JS: 120.5
function parsePrice(value) {
    const normalized = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const amount = Number(normalized);
    // Si la conversión falla (no es un número válido), devolvemos 0.
    return Number.isNaN(amount) ? 0 : amount;
}

// Formatea un número simple a texto para volver a editarlo en el input (ej. 500 -> "US$500")
function formatEditablePrice(value) {
    const amount = Number(value);
    return Number.isNaN(amount) ? '' : `US$${amount}`;
}
