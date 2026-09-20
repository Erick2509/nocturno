# Control de Servicios — Firebase Spark + Vercel

## Incluido
Inicio de sesión (administrador por correo y agente por usuario), registro de agentes desde el panel con instancia secundaria de Firebase Authentication, activación/desactivación mediante perfiles y reglas de Firestore, servicios, turnos individuales, actividades, confirmación, justificación de atrasos, incidencias escritas, resumen, CSV, PWA instalable.

## Límites importantes de esta edición gratuita
- **No utiliza Cloud Functions, Admin SDK, Firebase Storage ni notificaciones push.** No hay tareas recurrentes, envío automático de alertas, PDF ni editor de turnos/actividades confirmadas. Los estados atrasada/no realizada se calculan al consultar la app; no se escriben automáticamente en Firestore.
- Deshabilitar un agente bloquea su lectura/escritura en Firestore, pero **no deshabilita su cuenta en Firebase Authentication**. Para eliminar o restablecer credenciales de otros usuarios usa Firebase Console > Authentication. Si una cuenta se crea en Authentication y falla la escritura de su perfil, elimina manualmente la cuenta huérfana desde Firebase Console antes de reintentar.
- La creación de agentes en el navegador es una adaptación para Spark: el registro se realiza en una instancia secundaria de Auth, pero **no equivale a una operación privilegiada de servidor**. Las reglas protegen los documentos de Firestore. Para una gestión de credenciales completamente administrada, usar un backend con Admin SDK.
- La confirmación de actividades requiere conexión. Las reglas validan hora del servidor y asignación. Cerca de la hora límite, el cliente podría enviar un estado que el servidor rechace: refresca y vuelve a intentar. No se garantiza prueba física del trabajo, solo confirmación del agente.
- El control de superposición de turnos es una comprobación de interfaz, no una garantía transaccional. La vista resumen consulta la colección de actividades completa: vigila cuotas de Firestore y archiva información antigua cuando crezca.

## 1. Configurar Firebase
Proyecto ya integrado: `nocturno-8fed4` (la configuración web de Firebase es pública; nunca coloques una clave privada de cuenta de servicio en src/).
1. Firebase Console > Authentication > Sign-in method: habilita **Correo electrónico/Contraseña**.
2. Authentication > Users > Agregar usuario: crea tu cuenta de administrador con **correo real** y contraseña robusta. Copia su **UID**.
3. Firestore Database > Crear base de datos (modo producción). En `usuarios/{TU_UID}` crea: `nombre` (string), `role` (string) = `admin`, `activo` (boolean) = `true`. **No uses el ID de proyecto como ID del documento**. Solo crea un documento admin, nunca un admin público.
4. En Firestore > Reglas, pega el contenido completo de `firestore.rules` y publica. Alternativamente, con Firebase CLI: `firebase login`, `firebase use nocturno-8fed4` (o `firebase deploy --only firestore:rules --project nocturno-8fed4`). Si no tienes el proyecto en `.firebaserc`, utiliza `--project nocturno-8fed4`.
5. Authentication > Settings > Authorized domains: agrega el dominio real de Vercel, por ejemplo `tu-proyecto.vercel.app`. No agregues dominios de terceros.
6. Para la primera prueba, crea un servicio, luego un agente, luego un turno y finalmente una actividad. **Los agentes ingresan con su usuario sin @ y su contraseña temporal.**

## 2. Ejecutar en tu PC
Requiere Node.js LTS. Desde esta carpeta:
```
npm install
npm run dev
```
Abre la URL que indique Vite (normalmente http://localhost:5173). `npm run build` genera la carpeta `dist`.

## 3. Publicar en Vercel
Sube esta carpeta a un repositorio privado de GitHub y conecta el repositorio en Vercel > New Project. Framework preset Vite, Build Command `npm run build`, Output Directory `dist`. `vercel.json` ya está incluido. Tras desplegar, agrega el dominio de Vercel en Firebase Authentication > Authorized domains. Abre la web desde HTTPS e instala la PWA desde el navegador compatible.

## 4. Diagnóstico
- `Missing or insufficient permissions`: revisa que `usuarios/{UID}` exista, rol/activo sean correctos y reglas estén publicadas.
- Si no aparecen agentes recién creados, revisa Firestore y Authentication. Si el perfil no se guardó, elimina la cuenta huérfana desde Authentication antes de repetir.
- No compartas tu contraseña de administrador ni un JSON de cuenta de servicio.
