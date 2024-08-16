// Utility function to generate a random integer within a range
function random(num) {
    return Math.floor(Math.random() * num);
}

// Class to handle canvas operations
class Canvas {
    constructor(canvasSelector, canvasColor = '#008001', makeFullScreen = true) {
        this.canvas = document.querySelector(canvasSelector);

        if (!this.canvas) {
            console.error(`Canvas element not found for selector: ${canvasSelector}`);
            return;
        }

        this.canvas.style.background = canvasColor;
        if (makeFullScreen) {
            this.makeFullScreen();
            window.addEventListener('resize', () => this.makeFullScreen());
        }
    }

    makeFullScreen() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    getCtx(dimension = '2d') {
        return this.canvas.getContext(dimension);
    }

    getWidth() {
        return this.canvas.width;
    }

    getHeight() {
        return this.canvas.height;
    }

    clear() {
        this.getCtx().clearRect(0, 0, this.getWidth(), this.getHeight());
    }
}

// Function to draw a star
// Function to draw a professional Pakistani flag star without a circle
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 2; // Slightly smaller border width to match the flag's star
    ctx.strokeStyle = '#FFFFFF'; // White border, as per the Pakistani flag
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; // White fill color for the star
    ctx.fill();
}


// Class to manage animation with circles
class Animation {
    constructor(canvas, circlesNumber = 120, circles = null) {
        this.canvas = canvas;
        if (!this.canvas || !this.canvas.canvas) return;

        this.circles = circles === null 
            ? Array.from({ length: circlesNumber }, () => new Circle(this.getCanvas()))
            : circles;

        this.render();
    }

    getCanvas() {
        return this.canvas;
    }

    getCircles() {
        return this.circles;
    }

    moveCircles(stepSize = 6) {
        this.getCircles().forEach(circle => circle.move(stepSize));
    }

    drawCircles() {
        this.getCircles().forEach(circle => circle.draw());
    }

    render(timeFrames = 80) {
        setInterval(() => {
            this.canvas.clear();
            this.moveCircles();
            this.drawCircles();
        }, timeFrames);
    }
}

// Class to handle individual circles
class Circle {
    constructor(canvas) {
        this.canvas = canvas;
        this.init();
    }

    init() {
        this.setRandomPosition();
        this.setSize();
        this.draw();
    }

    move(stepSize) {
        this.lastY = this.y;
        this.y += stepSize * 0.5;
        this.checkPosition();
    }

    setRandomPosition() {
        this.x = this.randomInRange(0, this.getCanvasWidth());
        this.y = this.randomInRange(-this.getCanvasHeight(), 0);
        this.lastX = this.x;
        this.lastY = this.y;
    }

    checkPosition() {
        if (this.y > this.getCanvasHeight()) {
            this.setRandomPosition();
        }
    }

    setSize(maxSize = 10, minSize = 1) {
        this.size = this.randomInRange(minSize, maxSize);
    }

    draw() {
        const ctx = this.getCtx();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 2, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.closePath();

        // Drawing a star within the circle
        drawStar(ctx, this.x, this.y, 5, this.size * 2, this.size);
    }

    getCtx() {
        return this.canvas.getCtx();
    }

    getCanvasWidth() {
        return this.canvas.getWidth();
    }

    getCanvasHeight() {
        return this.canvas.getHeight();
    }

    randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// Initialize animation with canvas
new Animation(new Canvas('#animation-canvas'));
Animation = document.body.style.overflowX = "hidden";

// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const carouselContent = document.querySelector('.carousel-content');
    const items = document.querySelectorAll('.carousel-item');
    const firstSlideVideo = items[0].querySelector('video'); // Assuming the video is in the first slide
    let currentIndex = 0;
    let autoSlideInterval;

    function showItem(index) {
        const totalItems = items.length;

        if (index >= totalItems) {
            currentIndex = 0; // Loop back to the first slide
        } else if (index < 0) {
            currentIndex = totalItems - 1; // Go to the last slide if going backwards from the first
        } else {
            currentIndex = index;
        }

        carouselContent.classList.remove('slide-animation');
        void carouselContent.offsetWidth; // Trigger reflow to restart animation
        carouselContent.classList.add('slide-animation');

        // Apply different animations for specific slides
        items.forEach((item, i) => {
            item.classList.remove('slide-anim1', 'slide-anim2', 'slide-anim3');
            if (i === currentIndex) {
                if (i % 3 === 0) {
                    item.classList.add('slide-anim1');
                } else if (i % 3 === 1) {
                    item.classList.add('slide-anim2');
                } else if (i % 3 === 2) {
                    item.classList.add('slide-anim3');
                }
            }
        });

        carouselContent.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            // Check if video is paused or ended
            if (currentIndex === 0 && firstSlideVideo && (!firstSlideVideo.paused || !firstSlideVideo.ended)) {
                return; // Stay on the current slide if the video is playing
            }
            showItem(currentIndex + 1);
        }, 9000); // 9 Seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    prevButton.addEventListener('click', () => {
        stopAutoSlide();
        showItem(currentIndex - 1);
        startAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        stopAutoSlide();
        showItem(currentIndex + 1);
        startAutoSlide();
    });

    // Monitor the video for pause events to move to the next slide
    if (firstSlideVideo) {
        firstSlideVideo.addEventListener('pause', () => {
            if (currentIndex === 0) {
                showItem(currentIndex + 1);
            }
        });
    }

    // Start the automatic slide change
    startAutoSlide();
    showItem(currentIndex);
});


document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
  
        // Add active class to the clicked tab and its corresponding content
        tab.classList.add('active');
        const target = tab.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
      });
    });
  });
  
  document.querySelector('.pin-container').addEventListener('mouseenter', function() {
    document.querySelector('.pin-perspective .vertical-line').style.height = '80px';
  });
  
  document.querySelector('.pin-container').addEventListener('mouseleave', function() {
    document.querySelector('.pin-perspective .vertical-line').style.height = '40px';
  });
  
  