const products = [
  {title:'Banner Printing',price:'TSh 3,000/sqm',size:'Any size (cm)',badge:'Bestseller',image:'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=900&q=85'},
  {title:'Roll-Up Banners',price:'TSh 35,000',size:'85 x 200 cm',badge:'Event ready',image:'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=85'},
  {title:'Vinyl Printing',price:'TSh 5,000/sqm',size:'Any size (cm)',badge:'Weatherproof',image:'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=85'},
  {title:'Mesh Banners',price:'TSh 6,000/sqm',size:'Any size (cm)',badge:'Outdoor',image:'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85'},
  {title:'PVC Boards',price:'TSh 8,000/sqm',size:'122 x 244 cm max',badge:'Rigid display',image:'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85'},
  {title:'Window Graphics',price:'TSh 7,000/sqm',size:'Any size (cm)',badge:'Retail favorite',image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85'},
  {title:'Wall Graphics',price:'TSh 7,500/sqm',size:'Any size (cm)',badge:'Interior',image:'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=900&q=85'},
  {title:'Billboards',price:'On request',size:'Site specific',badge:'Maximum reach',image:'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=85'},
  {title:'Exhibition Displays',price:'TSh 95,000',size:'300 x 230 cm',badge:'Full setup',image:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85'}
];

const productGrid = document.querySelector('#product-grid');
const productSelect = document.querySelector('#selected-product');

products.forEach((product, index) => {
  const priceLabel = product.price === 'On request' ? '<b>Price on request</b>' : `From <b>${product.price}</b>`;
  productGrid.insertAdjacentHTML('beforeend', `<article class="product-card reveal ${index%3===1?'delay-1':index%3===2?'delay-2':''}" data-product="${product.title}"><div class="product-image"><img src="${product.image}" alt="${product.title}" loading="lazy"><span class="product-badge">${product.badge}</span></div><div class="product-info"><h3>${product.title}</h3><p class="price">${priceLabel}</p><div class="product-actions"><button class="send-art" data-product="${product.title}">Send Artwork</button></div></div></article>`);
  productSelect.insertAdjacentHTML('beforeend', `<option>${product.title}</option>`);
});
['Brand Launch Kit','Event Branding Package','Vehicle Branding','Custom Quote','Graphic Design Support'].forEach(p => productSelect.insertAdjacentHTML('beforeend', `<option>${p}</option>`));

const observeReveals = () => {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};
observeReveals();

const menu = document.querySelector('.mobile-menu');
const menuScrim = document.querySelector('.menu-scrim');
const menuButton = document.querySelector('.menu-button');
function setMenu(open){
  menu.classList.toggle('open',open); menuScrim.classList.toggle('open',open); document.body.classList.toggle('menu-open',open);
  menu.setAttribute('aria-hidden',String(!open)); menuButton.setAttribute('aria-expanded',String(open));
}
menuButton.addEventListener('click',()=>setMenu(true));
document.querySelector('.mobile-close').addEventListener('click',()=>setMenu(false));
menuScrim.addEventListener('click',()=>setMenu(false));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

document.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click',()=>{
  document.querySelector('.filter-chip.active').classList.remove('active'); chip.classList.add('active');
  document.querySelectorAll('.category-card').forEach(card=>{
    card.classList.toggle('hidden',chip.dataset.filter!=='all'&&!card.dataset.tags.includes(chip.dataset.filter));
  });
}));

