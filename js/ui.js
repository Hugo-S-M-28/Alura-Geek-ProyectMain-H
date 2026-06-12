// ==========================================
// MÓDULO DE INTERFAZ DE USUARIO (UI): ui.js
// ==========================================
// Este archivo maneja las notificaciones flotantes (Toasts) y reemplaza los
// diálogos nativos del navegador (alert, confirm, prompt) por ventanas modales
// modernas y estilizadas, controladas mediante promesas (Promises) asíncronas.

/**
 * Muestra una notificación flotante temporal no bloqueante en la esquina de la pantalla.
 * @param {string} mensaje - El texto a mostrar.
 * @param {'success'|'error'|'info'} tipo - El tipo de alerta (éxito, error, informativo).
 */
export function showToast(mensaje, tipo = 'success') {
    // 1. Obtener o crear el contenedor principal de los toasts
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Crear la tarjeta de la notificación
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;

    // Agregar la tarjeta al contenedor
    container.appendChild(toast);

    // 3. Animaciones de entrada y salida
    // Forzamos un reflow para que el navegador aplique la transición de entrada
    toast.offsetHeight;
    toast.classList.add('show');

    // Desvanecer y remover la notificación tras 3.5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        // Esperamos a que termine la transición CSS de salida para remover del DOM
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3500);
}

/**
 * Crea y abre un modal de diálogo genérico personalizado.
 * @param {object} opciones - Configuración del diálogo (tipo, mensaje, valorPorDefecto).
 * @returns {Promise<any>} Promesa que resuelve con la respuesta del usuario.
 */
function createDialog(opciones) {
    return new Promise((resolve) => {
        // 1. Crear elementos HTML del diálogo
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const box = document.createElement('div');
        box.className = 'dialog-box';

        const messagePara = document.createElement('p');
        messagePara.className = 'dialog-message';
        messagePara.textContent = opciones.mensaje;
        box.appendChild(messagePara);

        // Input para el prompt si corresponde
        let inputElement = null;
        if (opciones.tipo === 'prompt') {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.className = 'dialog-input';
            inputElement.value = opciones.valorPorDefecto || '';
            box.appendChild(inputElement);
        }

        // Contenedor de botones
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'dialog-actions';

        const btnAccept = document.createElement('button');
        btnAccept.type = 'button';
        btnAccept.className = 'btn-dialog btn-dialog-accept';
        btnAccept.textContent = opciones.tipo === 'confirm' ? 'Sí, continuar' : 'Aceptar';

        actionsDiv.appendChild(btnAccept);

        // Botón cancelar si es confirm o prompt
        let btnCancel = null;
        if (opciones.tipo === 'confirm' || opciones.tipo === 'prompt') {
            btnCancel = document.createElement('button');
            btnCancel.type = 'button';
            btnCancel.className = 'btn-dialog btn-dialog-cancel';
            btnCancel.textContent = 'Cancelar';
            actionsDiv.appendChild(btnCancel);
        }

        box.appendChild(actionsDiv);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // 2. Foco inicial y accesibilidad
        if (inputElement) {
            inputElement.focus();
            inputElement.select();
        } else {
            btnAccept.focus();
        }

        // 3. Manejadores de Cierre y Resolución
        function closeDialog(value) {
            overlay.classList.remove('show');
            box.classList.remove('show');
            // Removemos del DOM al finalizar la animación
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
                resolve(value);
            });
        }

        // Eventos de botones
        btnAccept.addEventListener('click', () => {
            if (opciones.tipo === 'prompt') {
                resolve(inputElement.value.trim());
            } else {
                resolve(true);
            }
            closeDialog(opciones.tipo === 'prompt' ? inputElement.value.trim() : true);
        });

        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                closeDialog(opciones.tipo === 'prompt' ? null : false);
            });
        }

        // Cerrar con tecla Escape o manejar navegación por teclado (Focus Trap)
        const focusableElements = [inputElement, btnAccept, btnCancel].filter(Boolean);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeDialog(opciones.tipo === 'prompt' ? null : false);
            }

            if (e.key === 'Tab') {
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab (hacia atrás)
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else { // Tab (hacia adelante)
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Limpiar el event listener cuando la promesa se resuelve
        overlay.addEventListener('transitionend', () => {
            document.removeEventListener('keydown', handleKeyDown);
        }, { once: true });

        // Activar animaciones CSS
        // Pequeño timeout para forzar el estado de inicio antes de la animación
        setTimeout(() => {
            overlay.classList.add('show');
            box.classList.add('show');
        }, 10);
    });
}

/**
 * Reemplazo personalizado para alert()
 * @param {string} mensaje
 * @returns {Promise<boolean>}
 */
export function customAlert(mensaje) {
    return createDialog({ tipo: 'alert', mensaje });
}

/**
 * Reemplazo personalizado para confirm()
 * @param {string} mensaje
 * @returns {Promise<boolean>}
 */
export function customConfirm(mensaje) {
    return createDialog({ tipo: 'confirm', mensaje });
}

/**
 * Reemplazo personalizado para prompt()
 * @param {string} mensaje
 * @param {string} valorPorDefecto
 * @returns {Promise<string|null>}
 */
export function customPrompt(mensaje, valorPorDefecto = '') {
    return createDialog({ tipo: 'prompt', mensaje, valorPorDefecto });
}
