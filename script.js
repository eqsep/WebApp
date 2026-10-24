/* ===== HIER ANPASSEN ===== */
const CONFIG = {
  SIE: "Gast",
  ICH: "Peter",
  /* E-Mail-Versand über Web3Forms: Access Key von web3forms.com (siehe README). Die Mail geht an die Adresse, mit der du den Key erstellt hast. */
  WEB3FORMS_KEY: "836b6452-38a1-4e81-9689-a315d1bfb4ca",
  /* Optional zusätzlich als Push aufs Handy (ntfy-App). Leer lassen = aus. */
  NTFY_TOPIC: "",
  /* Optional: Fallback, falls das Senden scheitert. Format: 491701234567 (ohne + und Leerzeichen) */
  WHATSAPP: ""
};
const MENU = {
  vor:   {title:"Vorspeise (der Anfang)",  opts:["☕ Kaffee","🍦 Eis","🌭 Streetfood","🚶 Spaziergang"]},
  haupt: {title:"Hauptgang (der Plan)",    opts:["🎬 Kino","⛳ Minigolf","🎳 Bowling","🧺 Picknick","🎲 Brettspiele", "🍻 Bar"]},
  dess:  {title:"Dessert (der Abschluss)", opts:["🍸 Cocktail","🌇 Sonnenuntergang","🛋️ Film bei mir","🥙 Döner um 23 Uhr"]}
};
const NO_TEXTS = ["Nein","Bist du sicher?","Wirklich?","Überleg nochmal","Es gibt Snacks","Ich hab auch Charme","Der Button hat Angst","Komm schon","Letzte Chance","Okay, ich geb auf"];
/* ========================= */

const $ = s => document.querySelector(s);
const pick = {vor:null, haupt:null, dess:null};
/* Name aus dem Link: .../WebApp/Anna (über 404.html) oder .../WebApp/?n=Anna */
{
  const q=new URLSearchParams(location.search);
  let n=(q.get("n")||q.get("name")||"").trim().slice(0,30);
  if(n){
    CONFIG.SIE=n.charAt(0).toUpperCase()+n.slice(1);
    try{history.replaceState(null,"",location.pathname.replace(/[^/]*$/,"")+encodeURIComponent(n))}catch(e){}
  }
}
document.querySelectorAll(".sie").forEach(e => e.textContent = CONFIG.SIE);
document.querySelectorAll(".ich").forEach(e => e.textContent = CONFIG.ICH);
document.title = "Eine Frage an " + CONFIG.SIE;

function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("on",s.id===id));window.scrollTo(0,0)}

/* Eigene Rad-Optionen merken (falls Speicher verfügbar) */
try{const x=JSON.parse(localStorage.getItem("dm_own")||"[]");if(Array.isArray(x))MENU.haupt.opts.push(...x.filter(o=>!MENU.haupt.opts.includes(o)))}catch(e){}

/* ---- Konfetti ---- */
function confetti(){
  const set=["🎉","💖","✨","🍕","🥳","🍦"];
  for(let i=0;i<40;i++){
    const s=document.createElement("span");s.className="conf";s.textContent=set[i%set.length];
    s.style.left=Math.random()*100+"vw";s.style.animationDuration=2.4+Math.random()*2+"s";s.style.animationDelay=Math.random()*.8+"s";
    document.body.appendChild(s);setTimeout(()=>s.remove(),5500);
  }
}

/* ---- 1. Einladung ---- */
let tries=0;
const yes=$("#yes"), no=$("#no");
function accept(){confetti();show("menu")}
yes.onclick=accept;
function dodge(e){
  if(e&&e.cancelable)e.preventDefault();
  tries++;
  if(tries>=NO_TEXTS.length-1){no.textContent="Okay, ich sag Ja 🙄";no.className="yes";no.style.cssText="";no.onclick=accept;no.onpointerenter=no.onpointerdown=no.ontouchstart=null;return}
  no.textContent=NO_TEXTS[tries];
  yes.style.fontSize=Math.min(1.15+tries*.12,2.3)+"rem";
  no.style.fontSize=Math.max(1-tries*.05,.6)+"rem";
  if(tries>=2){
    no.classList.add("run");
    const w=no.offsetWidth,h=no.offsetHeight;
    no.style.left=8+Math.random()*Math.max(10,innerWidth-w-16)+"px";
    no.style.top=8+Math.random()*Math.max(10,innerHeight-h-16)+"px";
  }
}
no.onpointerenter=dodge; no.onpointerdown=dodge; no.ontouchstart=dodge; no.onclick=dodge;

