// ==========================================
// ARCHIVO PRINCIPAL: script.js
// ==========================================
// Este archivo actúa como el "orquestador" o director de orquesta de la aplicación.
// Conecta el formulario (form.js) con la lista de deseos (wishlist.js) para que trabajen juntos.

// Importamos las funciones necesarias de otros archivos JavaScript.
// Usamos "import" porque en package.json definimos "type": "module" (módulos nativos de JavaScript).
import { setupForm } from './form.js';
import { actualizarDeseo, crearDeseo, setupWishlist } from './wishlist.js';
import './modal.js'; // Importa el archivo modal.js para activar los eventos del modal (ventana emergente)
import { ADMIN_PIN } from './config.js';
import { customPrompt, customAlert, showToast } from './ui.js';

// 1. OBTENER ROL DE USUARIO Y VALIDAR AUTENTICACIÓN
const searchParams = new URLSearchParams(window.location.search);
let isOwner = searchParams.get('admin') === 'true';

// Si intenta acceder en modo propietario, validamos con un PIN
if (isOwner) {
    const isAlreadyAuth = sessionStorage.getItem('wishlist_admin_auth') === 'true';
    if (!isAlreadyAuth) {
        // Solicitamos el PIN usando nuestro prompt personalizado
        const pinIngresado = await customPrompt('Introduce el PIN de propietario para acceder:');
        if (pinIngresado === ADMIN_PIN) {
            sessionStorage.setItem('wishlist_admin_auth', 'true');
            showToast('Acceso de propietario concedido.', 'success');
        } else {
            if (pinIngresado !== null) {
                // Si introdujo un PIN incorrecto (no canceló)
                await customAlert('PIN incorrecto. Acceso denegado.');
            }
            // Redirigir a modo invitado quitando los parámetros de la URL
            window.location.href = window.location.pathname;
        }
    }
}

// Aplicamos las clases correspondientes al body según el estado de autenticación
document.body.classList.toggle('is-owner', isOwner);
document.body.classList.toggle('is-guest', !isOwner);

// Configuración del botón de cerrar sesión para propietarios
const logoutLink = document.getElementById('logout-link');
if (isOwner) {
    logoutLink.hidden = false;
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('wishlist_admin_auth');
        window.location.href = window.location.pathname;
    });
}

// 2. CONFIGURACIÓN DEL FORMULARIO
// Llamamos a setupForm pasándole un objeto con opciones (parámetros de configuración).
const formController = setupForm({
    isOwner, // Le decimos al formulario si debe mostrarse (solo si es propietario)
    // Definimos una función callback (onSave) que se ejecutará cuando el formulario se guarde con éxito
    async onSave(id, deseo) {
        if (id) {
            // Si el deseo ya tiene un ID, significa que lo estamos editando y actualizando
            await actualizarDeseo(id, deseo);
        } else {
            // Si no tiene ID, es un deseo completamente nuevo que estamos creando
            await crearDeseo(deseo);
        }

        // Después de guardar, refrescamos la lista en la pantalla para ver los cambios de inmediato
        await wishlistController.refresh();
    },
});

// 3. CONFIGURACIÓN DE LA LISTA DE DESEOS
// Llamamos a setupWishlist para preparar el área donde se muestran las tarjetas de regalos.
const wishlistController = setupWishlist({
    isOwner, // Le decimos si debe mostrar botones de eliminar/editar en cada tarjeta
    // Cuando el usuario haga clic en "Editar" en una tarjeta, se ejecuta esta función callback:
    onEdit: (deseo) => formController.startEdit(deseo), // Pasa el deseo al formulario para editarlo
});

// 4. INICIALIZACIÓN
// Ejecutamos por primera vez la recarga de deseos para que aparezcan en pantalla al cargar la página.
wishlistController.refresh();
