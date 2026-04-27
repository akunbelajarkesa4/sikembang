import { supabase } from './supabase.js';

export async function displayUserGreeting() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error("No user found or error fetching user:", error);
        return;
    }

    // Extract username from user_metadata
    const username = user.user_metadata?.username || 'User';
    
    // Display "Hi, {username}" on the dashboard
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) {
        greetingElement.textContent = `Hi, ${username}`;
    }
}

// Optionally run it on load if included directly
document.addEventListener('DOMContentLoaded', displayUserGreeting);