/* ---- 2. Menü ---- */
function renderCourses(){
  const box=$("#courses");box.innerHTML="";
  for(const k in MENU){
    const h=document.createElement("h2");h.textContent=MENU[k].title;box.appendChild(h);
    const g=document.createElement("div");g.className="cards";g.id="g_"+k;
    MENU[k].opts.forEach(o=>{
      const b=document.createElement("button");b.className="card";b.textContent=o;
      b.setAttribute("aria-pressed",pick[k]===o);
      b.onclick=()=>choose(k,o);g.appendChild(b);
    });
    box.appendChild(g);
    const j=document.createElement("button");j.className="joker";j.textContent="🎲 Überrasch mich";
    j.onclick=()=>choose(k,MENU[k].opts[Math.floor(Math.random()*MENU[k].opts.length)]);
    box.appendChild(j);
  }
}
function choose(k,o){pick[k]=o;renderCourses()}
renderCourses();
const d=$("#d");
{const n=new Date(Date.now()+86400000);d.min=n.toISOString().slice(0,10)}

$("#tobill").onclick=()=>{
  const miss=[];
  if(!pick.vor)miss.push("Vorspeise");if(!pick.haupt)miss.push("Hauptgang");if(!pick.dess)miss.push("Dessert");
  if(!d.value)miss.push("Tag");if(!$("#t").value)miss.push("Uhrzeit");
  $("#err").textContent=miss.length?"Noch offen: "+miss.join(", ")+". Der Kellner wartet.":"";
  if(!miss.length){buildBill();show("billscreen")}
};

/* ---- 3. Rechnung & Senden ---- */
function when(){
  const dt=new Date(d.value+"T12:00:00");
  return dt.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})+", "+$("#t").value+" Uhr";
}
function buildBill(){
  const rows=[["Vorspeise",pick.vor],["Hauptgang",pick.haupt],["Dessert",pick.dess],["Termin",when()]];
  const wish=$("#wish").value.trim();if(wish)rows.push(["Sonderwunsch",wish]);
  $("#bill").innerHTML="<h2>Chez "+esc(CONFIG.ICH)+"</h2>"+rows.map(r=>"<div><span>"+r[0]+"</span><span>"+esc(r[1])+"</span></div>").join("")+
    "<div><span>Trinkgeld</span><span>ein Lächeln reicht</span></div><div class='tot'><span>Gesamt</span><span>unbezahlbar</span></div>";
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#back").onclick=()=>show("menu");
$("#send").onclick=async()=>{
  const btn=$("#send"),err=$("#senderr");btn.disabled=true;btn.textContent="Wird serviert …";err.innerHTML="";
  const wish=$("#wish").value.trim();
  const text=CONFIG.SIE+" hat bestellt:\nVorspeise: "+pick.vor+"\nHauptgang: "+pick.haupt+"\nDessert: "+pick.dess+"\nWann: "+when()+(wish?"\nSonderwunsch: "+wish:"");
  const jobs=[];
  if(CONFIG.WEB3FORMS_KEY&&!CONFIG.WEB3FORMS_KEY.startsWith("HIER")){
    jobs.push(fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},
      body:JSON.stringify({access_key:CONFIG.WEB3FORMS_KEY,subject:"Date-Bestellung von "+CONFIG.SIE,from_name:CONFIG.SIE,
        Vorspeise:pick.vor,Hauptgang:pick.haupt,Dessert:pick.dess,Termin:when(),Sonderwunsch:wish||"-"})
    }).then(async r=>{const j=await r.json();if(!r.ok||!j.success)throw new Error(j.message||r.status)}));
  }
  if(CONFIG.NTFY_TOPIC){
    jobs.push(fetch("https://ntfy.sh/"+encodeURIComponent(CONFIG.NTFY_TOPIC),{method:"POST",body:text,headers:{Title:"Date-Bestellung eingegangen",Tags:"heart",Priority:"high"}})
      .then(r=>{if(!r.ok)throw new Error(r.status)}));
  }
  try{
    if(!jobs.length)throw new Error("Kein Versandweg konfiguriert");
    const res=await Promise.allSettled(jobs);
    console.log("Versand-Ergebnis:",res);if(!res.some(x=>x.status==="fulfilled"))throw res[0].reason;
    confetti();show("done");
  }catch(e){
    btn.disabled=false;btn.textContent="Nochmal versuchen";
    console.error("Senden fehlgeschlagen:",e);err.textContent="Die Bestellung ist leider nicht angekommen. Bitte nochmal tippen. (Grund: "+((e&&e.message)||e)+")";
    if(CONFIG.WHATSAPP){const a=document.createElement("a");a.href="https://wa.me/"+CONFIG.WHATSAPP+"?text="+encodeURIComponent(text);a.textContent=" Oder direkt per WhatsApp schicken.";a.style.color="#fff";err.appendChild(a)}
  }
};

