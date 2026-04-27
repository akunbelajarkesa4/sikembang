import { supabase } from './supabase.js';

export async function getLoggedInUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = 'login.html';
        return null;
    }

    const username = user.user_metadata.username || 'User';
    
    // Display on dashboard if an element with ID 'greeting' exists
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = `Hi, ${username}`;
    }

    return user;
}
