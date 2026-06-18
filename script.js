const products = [
  {title:'Banner Printing',price:'KSh 650',size:'Any custom size',badge:'Bestseller',image:'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=900&q=85'},
  {title:'Roll-Up Banners',price:'KSh 6,500',size:'850 × 2000 mm',badge:'Event ready',image:'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=85'},
  {title:'Vinyl Printing',price:'KSh 900',size:'Any custom size',badge:'Weatherproof',image:'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=85'},
  {title:'Mesh Banners',price:'KSh 1,100',size:'Any custom size',badge:'Outdoor',image:'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85'},
  {title:'PVC Boards',price:'KSh 1,450',size:'1220 × 2440 mm max',badge:'Rigid display',image:'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85'},
  {title:'Window Graphics',price:'KSh 1,200',size:'Any custom size',badge:'Retail favorite',image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85'},
  {title:'Wall Graphics',price:'KSh 1,300',size:'Any custom size',badge:'Interior',image:'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=900&q=85'},
  {title:'Billboards',price:'On request',size:'Site specific',badge:'Maximum reach',image:'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=85'},
  {title:'Exhibition Displays',price:'KSh 18,500',size:'3000 × 2300 mm',badge:'Full setup',image:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85'}
];

const productGrid = document.querySelector('#product-grid');
const productSelect = document.querySelector('#selected-product');

products.forEach((product, index) => {
  const priceLabel = product.price === 'On request' ? '<b>Price on request</b>' : `From <b>${product.price}</b>`;
  productGrid.insertAdjacentHTML('beforeend', `<article class="product-card reveal ${index%3===1?'delay-1':index%3===2?'delay-2':''}" data-product="${product.title}"><div class="product-image"><img src="${product.image}" alt="${product.title}" loading="lazy"><span class="product-badge">${product.badge}</span></div><div class="product-info"><h3>${product.title}</h3><p class="price">${priceLabel}</p><div class="product-actions"><button class="artwork-spec" data-product="${product.title}" data-size="${product.size}">Artwork Size</button><button class="send-art" data-product="${product.title}">Send Artwork</button></div></div></article>`);
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

const specModal=document.querySelector('#spec-modal');
const uploadModal=document.querySelector('#upload-modal');
let currentProduct='Banner Printing';
function openModal(modal){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>modal.querySelector('.modal-close').focus(),100)}
function closeModal(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('modal-open')}
function selectProduct(name){currentProduct=name;productSelect.value=name;if(productSelect.value!==name){productSelect.insertAdjacentHTML('beforeend',`<option>${name}</option>`);productSelect.value=name}}
function setSpecModalValues(spec){
  if(!specModal) return;
  const titleEl=document.querySelector('#spec-title');
  const widthEl=document.querySelector('#spec-width');
  const heightEl=document.querySelector('#spec-height');
  const bleedEl=document.querySelector('#spec-bleed');
  const safeEl=document.querySelector('#spec-safe');
  const dpiEl=document.querySelector('#spec-dpi');
  const formatEl=document.querySelector('#spec-format');
  const sizeText = spec.dataset.size || '';
  const sizeMatch = sizeText.match(/(\d+[\.,]?\d*)\s*[×xX]\s*(\d+[\.,]?\d*)/);
  if(titleEl) titleEl.textContent=currentProduct;
  if(sizeMatch){ if(widthEl) widthEl.value = sizeMatch[1].replace(',', '.'); if(heightEl) heightEl.value = sizeMatch[2].replace(',', '.'); } else { if(widthEl) widthEl.value=''; if(heightEl) heightEl.value=''; }
  if(bleedEl) bleedEl.value = bleedEl.value || 3;
  if(safeEl) safeEl.value = safeEl.value || 5;
  if(dpiEl) dpiEl.value = dpiEl.value || 300;
  if(formatEl) formatEl.value = formatEl.value || 'PDF';
}
document.addEventListener('click',e=>{
  const spec=e.target.closest('.artwork-spec');
  const upload=e.target.closest('.send-art,.open-upload');
  const service=e.target.closest('[data-service]');
  if(spec){
    currentProduct=spec.dataset.product;
    setSpecModalValues(spec);
    openModal(specModal);
  }
  if(upload||service){const name=upload?.dataset.product||service?.dataset.service;selectProduct(name);openModal(uploadModal)}
});
const specToUploadButton=document.querySelector('.spec-to-upload');
if(specToUploadButton){
  specToUploadButton.addEventListener('click',()=>{closeModal(specModal);selectProduct(currentProduct);openModal(uploadModal)});
}
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

const fileInput=document.querySelector('#file-drop input');
fileInput.addEventListener('change',()=>{document.querySelector('.file-name').textContent=[...fileInput.files].map(f=>f.name).join(', ')});

const toast=document.querySelector('.toast');
function showToast(message='Request received', subtitle='Our print team will be in touch shortly.'){
  toast.querySelector('b').textContent = message;
  toast.querySelector('span:last-child').textContent = subtitle;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),4500);
}

async function submitArtworkForm(event){
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const files = form.querySelector('input[name="artwork"]').files;
  if (!files.length) {
    showToast('Artwork needed', 'Please attach at least one artwork file before submitting.');
    return;
  }
  try {
    const response = await fetch('/api/send-artwork', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to send artwork submission.');
    }
    if (result.fallback && result.whatsappUrl) {
      const whatsappWindow = window.open(result.whatsappUrl, '_blank', 'noopener');
      if (!whatsappWindow) {
        window.location.href = result.whatsappUrl;
      }
    }
    closeModal(uploadModal);
    form.reset();
    document.querySelector('.file-name').textContent = '';
    showToast(
      result.fallback ? 'WhatsApp opened' : 'Sent successfully',
      result.fallback ? 'Direct file attachments need WhatsApp API setup.' : 'Your artwork file was sent over WhatsApp.'
    );
  } catch (error) {
    console.error('Upload submit failed:', error);
    showToast('Send failed', error.message || 'Please try again later.');
  }
}

document.querySelector('#upload-form').addEventListener('submit', submitArtworkForm);
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();e.target.reset();showToast()});

// Send spec form details to WhatsApp using the site's contact phone number
const specSendBtn = document.querySelector('.spec-send');
if(specSendBtn){
  specSendBtn.addEventListener('click',()=>{
    const width = document.querySelector('#spec-width')?.value || '';
    const height = document.querySelector('#spec-height')?.value || '';
    const bleed = document.querySelector('#spec-bleed')?.value || '';
    const safe = document.querySelector('#spec-safe')?.value || '';
    const dpi = document.querySelector('#spec-dpi')?.value || '';
    const format = document.querySelector('#spec-format')?.value || '';
    const product = currentProduct || '';
    // obtain tel from contact meta and normalize to digits
    const telEl = document.querySelector('.contact-meta a[href^="tel:"]');
    let phone = '255769604606';
    if(telEl){ phone = telEl.getAttribute('href').replace(/[^0-9]/g,''); if(phone.startsWith('0')) phone = phone.replace(/^0/,'255'); }
    const message = `Artwork request: ${product}\nDimensions: ${width} x ${height} mm\nBleed: ${bleed} mm\nSafe area: ${safe} mm\nResolution: ${dpi} dpi\nFormat: ${format}`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl,'_blank');
    closeModal(specModal);
  });
}
