# Mi lista de deseos

Aplicación web local para crear una wishlist de cumpleaños, navidad u otros eventos. El propietario agrega deseos con imagen, precio aproximado y link del producto en tiendas como Amazon o Mercado Libre. Los amigos pueden ver la lista y reservar un regalo para evitar compras duplicadas.

## Funcionalidades

- Ver deseos con imagen, nombre, descripción, precio y estado.
- Abrir el link de compra de cada producto.
- Reservar un deseo escribiendo el nombre de quien lo comprará.
- Modo propietario con `?admin=true` para añadir, editar y eliminar deseos.
- Persistencia local usando `json-server` sobre `db.json`.

## Ejecutar en local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Inicia la API local:

   ```bash
   npm run api
   ```

   También puedes usar:

   ```bash
   npx json-server --watch db.json --port 3001
   ```

3. Abre `index.html` con Live Server o con un servidor estático local.

## Modos de uso

- Amigos/invitados: abre la app sin parámetros, por ejemplo `index.html`.
- Propietario: abre la app con `?admin=true`, por ejemplo `index.html?admin=true`.

El modo propietario es solo una simulación para demo local. No incluye autenticación real.

## API local

La app consume:

```txt
http://localhost:3001/deseos
```

Modelo de cada deseo:

```json
{
  "id": "001",
  "nombre": "Auriculares inalámbricos",
  "descripcion": "Color negro, cancelación de ruido",
  "precio": 59.99,
  "imagen": "https://ejemplo.com/auriculares.jpg",
  "enlace": "https://www.amazon.com/...",
  "reservado_por": null,
  "es_propietario": true
}
```

## Tecnologías

- HTML5
- CSS3
- JavaScript nativo con módulos ES
- JSON Server
