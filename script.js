// --- PART 1: CURSOR GLOW EFFECT (UNCHANGED) ---
(() => {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;

    document.body.addEventListener("mousemove", e => {
        const { clientX, clientY } = e;
        glow.style.transform = `translate(${clientX}px, ${clientY}px)`;
    });
})();


// --- PART 2: FORM SUBMISSION LOGIC (UPDATED) ---
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // --- UPDATED: API endpoint now points to your live Render server ---
    const backendUrl = "https://nmc-backend-bot.onrender.com/register";
    // ---------------------------------------------------------------------

    const statusMessage = document.getElementById('status-message');
    const form = event.target;

    // Create a simple object with the form data
    const formData = {
        fullName: form.elements['fullName'].value,
        age: form.elements['age'].value,
        email: form.elements['email'].value,
        ign: form.elements['ign'].value,
        discordId: form.elements['discordId'].value
    };

    // Send the data to our backend server
    fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            statusMessage.textContent = "Registration successful! A moderator will review it.";
            statusMessage.style.color = "#4CAF50";
            form.reset();
        } else {
            statusMessage.textContent = "Something went wrong. Please try again.";
            statusMessage.style.color = "#f44336";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = "Could not connect to the server. Please try again later.";
        statusMessage.style.color = "#f44336";
    });
});
