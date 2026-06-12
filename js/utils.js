// ==========================================
// UTILIDADES COMPARTIDAS: utils.js
// ==========================================
// Este archivo contiene funciones de ayuda generales y reutilizables
// para evitar duplicar lógica de formateo y manipulación a lo largo del proyecto.

/**
 * Formatea un valor numérico a un formato de moneda profesional (USD en es-MX).
 * @param {number|string} value - El precio a formatear.
 * @returns {string} El precio en formato de moneda o mensaje de confirmación.
 */
export function formatPrice(value) {
    const amount = Number(value);

    // Si el valor no es un número válido o está vacío
    if (Number.isNaN(amount)) {
        return 'Precio por confirmar';
    }

    // Usamos el formateador oficial del navegador (Intl.NumberFormat)
    // para adaptarlo al estándar monetario regional.
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
