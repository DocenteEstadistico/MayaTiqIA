# 🧮 MAYA TIQ IA — Motor de Generación e Importación de Ejercicios

Este directorio contiene la suite oficial de utilidades para generar, verificar, importar y publicar ejercicios matemáticos en la base de datos de **Supabase** de MayaTiqIA.

---

## 📁 Contenido del Directorio

- **`mayan_generator.py`**: Generador paramétrico simbólico puro (SymPy). 100% verificado, sin alucinaciones y propio.
- **`sqlesquema.sql`**: Esquema oficial v1.1 para ejecutar en el SQL Editor de Supabase (Tablas `students`, `exercises`, `profile_permissions`, `attempts` con políticas RLS por perfil).
- **`mayan_ai_pipeline.py`**: Pipeline para generar ejercicios enriquecidos mediante OpenAI (`gpt-4o-mini`), verificados simbólicamente con SymPy y validados contra similitud.
- **`mayan_safe_importer.py`**: Importador de fuentes abiertas libres para uso comercial (GSM8K con Licencia MIT, MIT MathNet).
- **`requirements.txt`**: Librerías de Python requeridas (`sympy`, `supabase`, `openai`, `tqdm`, `python-dotenv`).
- **`.env.example`**: Plantilla para tus llaves de API y credenciales de Supabase.

---

## 🚀 Guía de Inicio Rápido

### 1. Configurar Entorno Python
```bash
# Entrar al directorio
cd exercise_engine

# Crear e iniciar entorno virtual Python
python -m venv venv
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Ejecutar Esquema en Supabase
Copia el contenido de `sqlesquema.sql` y pégalo en el **SQL Editor** de tu consola de Supabase.

### 3. Generar Ejercicios Simbólicos
```bash
# Construir el banco equilibrado predeterminado (1.000 ejercicios)
python build_exercise_bank.py

# Elegir tamaño, semilla reproducible y directorio de salida
python build_exercise_bank.py --total 500 --seed 42 --out ../src/data/
```

El constructor reparte el total entre cinco áreas (aritmética, álgebra,
geometría y trigonometría, conjuntos, y progresiones) en cuotas iguales. Dentro
de cada área, reparte la cuota equitativamente entre sus subtemas y genera
variantes únicas verificadas por las plantillas registradas. Para un total de
1.000, genera 200 ejercicios por área; para 5.000 o 10.000, las cuotas se
ajustan automáticamente. Si alguna plantilla no puede generar la cuota única
solicitada, el proceso se detiene con un error en vez de publicar un banco
incompleto.

El resultado predeterminado se guarda en `src/data/ejercicios_base_1000.json`
y en cinco archivos separados por área. `build_base_500.py` se conserva como
compatibilidad para regenerar un banco equilibrado de 500 ejercicios.

Las plantillas de cálculo diferencial e integral permanecen disponibles en
`mayan_generator.py`, pero no se incluyen en estos bancos de cinco áreas; para
añadir cálculo habría que definirlo como una sexta área o decidir expresamente
cómo redistribuir las cuotas.

## 🔐 Cuentas y pases de acceso de Supabase

La aplicación requiere una cuenta y un pase individual de un solo uso. Cada
persona crea su contraseña para su cuenta; el código de pase es una credencial
distinta que se canjea una sola vez y comienza a contar sus días al canjearse.
Se pueden emitir lotes de 1 a 500 códigos y repetir el proceso para crear
cientos o miles de pases con distintos plazos y etiquetas.

1. En el SQL Editor de Supabase, ejecuta `access_passes.sql`. El script crea
   las tablas/RPC con RLS y restringe la lectura de ejercicios aprobados a
   cuentas con acceso vigente.
2. Crea/confirma tu propia cuenta en la aplicación. En el SQL Editor, descomenta
   el bloque `Bootstrap del administrador`, sustituye `TU_CORREO_ADMIN` por el
   correo exacto de esa cuenta y ejecútalo. No incluyas claves privadas en el
   código fuente.
3. En Authentication → URL Configuration de Supabase configura `Site URL` como
   `https://mayantechia.netlify.app` y agrega a `Redirect URLs` ese dominio más
   `http://localhost:5173/**` para desarrollo.
4. En Netlify → Site configuration → Environment variables configura
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con el URL y la clave pública
   del mismo proyecto. Configura las mismas dos variables en `.env` para local
   (consulta `.env.example`) y vuelve a desplegar el sitio.
5. Desde una sesión de administrador, emite `20` códigos con duración `7` días,
   descarga el CSV y entrega un código distinto a cada persona. Para más de 500,
   emite varios lotes y usa una etiqueta distinta para identificarlos. Guarda
   cada CSV en un lugar privado y seguro: los códigos se guardan como hashes y
   el texto legible se muestra solo al emitirlos.

### Publicar el banco para servirlo con RLS

Los ejercicios se consultan desde Supabase después de iniciar sesión; el
frontend no importa el JSON local. Para cargar o actualizar el banco, ejecuta
`npm run upload:bank` desde la raíz del proyecto. El cargador toma
`VITE_SUPABASE_URL` de `.env` o del entorno, y requiere
`SUPABASE_SERVICE_ROLE_KEY` en el entorno de esa operación. La clave
service-role omite RLS: no la guardes en `.env` con prefijo `VITE_`, no la
pongas en Netlify y no la compartas con estudiantes. La carga hace upsert por
`exercise_id` y se puede repetir.

El código de canje y la autorización del administrador se validan en funciones
transaccionales de Supabase, no en el navegador. El esquema separa la emisión
de pases de la concesión de acceso para que una pasarela de pago futura pueda
registrar un `source = 'payment'` sin reutilizar códigos. La integración de
Stripe u otras pasarelas no se configura en este cambio.
