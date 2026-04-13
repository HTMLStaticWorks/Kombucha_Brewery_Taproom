/*--------------------
Skewed One Page Scroll Vanilla JS
--------------------*/

document.addEventListener("DOMContentLoaded", function () {
    let curPage = 1;
    let pages = document.querySelectorAll(".skw-page");
    let numOfPages = pages.length;
    let animTime = 1000;
    let scrolling = false;
    let pgPrefix = ".skw-page-";

    let heroSection = document.querySelector(".skw-pages");
    if (!heroSection) return;

    function pagination() {
        scrolling = true;

        pages.forEach(page => {
            page.classList.remove("active", "inactive");
        });

        let current = document.querySelector(pgPrefix + curPage);
        if (current) current.classList.add("active");

        let prev = document.querySelector(pgPrefix + (curPage - 1));
        if (prev) prev.classList.add("inactive");

        setTimeout(function () {
            scrolling = false;
        }, animTime);
    }

    function navigateUp() {
        if (curPage === 1) return;
        curPage--;
        pagination();
    }

    function navigateDown() {
        if (curPage === numOfPages) return;
        curPage++;
        pagination();
    }

    // Advanced wheel handler to smoothly release scroll when reaching ends
    document.addEventListener("wheel", function (e) {
        // Find if we are near the top of the page (within the hero section area)
        let scrollY = window.scrollY || window.pageYOffset;

        // If we are significantly scrolled down past the hero, ignore
        if (scrollY > heroSection.offsetHeight / 2 && e.deltaY > 0) {
            return;
        }

        // If we are at the top, we intercept
        if (scrollY <= 10) {

            let dir = e.deltaY > 0 ? "down" : "up";

            // If going up on the very first slide, let standard behavior (bounce scroll)
            if (dir === "up" && curPage === 1) {
                return;
            }

            // If going down on the very last slide, let user scroll down the actual page
            if (dir === "down" && curPage === numOfPages) {
                return;
            }

            // Otherwise, we intercept and slide
            e.preventDefault();

            if (scrolling) return;

            if (dir === "down") {
                navigateDown();
            } else {
                navigateUp();
            }
        }
    }, { passive: false });

    // Keyboard support when at the top
    document.addEventListener("keydown", function (e) {
        if (window.scrollY <= 10) {
            if (e.which === 38) { // Up
                if (curPage > 1) {
                    e.preventDefault();
                    if (!scrolling) navigateUp();
                }
            } else if (e.which === 40) { // Down
                if (curPage < numOfPages) {
                    e.preventDefault();
                    if (!scrolling) navigateDown();
                }
            }
        }
    });

    // Touch support for mobile sliding
    let touchStartY = 0;
    document.addEventListener("touchstart", function (e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchmove", function (e) {
        let scrollY = window.scrollY || window.pageYOffset;
        if (scrollY <= 10) {
            let touchEndY = e.touches[0].clientY;
            let dir = touchStartY > touchEndY ? "down" : "up";

            if (dir === "up" && curPage === 1) return;
            if (dir === "down" && curPage === numOfPages) return;

            e.preventDefault();

            if (!scrolling && Math.abs(touchStartY - touchEndY) > 50) {
                if (dir === "down") {
                    navigateDown();
                } else {
                    navigateUp();
                }
                touchStartY = touchEndY; // reset
            }
        }
    }, { passive: false });
});
