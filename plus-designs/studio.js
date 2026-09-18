const designs=[...document.querySelectorAll('.design')];
const allPreview=document.querySelector('#preview-all');
function refreshPreviewButtons(){for(const d of designs){const b=d.querySelector('.preview-one');b.setAttribute('aria-pressed',String(d.classList.contains('demo-hover')));b.innerHTML=d.classList.contains('demo-hover')?'Reset preview <span>↙</span>':'Preview hover <span>↗</span>'}const all=designs.every(d=>d.classList.contains('demo-hover'));allPreview.setAttribute('aria-pressed',String(all));allPreview.innerHTML=`<span class="preview-dot"></span>${all?'Reset all previews':'Preview all hovers'}`}
allPreview.addEventListener('click',()=>{const next=!designs.every(d=>d.classList.contains('demo-hover'));designs.forEach(d=>d.classList.toggle('demo-hover',next));refreshPreviewButtons()});
document.querySelectorAll('.preview-one').forEach(b=>b.addEventListener('click',()=>{b.closest('.design').classList.toggle('demo-hover');refreshPreviewButtons()}));
// Do not leave a demonstration hover forced on while using the actual selector.
document.querySelectorAll('.lens-photo .quick-trigger').forEach(b=>b.addEventListener('click',()=>{b.closest('.design').classList.remove('demo-hover');refreshPreviewButtons()}));
