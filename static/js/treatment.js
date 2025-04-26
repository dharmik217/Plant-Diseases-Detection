const plantData = {
    // Existing apple disease data
    "apple scab": {
        name: "Apple Scab",
        description: "Maintain healthy growth using fungicides like captan. Use a balanced fertilizer during the growing season."
    },
    "cedar apple rust": {
        name: "Cedar Apple Rust",
        description: "Promote root health with phosphorus-rich fertilizers and apply fungicides containing myclobutanil."
    },
    "black rot": {
        name: "Black Rot",
        description: "Enhance plant vigor using micronutrient fertilizers and apply lime-sulfur sprays as a preventive measure."
    },
    "apple canker": {
        name: "Apple Canker",
        description: "Use copper-based fungicides during dormancy and prune cankered branches to manage the disease."
    },
};

function filterPlants() {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const plantCards = document.querySelectorAll('.plant-card');

    plantCards.forEach(card => {
        const plantName = card.getAttribute('data-name');
        if (plantName.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showDetails(plant) {
    const detailsDiv = document.getElementById('details');
    const plantNameElement = document.getElementById('plantName');
    const plantDescriptionElement = document.getElementById('plantDescription');

    plantNameElement.textContent = plantData[plant].name;
    plantDescriptionElement.textContent = plantData[plant].description;

    detailsDiv.style.display = 'block';
}
