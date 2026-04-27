import { supabase } from './supabase.js';

export async function registerUser(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username').value;
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput,
        options: {
            data: {
                username: usernameInput
            }
        }
    });

    if (signUpError) {
        alert(signUpError.message);
        return;
    }

    // After successful signup, immediately log in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput
    });

    if (signInError) {
        alert("Pendaftaran berhasil, tetapi gagal login otomatis: " + signInError.message);
        window.location.href = 'login.html';
        return;
    }

    // Ensure a valid session is created before proceeding
    if (signInData.session) {
        // Redirect to index (dashboard) after session exists
        window.location.href = 'index.html';
    } else {
        alert("Silakan cek email Anda untuk konfirmasi pendaftaran.");
        window.location.href = 'login.html';
    }
}

document.getElementById('registerForm')?.addEventListener('submit', registerUser);