const uploadModal=document.querySelector('#upload-modal');
const vehicleModal=document.querySelector('#vehicle-modal');
const vehicleGrid=document.querySelector('#vehicle-grid');
const eventModal=document.querySelector('#event-modal');
const eventGrid=document.querySelector('#event-grid');
const vehicles = [
  { name:'Hiace (Minibus)', image:'https://images.unsplash.com/photo-1566937169542-48c5c7b4e5d8?auto=format&fit=crop&w=600&q=80' },
  { name:'SUV Cars', image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80' },
  { name:'Saloon Cars', image:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80' },
  { name:'Hardtop Pickup Trucks', image:'https://images.unsplash.com/photo-1594502184342-2e2f0a4e5b5a?auto=format&fit=crop&w=600&q=80' },
  { name:'Lorry / Trailer', image:'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=600&q=80' },
  { name:'Motorbikes', image:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80' },
  { name:'Public Buses', image:'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80' },
  { name:'Tuk-tuk (Bajaj)', image:'https://images.unsplash.com/photo-1513010965784-4f6d2f06f72c?auto=format&fit=crop&w=600&q=80' },
  { name:'Taxi Cabs', image:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80' },
  { name:'Delivery Vans', image:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80' },
  { name:'Food Trucks', image:'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=600&q=80' },
  { name:'Executive / Luxury', image:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80' },
];
const events = [
  { name:'Festivals', image:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80' },
  { name:'Seminars & Workshops', image:'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80' },
  { name:'Public Meetings', image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80' },
  { name:'Product Launches', image:'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=600&q=80' },
  { name:'Bonanzas & Galas', image:'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80' },
  { name:'Campaigns & Rallies', image:'https://images.unsplash.com/photo-1560264418-c4443892a6d7?auto=format&fit=crop&w=600&q=80' },
  { name:'Corporate Retreats', image:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80' },
  { name:'Trade Shows', image:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80' },
  { name:'Weddings & Parties', image:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
  { name:'Conferences & Summits', image:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80' },
  { name:'Award Ceremonies', image:'https://images.unsplash.com/photo-1475721027785-74e3511e3e32?auto=format&fit=crop&w=600&q=80' },
  { name:'Sporting Events', image:'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=600&q=80' },
];
function renderVehicleGallery() {
  vehicleGrid.innerHTML = vehicles.map(v => `
    <button type="button" class="vehicle-card" data-vehicle="${v.name}">
      <div class="vehicle-image"><img src="${v.image}" alt="${v.name}" loading="lazy"></div>
      <span class="vehicle-name">${v.name}</span>
    </button>
  `).join('');
}
vehicleGrid.addEventListener('click', e => {
  const card = e.target.closest('.vehicle-card');
  if (!card) return;
  closeModal(vehicleModal);
  selectProduct('Vehicle Branding - ' + card.dataset.vehicle);
  openModal(uploadModal);
});
renderVehicleGallery();
function renderEventGallery() {
  eventGrid.innerHTML = events.map(e => `
    <button type="button" class="vehicle-card" data-event="${e.name}">
      <div class="vehicle-image"><img src="${e.image}" alt="${e.name}" loading="lazy"></div>
      <span class="vehicle-name">${e.name}</span>
    </button>
  `).join('');
}
eventGrid.addEventListener('click', e => {
  const card = e.target.closest('.vehicle-card');
  if (!card) return;
  closeModal(eventModal);
  selectProduct('Event Branding - ' + card.dataset.event);
  openModal(uploadModal);
});
renderEventGallery();
function openModal(modal){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>modal.querySelector('.modal-close').focus(),100)}
function closeModal(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('modal-open')}
function selectProduct(name){productSelect.value=name;if(productSelect.value!==name){productSelect.insertAdjacentHTML('beforeend',`<option>${name}</option>`);productSelect.value=name}}
document.addEventListener('click',e=>{
  const upload=e.target.closest('.send-art,.open-upload');
  const service=e.target.closest('[data-service]');
  const gallery=e.target.closest('[data-gallery]');
  if(gallery?.dataset.gallery==='vehicle'){openModal(vehicleModal);return}
  if(gallery?.dataset.gallery==='event'){openModal(eventModal);return}
  if(upload||service){const name=upload?.dataset.product||service?.dataset.service;selectProduct(name);openModal(uploadModal)}
});
document.querySelectorAll('.modal').forEach(modal=>{
  modal.querySelector('.modal-close').addEventListener('click',()=>closeModal(modal));
  modal.querySelector('.modal-scrim').addEventListener('click',()=>closeModal(modal));
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal.open').forEach(closeModal);setMenu(false)}});

document.querySelectorAll('.faq-item>button').forEach(button=>button.addEventListener('click',()=>{
  const item=button.closest('.faq-item'); const wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f=>{f.classList.remove('open');f.querySelector('button').setAttribute('aria-expanded','false')});
  if(!wasOpen){item.classList.add('open');button.setAttribute('aria-expanded','true')}
}));

let slide=0;
const track=document.querySelector('.carousel-track');
const count=document.querySelector('.carousel-count');
function updateCarousel(){track.style.transform=`translateX(-${slide*100}%)`;count.textContent=`0${slide+1} / 03`}
document.querySelector('.carousel-next').addEventListener('click',()=>{slide=(slide+1)%3;updateCarousel()});
document.querySelector('.carousel-prev').addEventListener('click',()=>{slide=(slide+2)%3;updateCarousel()});

const searchForm=document.querySelector('#product-search');
const searchInput=searchForm.querySelector('input');
const results=searchForm.querySelector('.search-results');
function searchProducts(query){
  const matches=products.filter(p=>p.title.toLowerCase().includes(query.toLowerCase())).slice(0,5);
  results.innerHTML=query?matches.map(p=>`<button type="button" data-result="${p.title}">${p.title}</button>`).join(''):'';
  if(query&&!matches.length)results.innerHTML='<button type="button">No exact match — request a custom quote</button>';
  results.classList.toggle('show',!!query);
}
searchInput.addEventListener('input',()=>searchProducts(searchInput.value.trim()));
results.addEventListener('click',e=>{
  const btn=e.target.closest('button'); if(!btn)return;
  const name=btn.dataset.result;
  results.classList.remove('show');
  if(name){document.querySelector(`[data-product="${name}"]`).scrollIntoView({behavior:'smooth',block:'center'})}else{selectProduct('Custom Quote');openModal(uploadModal)}
});
searchForm.addEventListener('submit',e=>{e.preventDefault();const match=products.find(p=>p.title.toLowerCase().includes(searchInput.value.toLowerCase()));if(match){document.querySelector(`[data-product="${match.title}"]`).scrollIntoView({behavior:'smooth',block:'center'});results.classList.remove('show')}else{selectProduct(searchInput.value||'Custom Quote');openModal(uploadModal)}});
document.querySelectorAll('[data-search]').forEach(btn=>btn.addEventListener('click',()=>{searchInput.value=btn.dataset.search;searchProducts(btn.dataset.search);document.querySelector('.hero-search').scrollIntoView({behavior:'smooth',block:'center'})}));


const toast=document.querySelector('.toast');
function showToast(message='Request received', subtitle='Our print team will be in touch shortly.'){
  toast.querySelector('b').textContent = message;
  toast.querySelector('span:last-child').textContent = subtitle;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),4500);
}

function sanitize(val) { const el = document.createElement('div'); el.textContent = val; return el.textContent; }

function submitArtworkForm(event){
  event.preventDefault();
  const form = event.target;
  const name = sanitize(form.querySelector('[name="name"]').value.trim());
  const phone = sanitize(form.querySelector('[name="phone"]').value.trim());
  const product = sanitize(form.querySelector('[name="product"]').value);
  const quantity = sanitize(form.querySelector('[name="quantity"]').value || '');
  const width = sanitize(form.querySelector('[name="width"]').value || '');
  const height = sanitize(form.querySelector('[name="height"]').value || '');
  const notes = sanitize(form.querySelector('[name="notes"]').value.trim());

  if (!name || !phone || !product) {
    showToast('Missing info', 'Please fill in your name, phone and service type.');
    return;
  }

  let message = `New inquiry from ${name}\nPhone: ${phone}\nService: ${product}`;
  if (quantity) message += `\nQuantity: ${quantity}`;
  if (width && height) message += `\nDimensions: ${width} x ${height} cm`;
  if (notes) message += `\nNotes: ${notes}`;

  closeModal(uploadModal);
  form.reset();
  const waUrl = `https://wa.me/255769604606?text=${encodeURIComponent(message)}`;
  window.location.href = waUrl;
}

document.querySelector('#upload-form').addEventListener('submit', submitArtworkForm);
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();e.target.reset();showToast()});
