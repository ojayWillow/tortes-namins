// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        item.style.animation = 'fadeIn 0.4s ease';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== CAKE BUILDER =====
let currentStep = 1;
const totalSteps = 5;
const steps = document.querySelectorAll('.builder-step');
const dots = document.querySelectorAll('.step-dot');
const prevBtn = document.getElementById('prevStep');
const nextBtn = document.getElementById('nextStep');
const orderBtn = document.getElementById('orderBtn');
const totalPriceEl = document.getElementById('totalPrice');

const labels = {
  size: { bento: 'Bento (1-2 pers.)', small: 'Mazā (4-6 pers.)', medium: 'Vidējā (8-12 pers.)', large: 'Lielā (14-20 pers.)' },
  flavor: { vanilla: 'Vaniļas', chocolate: 'Šokolādes', pistachio: 'Pistāciju', redvelvet: 'Red Velvet' },
  filling: { raspberry: 'Aveņu', mango: 'Mango-Passion', caramel: 'Karameles', berries: 'Meža ogu' },
  coating: { mousse: 'Mousse glazūra', buttercream: 'Sviesta krēms', naked: 'Naked', fondant: 'Fondāns' },
  decor: { flowers: 'Dzīvie ziedi', macarons: 'Makarūni', gold: 'Zelta lapa', photo: 'Foto topiņš', text: 'Uzraksts', sprinkles: 'Konfetti' }
};

const cakeEmojis = {
  bento: '🍱', small: '🎂', medium: '🎂', large: '🎂',
  vanilla: '🍦', chocolate: '🍫', pistachio: '🌿', redvelvet: '❤️'
};

function updateStep(step) {
  currentStep = step;
  steps.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  document.querySelector(`.builder-step[data-step="${step}"]`).classList.add('active');
  dots.forEach((d, i) => {
    if (i + 1 < step) d.classList.add('completed');
    else d.classList.remove('completed');
    if (i + 1 === step) d.classList.add('active');
  });
  prevBtn.disabled = step === 1;
  nextBtn.textContent = step === totalSteps ? 'Gatavs! ✨' : 'Tālāk →';
}

nextBtn.addEventListener('click', () => {
  if (currentStep < totalSteps) updateStep(currentStep + 1);
  else {
    orderBtn.style.display = 'block';
    orderBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 1) updateStep(currentStep - 1);
});

dots.forEach(dot => {
  dot.addEventListener('click', () => updateStep(parseInt(dot.dataset.step)));
});

function calculateTotal() {
  let total = 0;
  const sizeInput = document.querySelector('input[name="size"]:checked');
  if (sizeInput) total += parseInt(sizeInput.dataset.price);
  const flavorInput = document.querySelector('input[name="flavor"]:checked');
  if (flavorInput) total += parseInt(flavorInput.dataset.price);
  const fillingInput = document.querySelector('input[name="filling"]:checked');
  if (fillingInput) total += parseInt(fillingInput.dataset.price);
  const coatingInput = document.querySelector('input[name="coating"]:checked');
  if (coatingInput) total += parseInt(coatingInput.dataset.price);
  document.querySelectorAll('input[name="decor"]:checked').forEach(d => {
    total += parseInt(d.dataset.price);
  });
  totalPriceEl.textContent = `€${total}`;
  return total;
}

function updatePreview() {
  calculateTotal();
  const size = document.querySelector('input[name="size"]:checked');
  const flavor = document.querySelector('input[name="flavor"]:checked');
  const filling = document.querySelector('input[name="filling"]:checked');
  const coating = document.querySelector('input[name="coating"]:checked');
  const decors = document.querySelectorAll('input[name="decor"]:checked');

  document.getElementById('prevSize').innerHTML = `<span>Izmērs:</span> ${size ? labels.size[size.value] : '<em>Nav izvēlēts</em>'}`;
  document.getElementById('prevFlavor').innerHTML = `<span>Biskvīts:</span> ${flavor ? labels.flavor[flavor.value] : '<em>Nav izvēlēts</em>'}`;
  document.getElementById('prevFilling').innerHTML = `<span>Pildījums:</span> ${filling ? labels.filling[filling.value] : '<em>Nav izvēlēts</em>'}`;
  document.getElementById('prevCoating').innerHTML = `<span>Pārklājums:</span> ${coating ? labels.coating[coating.value] : '<em>Nav izvēlēts</em>'}`;
  
  let decorText = '<em>Nav izvēlēts</em>';
  if (decors.length > 0) {
    decorText = Array.from(decors).map(d => labels.decor[d.value]).join(', ');
  }
  document.getElementById('prevDecor').innerHTML = `<span>Dekorācijas:</span> ${decorText}`;

  // Update visual
  const visual = document.getElementById('cakeVisual');
  if (size) visual.querySelector('.cake-base').textContent = cakeEmojis[size.value] || '🎂';
  
  const colors = {
    vanilla: ['#FFF8DC', '#FFEAA7'], chocolate: ['#8B4513', '#D2691E'],
    pistachio: ['#B8E6B8', '#7BC67B'], redvelvet: ['#DC143C', '#FF6B81']
  };
  if (flavor && colors[flavor.value]) {
    visual.style.background = `linear-gradient(135deg, ${colors[flavor.value][0]}, ${colors[flavor.value][1]})`;
  }
}

document.querySelectorAll('.builder-app input').forEach(input => {
  input.addEventListener('change', updatePreview);
});

// WhatsApp order
orderBtn.addEventListener('click', () => {
  const size = document.querySelector('input[name="size"]:checked');
  const flavor = document.querySelector('input[name="flavor"]:checked');
  const filling = document.querySelector('input[name="filling"]:checked');
  const coating = document.querySelector('input[name="coating"]:checked');
  const decors = document.querySelectorAll('input[name="decor"]:checked');
  
  let msg = 'Sveiki! Vēlos pasūtīt torti:\n';
  if (size) msg += `📐 Izmērs: ${labels.size[size.value]}\n`;
  if (flavor) msg += `🍰 Biskvīts: ${labels.flavor[flavor.value]}\n`;
  if (filling) msg += `🫐 Pildījums: ${labels.filling[filling.value]}\n`;
  if (coating) msg += `🎨 Pārklājums: ${labels.coating[coating.value]}\n`;
  if (decors.length > 0) msg += `🌸 Dekorācijas: ${Array.from(decors).map(d => labels.decor[d.value]).join(', ')}\n`;
  msg += `💰 Orientējošā cena: ${totalPriceEl.textContent}`;
  
  window.open(`https://wa.me/371XXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Paldies! Jūsu ziņojums ir nosūtīts. Mēs sazināsimies ar jums drīzumā! 🎂');
  e.target.reset();
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});