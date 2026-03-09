// Navbar
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Gallery Filter
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

// Cake Builder
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

const palette = {
  vanilla: ['#FFF8DC', '#FFEAA7'],
  chocolate: ['#A0785A', '#7B5B3A'],
  pistachio: ['#D6EAD6', '#ABCFAB'],
  redvelvet: ['#F2BDC8', '#D47088']
};

function updateStep(step) {
  currentStep = step;
  steps.forEach(s => s.classList.remove('active'));
  dots.forEach((d, i) => {
    d.classList.remove('active', 'completed');
    if (i + 1 < step) d.classList.add('completed');
    if (i + 1 === step) d.classList.add('active');
  });
  document.querySelector(`.builder-step[data-step="${step}"]`).classList.add('active');
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
  ['size', 'flavor', 'filling', 'coating'].forEach(name => {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    if (input) total += parseInt(input.dataset.price);
  });
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

  document.getElementById('prevSize').innerHTML = `<span>Izmērs:</span><em>${size ? labels.size[size.value] : 'Nav izvēlēts'}</em>`;
  document.getElementById('prevFlavor').innerHTML = `<span>Biskvīts:</span><em>${flavor ? labels.flavor[flavor.value] : 'Nav izvēlēts'}</em>`;
  document.getElementById('prevFilling').innerHTML = `<span>Pildījums:</span><em>${filling ? labels.filling[filling.value] : 'Nav izvēlēts'}</em>`;
  document.getElementById('prevCoating').innerHTML = `<span>Pārklājums:</span><em>${coating ? labels.coating[coating.value] : 'Nav izvēlēts'}</em>`;

  let decorText = 'Nav izvēlēts';
  if (decors.length > 0) decorText = Array.from(decors).map(d => labels.decor[d.value]).join(', ');
  document.getElementById('prevDecor').innerHTML = `<span>Dekorācijas:</span><em>${decorText}</em>`;

  const visual = document.getElementById('cakeVisual');
  const cakeBase = document.getElementById('cakeBase');
  if (size) cakeBase.textContent = size.value === 'bento' ? '🍱' : '🎂';
  if (flavor && palette[flavor.value]) {
    visual.style.background = `linear-gradient(180deg, ${palette[flavor.value][0]}, ${palette[flavor.value][1]})`;
  }
}

document.querySelectorAll('.builder-app input').forEach(input => {
  input.addEventListener('change', updatePreview);
});

// WhatsApp order
orderBtn.addEventListener('click', () => {
  const get = name => document.querySelector(`input[name="${name}"]:checked`);
  const decors = document.querySelectorAll('input[name="decor"]:checked');
  let msg = 'Sveiki! Vēlos pasūtīt torti:\n';
  if (get('size')) msg += `📐 Izmērs: ${labels.size[get('size').value]}\n`;
  if (get('flavor')) msg += `🍰 Biskvīts: ${labels.flavor[get('flavor').value]}\n`;
  if (get('filling')) msg += `🫐 Pildījums: ${labels.filling[get('filling').value]}\n`;
  if (get('coating')) msg += `🎨 Pārklājums: ${labels.coating[get('coating').value]}\n`;
  if (decors.length) msg += `🌸 Dekorācijas: ${Array.from(decors).map(d => labels.decor[d.value]).join(', ')}\n`;
  msg += `💰 Orientējošā cena: ${totalPriceEl.textContent}`;
  window.open(`https://wa.me/371XXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Paldies! Jūsu ziņojums ir nosūtīts. Mēs sazināsimies ar jums drīzumā! 🎂');
  e.target.reset();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});