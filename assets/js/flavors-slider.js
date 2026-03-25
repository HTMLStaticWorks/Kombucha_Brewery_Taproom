/**
 * Flavors Slider Logic
 * Adapted for The Fizzy Brewery
 */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector(".flavors-main-slider");
    const trails = document.querySelectorAll(".trail-item");
    const prevBtn = document.querySelector(".slider-prev");
    const nextBtn = document.querySelector(".slider-next");

    let value = 0;
    let trailValue = 0;
    const interval = 5000;

    const move = (S, T) => {
        slider.style.transform = `translateX(-${S}%)`;
        trails.forEach(cur => cur.classList.remove("active"));
        trails[T].classList.add("active");
        animateContent();
    };

    const initiateINC = () => {
        value === 80 ? value = 0 : value += 20;
        trailValue = value / 20;
        move(value, trailValue);
    };

    const initiateDEC = () => {
        value === 0 ? value = 80 : value -= 20;
        trailValue = value / 20;
        move(value, trailValue);
    };

    let start = setInterval(initiateINC, interval);

    nextBtn.addEventListener("click", () => {
        clearInterval(start);
        initiateINC();
        start = setInterval(initiateINC, interval);
    });

    prevBtn.addEventListener("click", () => {
        clearInterval(start);
        initiateDEC();
        start = setInterval(initiateINC, interval);
    });

    trails.forEach((trail, index) => {
        trail.addEventListener("click", () => {
            clearInterval(start);
            value = index * 20;
            trailValue = index;
            move(value, trailValue);
            start = setInterval(initiateINC, interval);
        });
    });

    function animateContent() {
        const activeSlide = document.querySelectorAll('.box')[trailValue];
        const h1 = activeSlide.querySelector('h1');
        const p = activeSlide.querySelector('p');
        const btn = activeSlide.querySelector('button');
        const img = activeSlide.querySelector('.illustration img');

        if (window.gsap) {
            gsap.from([h1, p, btn], {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                clearProps: "all"
            });
            gsap.from(img, {
                opacity: 0,
                x: 100,
                duration: 1,
                clearProps: "all"
            });
        }
    }

    // Initial run
    animateContent();
});
