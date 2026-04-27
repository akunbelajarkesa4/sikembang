import { supabase } from './supabase.js';

export async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
        window.location.href = 'login.html';
    }
}

// Run this script on page load
document.addEventListener('DOMContentLoaded', checkSession);