/* ---- 4. Glücksrad ---- */
const cv=$("#wheel"),cx=cv.getContext("2d"),COL=["#ff4f8b","#ffe66d","#7ee8c7","#8f6bff","#ff9a5c"];
let rot=0,winner=null,vetoLeft=1,spinning=false;
function drawWheel(){
  const o=MENU.haupt.opts,n=o.length,seg=2*Math.PI/n,R=320;
  cx.clearRect(0,0,640,640);
  o.forEach((t,i)=>{
    const a=i*seg-Math.PI/2;
    cx.beginPath();cx.moveTo(R,R);cx.arc(R,R,R,a,a+seg);cx.closePath();
    cx.fillStyle=COL[i%COL.length];cx.fill();cx.strokeStyle="#1a0a22";cx.lineWidth=4;cx.stroke();
    cx.save();cx.translate(R,R);cx.rotate(a+seg/2);cx.fillStyle="#1a0a22";cx.textAlign="right";cx.textBaseline="middle";
    cx.font="800 28px system-ui,sans-serif";cx.fillText(t.length>16?t.slice(0,15)+"…":t,R-26,0);cx.restore();
  });
}
function spin(){
  if(spinning)return;spinning=true;
  $("#spin").disabled=$("#veto").disabled=$("#take").disabled=true;$("#res").textContent="…";
  const n=MENU.haupt.opts.length,segDeg=360/n;
  winner=Math.floor(Math.random()*n);                 /* erst Gewinner wählen … */
  const target=(360-(winner+.5)*segDeg)%360;          /* … dann Winkel berechnen */
  rot+=360*5+((target-rot%360)+360)%360;
  cv.style.transform="rotate("+rot+"deg)";
  setTimeout(()=>{
    spinning=false;$("#res").textContent=MENU.haupt.opts[winner];
    $("#spin").disabled=true;$("#take").disabled=false;$("#veto").disabled=vetoLeft<=0;confetti();
  },4300);
}
$("#openwheel").onclick=()=>{drawWheel();vetoLeft=1;$("#veto").disabled=true;$("#take").disabled=true;$("#spin").disabled=false;$("#res").textContent="";$("#wheelbox").classList.add("on")};
$("#spin").onclick=spin;
$("#veto").onclick=()=>{vetoLeft--;spin()};
$("#take").onclick=()=>{choose("haupt",MENU.haupt.opts[winner]);$("#wheelbox").classList.remove("on")};
$("#closew").onclick=()=>$("#wheelbox").classList.remove("on");
$("#addown").onclick=()=>{
  const v=$("#own").value.trim();if(!v||MENU.haupt.opts.includes(v)||spinning)return;
  MENU.haupt.opts.push(v);$("#own").value="";drawWheel();renderCourses();
  try{const own=JSON.parse(localStorage.getItem("dm_own")||"[]");own.push(v);localStorage.setItem("dm_own",JSON.stringify(own))}catch(e){}
  $("#spin").disabled=false;
};
