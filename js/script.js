import { setupForm } from './form.js';
import { actualizarDeseo, crearDeseo, setupWishlist } from './wishlist.js';
import './modal.js';

const searchParams = new URLSearchParams(window.location.search);
const isOwner = searchParams.get('admin') === 'true';

const formController = setupForm({
    isOwner,
    async onSave(id, deseo) {
        if (id) {
            await actualizarDeseo(id, deseo);
        } else {
            await crearDeseo(deseo);
        }

        await wishlistController.refresh();
    },
});

const wishlistController = setupWishlist({
    isOwner,
    onEdit: (deseo) => formController.startEdit(deseo),
});

wishlistController.refresh();
