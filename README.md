# Papelime — Sitio Web

Sitio corporativo de **Papelime LLC.** — bebida tropical de caña de azúcar y limón, Northern Virginia, USA.

**Stack**: HTML + CSS + JavaScript vanilla. Sin React, sin frameworks, sin build step.

---

## Probar localmente

**Doble clic en `index.html`** → se abre en tu navegador. Listo.

No requiere servidor. Las únicas dependencias externas son Google Fonts (se cargan automáticamente si tienes internet).

---

## Subir a cPanel (despliegue)

1. Comprime esta carpeta entera en un `.zip`.
2. cPanel → **File Manager** → entra a `public_html/`.
3. Sube el ZIP y haz click en **Extract**.
4. (Opcional) Si quieres que el sitio quede en el root del dominio, mueve los contenidos directamente a `public_html/` y borra el ZIP.
5. Visita tu dominio. Listo.

**Estructura esperada en cPanel:**
```
public_html/
├── index.html
├── story.html
├── product.html
├── sustainability.html
├── find.html
├── contact.html
├── styles.css
├── script.js
└── assets/
    ├── papelime-logo.png
    ├── bottle-small.jpg
    ├── bottle-and-jug.jpg
    ├── glass-of-papelime.jpg
    ├── label-art-a.png
    ├── label-art-b.png
    └── label-art-c.png
```

---

## Páginas

| Archivo | Sección |
|---|---|
| `index.html` | Inicio |
| `story.html` | Nuestra Historia |
| `product.html` | El Producto |
| `sustainability.html` | Sustentabilidad |
| `find.html` | Dónde Encontrarnos |
| `contact.html` | Contacto |

---

## Editar el sitio

| Archivo | Contiene |
|---|---|
| `*.html` | Contenido de cada página (texto, estructura) |
| `styles.css` | Todos los estilos + variables de marca (colores, tipografías) |
| `script.js` | JS mínimo: menú móvil, formulario, año del footer |
| `assets/` | Imágenes (logo, fotos, ilustraciones) |

### Cambiar colores o tipografías
Edita las variables CSS al inicio de `styles.css` (sección `:root`).

### Cambiar el logo
Reemplaza `assets/papelime-logo.png` con tu nuevo archivo (mismo nombre).

### Cambiar el header o footer
El header y footer están **duplicados en cada página HTML** (es la forma más simple y compatible con cPanel). Si cambias uno, cambia los 6 archivos. Tip: usa "Buscar y reemplazar en archivos" en VS Code.

---

## Compatibilidad

- ✅ Funciona al abrir con doble clic (`file://`)
- ✅ Funciona en cPanel compartido sin Node.js
- ✅ Funciona en GitHub Pages, Netlify, Vercel
- ✅ Compatible con todos los navegadores modernos (Chrome, Safari, Firefox, Edge)
- ✅ Responsive (móvil, tablet, desktop)

---

Desarrollado por [@herasi.dev](https://www.herasi.dev) para Papelime LLC.
