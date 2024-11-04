const nonce = 'YOUR-API-KEY';
let lastImageIndex = -1;
let lastPrompt = '';

async function fetchImage() {
    const prompt = document.getElementById('prompt').value;
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';

    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    lastPrompt = prompt;
    lastImageIndex = -1; // Reset last image index for a fresh start

    await fetchAndDisplayImage(prompt);
    document.getElementById('regenerate-btn').disabled = false;
}

async function regenerateImage() {
    if (lastPrompt) {
        await fetchAndDisplayImage(lastPrompt);
    }
}

async function fetchAndDisplayImage(prompt) {
    const imageContainer = document.getElementById('image-container');
    const url = `https://pixabay.com/api/?key=${nonce}&q=${encodeURIComponent(prompt)}&image_type=photo`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hits.length > 0) {
            // Avoid displaying the same image as the last one
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * data.hits.length);
            } while (newIndex === lastImageIndex && data.hits.length > 1);

            lastImageIndex = newIndex;
            const img = document.createElement('img');
            img.src = data.hits[newIndex].webformatURL;
            imageContainer.innerHTML = ''; // Clear previous image
            imageContainer.appendChild(img);
        } else {
            imageContainer.innerHTML = 'No images found.';
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        imageContainer.innerHTML = 'API key not found. ';
    }
}
