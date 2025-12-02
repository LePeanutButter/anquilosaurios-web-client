<script lang="ts">
    import { authService } from '../authService';
    import { authStore } from '../authStore';
    import { goto } from '$app/navigation';

    let isLogin = true;
    let isLoading = false;
    let error = '';
    let success = '';

    let loginIdentifier = '';
    let loginPassword = '';

    let registerName = '';
    let registerUsername = '';
    let registerEmail = '';
    let registerPassword = '';
    let registerConfirmPassword = '';

    let validationErrors: Record<string, string> = {};

    $: isLoading = $authStore.isLoading;

    function toggleForm() {
        isLogin = !isLogin;
        clearForm();
        error = '';
        success = '';
        validationErrors = {};
    }

    function clearForm() {
        loginIdentifier = '';
        loginPassword = '';
        registerName = '';
        registerUsername = '';
        registerEmail = '';
        registerPassword = '';
        registerConfirmPassword = '';
    }

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateRegisterForm(): boolean {
        validationErrors = {};

        if (!registerName.trim()) {
            validationErrors.name = 'El nombre es requerido';
        }

        if (!registerUsername.trim()) {
            validationErrors.username = 'El nombre de usuario es requerido';
        } else if (registerUsername.length < 3) {
            validationErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (!registerEmail.trim()) {
            validationErrors.email = 'El email es requerido';
        } else if (!validateEmail(registerEmail)) {
            validationErrors.email = 'Email inválido';
        }

        if (!registerPassword) {
            validationErrors.password = 'La contraseña es requerida';
        } else if (registerPassword.length < 6) {
            validationErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (registerPassword !== registerConfirmPassword) {
            validationErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        return Object.keys(validationErrors).length === 0;
    }

    function validateLoginForm(): boolean {
        validationErrors = {};

        if (!loginIdentifier.trim()) {
            validationErrors.identifier = 'Email o nombre de usuario es requerido';
        }

        if (!loginPassword) {
            validationErrors.password = 'La contraseña es requerida';
        }

        return Object.keys(validationErrors).length === 0;
    }

    async function handleLogin() {
        if (!validateLoginForm()) return;

        error = '';
        success = '';

        try {
            await authService.login({
                identifier: loginIdentifier,
                rawPassword: loginPassword
            });

            success = '¡Inicio de sesión exitoso!';
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                goto('/inicio');
            }, 1000);
        } catch (err: any) {
            error = err.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        }
    }

    async function handleRegister() {
        if (!validateRegisterForm()) return;

        error = '';
        success = '';

        try {
            await authService.register({
                name: registerName,
                username: registerUsername,
                email: registerEmail,
                rawPassword: registerPassword
            });

            success = '¡Registro exitoso! Redirigiendo...';
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                goto('/inicio');
            }, 1000);
        } catch (err: any) {
            error = err.message || 'Error al registrarse. Intenta de nuevo.';
        }
    }

    function handleSubmit(event: Event) {
        event.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    }
