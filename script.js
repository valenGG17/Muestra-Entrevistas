const Q={q1:["Muy bien","Bien","Regular","Mal"],q2:["Comunicación con docentes","Edificio y espacios","Actividades extra","Tecnología"]};
const SEED={q1:[142,168,64,26],q2:[88,97,121,94],q3:[18,41,92,143,106]};
const $=s=>document.querySelector(s);
// Encuesta
Object.entries(Q).forEach(([k,o])=>{$(`[data-q=${k}]`).innerHTML=o.map((t,i)=>`<label class="opt"><input type="radio" name="${k}" value="${i}">${t}</label>`).join("")});
$("#scale").innerHTML=[1,2,3,4,5].map(n=>`<label><input type="radio" name="q3" value="${n-1}"><span>${n}</span></label>`).join("");
let mine=null;try{mine=JSON.parse(localStorage.getItem("glew-mine")||"null")}catch(e){}
function counts(){const c={q1:[...SEED.q1],q2:[...SEED.q2],q3:[...SEED.q3]};if(mine)["q1","q2","q3"].forEach(k=>c[k][mine[k]]++);return c}
function render(thanks){const c=counts(),total=c.q1.reduce((a,b)=>a+b,0);
const block=(t,k,labels)=>{const s=c[k].reduce((a,b)=>a+b,0);return `<h3>${t}</h3>`+labels.map((l,i)=>{const p=Math.round(c[k][i]/s*100);return `<div class="bar"><div class="l"><span>${l}${mine&&mine[k]==i?" (tu voto)":""}</span><span>${p}%</span></div><div class="track"><div class="fill ${mine&&mine[k]==i?"me":""}" style="width:${p}%"></div></div></div>`}).join("")};
$("#res").innerHTML=(thanks?`<div class="thanks">¡Gracias! Tu respuesta ya suma a los resultados.</div>`:"")+`<div class="total">${total}</div><p style="margin:0 0 14px">respuestas hasta ahora</p>`+block("Cómo se sienten","q1",Q.q1)+block("Qué mejorarían","q2",Q.q2)+block("Cuánto los escuchan (1 a 5)","q3",["1","2","3","4","5"])}
render(false);
$("#sf").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),v={};
for(const k of ["q1","q2","q3"]){if(f.get(k)===null){$("#err").textContent="Falta responder la pregunta "+k.slice(1)+".";return}v[k]=+f.get(k)}
$("#err").textContent="";mine=v;try{localStorage.setItem("glew-mine",JSON.stringify(v))}catch(e){}
render(true);$("#res").scrollIntoView({behavior:"smooth",block:"nearest"})};
// Feedback
const esc=s=>s.replace(/[<>&"]/g,"");
$("#bf").onsubmit=e=>{e.preventDefault();
const n=$("#bn").value.trim(),m=$("#bm").value.trim(),t=$("#bt").value.trim();
if(!n){$("#be").textContent="Escribí tu nombre para continuar.";return}
if(!/^[^\s@]+@gmail\.com$/i.test(m)){$("#be").textContent="Ingresá un Gmail válido, por ejemplo tunombre@gmail.com.";return}
if(!t){$("#be").textContent="Escribí tu comentario para poder enviarlo.";return}
e.target.innerHTML=`<div class="thanks" role="status">¡Gracias, ${esc(n)}! Recibimos tu feedback y te respondemos por Gmail a ${esc(m)}.</div>`};
