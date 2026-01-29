
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const container = document.querySelector('.container');


const THEME_KEY = 'portfolio_theme';
function setTheme(theme){
  if(theme === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
  localStorage.setItem(THEME_KEY, theme);
}
function toggleTheme(){
  const isLight = document.documentElement.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
  updateThemeIcon();
}
function updateThemeIcon(){
  const icon = document.getElementById('theme-icon');
  const isLight = document.documentElement.classList.contains('light');
  // simple sun/moon path
  icon.setAttribute('d', isLight 
    ? 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z' 
    : 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z');
}
$('#theme-toggle').addEventListener('click', toggleTheme);
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
setTheme(savedTheme);
updateThemeIcon();


$('#year').textContent = new Date().getFullYear();


$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});


const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas(){
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
function initParticles(){
  particles = [];
  const count = Math.round((canvas.width * canvas.height) / 50000); // responsive
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 0.6 + Math.random() * 1.8,
      hue: 180 + Math.random()*60
    });
  }
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // background gradient nebula
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0, 'rgba(2,6,23,0.9)');
  g.addColorStop(0.5, 'rgba(0,13,38,0.65)');
  g.addColorStop(1, 'rgba(0,18,32,0.9)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

 
  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0) p.x = canvas.width;
    if(p.x > canvas.width) p.x = 0;
    if(p.y < 0) p.y = canvas.height;
    if(p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.9)`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();


    for(let j=i+1;j<particles.length;j++){
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if(d < 120){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,210,255, ${1 - d/120})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(q.x,q.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
function startCanvas(){
  resizeCanvas();
  initParticles();
  draw();
}
window.addEventListener('resize', ()=>{
  resizeCanvas();
  initParticles();
});


startCanvas();

// ---------- Typewriter ----------
const typeEl = document.getElementById('typewriter');
const phrases = ['Web Developer', 'UI Engineer', 'Performance Enthusiast', 'Blockchain Learner'];
let tIndex = 0, charIndex = 0, deleting = false;
function tickType(){
  const current = phrases[tIndex];
  if(!deleting){
    charIndex++;
    typeEl.textContent = current.slice(0,charIndex);
    if(charIndex === current.length){ deleting = true; setTimeout(tickType, 900); return; }
  } else {
    charIndex--;
    typeEl.textContent = current.slice(0,charIndex);
    if(charIndex === 0){ deleting = false; tIndex = (tIndex+1) % phrases.length; setTimeout(tickType, 400); return; }
  }
  setTimeout(tickType, deleting ? 40 : 80);
}
tickType();

// ---------- Skill radial charts ----------
function drawRadials(){
  const canvasEls = document.querySelectorAll('canvas.radial');
  canvasEls.forEach(c => {
    const ctx = c.getContext('2d');
    const size = c.width;
    const percent = parseInt(c.dataset.chart,10) || 0;
    const thickness = 10;
    ctx.clearRect(0,0,size,size);
    const cx = size/2, cy = size/2, r = (size/2) - thickness;
    // background ring
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = thickness;
    ctx.stroke();
    // foreground arc
    const start = -Math.PI/2;
    const end = start + (Math.PI*2) * (percent/100);
    // gradient
    const g = ctx.createLinearGradient(0,0,size,size);
    g.addColorStop(0, '#00ffee');
    g.addColorStop(1, '#4aa6ff');
    ctx.beginPath();
    ctx.arc(cx,cy,r,start,end);
    ctx.strokeStyle = g;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.stroke();
    // text
    ctx.fillStyle = 'white';
    ctx.font = '700 16px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percent + '%', cx, cy);
  });
}
drawRadials();
window.addEventListener('resize', drawRadials);


const barFills = document.querySelectorAll('.bar-fill');
function animateBars(){
  const trigger = document.getElementById('skills');
  const rect = trigger.getBoundingClientRect();
  if(rect.top < window.innerHeight * 0.85){
    barFills.forEach(b => {
      const val = b.dataset.fill || 0;
      b.style.width = val + '%';
    });
    window.removeEventListener('scroll', animateBars);
  }
}
window.addEventListener('scroll', animateBars);
animateBars();

// ---------- Projects data (editable) ----------
const projectsData = [
  {
    id:'p1',
    title:'Weather App',
    desc:'A clean weather app with API integration and animated UI. Supports search, geolocation and responsive charts.',
    tech:['HTML','CSS','JS','API'],
    category:'web',
    img:'assets/weather.jpg',
    live:'#',
    repo:'#'
  },
  {
    id:'p2',
    title:'Portfolio Website',
    desc:'This very portfolio: advanced single-page, animated, and accessible.',
    tech:['HTML','CSS','JS'],
    category:'ui',
    img:'assets/portfolio.jpg',
    live:'#',
    repo:'#'
  },
  {
    id:'p3',
    title:'To-Do Advanced',
    desc:'LocalStorage backed task manager with tags, filters, and analytics.',
    tech:['JS','LocalStorage'],
    category:'tool',
    img:'assets/todo.jpg',
    live:'#',
    repo:'#'
  }
];
const grid = document.getElementById('projects-grid');

function createProjectCard(p){
  const div = document.createElement('div');
  div.className = 'project';
  div.innerHTML = `
    <img src="${p.img}" alt="${p.title} screenshot" loading="lazy" onerror="this.style.visibility='hidden'">
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="project-meta">
      <small>${p.tech.join(' • ')}</small>
      <div>
        <button class="btn ghost open-project" data-id="${p.id}">Preview</button>
        <a class="btn primary" href="${p.live}" target="_blank" rel="noopener">Live</a>
      </div>
    </div>
  `;
  return div;
}
function renderProjects(filter='all', q=''){
  grid.innerHTML='';
  const lower = q.trim().toLowerCase();
  const filtered = projectsData.filter(p=>{
    const matchFilter = filter === 'all' ? true : p.category === filter;
    const matchQ = !lower || p.title.toLowerCase().includes(lower) || p.desc.toLowerCase().includes(lower) || p.tech.join(' ').toLowerCase().includes(lower);
    return matchFilter && matchQ;
  });
  if(filtered.length === 0){
    grid.innerHTML = `<p style="grid-column:1/-1;color:var(--muted)">No projects found.</p>`;
    return;
  }
  filtered.forEach(p => grid.appendChild(createProjectCard(p)));
}
renderProjects();


$$('.filter').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    $$('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    renderProjects(filter, $('#search').value);
  });
});
$('#search').addEventListener('input', e=>{
  const f = $$('.filter.active')[0]?.dataset.filter || 'all';
  renderProjects(f, e.target.value);
});


const modal = $('#project-modal');
const modalImg = $('#modal-img');
const modalTitle = $('#modal-title');
const modalDesc = $('#modal-desc');
const modalTech = $('#modal-tech');
const modalLive = $('#modal-live');
const modalGit = $('#modal-git');
function openModal(p){
  modalImg.src = p.img;
  modalImg.alt = p.title;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalTech.textContent = 'Tech: ' + p.tech.join(', ');
  modalLive.href = p.live;
  modalGit.href = p.repo;
  modal.setAttribute('aria-hidden','false');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // focus trap: simple
  modal.querySelector('.modal-close').focus();
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('click', e=>{
  if(e.target.classList.contains('open-project')){
    const id = e.target.dataset.id;
    const p = projectsData.find(x=>x.id===id);
    if(p) openModal(p);
  }
});
modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e=>{
  if(e.target === modal) closeModal();
});
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

// ---------- Contact form (EmailJS) ----------
const contactForm = $('#contact-form');
const toast = $('#toast');

function showToast(msg, ok=true){
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.background = ok ? '#07251a' : '#3a0b00';
  setTimeout(()=>{ toast.style.display = 'none' }, 3500);
}

// If you want EmailJS, sign up at https://www.emailjs.com and get IDs.
// Replace these placeholders:
const EMAILJS_USER = 'YOUR_EMAILJS_USER_ID';
const EMAILJS_SERVICE = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID';
// To enable, set these variables with your actual ids and uncomment the sendEmailJS call below.

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  if(!name || !email || !message){ showToast('Please complete all fields', false); return; }

  // Try sending via EmailJS if configured
  if(EMAILJS_USER && EMAILJS_SERVICE && EMAILJS_TEMPLATE && !EMAILJS_USER.includes('YOUR')){
    // dynamic import of emailjs SDK (CDN)
    try {
      if(!window.emailjs){
        await import('https://cdn.jsdelivr.net/npm/emailjs-com@3.2.0/dist/email.min.js');
      }
      window.emailjs.init(EMAILJS_USER);
      const resp = await window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: name,
        from_email: email,
        message: message
      });
      showToast('Message sent — thank you!');
      contactForm.reset();
    } catch(err){
      console.error(err);
      showToast('Failed to send. Try email.', false);
    }
  } else {
    // fallback: prepare mailto
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(message + '\n\n' + 'Reply to: ' + email);
    showToast('Opening email client…');
    window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
  }
});

// Quick open email button
$('#contact-mail').addEventListener('click', ()=>{
  window.location.href = `mailto:your.email@example.com`;
});

// ---------- Small accessibility helpers ----------
document.querySelectorAll('.btn').forEach(b=>{
  b.addEventListener('keydown', e => { if(e.key === 'Enter') b.click(); });
});

// ---------- Optional: progressive enhancements ----------
// Example: lazy-load project images (simple)
const imgs = document.querySelectorAll('img[loading="lazy"]');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const img = en.target;
        if(img.dataset.src){ img.src = img.dataset.src; }
        io.unobserve(img);
      }
    });
  }, {rootMargin:'100px'});
  imgs.forEach(i=>io.observe(i));
}

// ---------- Init done ----------
console.log('Advanced portfolio frontend loaded.');