</script>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h1>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
            <p>{isLogin ? 'Bienvenido de vuelta' : 'Únete a nuestra comunidad'}</p>
        </div>

        <!-- Mensajes de error y éxito -->
        {#if error}
            <div class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
            </div>
        {/if}

        {#if success}
            <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{success}</span>
            </div>
        {/if}

        <form on:submit={handleSubmit} class="auth-form">
            {#if isLogin}
                <!-- Formulario de Login -->
                <div class="form-group">
                    <label for="identifier">Email o Usuario</label>
                    <input
                        id="identifier"
                        type="text"
                        bind:value={loginIdentifier}
                        placeholder="tu@email.com o usuario"
                        disabled={isLoading}
                        class:error={validationErrors.identifier}
                    />
                    {#if validationErrors.identifier}
                        <span class="error-message">{validationErrors.identifier}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        bind:value={loginPassword}
                        placeholder="••••••••"
                        disabled={isLoading}
                        class:error={validationErrors.password}
                    />
                    {#if validationErrors.password}
                        <span class="error-message">{validationErrors.password}</span>
                    {/if}
                </div>
            {:else}
                <!-- Formulario de Registro -->
                <div class="form-group">
                    <label for="name">Nombre Completo</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={registerName}
                        placeholder="Juan Pérez"
                        disabled={isLoading}
                        class:error={validationErrors.name}
                    />
                    {#if validationErrors.name}
                        <span class="error-message">{validationErrors.name}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="username">Nombre de Usuario</label>
                    <input
                        id="username"
                        type="text"
                        bind:value={registerUsername}
                        placeholder="juanperez"
                        disabled={isLoading}
                        class:error={validationErrors.username}
                    />
                    {#if validationErrors.username}
                        <span class="error-message">{validationErrors.username}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        bind:value={registerEmail}
                        placeholder="tu@email.com"
                        disabled={isLoading}
                        class:error={validationErrors.email}
                    />
                    {#if validationErrors.email}
                        <span class="error-message">{validationErrors.email}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="register-password">Contraseña</label>
                    <input
                        id="register-password"
                        type="password"
                        bind:value={registerPassword}
                        placeholder="••••••••"
                        disabled={isLoading}
                        class:error={validationErrors.password}
                    />
                    {#if validationErrors.password}
                        <span class="error-message">{validationErrors.password}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="confirm-password">Confirmar Contraseña</label>
                    <input
                        id="confirm-password"
                        type="password"
                        bind:value={registerConfirmPassword}
                        placeholder="••••••••"
                        disabled={isLoading}
                        class:error={validationErrors.confirmPassword}
                    />
                    {#if validationErrors.confirmPassword}
                        <span class="error-message">{validationErrors.confirmPassword}</span>
                    {/if}
                </div>
            {/if}

            <button type="submit" class="btn-primary" disabled={isLoading}>
                {#if isLoading}
                    <span class="spinner"></span>
                    Procesando...
                {:else}
                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                {/if}
            </button>
        </form>

        <div class="auth-footer">
            <p>
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button type="button" class="link-button" on:click={toggleForm} disabled={isLoading}>
                    {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </button>
            </p>
        </div>
    </div>
</div>

<style>
    .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(180deg, #0a84ff 0%, #003d80 100%);
        padding: 20px;
    }

    .auth-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        padding: 40px;
        width: 100%;
        max-width: 450px;
    }

    .auth-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .auth-header h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 8px;
    }

    .auth-header p {
        color: #666;
        font-size: 14px;
    }

    .alert {
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
    }

    .alert-error {
        background-color: #fee;
        color: #c33;
        border: 1px solid #fcc;
    }

    .alert-success {
        background-color: #efe;
        color: #3c3;
        border: 1px solid #cfc;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    label {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }

    input {
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        background: white;
    }

    input:focus {
        outline: none;
        border-color: #0a84ff;
        box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.1);
    }

    input.error {
        border-color: #ff4444;
    }

    input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }

    .error-message {
        font-size: 12px;
        color: #ff4444;
        margin-top: -2px;
    }

    .btn-primary {
        background: linear-gradient(180deg, #0a84ff 0%, #003d80 100%);
        color: white;
        border: none;
        padding: 14px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(10, 132, 255, 0.3);
    }

    .btn-primary:active:not(:disabled) {
        transform: translateY(0);
    }

    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .auth-footer {
        text-align: center;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
    }

    .auth-footer p {
        color: #666;
        font-size: 14px;
    }

    .link-button {
        background: none;
        border: none;
        color: #0a84ff;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        margin-left: 4px;
        text-decoration: underline;
    }

    .link-button:hover:not(:disabled) {
        color: #003d80;
    }

    .link-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        .auth-card {
            padding: 30px 20px;
        }

        .auth-header h1 {
            font-size: 24px;
        }
    }
</style>