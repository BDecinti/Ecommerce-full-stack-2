// 1. USUARIOS POR DEFECTO (Para poder probar sin registrarte primero)
const usuariosPorDefecto = [
    { email: 'admin@duoc.cl', password: '123', rol: 'admin', nombre: 'Admin Sistema' },
    { email: 'cliente@duoc.cl', password: '123', rol: 'cliente', nombre: 'Cliente Prueba' }
];

// Cargar usuarios desde LocalStorage si existen; de lo contrario, usar los por defecto
function obtenerUsuarios() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (!usuariosGuardados) {
        // Guardar los por defecto la primera vez
        localStorage.setItem('usuarios', JSON.stringify(usuariosPorDefecto));
        return usuariosPorDefecto;
    }
    return JSON.parse(usuariosGuardados);
}

// -------------------------------------------------------------
// LOGICA DE REGISTRO (signup.html)
// -------------------------------------------------------------
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // Capturar los valores ingresados
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rol = document.getElementById('rol').value;

        const usuarios = obtenerUsuarios();

        // Verificar si el correo ya está registrado
        const existe = usuarios.find(u => u.email === email);
        if (existe) {
            document.getElementById('mensajeSignup').style.color = 'red';
            document.getElementById('mensajeSignup').textContent = 'El correo ya está registrado.';
            return;
        }

        // Crear nuevo objeto de usuario
        const nuevoUsuario = { nombre, email, password, rol };
        usuarios.push(nuevoUsuario);

        // Guardar la lista actualizada en LocalStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        document.getElementById('mensajeSignup').style.color = 'green';
        document.getElementById('mensajeSignup').textContent = '¡Registro exitoso! Redirigiendo al login...';

        // Redirigir al login en 1.5 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// -------------------------------------------------------------
// LOGICA DE LOGIN (login.html)
// -------------------------------------------------------------
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita recargar la página

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const mensaje = document.getElementById('mensajeLogin');

        const usuarios = obtenerUsuarios();

        // BUSQUEDA / AUTENTICACION SIMULADA:
        // En un sistema real, aquí harías un `fetch()` enviando los datos al Backend (servidor/Base de datos).
        const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

        if (usuarioValido) {
            // Guardar la sesión activa del usuario actual
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));

            mensaje.style.color = 'green';
            mensaje.textContent = `Bienvenido ${usuarioValido.nombre} (${usuarioValido.rol})...`;

            // Redireccionar según el ROL
            setTimeout(() => {
                if (usuarioValido.rol === 'admin') {
                    window.location.href = 'admin_home.html'; // Vista de Administrador
                } else {
                    window.location.href = 'index.html';       // Vista de Cliente / Tienda
                }
            }, 1000);
        } else {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Correo o contraseña incorrectos.';
        }
    });
}