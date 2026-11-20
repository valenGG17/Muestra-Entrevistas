const $=s=>document.querySelector(s);
const BANDS={
taller:{tag:"Talleres de carpintería",qs:[
{q:"¿Qué taller de carpintería te gusta más?",o:["Hacer muebles pequeños","Tallado y decoración","Restauración de muebles","Todavía no sé"]},
{q:"¿Qué herramienta te gustaría aprender a usar mejor?",o:["Serrucho y formón","Lijadora y torno","Taladro y sierra caladora","Medición y trazado"]},
{q:"¿Qué te gustaría construir en el taller?",o:["Una silla o un banco","Una caja o un cofre","Un juguete de madera","Un estante"]},
{q:"¿Cómo te sentís trabajando en el taller?",o:["Muy seguro/a","Seguro/a, pero con dudas","Necesito más ayuda","Me da un poco de miedo"]},
{q:"¿Con quién preferís trabajar?",o:["Solo/a","En pareja","En un grupo chico","Con todo el curso"]}]},
carrera:{tag:"Tu carrera profesional",qs:[
{q:"¿Qué orientación te interesa más?",o:["Maestro mayor de obra","Programación","Técnico en reparación de computadoras","Todavía no sé"]},
{q:"¿Qué actividad te gustaría hacer más?",o:["Interpretar planos y calcular materiales","Crear una app o un sitio web","Armar y diagnosticar una PC","Coordinar un equipo en una obra"]},
{q:"¿Cómo preferís aprender?",o:["Practicando en taller o laboratorio","Con proyectos reales","Con clases teóricas","Con visitas a empresas"]},
{q:"¿Qué te gustaría hacer al terminar la secundaria?",o:["Trabajar en mi rubro","Estudiar en un terciario o la universidad","Armar mi propio emprendimiento","Todavía no lo sé"]},
{q:"¿Qué tan preparado/a te sentís para tu orientación?",o:["Muy preparado/a","Bastante","Poco","Todavía nada"]}]},
practicas:{tag:"Prácticas profesionalizantes",qs:[
{q:"¿Dónde te gustaría hacer tus prácticas?",o:["En una constructora o una obra","En una empresa de software","En un taller de reparación de computadoras","En un proyecto de la propia escuela"]},
{q:"¿Qué es lo que más te preocupa de las prácticas?",o:["No tener experiencia","Los horarios","Conseguir un lugar","Combinarlas con otras actividades"]},
{q:"¿Qué apoyo necesitás más?",o:["Que la escuela consiga el lugar","Un tutor que me acompañe","Orientación sobre qué hacer","Materiales o herramientas"]},
{q:"¿Cuánto tiempo te gustaría dedicarles?",o:["Pocas horas por semana","Medio día","Jornada completa algunos días","Un bloque intensivo"]},
{q:"¿Qué te gustaría llevarte de las prácticas?",o:["Experiencia para mi CV","Contactos del rubro","Un certificado","Saber si me gusta mi rubro"]}]}
};
const nivelDe=c=>c<=3?"taller":c<=6?"carrera":"practicas";
let S={curso:null,nivel:null,step:0,ans:{},comentario:"",nombre:"",mode:""};
const box=$("#quiz");
const total=()=>(S.nivel?BANDS[S.nivel].qs.length:5)+2;

function head(){
return `<div class="meta"><span>Paso ${S.step+1} de ${total()}</span>${S.nivel?`<span class="tag">${BANDS[S.nivel].tag}</span>`:""}</div><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total()}" aria-valuenow="${S.step+1}"><i style="width:${(S.step+1)/total()*100}%"></i></div>`}
function focusTitle(){const h=box.querySelector("h2");if(h)h.focus({preventScroll:true})}

