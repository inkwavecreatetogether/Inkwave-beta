
// Inkwave Beta Web App - interactive prototype
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let drawing=false;
let strokes=[];
let current=null;

function resizeCanvas(){
  const rect = document.getElementById('canvasContainer').getBoundingClientRect();
  canvas.width = Math.min(1200, rect.width-0);
  canvas.height = Math.max(360, rect.height-0);
  redrawAll();
}
window.addEventListener('resize', resizeCanvas);

function pos(e){
  const r = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {x:(clientX - r.left)*(canvas.width/r.width), y:(clientY - r.top)*(canvas.height/r.height)};
}

canvas.addEventListener('pointerdown', (e)=>{ drawing=true; current={points:[],size:lineWidth,color:lineColor,t0:Date.now()}; const p=pos(e); current.points.push({x:p.x,y:p.y,t:0}); });
window.addEventListener('pointermove', (e)=>{ if(!drawing) return; const p=pos(e); const t=Date.now() - current.t0; current.points.push({x:p.x,y:p.y,t}); drawSegment(current); });
window.addEventListener('pointerup', ()=>{ if(!drawing) return; drawing=false; strokes.push(current); current=null; });

function drawSegment(s){
  const pts = s.points;
  if(pts.length<2) return;
  ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle=s.color; ctx.lineWidth=s.size;
  ctx.beginPath(); const a=pts[pts.length-2], b=pts[pts.length-1]; ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
}

function redrawAll(){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); strokes.forEach(s=>{ ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle=s.color; ctx.lineWidth=s.size; ctx.beginPath(); for(let i=1;i<s.points.length;i++){ ctx.moveTo(s.points[i-1].x,s.points[i-1].y); ctx.lineTo(s.points[i].x,s.points[i].y); } ctx.stroke(); }); }

document.getElementById('clearBtn').addEventListener('click', ()=>{ strokes=[]; redrawAll(); });
document.getElementById('exportBtn').addEventListener('click', ()=>{ const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download='inkwave-sketch.png'; a.click(); });

// line width and color
let lineWidth = 3; let lineColor = '#0b2b3a';
document.getElementById('size').addEventListener('input', (e)=>{ lineWidth = parseInt(e.target.value,10); document.getElementById('sizeVal').textContent=lineWidth; });
const colors = document.querySelectorAll('.color-swatch'); colors.forEach(c=> c.addEventListener('click', ()=>{ lineColor = c.getAttribute('data-color'); document.querySelectorAll('.color-swatch').forEach(s=>s.style.outline=''); c.style.outline='3px solid rgba(255,255,255,0.08)'; }));

// playback/time-lapse
let playing=false; document.getElementById('playBtn').addEventListener('click', ()=>{ if(strokes.length===0){ alert('Draw something first'); return; } playing=true; redrawAll(); let events=[]; strokes.forEach((s,si)=> s.points.forEach((p,pi)=> events.push({t:p.t + si*50, si, pi}))); events.sort((a,b)=>a.t-b.t); let i=0; let start=performance.now(); function step(now){ const elapsed = now-start; while(i<events.length && events[i].t<=elapsed){ const e=events[i]; const s=strokes[e.si]; if(e.pi>0){ const pp=s.points[e.pi-1]; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.strokeStyle=s.color; ctx.lineWidth=s.size; ctx.beginPath(); ctx.moveTo(pp.x,pp.y); ctx.lineTo(s.points[e.pi].x,s.points[e.pi].y); ctx.stroke(); } i++; } if(i<events.length && playing) requestAnimationFrame(step); } requestAnimationFrame(step); });
document.getElementById('pauseBtn').addEventListener('click', ()=>{ playing=false; });

// AI Suggest (simulated): smooth and color overlay
document.getElementById('aiBtn').addEventListener('click', ()=>{ if(strokes.length===0){ alert('Draw something first'); return; } // simulate effect
  const tcanvas = document.createElement('canvas'); tcanvas.width=canvas.width; tcanvas.height=canvas.height; const tctx = tcanvas.getContext('2d'); tctx.fillStyle='#fff'; tctx.fillRect(0,0,tcanvas.width,tcanvas.height);
  strokes.forEach(s=>{ tctx.strokeStyle='#223344'; tctx.lineWidth=s.size; tctx.lineJoin='round'; tctx.lineCap='round'; tctx.beginPath(); for(let i=1;i<s.points.length;i++){ tctx.moveTo(s.points[i-1].x,s.points[i-1].y); tctx.lineTo(s.points[i].x,s.points[i].y); } tctx.stroke(); });
  const g = tctx.createLinearGradient(0,0,tcanvas.width,tcanvas.height); g.addColorStop(0,'rgba(110,231,183,0.08)'); g.addColorStop(1,'rgba(123,211,255,0.08)'); tctx.fillStyle=g; tctx.fillRect(0,0,tcanvas.width,tcanvas.height); ctx.drawImage(tcanvas,0,0);
  document.getElementById('mockThumb').style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
});

// gallery click to open demo image
document.querySelectorAll('.gallery img').forEach(img=> img.addEventListener('click', ()=>{ const src=img.src; window.open(src,'_blank'); }));

// login modal
const modalBack = document.getElementById('modalBack');
document.getElementById('joinBtn').addEventListener('click', (e)=>{ e.preventDefault(); modalBack.style.display='flex'; document.getElementById('email').focus(); });
modalBack.addEventListener('click', (e)=>{ if(e.target===modalBack) modalBack.style.display='none'; });
document.getElementById('submitJoin').addEventListener('click', ()=>{ const email = document.getElementById('email').value.trim(); if(!email || !email.includes('@')){ document.getElementById('joinMsg').textContent='Please enter a valid email.'; return; } document.getElementById('joinMsg').textContent='Thanks! Check your inbox for the beta link (simulated).'; setTimeout(()=> modalBack.style.display='none', 1200); });

// init
resizeCanvas();
window.addEventListener('load', ()=>{ resizeCanvas(); });
