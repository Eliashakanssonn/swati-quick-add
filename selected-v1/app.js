// Design fixture only. Prices and catalogue are snapshots; no cart API is called.
const $ = s => document.querySelector(s);
const shades = [
  ['jade','Jade Green','green-jade'],['aquamarine','Aquamarine Blue','blue-aquamarine'],
  ['honey','Honey Hazel Brown','hazel-brown-honey'],['graphite','Graphite Dark Grey','dark-grey-graphite'],
  ['bronze','Bronze Dark Brown','dark-brown-bronze'],['pearl','Pearl Grey','grey-pearl'],
  ['sandstone','Sandstone Brown','brown-sandstone'],['sapphire','Sapphire Dark Blue','dark-blue-sapphire'],
  ['turquoise','Turquoise Grey Blue','blue-green-turquoise'],['amber','Amber Brown','amber'],
  ['emerald','Emerald Dark Green','emerald'],['olivine','Olivine Green Brown','olivine']
];
const durations = [
  {name:'1-Day',pairs:5,price:31900,compare:39900},
  {name:'1-Month',pairs:1,price:34300,compare:42900},
  {name:'6-Months',pairs:1,price:47900,compare:59900}
];
const powers = ['0.00',...Array.from({length:23},(_,i)=>(-.5-i*.25).toFixed(2))];
let state, opener, count=0;
const money = cents => `${new Intl.NumberFormat('en-SE',{maximumFractionDigits:2}).format(cents/100)} kr`;
const packs = () => state.qty * (state.dual ? 2 : 1);
const product = () => shades.find(s=>s[0]===state.shade);
const packText = () => {const n=packs(), pairs=n*durations[state.duration].pairs;return `${n} ${n===1?'pack':'packs'} · ${pairs} ${pairs===1?'pair':'pairs'}`};
const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
$('#grid').innerHTML = shades.slice(0,4).map((s,i)=>`<article class="card"><button class="photo-button" data-open="${s[0]}" aria-label="Quick buy ${s[1]}" aria-haspopup="dialog"><img src="${i===0?'../plus-designs/assets/jade-eye.webp':`../assets/${s[0]}.png`}" alt="${s[1]} lenses on an eye"><span class="badges" aria-hidden="true"><span class="badge">SAVE 20%</span>${i===0?'<span class="badge ink">BESTSELLER</span>':''}</span><span class="quick-pill" aria-hidden="true"><span class="quick-label">Quick buy</span><span class="quick-icon">${icon}</span></span></button><div class="card-meta"><div><span class="card-name">${s[1]}</span><p>For Daily Use (5 Pairs)</p></div><span class="card-price">319 kr<s>399 kr</s></span></div><a class="shop-now" href="https://www.swati.com/products/${s[2]}-daily-lenses">SHOP NOW</a></article>`).join('');
for (const id of ['power','left','right']) {
  $('#'+id).innerHTML='<option value="">Select eye power</option>'+powers.map(v=>`<option value="${v}">${v==='0.00'?'0.00 · No correction':v}</option>`).join('');
  $('#'+id).onchange=e=>{state[id]=e.target.value;clearError();update()};
}
function clearError(){ $('#error').hidden=true;for(const id of ['power','left','right'])$('#'+id).removeAttribute('aria-invalid') }
function update(){
  const s=product(), d=durations[state.duration];
  $('#qtitle').textContent=s[1];$('#subline').textContent=`${d.name} · ${d.pairs} ${d.pairs===1?'pair':'pairs'} per pack`;
  $('#unitprice').textContent=money(d.price);$('#compare').textContent=money(d.compare);
  const half=shades.indexOf(s)<9;
  $('#largeimage').src=`../assets/${s[0]}${half?'-half-face.jpg':'.png'}`;
  $('#largeimage').alt=`${s[1]} ${half?'half-face photograph':'lens colour'}`;
  $('#largeimage').style.objectFit=half?'cover':'contain';
  $('#smallimage').src=`../assets/${s[0]}.png`;
  $('#shade').innerHTML=shades.filter((_,i)=>state.duration!==0||i<9).map(s=>`<option value="${s[0]}">${s[1]}</option>`).join('');
  $('#shade').value=state.shade;$('#duration').value=state.duration;
  $('#dual').checked=state.dual;$('#dualfields').hidden=!state.dual;$('#single-power').hidden=state.dual;
  for (const id of ['power','left','right']) {$('#'+id).value=state[id];$('#'+id).dataset.empty=state[id]===''}
  $('#qty').textContent=state.qty;$('#minus').disabled=state.qty===1;
  $('#qtylabel').textContent=state.dual?'Quantity per eye power':'Quantity';
  $('#qtyhelp').textContent=packText();$('#summary').textContent=packText();$('#total').textContent=money(d.price*packs());
}
function open(shade,el){
  opener=el;state={shade,duration:0,power:'',left:'',right:'',dual:false,qty:1};clearError();update();
  $('#quick').showModal();document.body.classList.add('modal-open');$('.selector-scroll').scrollTop=0;$('#quick .close').focus();
}
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open,b));
$('#shade').onchange=e=>{state.shade=e.target.value;state.power=state.left=state.right='';clearError();update()};
$('#duration').onchange=e=>{state.duration=Number(e.target.value);if(state.duration===0&&shades.indexOf(product())>8)state.shade='jade';state.power=state.left=state.right='';clearError();update()};
$('#dual').onchange=e=>{state.dual=e.target.checked;clearError();update()};
$('#plus').onclick=()=>{state.qty++;update()};$('#minus').onclick=()=>{state.qty=Math.max(1,state.qty-1);update()};
for(const d of document.querySelectorAll('dialog')){
  d.querySelector('.close').onclick=()=>d.close();
  d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close()});
  d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')){document.body.classList.remove('modal-open');opener?.focus()}});
}
$('#add').onclick=()=>{
  const missing=(state.dual?['left','right']:['power']).filter(id=>state[id]==='');
  if(missing.length){$('#error').textContent=state.dual?'Choose an eye power for each eye.':'Please choose your eye power.';$('#error').hidden=false;missing.forEach(id=>$('#'+id).setAttribute('aria-invalid','true'));$('#'+missing[0]).focus();return}
  count+=packs();$('#count').textContent=count;
  $('#receipt').replaceChildren();
  for(const text of [product()[1],`${durations[state.duration].name} · ${packText()}`,state.dual?`Left ${state.left} / Right ${state.right}`:`Eye power ${state.power}`,money(durations[state.duration].price*packs())]){const p=document.createElement('p');p.textContent=text;$('#receipt').append(p)}
  $('#quick').close();$('#success').showModal();$('#continue').focus();
};
$('#continue').onclick=()=>$('#success').close();
const qs=new URLSearchParams(location.search);
if(qs.has('artboard'))document.body.classList.add('artboard');
if(qs.has('open')){open('jade',$('[data-open]'));if(qs.get('state')==='dual'){state.dual=true;state.left='-1.00';state.right='-1.50';update()}}
