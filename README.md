# 🎁 **Mi Lista de Deseos (Wishlist)**

¡Bienvenido a **Mi Lista de Deseos**! 🌟 Esta es una aplicación web interactiva y moderna diseñada para gestionar y compartir tus regalos de cumpleaños, navidad u otros eventos especiales.

El propietario de la lista puede agregar, editar y eliminar deseos, mientras que los amigos pueden explorar las tarjetas, ver detalles extendidos y reservar regalos para evitar compras duplicadas. ¡Todo con una interfaz de diseño premium y una experiencia súper fluida! 🚀

---

## 🎨 **Captura de Pantalla**

<p align="center">
  <img src="https://github.com/Hugo-S-M-28/Alura-Geek-ProyectMain-H/blob/main/assets/Presentación/Captura%20de%20pantalla%20de%20AluraGeek%20aplicaci%C3%B3n.png" alt="Mi Lista de Deseos">
</p>

---

## ✨ **Características Principales**

### 👥 **Roles de Usuario Inteligentes**

* 👤 **Modo Invitado (Guest):**
  * Explora la galería de deseos en tiempo real. 💳
  * Visualiza detalles ampliados en una ventana emergente (modal). 🔎
  * Reserva regalos escribiendo su nombre (el artículo se deshabilita para evitar reservas duplicadas). 🤝
* 🔑 **Modo Propietario (Admin):**
  * Protegido por una capa de validación de **PIN de Seguridad** (`1234`) 🛡️.
  * Habilita un panel lateral interactivo para **Crear** y **Editar** deseos. ✏️
  * Permite **Eliminar** artículos con confirmaciones de seguridad personalizadas. 🗑️
  * Incluye un enlace para **Cerrar Sesión** de administración de forma segura. 🚪

### 💅 **Experiencia de Usuario Premium (UX)**

* 🔔 **Sistema de Diálogos Custom (ES6 Promises):** Olvídate de los antiestéticos y bloqueantes `alert()`, `confirm()` y `prompt()` del navegador. Hemos desarrollado modales y notificaciones flotantes (Toasts) estilizados con CSS y animados que corren de forma asíncrona. 💬
* ⚡ **Pantallas de Carga Shimmer (Skeletons):** Mientras la aplicación descarga la información del servidor, se muestra una grilla de tarjetas con animación de esqueleto parpadeante. ⏳
* 🎭 **Transiciones Fluidas:** Las ventanas modales e interfaces de confirmación cuentan con efectos de fundido suaves (`opacity` + `visibility` en CSS). 👁️
* ♿ **Accesibilidad Teclado (Focus Trap):** Al abrir una ventana modal o de diálogo, el foco del teclado queda atrapado automáticamente dentro del modal (WCAG 2.1), facilitando la navegación para lectores de pantalla. ⌨️

---

## 🛠️ **Tecnologías Utilizadas**

* **HTML5:** Marcado estructurado y semántico con soporte nativo de `<template>`. 🏷️
* **CSS3 (Vanilla):** Diseño adaptativo (*responsive*), variables CSS `:root`, animaciones personalizadas y diseño de grillas CSS Grid y Flexbox. 🎨
* **JavaScript (ES6 Modules):** Programación modular nativa (`import`/`export`), peticiones asíncronas (`fetch`, `async/await`), Promesas personalizadas y manipulación avanzada del DOM. 🧠
* **JSON-Server:** Simulación de API REST local y base de datos reactiva mediante un archivo JSON. 💾

---

## 📂 **Estructura del Proyecto**

```plaintext
Alura-Geek-ProyectMain/
├── assets/                  # 📂 Recursos estáticos
│   ├── icons/               # 📌 Íconos de la interfaz (delete, github, linkedin, etc.)
│   ├── products/            # 🖼️ Imágenes de los productos en formato kebab-case
│   └── backgrounds/         # 🌌 Fondos y texturas visuales
├── css/                     # 📂 Hojas de estilo
│   └── style.css            # 🎨 Archivo CSS principal con variables y animaciones
├── js/                      # 📂 Lógica modular de la aplicación
│   ├── config.js            # ⚙️ Constantes del proyecto (API_URL, PIN de administrador)
│   ├── utils.js             # 🧮 Utilidades generales (formateador de precios DRY)
│   ├── ui.js                # 💬 Modales y notificaciones Toasts basados en Promises
│   ├── script.js            # 🎼 Orquestador y validador de acceso de administrador
│   ├── modal.js             # 🔎 Control del modal detallado y Focus Trap de accesibilidad
│   ├── form.js              # 📝 Validación y comportamiento del formulario
│   └── wishlist.js          # 🛍️ Lógica de peticiones CRUD (API) y renderizado
├── db.json                  # 💾 Base de datos simulada (API Server)
├── index.html               # 🌐 Estructura HTML principal optimizada (SEO y accesibilidad)
├── package.json             # ⚙️ Dependencias y comandos de prueba
└── README.md                # 📄 Documentación del proyecto (¡esta que estás leyendo!)
```

---

## 🚀 **Instalación y Configuración**

Sigue estos sencillos pasos para echar a andar el proyecto en tu entorno local:

### 1️⃣ Descargar el Proyecto

Clona este repositorio en tu computadora usando git:

```bash
git clone https://github.com/Hugo-S-M-28/Alura-Geek-ProyectMain-H.git
cd Alura-Geek-ProyectMain-H
```

### 2️⃣ Instalar las Dependencias

Asegúrate de instalar la versión exacta compatible de `json-server` configurada en el archivo del proyecto:

```bash
npm install
```

### 3️⃣ Iniciar el Servidor de Datos (API)

Levanta la API simulada ejecutando el script preconfigurado:

```bash
npm run api
```

El servidor backend se iniciará en [http://localhost:3001/deseos](http://localhost:3001/deseos). 📡

### 4️⃣ Lanzar la Aplicación

Para poder probar los módulos nativos de JS, abre el archivo `index.html` sirviéndolo desde un servidor web de desarrollo local.
> 💡 **Tip:** Te recomendamos instalar la extensión **Live Server** en Visual Studio Code y hacer clic en **"Go Live"** en la esquina inferior derecha.

---

## 🧪 **Pruebas de Calidad**

La aplicación incluye un script para comprobar que no existan errores sintácticos de JavaScript en ninguno de los módulos del proyecto:

```bash
npm run test
```

---

## 📬 **Contacto y Créditos**

Este proyecto fue desarrollado y refactorizado por **Hugo Sánchez Milán** como parte de la formación en **Alura LATAM** 🎓.

* **LinkedIn:** [Hugo Sánchez Milán](https://www.linkedin.com/in/hugo-s-197b81278/) 💼
* **GitHub:** [Hugo-S-M-28](https://github.com/Hugo-S-M-28) 🐙

¡Espero que disfrutes explorando y aprendiendo de este proyecto! 🎮
