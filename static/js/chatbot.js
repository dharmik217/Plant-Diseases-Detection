// Predefined chatbot responses
const chatbotResponses = {
    "what treatment does a rose need": "Roses require regular pruning, pest control, and plenty of sunlight.",
    "how do i care for a cactus": "Cacti need minimal watering and plenty of direct sunlight.",
    "money plant care": "Money plants prefer indirect sunlight and frequent watering."
};

// Toggle chatbot visibility
function toggleChatbot() {
    const chatbotContent = document.getElementById('chatbot-content');
    chatbotContent.style.display = chatbotContent.style.display === 'none' ? 'flex' : 'none';
}

// Handle message input when pressing Enter
function handleInput(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Send a message and generate a response
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    displayMessage("You: " + message);
    input.value = "";

    const response = chatbotResponses[message.toLowerCase()] || "Sorry, I don't know the answer to that.";
    setTimeout(() => displayMessage("Bot: " + response), 500);
}

// Display a message in the chat
function displayMessage(message) {
    const chatMessages = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.textContent = message;
    div.style.marginBottom = '10px';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
