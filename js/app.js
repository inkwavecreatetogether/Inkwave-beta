// interactive app logic here
// ===== Inkwave Beta JS =====

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth"
      });
    }
  });
});

// ===== Fade-in on scroll =====
const fadeElements = document.querySelectorAll(".feature, .hero-text, .cta");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));

// ===== Modal Demo (Try the Beta) =====

// Create modal structure dynamically
const modalHTML = `
  <div id="demoModal" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Inkwave Beta Demo</h2>
      <p>Imagine your strokes coming alive! 🎨 This is where you'll draw, evolve, and connect.</p>
      <canvas id="demoCanvas" width="400" height="300"></canvas>
      <button id="clearCanvas" class="btn btn-primary">Clear</button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML("beforeend", modalHTML);

// Modal functionality
const modal = document.getElementById("demoModal");
const openBtn = document.querySelector(".btn");
const closeBtn = document.querySelector(".close");
const clearBtn = document.getElementById("clearCanvas");
const canvas = document.getElementById("demoCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;

if (openBtn) {
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });
}

closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Basic drawing interaction
canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#8b5cf6";
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// ===== Small CSS Injection for modal =====
const modalStyle = document.createElement("style");
modalStyle.textContent = `
  .modal {
    display: none;
    position: fixed;
    z-index: 100;
    left: 0; top: 0;
    width: 100%; height: 100%;
    background: rgba(15, 23, 42, 0.9);
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: #1e293b;
    color: #fff;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 0 40px rgba(138, 92, 246, 0.4);
    animation: fadeIn 0.3s ease;
  }
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 1.8rem;
    cursor: pointer;
  }
  #demoCanvas {
    margin-top: 1rem;
    background: #0f172a;
    border-radius: 10px;
    border: 1px solid rgba(138, 92, 246, 0.4);
  }
  @keyframes fadeIn {
    from {opacity: 0; transform: scale(0.9);}
    to {opacity: 1; transform: scale(1);}
  }
  .visible { opacity: 1; transform: translateY(0); transition: 1s ease; }
  .feature, .hero-text, .cta { opacity: 0; transform: translateY(40px); }
`;
document.head.appendChild(modalStyle);
