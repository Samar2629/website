// --- PART 1: CURSOR GLOW EFFECT ---
(() => {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;

    document.body.addEventListener("mousemove", e => {
        const { clientX, clientY } = e;
        glow.style.transform = `translate(${clientX}px, ${clientY}px)`;
    });
})();


// --- PART 2: FORM SUBMISSION LOGIC ---
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // The URL of your live backend server on Render
    const backendUrl = "https://nmc-backend-bot.onrender.com/register";
    
    const statusMessage = document.getElementById('status-message');
    const form = event.target;

    const formData = {
        fullName: form.elements['fullName'].value,
        age: form.elements['age'].value,
        email: form.elements['email'].value,
        ign: form.elements['ign'].value,
        discordId: form.elements['discordId'].value
    };

    // Temporarily disable the button to prevent multiple clicks
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    statusMessage.textContent = 'Submitting...';
    statusMessage.style.color = '#ccc';

    fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        // Re-enable the button once we get a response
        submitButton.disabled = false;

        if (response.ok) {
            statusMessage.textContent = "Registration successful! A moderator will review it.";
            statusMessage.style.color = "#4CAF50"; // Green for success
            form.reset();
        } else {
            // Handle specific error messages from the server, including the rate limit
            const errorData = await response.json();
            statusMessage.textContent = errorData.message || "Something went wrong. Please try again.";
            statusMessage.style.color = "#f44336"; // Red for error
        }
    })
    .catch(error => {
        // Re-enable the button on network error
        submitButton.disabled = false;
        console.error('Error:', error);
        statusMessage.textContent = "Could not connect to the server. Please try again later.";
        statusMessage.style.color = "#f44336";
    });
});
