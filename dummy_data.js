import { supabase } from './supabase.js';

export async function insertDummyData() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Error: No user logged in to insert dummy data");
        return;
    }

    const userId = user.id;

    // 1. Insert into growth_data
    const { data: growthData, error: growthError } = await supabase
        .from('growth_data')
        .insert([
            {
                user_id: userId,
                weight: 8,
                height: 70,
                status: "normal"
            }
        ]);
        
    if (growthError) {
        console.error("Error inserting growth data:", growthError);
    } else {
        console.log("Successfully inserted growth data:", growthData);
    }

    // 2. Insert into reminders
    const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .insert([
            {
                user_id: userId,
                title: "Imunisasi",
                date: new Date().toISOString().split('T')[0] // today's date in YYYY-MM-DD
            }
        ]);

    if (remindersError) {
        console.error("Error inserting reminder:", remindersError);
    } else {
        console.log("Successfully inserted reminder:", remindersData);
    }

    // 3. Insert into activities
    const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .insert([
            {
                user_id: userId,
                activity: "Bermain",
                duration: 60,
                food: "Bubur"
            }
        ]);

    if (activitiesError) {
        console.error("Error inserting activity:", activitiesError);
    } else {
        console.log("Successfully inserted activity:", activitiesData);
    }
}
