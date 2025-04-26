function search() { 
    const query = document.getElementById('searchQuery').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = card.getAttribute('data-name').toLowerCase().includes(query) ? 'block' : 'none';
    });
}
function toggleDetails(button) {
    const card = button.closest('.card');
    const details = card.querySelector('.details');
    details.style.display = details.style.display === "none" || details.style.display === "" ? "block" : "none";
    button.innerText = details.style.display === "block" ? "Less Details ▲" : "More Details ▼";
}
function changeLanguage(lang) {
    document.querySelectorAll('.en, .hi, .gu').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.' + lang).forEach(el => el.style.display = 'block');
}
document.querySelectorAll(".details-button").forEach(button => {
    button.addEventListener("click", function () {
        const card = this.closest('.card');
        const details = card.querySelector('.details');
        const isExpanded = card.classList.contains("expanded");

        // Collapse all other cards
        document.querySelectorAll(".card").forEach(c => {
            c.classList.remove("expanded");
            c.querySelector('.details').style.display = "none";
            c.querySelector('.details-button').innerHTML = "More Details";
        });

        // Toggle the clicked card
        if (!isExpanded) {
            card.classList.add("expanded");
            details.style.display = "block";
            this.innerHTML = "Less Details";
        }
    });
});