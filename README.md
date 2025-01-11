# 🕹️ **AluraGeek**  
**AluraGeek** es una aplicación web desarrollada como parte del **Challenge Alura LATAM**. Este proyecto permite a los usuarios:  
- Listar productos tecnológicos.  
- Añadir nuevos productos con detalles (nombre, precio, imagen).  
- Eliminar productos existentes.  

Además, utiliza un servidor JSON simulado para la gestión de datos.

---

## 🌐 **Descripción del Proyecto**  
**AluraGeek** es un proyecto diseñado para enseñar y practicar conceptos clave como:  
- Manipulación del DOM con JavaScript.  
- Uso de JavaScript modular para una mejor organización.  
- Integración con APIs para cargar y gestionar datos dinámicos.  

### 🎨 **Diseño Web Completo**  
La aplicación incluye una interfaz atractiva y funcional, optimizada para la experiencia del usuario.  

---

## 🚀 **Características Principales**  

### 🎥 **Visualización Dinámica de Productos**  
- Una galería muestra los productos cargados desde una API.  

### ➕ **Agregar Nuevos Productos**  
- Formulario interactivo para añadir productos con los siguientes campos:  
  - Nombre del producto.  
  - Precio del producto.  
  - URL de imagen del producto.  

### ❌ **Eliminar Productos**  
- Cada producto incluye un botón para eliminarlo del listado.  

### 🔍 **Modal Interactivo**  
- Al hacer clic en la imagen de un producto, se abre un modal con una vista ampliada.  

### 📄 **Pie de Página Personalizado**  
- Leyenda del creador y enlaces a redes sociales.  

---

## 🛠️ **Configuración del Servidor de Desarrollo**  
Para iniciar el servidor de desarrollo y trabajar con el JSON simulado, sigue estos pasos:

1. Abre una terminal y navega al directorio raíz del proyecto (donde se encuentra el archivo `package.json`).  
2. Ejecuta el siguiente comando para iniciar el servidor de JSON Server:  

   ```bash
   npx json-server --watch db.json --port 3001
   ```  
3. Accede al servidor desde tu navegador en:  
   [http://localhost:3001/videos](http://localhost:3001/videos)  

**Nota:** El servidor se recargará automáticamente cuando se realicen cambios en los archivos fuente.  

---

## 📦 **Instalación de Dependencias**  

1. Asegúrate de estar en el directorio raíz del proyecto.  
2. Ejecuta el siguiente comando:  

   ```bash
   npm install
   ```  

**¿Qué hace este comando?**  
- Descarga las dependencias especificadas en el archivo `package.json`.  
- Crea la carpeta `node_modules/` para almacenar estas dependencias.  
- Actualiza el archivo `package-lock.json` con las versiones instaladas.  

---

## **Uso de Live Server**  

La extensión **Live Server** de Visual Studio Code se utiliza para lanzar un servidor de desarrollo local con recarga en vivo.  

### Cómo usar Live Server:
1. Abre el proyecto en **Visual Studio Code**.  
2. Haz clic en el botón **"Go Live"** en la barra de estado para iniciar el servidor.  

---

## **Estructura del Proyecto**  
```plaintext
Alura-Geek-ProyectMain/
├── assets/                  # Archivos estáticos generales (íconos, imágenes, fondos)
│   ├── icons/               # Íconos interactivos (eliminar, editar, buscar)
│   ├── products/            # Imágenes relacionadas con productos
│   └── backgrounds/         # Imágenes para fondos
├── CSS/                     # Estilos del proyecto
│   └── style.css            # Archivo principal de estilos
├── images/                  # Imágenes generales (logos, íconos genéricos)
├── JS/                      # Archivos JavaScript (modularizados)
│   ├── script.js            # Lógica principal de la aplicación
│   ├── modal.js             # Funciones para el modal interactivo
│   ├── form.js              # Gestión del formulario (validación, envío)
│   └── products.js          # Gestión de productos (listar, agregar, eliminar)
├── db.json                  # Base de datos simulada (JSON Server)
├── index.html               # Archivo HTML principal
├── package.json             # Archivo de configuración del proyecto
└── README.md                # Documentación del proyecto
```

---

## 🛠️ **Tecnologías Utilizadas**  

- **HTML5:** Estructura semántica del proyecto.  
- **CSS3:** Diseño y estilización de la interfaz.  
- **JavaScript:** Manipulación dinámica del DOM y modularización del código.  
- **MockAPI:** Backend simulado para gestionar los datos.  
- **JSON:** Formato de datos utilizado para la comunicación con la API.  

---

## 📥 **Instalación y Uso**  

### Requisitos Previos:  
- Tener un navegador web moderno instalado.  

### Pasos:  

1. **Clona el Repositorio:**  
   ```bash
   git clone https://github.com/Hugo-S-M-28/Alura-Geek-ProyectMain
   ```  

2. **Navega al Directorio del Proyecto:**  
   ```bash
   cd Alura-Geek-ProyectMain
   ```  

3. **Abre el Archivo `index.html` en tu Navegador:**  
   ```bash
   live-server
   ```  

---

## 📬 **Contacto**  

Si tienes preguntas, comentarios o estás interesado en mi trabajo, no dudes en contactarme:  

- **LinkedIn:** [Hugo Sánchez Milán](https://www.linkedin.com/in/hugo-s-197b81278/)  
- **GitHub:** [Hugo-S-M-28](https://github.com/Hugo-S-M-28)  

---

¡Gracias por visitar el proyecto **AluraGeek**! 🎮  
Espero que disfrutes explorando mi trabajo y aprendiendo de este proyecto.  

