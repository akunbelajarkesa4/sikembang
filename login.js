import { supabase } from './supabase.js';

export async function loginUser(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput
    });

    if (error) {
        alert(error.message);
    } else {
        window.location.href = 'index.html';
    }
}

document.getElementById('loginForm')?.addEventListener('submit', loginUser);
