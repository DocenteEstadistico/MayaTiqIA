# Ing. Pegasus — Guía de despliegue

Integración del asistente Pegasus dentro de MayaTiqIA.

## Qué quedó instalado

- **Componente**: [src/components/PegasusAssistantView.jsx](src/components/PegasusAssistantView.jsx) — vista React autocontenida con el banco de 90 preguntas (20 campo · 20 clases · 50 internado basadas en el Reglamento ENCA 01-2022), portraits animados tipo videollamada, avatar seleccionable (Agro/AGI) y logging a Supabase.
- **Imágenes**: [src/assets/pegasus/](src/assets/pegasus/) — `pegassus.jpg`, `agro.jpg`, `agi.jpg`, `aula.jpg` (optimizadas a ~25 KB cada una, total ~175 KB).
- **Ruta**: Entrada `pegasus` agregada al nav de [MayanDashboard.jsx](MayanDashboard.jsx) con ícono `MessageCircle`. Se abre desde el tab "Pegasus".
- **Supabase**: [exercise_engine/pegasus_schema.sql](exercise_engine/pegasus_schema.sql) — tabla `pegasus_conversations` + 2 vistas (`pegasus_unmatched_questions`, `pegasus_daily_usage`).

## Pasos para dejarlo corriendo

### 1. Probar en local

```powershell
cd C:\Users\Alvaro\MayaTiqIA
npm install        # solo si no lo has corrido antes
npm run dev
```

Abre `http://localhost:5173`, verás "Pegasus" en el nav. Sin Supabase conectado el chat funciona igual (las conversaciones no se guardan, pero no rompe nada — el cliente tiene `isSupabaseConfigured` como guardia).

### 2. Aplicar el esquema en Supabase

1. Entra a tu proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor** > **New query**.
3. Pega el contenido de [exercise_engine/pegasus_schema.sql](exercise_engine/pegasus_schema.sql).
4. **Run**.

Verifica en **Table Editor** que apareció `pegasus_conversations`.

### 3. Confirmar variables de entorno

En `.env` (local) y en Netlify (producción) debe haber:

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Estas ya existen para el resto de MayaTiqIA — Pegasus usa las mismas, no requiere variables nuevas.

### 4. Desplegar a Netlify

Si tu repo está conectado a Netlify por GitHub:

```powershell
git add src/components/PegasusAssistantView.jsx src/assets/pegasus MayanDashboard.jsx exercise_engine/pegasus_schema.sql PEGASUS_DEPLOY.md
git commit -m "feat: integrar Ing. Pegasus en MayaTiqIA"
git push
```

Netlify detecta el push, corre `npm run build`, y publica a `dist/`. En ~2 minutos está en línea.

Si el deploy es manual:

```powershell
npm run build
netlify deploy --prod --dir=dist
```

### 5. Verificar en producción

1. Abre la URL de Netlify.
2. Entra al tab **Pegasus**.
3. Pregunta cualquier cosa (p. ej. *"¿qué pasa si fumo?"*).
4. En Supabase, abre **Table Editor** > `pegasus_conversations`. Debe aparecer la fila con tu pregunta, la respuesta que dio, y `fallback = false` si matcheó, `true` si no.

## Cómo el profesor ve las preguntas

En Supabase SQL Editor, consultas listas:

```sql
-- Preguntas que NO están en el banco (ordenadas por frecuencia)
select * from pegasus_unmatched_questions limit 50;

-- Volumen por día y por modo
select * from pegasus_daily_usage limit 30;

-- Últimas 100 conversaciones
select mode, question, matched_q, fallback, created_at
from pegasus_conversations
order by created_at desc
limit 100;
```

La primera es la más valiosa — te dice exactamente qué preguntas agregar al banco. Cada vez que amplíes la lista en [PegasusAssistantView.jsx](src/components/PegasusAssistantView.jsx), un nuevo deploy de Netlify las publica.

## Siguientes pasos opcionales

- **Banco editable sin redeploy**: mover el array `BANK` a una tabla `pegasus_qa_bank` en Supabase y leerlo con `useEffect`. Así el profesor edita desde una pantalla admin sin tocar código.
- **Fallback con IA**: cuando `match === null`, llamar a una Netlify Function (`netlify/functions/pegasus_llm.js`) que consulte Claude/OpenAI con las instrucciones de rol de Pegasus. La llave del modelo vive en variables de entorno de Netlify, nunca expuesta al navegador.
- **Identificar al estudiante**: cuando tengan auth real, pasar el `student_id` al `logConversation()` para ver quién pregunta qué y detectar temas recurrentes por alumno.

## Rollback

Si algo sale mal, los cambios están aislados en 4 archivos. Para quitar Pegasus del todo:

1. En [MayanDashboard.jsx](MayanDashboard.jsx) quitar:
   - El import de `PegasusAssistantView`
   - `MessageCircle` de los imports de lucide-react
   - La entrada `{ id: 'pegasus', ... }` en `navItems`
   - El bloque `{vistaActiva === 'pegasus' && ...}`
2. Borrar `src/components/PegasusAssistantView.jsx`, `src/assets/pegasus/`, y `exercise_engine/pegasus_schema.sql`.
3. En Supabase, si quieres eliminar los datos: `drop table pegasus_conversations cascade;`.
