import { supabase } from './supabase.js';

/**
 * 1. Global Function to get the currently logged-in user
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    // If no user is found, redirect to login page
    if (error || !user) {
        window.location.href = 'login.html';
        return null;
    }

    return user;
}

// 5. Ensure ALL protected pages call getCurrentUser() on load
document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    // Don't redirect if we are already on login or register pages
    if (!path.includes('login.html') && !path.includes('register.html')) {
        await getCurrentUser();
    }
});


/**
 * 2A. Insert Growth Data
 */
export async function insertGrowthData(weight, height, headCircumference, feedingType, complaints, status) {
    const user = await getCurrentUser();
    if (!user) return null;

    // 3. Log user.id before insert
    console.log("Inserting growth data for user_id:", user.id);

    const { data, error } = await supabase
        .from('growth_data')
        .insert([
            {
                user_id: user.id,
                weight: weight,
                height: height,
                head_circumference: headCircumference,
                feeding_type: feedingType,
                complaints: complaints,
                status: status
            }
        ]);

    // 6. Error handling
    if (error) {
        console.error("Error inserting growth data:", error);
        alert("Gagal menyimpan data pertumbuhan: " + error.message);
        return null;
    }

    alert("Data pertumbuhan berhasil disimpan!");
    return data;
}


/**
 * 2B. Insert Reminders
 */
export async function insertReminder(title, date) {
    const user = await getCurrentUser();
    if (!user) return null;

    // 3. Log user.id before insert
    console.log("Inserting reminder for user_id:", user.id);

    const { data, error } = await supabase
        .from('reminders')
        .insert([
            {
                user_id: user.id,
                title: title,
                date: date,
                status: "pending"
            }
        ]);

    // 6. Error handling
    if (error) {
        console.error("Error inserting reminder:", error);
        alert("Gagal menyimpan pengingat: " + error.message);
        return null;
    }

    alert("Pengingat berhasil disimpan!");
    return data;
}


/**
 * 2C. Insert Activities
 */
export async function insertActivity(activity, duration, food) {
    const user = await getCurrentUser();
    if (!user) return null;

    // 3. Log user.id before insert
    console.log("Inserting activity for user_id:", user.id);

    const { data, error } = await supabase
        .from('activities')
        .insert([
            {
                user_id: user.id,
                activity: activity,
                duration: duration,
                food: food
            }
        ]);

    // 6. Error handling
    if (error) {
        console.error("Error inserting activity:", error);
        alert("Gagal menyimpan aktivitas: " + error.message);
        return null;
    }

    alert("Aktivitas berhasil disimpan!");
    return data;
}


/**
 * 4. Fetch + Render Chart (Grafik)
 * Assumes you have <canvas id="growthChart"></canvas> and an empty state container <div id="chart-container">
 */
export async function fetchAndRenderChart() {
    const user = await getCurrentUser();
    if (!user) return;

    // Fetch data using RLS (user_id matches automatically if policies are strict, but it's good practice to filter)
    const { data, error } = await supabase
        .from('growth_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // 6. Error handling
    if (error) {
        console.error("Error fetching chart data:", error);
        alert("Gagal memuat data grafik: " + error.message);
        return;
    }

    // 6. Check if data exists
    if (!data || data.length === 0) {
        const chartContainer = document.getElementById('chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<p class="empty-state">Belum ada data</p>';
        } else {
            console.warn("Element with id 'chart-container' not found to show empty state.");
        }
        return;
    }

    // Convert data for Chart.js
    const labels = data.map(item => {
        const date = new Date(item.created_at);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    const weightData = data.map(item => item.weight);
    const heightData = data.map(item => item.height);

    const ctx = document.getElementById('growthChart');
    if (!ctx) {
        console.error("Canvas element with id 'growthChart' not found.");
        return;
    }

    // Destroy existing chart instance to prevent overlaps if re-rendered
    if (window.growthChartInstance) {
        window.growthChartInstance.destroy();
    }

    // Render using Chart.js
    window.growthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Berat Badan (kg)',
                    data: weightData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Tinggi Badan (cm)',
                    data: heightData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Berat (kg)' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Tinggi (cm)' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}
