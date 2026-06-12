export function setupForm({ isOwner, onSave }) {
    const ownerPanel = document.getElementById('owner-panel');
    const form = document.getElementById('wishlist-form');
    const idInput = document.getElementById('deseo-id');
    const nombreInput = document.getElementById('nombre');
    const descripcionInput = document.getElementById('descripcion');
    const enlaceInput = document.getElementById('enlace');
    const precioInput = document.getElementById('precio');
    const imagenInput = document.getElementById('imagen');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');

    ownerPanel.hidden = !isOwner;

    if (!isOwner) {
        return {
            startEdit: () => {},
        };
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const deseo = {
            nombre: nombreInput.value.trim(),
            descripcion: descripcionInput.value.trim(),
            enlace: enlaceInput.value.trim(),
            precio: parsePrice(precioInput.value),
            imagen: imagenInput.value.trim(),
        };

        if (!deseo.nombre || !deseo.descripcion || !deseo.enlace || !deseo.imagen) {
            alert('Completa todos los campos del deseo.');
            return;
        }

        try {
            await onSave(idInput.value || null, deseo);
            resetForm();
        } catch (error) {
            console.error(error);
            alert('No se pudo guardar el deseo. Revisa que el servidor esté activo.');
        }
    });

    form.addEventListener('reset', () => {
        setTimeout(resetEditState, 0);
    });

    cancelEditButton.addEventListener('click', resetForm);
    setupPriceMask(precioInput);

    return {
        startEdit(deseo) {
            idInput.value = deseo.id;
            nombreInput.value = deseo.nombre;
            descripcionInput.value = deseo.descripcion || '';
            enlaceInput.value = deseo.enlace || '';
            precioInput.value = formatEditablePrice(deseo.precio);
            imagenInput.value = deseo.imagen || '';
            submitButton.textContent = 'Guardar cambios';
            cancelEditButton.hidden = false;
            ownerPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
    };

    function resetForm() {
        form.reset();
        resetEditState();
    }

    function resetEditState() {
        idInput.value = '';
        submitButton.textContent = 'Guardar deseo';
        cancelEditButton.hidden = true;
    }
}

function setupPriceMask(input) {
    input.addEventListener('input', () => {
        const value = input.value.replace(/[^0-9.,]/g, '').replace(',', '.');
        input.value = value ? `US$${value}` : '';
    });

    input.addEventListener('focus', () => {
        if (input.value && !input.value.startsWith('US$')) {
            input.value = `US$${input.value}`;
        }
    });
}

function parsePrice(value) {
    const normalized = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const amount = Number(normalized);
    return Number.isNaN(amount) ? 0 : amount;
}

function formatEditablePrice(value) {
    const amount = Number(value);
    return Number.isNaN(amount) ? '' : `US$${amount}`;
}
