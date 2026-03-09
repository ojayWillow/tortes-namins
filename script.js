const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 12);
});

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

let currentStep = 1;
const totalSteps = 5;
const steps = document.querySelectorAll('.builder-step');
const dots = document.querySelectorAll('.step-dot');
const prevBtn = document.getElementById('prevStep');
const nextBtn = document.getElementById('nextStep');
const orderBtn = document.getElementById('orderBtn');
const totalPriceEl = document.getElementById('totalPrice');

const labels = {
  size: { bento: 'Bento', small: 'Mazā', medium: 'Vidējā', large: 'Lielā' },
  flavor: { vanilla: 'Vaniļas', chocolate: 'Šokolādes', pistachio: 'Pistāciju', redvelvet: 'Red Velvet' },
  filling: { raspberry: 'Aveņu', mango: 'Mango-passion', caramel: 'Karameles', berries: 'Meža ogu' },
  coating: { mousse: 'Mousse glazūra', buttercream: 'Sviesta krēms', naked: 'Naked', fondant: 'Fondāns' },
  decor: { flowers: 'Dzīvie ziedi', macarons: 'Makarūni', gold: 'Zelta lapa', text: 'Teksts' }
};

const palette = {
  vanilla: ['#fff4dd', '#ffe2a8'],
  chocolate: ['#c89b6d', '#8b5e3c'],
  pistachio: ['#d7ead7', '#afd4ae'],
  redvelvet: ['#f4c5cf', '#dd7c92']
};

function updateStep(step) {
  currentStep = step;
  steps.forEach(stepEl => stepEl.classList.remove('active'));
  dots.forEach(dot => {
    dot.classList.remove('active');
    dot.classList.remove('completed');
  });

  document.querySelector(`.builder-step[data-step="${step}"]`)?.classList.add('active');

  dots.forEach((dot, index) => {
    if (index + 1 < step) dot.classList.add('completed');
    if (index + 1 === step) dot.classList.add('active');
  });

  prevBtn.disabled = step === 1;
  nextBtn.textContent = step === totalSteps ? 'Pabeigt' : 'Tālāk';
}

function calculateTotal() {
  let total = 0;
  ['size', 'flavor', 'filling', 'coating'].forEach(name => {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    if (input) total += Number(input.dataset.price || 0);
  });
  document.querySelectorAll('input[name="decor"]:checked').forEach(item => {
    total += Number(item.dataset.price || 0);
  });
  totalPriceEl.textContent = `€${total}`;
  return total;
}

function textOrFallback(value, map) {
  return value ? map[value] : 'Nav izvēlēts';
}

function updatePreview() {
  const size = document.querySelector('input[name="size"]:checked');
  const flavor = document.querySelector('input[name="flavor"]:checked');
  const filling = document.querySelector('input[name="filling"]:checked');
  const coating = document.querySelector('input[name="coating"]:checked');
  const decors = Array.from(document.querySelectorAll('input[name="decor"]:checked'));

  document.getElementById('prevSize').innerHTML = `<span>Izmērs</span><em>${textOrFallback(size?.value, labels.size)}</em>`;
  document.getElementById('prevFlavor').innerHTML = `<span>Biskvīts</span><em>${textOrFallback(flavor?.value, labels.flavor)}</em>`;
  document.getElementById('prevFilling').innerHTML = `<span>Pildījums</span><em>${textOrFallback(filling?.value, labels.filling)}</em>`;
  document.getElementById('prevCoating').innerHTML = `<span>Pārklājums</span><em>${textOrFallback(coating?.value, labels.coating)}</em>`;
  document.getElementById('prevDecor').innerHTML = `<span>Dekori</span><em>${decors.length ? decors.map(d => labels.decor[d.value]).join(', ') : 'Nav izvēlēts'}</em>`;

  const cakeVisual = document.getElementById('cakeVisual');
  const cakeBase = document.getElementById('cakeBase');
  if (size?.value === 'bento') cakeBase.textContent = '🍱';
  else cakeBase.textContent = '🎂';

  if (flavor?.value && palette[flavor.value]) {
    cakeVisual.style.background = `linear-gradient(180deg, ${palette[flavor.value][0]}, ${palette[flavor.value][1]})`;
  } else {
    cakeVisual.style.background = 'linear-gradient(180deg, #fff5f8, #f9efe6)';
  }

  calculateTotal();
}

nextBtn?.addEventListener('click', () => {
  if (currentStep < totalSteps) {
    updateStep(currentStep + 1);
  } else {
    orderBtn.style.display = 'block';
    orderBtn.focus();
  }
});

prevBtn?.addEventListener('click', () => {
  if (currentStep > 1) updateStep(currentStep - 1);
});

dots.forEach(dot => {
  dot.addEventListener('click', () => updateStep(Number(dot.dataset.step)));
});

document.querySelectorAll('.builder-shell input').forEach(input => {
  input.addEventListener('change', updatePreview);
});

orderBtn?.addEventListener('click', () => {
  const size = document.querySelector('input[name="size"]:checked')?.value;
  const flavor = document.querySelector('input[name="flavor"]:checked')?.value;
  const filling = document.querySelector('input[name="filling"]:checked')?.value;
  const coating = document.querySelector('input[name="coating"]:checked')?.value;
  const decor = Array.from(document.querySelectorAll('input[name="decor"]:checked')).map(d => labels.decor[d.value]).join(', ');

  const message = [
    'Sveiki! Vēlos pasūtīt torti.',
    `Izmērs: ${textOrFallback(size, labels.size)}`,
    `Biskvīts: ${textOrFallback(flavor, labels.flavor)}`,
    `Pildījums: ${textOrFallback(filling, labels.filling)}`,
    `Pārklājums: ${textOrFallback(coating, labels.coating)}`,
    `Dekori: ${decor || 'Nav izvēlēts'}`,
    `Orientējošā cena: ${totalPriceEl.textContent}`
  ].join('\n');

  window.open(`https://wa.me/371XXXXXXXX?text=${encodeURIComponent(message)}`, '_blank');
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

reveals.forEach(item => observer.observe(item));
updateStep(1);
updatePreview();