function render(){
const qs=S.nivel?BANDS[S.nivel].qs:[];
if(S.step===0)renderCurso();
else if(S.step<=qs.length)renderQ(S.step-1);
else renderFinal();
focusTitle();
}
function renderCurso(){
box.innerHTML=head()+`<h2 tabindex="-1">¿En qué curso estás?</h2><div class="cursos">${[1,2,3,4,5,6,7].map(n=>`<button type="button" class="curso" data-c="${n}" aria-pressed="${S.curso===n}">${n}.º</button>`).join("")}</div>`;
box.querySelectorAll(".curso").forEach(b=>b.onclick=()=>{const c=+b.dataset.c,n=nivelDe(c);if(n!==S.nivel)S.ans={};S.curso=c;S.nivel=n;S.step=1;render()});
}
function renderQ(i){
const q=BANDS[S.nivel].qs[i];
box.innerHTML=head()+`<h2 id="qt" tabindex="-1">${q.q}</h2><div role="radiogroup" aria-labelledby="qt">${q.o.map((t,k)=>`<label class="opt"><input type="radio" name="o" value="${k}"${S.ans[q.q]===t?" checked":""}>${t}</label>`).join("")}</div><div class="qnav"><button type="button" class="btn alt" id="prev">Anterior</button><button type="button" class="btn" id="next"${S.ans[q.q]?"":" disabled"}>Siguiente</button></div>`;
box.querySelectorAll("input[name=o]").forEach(r=>r.onchange=()=>{S.ans[q.q]=q.o[+r.value];$("#next").disabled=false});
$("#prev").onclick=()=>{S.step--;render()};
$("#next").onclick=()=>{S.step++;render()};
}
function renderFinal(){
box.innerHTML=head()+`<h2 tabindex="-1">¿Qué te gustaría que agreguemos?</h2><p style="margin:0 0 16px;color:var(--muted)">Una idea, un taller, una herramienta o algo de la página. Tu comentario nos ayuda a decidir.</p><label class="f">Tu comentario<textarea id="com" rows="5" maxlength="600" placeholder="Me gustaría que agreguen…"></textarea></label><label class="f" style="margin-top:14px">Tu nombre (opcional)<input type="text" id="nom" maxlength="60" autocomplete="given-name"></label><div class="err" id="qe" role="alert"></div><div class="qnav"><button type="button" class="btn alt" id="prev">Anterior</button><button type="button" class="btn" id="send">Enviar respuestas</button></div>`;
$("#com").value=S.comentario;$("#nom").value=S.nombre;
$("#prev").onclick=()=>{S.comentario=$("#com").value;S.nombre=$("#nom").value;S.step--;render()};
$("#send").onclick=async()=>{
const c=$("#com").value.trim();S.comentario=c;S.nombre=$("#nom").value.trim();
if(c.length<3){$("#qe").textContent="Escribí tu comentario para poder enviar.";return}
const b=$("#send");b.disabled=true;b.textContent="Enviando…";$("#qe").textContent="";
try{S.mode=await save({curso:S.curso,nivel:S.nivel,respuestas:S.ans,comentario:c,nombre:S.nombre||null});renderDone()}
catch(e){$("#qe").textContent="No pudimos guardar tus respuestas. Revisá tu conexión e intentá de nuevo.";b.disabled=false;b.textContent="Enviar respuestas"}
};
}
async function save(p){
const url=(window.SUPABASE_URL||"").replace(/\/$/,""),key=window.SUPABASE_ANON_KEY||"";
if(!url||!key){ // Modo demostración: sin base de datos configurada
try{const a=JSON.parse(localStorage.getItem("glew-quiz")||"[]");a.push({...p,created_at:new Date().toISOString()});localStorage.setItem("glew-quiz",JSON.stringify(a))}catch(e){}
return "demo"}
const r=await fetch(url+"/rest/v1/respuestas_quiz",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(p)});
if(!r.ok)throw new Error("HTTP "+r.status);
return "ok"}
function renderDone(){
box.innerHTML=`<div class="progress"><i style="width:100%"></i></div><div class="thanks" role="status"><span id="gr"></span> Recibimos tus respuestas.</div><h2 tabindex="-1">Tus respuestas</h2><ul class="recap">${Object.entries(S.ans).map(([q,a])=>`<li><b>${q}</b><span>${a}</span></li>`).join("")}<li id="rc"><b>Tu comentario</b><span></span></li></ul>${S.mode==="demo"?`<p class="note">Modo demostración: la base de datos todavía no está configurada, así que tus respuestas quedaron solo en este navegador.</p>`:""}<div class="qnav"><a class="btn alt" href="index.html">Volver al inicio</a><button type="button" class="btn" id="again">Responder de nuevo</button></div>`;
$("#gr").textContent=S.nombre?`¡Gracias, ${S.nombre}!`:"¡Gracias!";
$("#rc span").textContent=S.comentario;
$("#again").onclick=()=>{S={curso:null,nivel:null,step:0,ans:{},comentario:"",nombre:"",mode:""};render()};
focusTitle();
}
render();
