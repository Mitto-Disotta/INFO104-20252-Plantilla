# Google Sheets API 🚀

Este repo es una plantilla lista para usar que permite levantar una API backend con **Google Spreadsheets** como base de datos persistente.  

Tras configurar todo se podrá ejecutar cualquiera de los proyectos:

- **ejemplo-simple**: muestra **cómo conectarse** a Google Spreadsheet y la funcionalidad de **obtener** la información en un rango definido de una hoja.
- **ejemplo-completo**: agrega diversas funcionalidad como: **eliminación** de filas, **actualización** de información y **obtención** de todos los datos en una hoja (con un método distinto al del ejemplo-simple).

---

## 📦 1. Dependencias

El proyecto usa las siguientes librerías de Next.js para conectarse y autenticar con Google:

- **google-spreadsheet**  
- **googleapis**  
- **google-auth-library**

---

## ⚙️ 2. Configuración del Proyecto

Antes de correr la API, hay que hacer un poco de setup en Google Cloud y en el entorno local.

### 🧩 2.1 Credenciales en Google Cloud (GCP)

1. **Habilitar la API**  
   - Entra a [Google Cloud Console](https://console.cloud.google.com/).  
   - Crea un nuevo proyecto en el **selector de proyectos en la parte superior**.  
   - Selecciona tu proyecto y ve a **“APIs y servicios” → “Biblioteca”**.  
   - Busca y habilita **Google Sheets API**.

2. **Crear una Cuenta de Servicio**  
   - Ve a **“APIs y servicios” → “Credenciales”**.  
   - Haz clic en **“Crear credenciales” → “Cuenta de servicio”**.  
   - Asigna un nombre (por ejemplo: `sheets-api-connector`).  
   - Omite los roles, no son necesarios por ahora.

3. **Generar la Clave JSON**  
   - Una vez creada la cuenta, selecciónala.  
   - En la pestaña **“Claves”**, haz clic en **“Agregar clave” → “Crear nueva clave”**.  
   - Elige el tipo **JSON** y guarda el archivo.  
   - Este archivo contiene tus credenciales privadas. **Guárdalo con cuidado**.

---

### 🔐 2.2 Dar Acceso a la Google Sheet

La cuenta de servicio necesita permisos de editor sobre la hoja.

1. Abre el archivo JSON que descargaste.  
2. Copia el valor del campo `"client_email"` (algo como `...@...iam.gserviceaccount.com`).  
3. Abre la Google Sheet que usarás como base de datos.  
4. Pulsa en **“Compartir”** y pega el correo de la cuenta de servicio.  
5. Asigna el rol de **Editor** y guarda.

---

## 🧰 3. Instalación y Ejecución Local

Si quieres probar la conexión con estos proyectos plantilla, sigue los siguientes pasos. Sino puedes ir directamente a configurar tu propio proyecto.

### 📥 3.1 Instalar el Proyecto

Clona el repositorio y entra al directorio:

```bash
git clone https://github.com/Mitto-Disotta/INFO104-20252-Plantilla
cd INFO104-20252-Plantilla
```

Instala las dependencias de Next:

```bash
npm install
```

### 🌍 3.2 Configurar Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Luego abre .env y agrega tus credenciales.

Variables necesarias:

| Variable | Fuente | Descripción |
|-----------|---------|-------------|
| `GOOGLE_SHEET_ID` | URL de tu Google Sheet (el ID que aparece entre `/d/` y `/edit`) | Identificador único de la hoja que se usará como base de datos |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Archivo JSON descargado (campo `client_email`) | Correo electrónico de la cuenta de servicio |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Archivo JSON descargado (campo `private_key`) | Clave privada de la cuenta de servicio (debe incluir saltos de línea `\n` y estar entre comillas dobles `"`) |

Ejemplo de .env:

```env
GOOGLE_SHEETS_CLIENT_EMAIL="cuenta-ejemplo@ejemplo-476721.iam.gserviceaccount.com"
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSauIqRe6f5t1w\nXM+DS6BZeOYAPMq9jULzIqNPeXL4MC+5qi18yViLMPo1E7s6vejHqyD3l3X/UzIf\nkpFuF6H+cBoa3QppJTqUzpDMzWWCu2fyFTfeSfgsj1tcrDfpkCT/B0dUqziceotp\nkrHlqbIAxYQ9ugh42jIQXoX75uqryYWLpr8zUPs36689ni8URdEs9bJpqQ+y373c\nhfohhzvNsBAp/SDa3kwPpGcVwgD9mZUDwYybeeuYQQG5C2yWYtwxLygCkxNAdhdx\nCQDFAbBAi3d2YXtMRHyvjm7I1KPx5KgMZ6mTZhdQDVoOA5DIBrmAITsv5apu2ol7\nefv9biXHAgMBAAECggEANeMQie5i/IbDSO9fkDrtMQDF5aB6HXk4ArPk1wMjxSQ2\n7GYth5ey9sd3zsEMT3pFifb5kyYzT10XPXd7/sDD5hjsAqcHhdslzE6aDEYr7gl7\nICWfAjjHFd9NCLZ5fYSHmTTck9TQaQbQ+HH890GVOaN4IB+vrorfkha3yRYbmE1s\nToaCnYBFeNaI/ieUrQou0y/E4XvBZ/fp1+MMvT2PDXGJBxNb29weN8kRxZm30g5p\naoYNpTJEwAriQ6FA3VZ57lqk0AdxMx0/yLtaK0xeFmcpQoXqrm0Bv9hHUnRjCVXE\nDW0j0lxXHqwp/LHQ6t2ZfVBzxBIISGfRca6qn40zgQKBgQDCEuiGCBoxj8/bgZAB\nv2S2r5GH8xL5l87kAgzEFjWuS0VBWpYH7gnmx0x0MZGJnQNwoc42VKrVG3W3kLvc\niyi+4qG27o4+gECgcX7PCzcms7XvBRiu929bqL6rAYVQYAL3Nif3IupGT7q/BuMT\n5CthqLu6dyyV52Eg7p8iVE15vwKBgQDBIyAGsL6x9JGpOvzpGct+4UJJW1LkkHsN\neuYvVVWq8OCXsqgw9myzL/t3crbRw90WyYt95P6zdZSrOVcSZNASN6naQHeND85a\n1HUw5Bddc/wriNAWaSEJHaFp1MVgVJGmRjsZROx5g2MSJVBm2VgHJalrG1NQMbce\nEbxoPc4F+QKBgEbzEKzHU4Qg9jViVVo+NTyQTNztoVc8B3fVxAL/t5pDjEsLKeQ2\nQspqu+mSoYk0rKhFjxTPuTB1fICiWfuTqE64nbQ53Ci/TGEbfOeGSyBL/MwoCdEV\nRlG1DBeKU8mBgDQOSWgRDKKtzTC+/M8t0CpAvHi7zsHyt9CJTAYJ2dUTAoGABg8c\nChmxYdPSXgTDumxcvfZDJhn/V7xQn/OjFQkQTvSPlzK7pA2XC2gN84ldwubqILTh\n82kjtG2T5GtAGAuhm3Czm206UuqUBrVzl70QHpZs6tC39nwF1UtgrPlH1+XPS/AY\nGorXAFjm2sLg6tkWseK0le+dhX6JyB+2UW7e78ECgYEAohmiXubwkt7dvieJROFx\n8zTOn2rmiRQ1rD3fdZZCHFhqeiRbqZJquy3ASuPLCF7LOGwtk/e+linXGCWdF5bm\nZfoL2FWSUT+yu3OZTvYEXWADmzPuVeK+XBZa/i658v2vlnklkobKmDV9ue7uREKi\nO8rAbPwGi1l4JC3VjK9piRo=\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="16ysa_cf7_tQN85V-PZXJCg33pG0uWmdbruyUPOytsbQ"
```

### 🚀 4. Correr el Servidor
Con todo configurado, lanza el entorno de desarrollo:

```bash
npm run dev
```

Tu API ahora estará activa, lista y autenticada para interactuar con la Google Sheet que configuraste.
