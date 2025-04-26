let slideIndex = 0;
        const slides = document.querySelectorAll(".quote");
        const dots = document.querySelectorAll(".dot");

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove("active");
                dots[i].classList.remove("active");
            });
            slides[index].classList.add("active");
            dots[index].classList.add("active");
        }

        function nextSlide() {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }

        // Auto slide every 3 seconds
        setInterval(nextSlide, 5000);

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                slideIndex = index; // Update slide index
                showSlide(slideIndex); // Show the selected slide
            });
        });