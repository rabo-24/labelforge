import { useState, useRef } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0b1120",surface:"#111827",card:"#162032",border:"#1f3050",
  accent:"#6366f1",accentHover:"#818cf8",success:"#10b981",warn:"#f59e0b",
  danger:"#ef4444",text:"#f1f5f9",muted:"#6b7fa3",faint:"#0f1c2e",
};
const DC = {"RL / RLHF":"#be185d","Code":"#4ade80","Audio":"#38bdf8","Video":"#a78bfa","Function Calling":"#fbbf24","Enterprise Workflow":"#34d399","STEM":"#60a5fa"};

// ── ATOMS ─────────────────────────────────────────────────────────────────────
const Tag=({label,color,xs})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,fontSize:xs?9:10,fontWeight:700,padding:xs?"1px 5px":"2px 8px",whiteSpace:"nowrap"}}>{label}</span>;
const Bar=({pct,color=C.accent,h=5})=><div style={{background:C.border,borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(pct,100)}%`,background:color,height:"100%",borderRadius:99,transition:"width .4s"}}/></div>;
const Card=({children,style={}})=><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,...style}}>{children}</div>;
const Kpi=({label,value,sub,color=C.accent,icon})=><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",flex:"1 1 110px"}}>{icon&&<div style={{fontSize:20,marginBottom:4}}>{icon}</div>}<div style={{fontSize:22,fontWeight:800,color}}>{value}</div><div style={{fontSize:12,fontWeight:600,color:C.text,marginTop:2}}>{label}</div>{sub&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}</div>;
const Btn=({children,onClick,color=C.accent,outline,sm,disabled,full})=><button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":disabled?C.border:color,color:outline?color:disabled?C.muted:"#fff",border:`1.5px solid ${disabled?C.border:color}`,borderRadius:7,padding:sm?"5px 12px":"9px 18px",fontSize:sm?11:12,fontWeight:700,cursor:disabled?"default":"pointer",width:full?"100%":"auto",opacity:disabled?.5:1,transition:"all .15s"}}>{children}</button>;
const SecTitle=({children,color=C.muted})=><div style={{color,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{children}</div>;
const NavBtn=({icon,label,active,onClick,badge})=><button onClick={onClick} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:active?C.accent+"22":"transparent",border:active?`1px solid ${C.accent}55`:"1px solid transparent",borderRadius:7,padding:"8px 12px",color:active?C.accentHover:C.muted,cursor:"pointer",fontSize:12,fontWeight:active?700:400,textAlign:"left"}}><span style={{fontSize:14}}>{icon}</span><span style={{flex:1}}>{label}</span>{badge&&<span style={{background:C.danger,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,padding:"1px 6px"}}>{badge}</span>}</button>;
const Input=({placeholder,value,onChange,type="text"})=><input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",color:C.text,fontSize:12,boxSizing:"border-box",outline:"none"}}/>;
const Textarea=({placeholder,value,onChange,rows=4})=><textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 12px",color:C.text,fontSize:12,boxSizing:"border-box",outline:"none",resize:"vertical"}}/>;

// ── ROLES ─────────────────────────────────────────────────────────────────────
const ROLES=[
  {id:"exec",label:"Executive",icon:"👔",color:"#6366f1",desc:"Strategic KPIs, revenue, and portfolio health",nav:["delivery","training"],defaultView:"delivery"},
  {id:"deliveryhead",label:"Delivery Head",icon:"🎯",color:"#be185d",desc:"End-to-end delivery performance across all projects",nav:["delivery","workflow","qa","talent"],defaultView:"delivery"},
  {id:"spl",label:"Strategic Project Lead",icon:"🗂️",color:"#f59e0b",desc:"Manage specific projects from initiation to delivery",nav:["delivery","workflow","new-project","qa"],defaultView:"delivery"},
  {id:"teamlead",label:"Team Lead",icon:"👥",color:"#34d399",desc:"Oversee annotators, tasks, and quality for your team",nav:["delivery","workbench","qa","talent","training"],defaultView:"delivery"},
  {id:"annotator",label:"Annotator",icon:"✏️",color:"#38bdf8",desc:"Label tasks in your assigned domain",nav:["workbench","my-tasks","my-earnings","training"],defaultView:"workbench"},
  {id:"qa",label:"QA Reviewer",icon:"🔍",color:"#f59e0b",desc:"Review, approve, and adjudicate annotations",nav:["qa","qa-tasks"],defaultView:"qa"},
  {id:"client",label:"Client",icon:"🤝",color:"#34d399",desc:"Track project progress and download deliveries",nav:["client-dash","client-delivery"],defaultView:"client-dash"},
  {id:"admin",label:"Platform Admin",icon:"⚙️",color:"#be185d",desc:"Full access — manage all modules",nav:["delivery","workflow","new-project","workbench","qa","qa-tasks","talent","training","role-manager","client-dash","client-delivery"],defaultView:"delivery"},
];
const NAV_META={
  "delivery":{icon:"📊",label:"Delivery Dashboard",group:"ANALYTICS"},
  "workflow":{icon:"🔄",label:"Project Workflow",group:"PROJECTS"},
  "new-project":{icon:"➕",label:"New Project",group:"PROJECTS"},
  "workbench":{icon:"✏️",label:"Workbench",group:"WORK"},
  "my-tasks":{icon:"📋",label:"My Tasks",group:"WORK"},
  "my-earnings":{icon:"💳",label:"My Earnings",group:"WORK"},
  "training":{icon:"🎓",label:"Training",group:"LEARNING"},
  "qa":{icon:"✅",label:"QA Overview",group:"QUALITY"},
  "qa-tasks":{icon:"🔍",label:"QA Tasks",group:"QUALITY",badge:5},
  "talent":{icon:"👥",label:"Talent Hub",group:"WORKFORCE"},
  "client-dash":{icon:"📊",label:"Overview",group:"PROJECT"},
  "client-delivery":{icon:"📦",label:"Delivery",group:"PROJECT"},
  "role-manager":{icon:"🔐",label:"Role Manager",group:"ADMIN"},
};

// ── PROJECTS DATA ─────────────────────────────────────────────────────────────
const PROJECTS=[
  {id:1,name:"GPT-5 RLHF Batch 12",domain:"RL / RLHF",status:"active",tasks:1240,done:870,due:"Mar 3",priority:"high",revenue:124000,client:"OpenModel AI"},
  {id:2,name:"CodeLlama Bug Labels",domain:"Code",status:"active",tasks:640,done:210,due:"Mar 7",priority:"med",revenue:64000,client:"Meta Research"},
  {id:3,name:"Earnings Call Audio",domain:"Audio",status:"review",tasks:320,done:320,due:"Feb 28",priority:"high",revenue:48000,client:"FinanceAI Corp"},
  {id:4,name:"Surgical Video Seg.",domain:"Video",status:"active",tasks:180,done:44,due:"Mar 15",priority:"med",revenue:72000,client:"MedVision"},
  {id:5,name:"Tool-Use Chain Eval",domain:"Function Calling",status:"active",tasks:900,done:560,due:"Mar 5",priority:"high",revenue:90000,client:"DeepMind"},
  {id:6,name:"Contract NER 2026",domain:"Enterprise Workflow",status:"draft",tasks:400,done:0,due:"Mar 20",priority:"low",revenue:40000,client:"LegalAI"},
  {id:7,name:"SAT Math Grading",domain:"STEM",status:"review",tasks:750,done:750,due:"Feb 25",priority:"med",revenue:60000,client:"EduTech"},
];

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function Login({onLogin}){
  const [sel,setSel]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:600}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:54,height:54,background:C.accent,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px"}}>✦</div>
          <h1 style={{color:C.text,fontSize:26,fontWeight:800,margin:"0 0 6px"}}>LabelForge</h1>
          <p style={{color:C.muted,fontSize:13,margin:0}}>Select your role to continue</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {ROLES.map(r=>(
            <div key={r.id} onClick={()=>setSel(r.id)} style={{background:sel===r.id?r.color+"22":C.card,border:`2px solid ${sel===r.id?r.color:C.border}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}>
              <div style={{width:40,height:40,borderRadius:10,background:r.color+"22",border:`1.5px solid ${r.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1}}><div style={{color:sel===r.id?r.color:C.text,fontWeight:700,fontSize:13}}>{r.label}</div><div style={{color:C.muted,fontSize:10,marginTop:1}}>{r.desc}</div></div>
              {sel===r.id&&<div style={{width:18,height:18,borderRadius:"50%",background:r.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:800}}>✓</div>}
            </div>
          ))}
        </div>
        <Btn full onClick={()=>sel&&onLogin(sel)} disabled={!sel} color={C.accent}>{sel?`Enter as ${ROLES.find(r=>r.id===sel)?.label} →`:"Select a role to continue"}</Btn>
        <p style={{textAlign:"center",color:C.muted,fontSize:10,marginTop:10}}>Demo mode · no authentication required</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DELIVERY DASHBOARD — multi-persona
// ══════════════════════════════════════════════════════════════════════════════
function DeliveryDashboard({role,setView,setActiveProject}){
  const [persona,setPersona]=useState(role==="exec"?"exec":role==="deliveryhead"?"deliveryhead":role==="spl"?"spl":role==="teamlead"?"teamlead":"exec");
  const personas=["exec","deliveryhead","spl","teamlead"];
  const personaMeta={exec:{label:"Executive View",color:"#6366f1",icon:"👔"},deliveryhead:{label:"Delivery Head View",color:"#be185d",icon:"🎯"},spl:{label:"SPL View",color:"#f59e0b",icon:"🗂️"},teamlead:{label:"Team Lead View",color:"#34d399",icon:"👥"}};
  const total=PROJECTS.reduce((s,p)=>s+p.tasks,0);
  const done=PROJECTS.reduce((s,p)=>s+p.done,0);
  const revenue=PROJECTS.reduce((s,p)=>s+p.revenue,0);
  const pm=personaMeta[persona];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Delivery Dashboard</h2><p style={{color:C.muted,margin:"2px 0 0",fontSize:12}}>Feb 27 2026 · Real-time</p></div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {personas.map(p=><button key={p} onClick={()=>setPersona(p)} style={{background:persona===p?personaMeta[p].color+"33":"transparent",border:`1.5px solid ${persona===p?personaMeta[p].color:C.border}`,borderRadius:8,padding:"6px 12px",color:persona===p?personaMeta[p].color:C.muted,cursor:"pointer",fontSize:11,fontWeight:persona===p?700:400,display:"flex",alignItems:"center",gap:5}}><span>{personaMeta[p].icon}</span>{personaMeta[p].label.replace(" View","")}</button>)}
        </div>
      </div>

      {/* EXEC */}
      {persona==="exec"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
          <Kpi icon="💰" label="Portfolio Revenue" value={`$${(revenue/1000).toFixed(0)}k`} sub="Active projects" color={C.success}/>
          <Kpi icon="📦" label="Projects Active" value={PROJECTS.filter(p=>p.status==="active").length} sub="2 at risk" color={pm.color}/>
          <Kpi icon="✅" label="On-Time Rate" value="94%" sub="Last 30 days" color={C.success}/>
          <Kpi icon="⭐" label="Avg Quality Score" value="93.8%" sub="IAA & Gold Pass" color={C.accent}/>
          <Kpi icon="👥" label="Workforce Utilisation" value="87%" sub="248 annotators" color={C.warn}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card><SecTitle>Revenue by Domain</SecTitle>{Object.entries(DC).map(([d,c])=>{const rev=PROJECTS.filter(p=>p.domain===d).reduce((s,p)=>s+p.revenue,0);return rev>0&&(<div key={d} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><Tag label={d} color={c}/><span style={{color:C.text,fontSize:12,fontWeight:700}}>${(rev/1000).toFixed(0)}k</span></div><Bar pct={rev/revenue*100} color={c}/></div>);})}
          </Card>
          <Card><SecTitle>Portfolio Health</SecTitle>{PROJECTS.map(p=>{const pct=Math.round(p.done/p.tasks*100);const dc=DC[p.domain];return(<div key={p.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.text,fontSize:11,fontWeight:500}}>{p.name}</span><span style={{color:pct>70?C.success:pct>40?C.warn:C.danger,fontSize:11,fontWeight:700}}>{pct}%</span></div><Bar pct={pct} color={dc}/></div>);})}</Card>
        </div>
        <Card><SecTitle>Delivery Trend — Tasks Completed (mock weekly)</SecTitle>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80}}>
            {[420,510,490,630,580,720,870].map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:9,color:C.muted}}>{v}</span><div style={{width:"100%",background:C.accent,borderRadius:"3px 3px 0 0",height:`${(v/870)*70}px`}}/><span style={{fontSize:9,color:C.muted}}>{["W1","W2","W3","W4","W5","W6","W7"][i]}</span></div>)}
          </div>
        </Card>
      </>}

      {/* DELIVERY HEAD */}
      {persona==="deliveryhead"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
          <Kpi label="Tasks Completed" value={done.toLocaleString()} sub={`of ${total.toLocaleString()} total`} color={C.success}/>
          <Kpi label="SLA Risk" value="2" sub="Projects behind schedule" color={C.danger}/>
          <Kpi label="QA Disputed" value="38" sub="Awaiting resolution" color={C.warn}/>
          <Kpi label="Throughput/Day" value="1,240" sub="Avg last 7 days" color={C.accent}/>
        </div>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:C.text,fontWeight:700,fontSize:13}}>Project Pipeline</span><Btn sm onClick={()=>setView("new-project")}>+ New Project</Btn></div>
          {PROJECTS.map(p=>{const pct=Math.round(p.done/p.tasks*100);const dc=DC[p.domain];const risk=pct<30&&p.status==="active";return(<div key={p.id} onClick={()=>{setActiveProject(p);setView("project-detail");}} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.surface} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {risk&&<span title="At Risk" style={{fontSize:14}}>⚠️</span>}
            <div style={{width:8,height:8,borderRadius:"50%",background:dc,flexShrink:0}}/>
            <div style={{flex:2,minWidth:120}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{p.name}</div><div style={{color:C.muted,fontSize:10}}>{p.client} · Due {p.due}</div></div>
            <div style={{flex:2,minWidth:100}}><Bar pct={pct} color={dc}/><div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{color:C.muted,fontSize:9}}>{p.done}/{p.tasks}</span><span style={{color:C.text,fontSize:9,fontWeight:700}}>{pct}%</span></div></div>
            <Tag label={p.priority} color={p.priority==="high"?C.danger:p.priority==="med"?C.warn:C.muted}/>
            <Tag label={p.status} color={p.status==="active"?C.success:p.status==="review"?C.warn:C.muted}/>
            <span style={{color:C.muted}}>›</span>
          </div>);})}
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card><SecTitle>Bottleneck Analysis</SecTitle>{[["Task dispatch lag","2.1 hrs avg",C.warn],["QA backlog","38 tasks",C.danger],["Annotator utilisation","87%",C.success],["Pre-label accuracy","84%",C.warn]].map(([k,v,c])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{color:C.text,fontSize:12}}>{k}</span><span style={{color:c,fontWeight:700,fontSize:12}}>{v}</span></div>)}</Card>
          <Card><SecTitle>Team Capacity</SecTitle>{[["Annotators active","18 / 248",C.success],["QA reviewers","4 / 12",C.warn],["Senior QA","2 / 6",C.success],["Spare capacity","13%",C.muted]].map(([k,v,c])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{color:C.text,fontSize:12}}>{k}</span><span style={{color:c,fontWeight:700,fontSize:12}}>{v}</span></div>)}</Card>
        </div>
      </>}

      {/* SPL */}
      {persona==="spl"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
          <Kpi label="My Projects" value="3" sub="Active" color={pm.color}/>
          <Kpi label="Tasks This Week" value="4,230" color={C.accent}/>
          <Kpi label="On-Time" value="2/3" sub="Projects" color={C.warn}/>
          <Kpi label="Client NPS" value="8.4" sub="Avg this quarter" color={C.success}/>
        </div>
        {PROJECTS.filter(p=>["active","review"].includes(p.status)).map(p=>{
          const pct=Math.round(p.done/p.tasks*100);const dc=DC[p.domain];
          return(<Card key={p.id} style={{borderColor:dc+"33"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
              <div><div style={{color:C.text,fontWeight:700,fontSize:14}}>{p.name}</div><div style={{color:C.muted,fontSize:11}}>{p.client} · {p.domain} · Due {p.due} 2026</div></div>
              <div style={{display:"flex",gap:6}}><Tag label={p.status} color={p.status==="active"?C.success:C.warn}/><Tag label={`${pct}%`} color={dc}/></div>
            </div>
            <Bar pct={pct} color={dc} h={8}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:12}}>
              {[["Tasks Done",`${p.done}/${p.tasks}`,C.success],["QA Score","93.4%",C.accent],["Revenue",`$${(p.revenue/1000).toFixed(0)}k`,C.warn]].map(([l,v,c])=><div key={l} style={{background:C.faint,borderRadius:8,padding:"8px 10px"}}><div style={{color:C.muted,fontSize:10}}>{l}</div><div style={{color:c,fontWeight:700,fontSize:14}}>{v}</div></div>)}
            </div>
          </Card>);
        })}
      </>}

      {/* TEAM LEAD */}
      {persona==="teamlead"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
          <Kpi label="Team Size" value="14" sub="Annotators" color={pm.color}/>
          <Kpi label="Tasks Today" value="312" sub="Team total" color={C.accent}/>
          <Kpi label="Team Accuracy" value="96.8%" color={C.success}/>
          <Kpi label="Flagged Tasks" value="7" sub="Need attention" color={C.danger}/>
        </div>
        <Card><SecTitle>Annotator Performance</SecTitle>
          {[{n:"Aisha K.",tasks:42,acc:98.2,online:true},{n:"Miguel R.",tasks:38,acc:97.5,online:true},{n:"Jordan T.",tasks:12,acc:81.0,online:true,flag:true},{n:"Priya S.",tasks:55,acc:99.1,online:false},{n:"Chen W.",tasks:28,acc:84.2,online:true,flag:true}].map(w=>(
            <div key={w.n} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid ${C.border}22`}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.accent+"33",border:`1.5px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.accent,fontWeight:700}}>{w.n[0]}</div>
              <div style={{flex:2,color:C.text,fontSize:12,fontWeight:600}}>{w.n}{w.flag&&<span style={{marginLeft:6,fontSize:12}}>⚠️</span>}</div>
              <div style={{width:80}}><Bar pct={w.acc} color={w.acc>95?C.success:w.acc>88?C.warn:C.danger}/><span style={{fontSize:9,color:C.muted}}>{w.acc}% acc</span></div>
              <Tag label={`${w.tasks} tasks`} color={C.muted} xs/>
              <div style={{width:8,height:8,borderRadius:"50%",background:w.online?C.success:C.border}}/>
            </div>
          ))}
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card><SecTitle>Quality Flags Today</SecTitle>{[["Schema errors","3",C.danger],["Gold task fails","2",C.warn],["Disputed labels","7",C.warn],["Auto-rejects","1",C.danger]].map(([k,v,c])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{color:C.text,fontSize:12}}>{k}</span><span style={{color:c,fontWeight:700,fontSize:13}}>{v}</span></div>)}</Card>
          <Card><SecTitle>Task Throughput</SecTitle>{["Mon","Tue","Wed","Thu","Fri"].map((d,i)=>{const v=[280,310,295,312,0][i];return(<div key={d} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:11}}>{d}</span><span style={{color:C.text,fontSize:11,fontWeight:600}}>{v||"—"}</span></div><Bar pct={v/312*100} color={pm.color}/></div>);})}
          </Card>
        </div>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECT WORKFLOW — with manual fallbacks
// ══════════════════════════════════════════════════════════════════════════════
const WF_PHASES=[
  {id:"initiation",icon:"🎯",label:"Project Initiation",color:"#6366f1"},
  {id:"scoping",icon:"📐",label:"Scoping & Taxonomy",color:"#0891b2"},
  {id:"talent",icon:"👥",label:"Talent Allocation",color:"#d97706"},
  {id:"annotation",icon:"✏️",label:"Annotation",color:"#059669"},
  {id:"review",icon:"🔍",label:"Review & QA",color:"#dc2626"},
  {id:"delivery",icon:"📦",label:"Delivery",color:"#7c3aed"},
];

function ProjectWorkflow({setView}){
  const [phase,setPhase]=useState("initiation");
  const p=WF_PHASES.find(x=>x.id===phase);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Project Workflow</h2>
      <div style={{display:"flex",gap:0,overflowX:"auto",paddingBottom:8}}>
        {WF_PHASES.map((ph,i)=>(
          <div key={ph.id} style={{display:"flex",alignItems:"center",flex:1,minWidth:80}}>
            <div onClick={()=>setPhase(ph.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",padding:"10px 4px",background:phase===ph.id?ph.color+"22":"transparent",border:`2px solid ${phase===ph.id?ph.color:C.border}`,borderRadius:9,transition:"all .15s"}}>
              <span style={{fontSize:20}}>{ph.icon}</span>
              <span style={{fontSize:9,fontWeight:700,color:phase===ph.id?ph.color:C.muted,textAlign:"center",lineHeight:1.3}}>{ph.label}</span>
            </div>
            {i<WF_PHASES.length-1&&<div style={{width:14,height:2,background:C.border,flexShrink:0}}/>}
          </div>
        ))}
      </div>

      {phase==="initiation"&&<InitiationPhase setView={setView} color={p.color}/>}
      {phase==="scoping"&&<ScopingPhase color={p.color}/>}
      {phase==="talent"&&<TalentPhase color={p.color}/>}
      {phase==="annotation"&&<AnnotationPhase color={p.color}/>}
      {phase==="review"&&<ReviewPhase color={p.color}/>}
      {phase==="delivery"&&<DeliveryPhase color={p.color}/>}
    </div>
  );
}

function IntegrationBadge({name,active,onManual}){
  return(
    <div style={{background:C.faint,border:`1px solid ${active?C.success+"44":C.danger+"44"}`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:active?C.success:C.danger,flexShrink:0}}/>
      <div style={{flex:1}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{name}</div><div style={{color:active?C.success:C.danger,fontSize:10}}>{active?"Connected":"Disconnected"}</div></div>
      {!active&&<Btn sm outline color={C.warn} onClick={onManual}>Manual Entry</Btn>}
      {active&&<Tag label="Live" color={C.success} xs/>}
    </div>
  );
}

function InitiationPhase({setView,color}){
  const [manual,setManual]=useState(false);
  const [form,setForm]=useState({name:"",client:"",domain:"",budget:"",deadline:""});
  const domains=Object.keys(DC);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{borderColor:color+"44"}}>
        <div style={{color:color,fontWeight:800,fontSize:15,marginBottom:4}}>🎯 Project Initiation</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Client submits a project request. A project brief is captured and the project is created in LabelForge.</div>
        <SecTitle>Integration Status</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          <IntegrationBadge name="Salesforce CRM" active={false} onManual={()=>setManual(true)}/>
          <IntegrationBadge name="Docusign (SOW)" active={true}/>
          <IntegrationBadge name="Jira (Project Tickets)" active={false} onManual={()=>setManual(true)}/>
        </div>
        {manual&&(
          <div style={{background:C.faint,border:`1.5px solid ${color}44`,borderRadius:10,padding:16,marginBottom:14}}>
            <SecTitle color={color}>Manual Project Entry</SecTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[["Project Name","name","e.g. GPT-5 RLHF Batch 13"],["Client Name","client","e.g. OpenModel AI"],["Budget ($)","budget","e.g. 120000"],["Deadline","deadline","YYYY-MM-DD"]].map(([l,k,ph])=>(
                <div key={k}><div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l}</div><Input placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
              ))}
              <div><div style={{color:C.muted,fontSize:11,marginBottom:4}}>Domain</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{domains.map(d=><button key={d} onClick={()=>setForm(p=>({...p,domain:d}))} style={{background:form.domain===d?DC[d]+"33":"transparent",border:`1.5px solid ${form.domain===d?DC[d]:C.border}`,borderRadius:7,padding:"5px 10px",color:form.domain===d?DC[d]:C.muted,cursor:"pointer",fontSize:11,fontWeight:600}}>{d}</button>)}</div>
              </div>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn color={color} onClick={()=>setView("new-project")}>+ Create New Project</Btn>
          {!manual&&<Btn outline color={color} onClick={()=>setManual(true)}>Manual Entry</Btn>}
        </div>
      </Card>
      <Card><SecTitle>Substeps</SecTitle>{["Client submits brief (domain, volume, deadline, budget)","AE reviews & creates project in LabelForge","Taxonomy & ontology defined","Kickoff checklist signed off","Project moves to Scoping"].map((s,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{color:color,fontSize:11,marginTop:2}}>→</span><span style={{color:C.text,fontSize:12}}>{s}</span></div>)}</Card>
    </div>
  );
}

function ScopingPhase({color}){
  const [files,setFiles]=useState([]);
  const [llmQuery,setLlmQuery]=useState("");
  const [llmResult,setLlmResult]=useState("");
  const [loading,setLoading]=useState(false);
  const fileRef=useRef();

  const handleFiles=e=>{
    const f=Array.from(e.target.files||[]);
    setFiles(p=>[...p,...f.map(x=>({name:x.name,size:(x.size/1024).toFixed(1)+"KB",type:x.type||"doc"}))]);
  };

  const runLLM=async()=>{
    if(!llmQuery.trim())return;
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a data annotation taxonomy expert. The user has uploaded scoping documents for an annotation project. Based on their query, generate a concise, structured taxonomy or annotation guideline.\n\nUser query: ${llmQuery}\n\nProvide: 1) Label taxonomy, 2) Edge case guidelines, 3) Quality criteria. Keep it concise and structured.`}]})});
      const data=await res.json();
      setLlmResult(data.content?.[0]?.text||"No response received.");
    }catch(e){setLlmResult("Error connecting to LLM. Please check connectivity.");}
    setLoading(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{borderColor:color+"44"}}>
        <div style={{color:color,fontWeight:800,fontSize:15,marginBottom:4}}>📐 Scoping & Taxonomy</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Define annotation schema, gold samples, instructions, and quality thresholds. Upload existing documentation and use AI to organize it.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          <IntegrationBadge name="Confluence (Guidelines)" active={false} onManual={()=>fileRef.current?.click()}/>
          <IntegrationBadge name="Google Drive (Samples)" active={true}/>
        </div>

        <SecTitle color={color}>Document Upload</SecTitle>
        <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${color}55`,borderRadius:10,padding:24,textAlign:"center",cursor:"pointer",marginBottom:12,background:C.faint}}>
          <div style={{fontSize:28,marginBottom:6}}>📄</div>
          <div style={{color:C.text,fontSize:13,fontWeight:600}}>Drop files here or click to upload</div>
          <div style={{color:C.muted,fontSize:11,marginTop:4}}>Supports PDF, DOCX, TXT, XLSX — annotation guidelines, ontologies, sample datasets</div>
        </div>
        <input ref={fileRef} type="file" multiple onChange={handleFiles} style={{display:"none"}}/>
        {files.length>0&&<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>{files.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,background:C.faint,borderRadius:7,padding:"7px 12px"}}><span style={{fontSize:14}}>📄</span><span style={{color:C.text,fontSize:12,flex:1}}>{f.name}</span><Tag label={f.size} color={C.muted} xs/><button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:12}}>✕</button></div>)}</div>}
      </Card>

      <Card>
        <SecTitle color={color}>🤖 AI Taxonomy Assistant</SecTitle>
        <div style={{color:C.muted,fontSize:12,marginBottom:12}}>Describe what you need and the AI will generate a structured taxonomy, label hierarchy, and edge case guidelines from your uploaded documents.</div>
        <Textarea placeholder={`e.g. "Create a taxonomy for RLHF preference annotation including helpfulness, harmlessness, and honesty dimensions with edge case guidelines for ambiguous responses"`} value={llmQuery} onChange={e=>setLlmQuery(e.target.value)} rows={3}/>
        <div style={{marginTop:10,display:"flex",gap:8}}>
          <Btn color={color} onClick={runLLM} disabled={loading}>{loading?"🤖 Generating…":"🤖 Generate Taxonomy"}</Btn>
          {llmResult&&<Btn outline color={C.muted} sm onClick={()=>setLlmResult("")}>Clear</Btn>}
        </div>
        {llmResult&&<div style={{marginTop:14,background:C.faint,border:`1px solid ${color}44`,borderRadius:9,padding:14}}>
          <div style={{color:color,fontSize:11,fontWeight:700,marginBottom:8}}>AI GENERATED TAXONOMY</div>
          <div style={{color:C.text,fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{llmResult}</div>
        </div>}
      </Card>

      <Card><SecTitle>Manual Scoping Inputs</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["IAA Threshold (%)","90"],["Gold Set Size","200 tasks"],["Pilot Batch Size","50 tasks"],["Min Annotators/Task","3"]].map(([l,ph])=>(
            <div key={l}><div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l}</div><Input placeholder={ph}/></div>
          ))}
        </div>
        <div style={{marginTop:12}}><Btn color={color}>Save Scoping Config</Btn></div>
      </Card>
    </div>
  );
}

function TalentPhase({color}){
  const [sheetRows,setSheetRows]=useState([]);
  const [dragging,setDragging]=useState(false);
  const fileRef=useRef();

  const parseSheet=e=>{
    const f=Array.from(e.target.files||[]);
    if(!f.length)return;
    // mock parse — in real life use SheetJS
    setSheetRows([
      {name:"Aisha K.",email:"aisha@lf.io",domain:"RL / RLHF",tier:"Senior",avail:"Full-time"},
      {name:"Miguel R.",email:"miguel@lf.io",domain:"Video",tier:"Mid",avail:"Part-time"},
      {name:"Jordan T.",email:"jordan@lf.io",domain:"STEM",tier:"Junior",avail:"Full-time"},
      {name:"Priya S.",email:"priya@lf.io",domain:"Enterprise Workflow",tier:"Senior",avail:"Full-time"},
    ]);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{borderColor:color+"44"}}>
        <div style={{color:color,fontWeight:800,fontSize:15,marginBottom:4}}>👥 Talent Allocation</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Match and allocate annotators. Upload a Google Sheet roster or use the workforce pool directly.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          <IntegrationBadge name="Workforce DB (Auto-match)" active={true}/>
          <IntegrationBadge name="Google Sheets Roster" active={false} onManual={()=>fileRef.current?.click()}/>
          <IntegrationBadge name="Calendar API (Availability)" active={false} onManual={()=>{}}/>
        </div>

        <SecTitle color={color}>Upload Google Sheet Roster</SecTitle>
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);parseSheet({target:{files:e.dataTransfer.files}});}}
          onClick={()=>fileRef.current?.click()}
          style={{border:`2px dashed ${dragging?color:color+"55"}`,borderRadius:10,padding:20,textAlign:"center",cursor:"pointer",background:dragging?color+"11":C.faint,marginBottom:12,transition:"all .15s"}}>
          <div style={{fontSize:28,marginBottom:6}}>📊</div>
          <div style={{color:C.text,fontSize:13,fontWeight:600}}>Drop Google Sheet (.xlsx / .csv) or click to upload</div>
          <div style={{color:C.muted,fontSize:11,marginTop:4}}>Columns: Name, Email, Domain, Tier, Availability</div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" onChange={parseSheet} style={{display:"none"}}/>

        {sheetRows.length>0&&<div style={{marginTop:4}}>
          <SecTitle color={color}>Imported Roster ({sheetRows.length} annotators)</SecTitle>
          <div style={{background:C.faint,borderRadius:9,overflow:"hidden",border:`1px solid ${color}33`}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 2fr 1fr 1fr 40px",gap:0,padding:"8px 12px",borderBottom:`1px solid ${C.border}`}}>
              {["Name","Email","Domain","Tier","Avail",""].map(h=><span key={h} style={{color:C.muted,fontSize:10,fontWeight:700}}>{h}</span>)}
            </div>
            {sheetRows.map((r,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 2fr 2fr 1fr 1fr 40px",gap:0,padding:"9px 12px",borderBottom:`1px solid ${C.border}22`,alignItems:"center"}}>
                <span style={{color:C.text,fontSize:12,fontWeight:600}}>{r.name}</span>
                <span style={{color:C.muted,fontSize:11}}>{r.email}</span>
                <Tag label={r.domain} color={DC[r.domain]||C.accent} xs/>
                <Tag label={r.tier} color={r.tier==="Senior"?C.success:r.tier==="Mid"?C.warn:C.muted} xs/>
                <Tag label={r.avail} color={C.muted} xs/>
                <button onClick={()=>setSheetRows(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:12}}>✕</button>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,display:"flex",gap:8}}><Btn color={color}>Assign to Project</Btn><Btn outline color={color} sm>Send Briefing Invites</Btn></div>
        </div>}
      </Card>

      <Card><SecTitle>Skill-Match from Workforce Pool</SecTitle>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{Object.keys(DC).map(d=><button key={d} style={{background:DC[d]+"22",border:`1px solid ${DC[d]}44`,borderRadius:7,padding:"5px 10px",color:DC[d],cursor:"pointer",fontSize:11,fontWeight:600}}>{d}</button>)}</div>
        <Btn color={color}>Auto-Match Annotators</Btn>
      </Card>
    </div>
  );
}

function AnnotationPhase({color}){
  const [selDomain,setSelDomain]=useState("RL / RLHF");
  const [seedTab,setSeedTab]=useState("upload");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{borderColor:color+"44"}}>
        <div style={{color,fontWeight:800,fontSize:15,marginBottom:4}}>✏️ Annotation Setup</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Configure annotation tooling and seed data for the selected domain. Each domain has a dedicated annotation interface.</div>
        <SecTitle color={color}>Select Domain</SecTitle>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {Object.keys(DC).map(d=><button key={d} onClick={()=>setSelDomain(d)} style={{background:selDomain===d?DC[d]+"33":"transparent",border:`2px solid ${selDomain===d?DC[d]:C.border}`,borderRadius:9,padding:"8px 14px",color:selDomain===d?DC[d]:C.muted,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span>{["🤖","💻","🎙️","🎬","⚙️","🏢","🔬"][Object.keys(DC).indexOf(d)]}</span>{d}</button>)}
        </div>

        <SecTitle>Integration Status</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          <IntegrationBadge name="ML Pre-labeling API" active={true}/>
          <IntegrationBadge name="S3 / GCS Asset Store" active={true}/>
          <IntegrationBadge name="Task Queue System" active={false} onManual={()=>{}}/>
        </div>
      </Card>

      <Card>
        <SecTitle color={color}>Seed Data for {selDomain}</SecTitle>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {["upload","api","database","generate"].map(t=><button key={t} onClick={()=>setSeedTab(t)} style={{background:seedTab===t?color+"33":"transparent",border:`1px solid ${seedTab===t?color:C.border}`,borderRadius:6,padding:"5px 12px",color:seedTab===t?color:C.muted,cursor:"pointer",fontSize:11,fontWeight:seedTab===t?700:400,textTransform:"capitalize"}}>{t==="api"?"API Pull":t==="generate"?"AI Generate":t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>
        {seedTab==="upload"&&<div style={{border:`2px dashed ${color}55`,borderRadius:9,padding:20,textAlign:"center",background:C.faint}}>
          <div style={{fontSize:24,marginBottom:6}}>{selDomain==="Audio"?"🎙️":selDomain==="Video"?"🎬":selDomain==="Code"?"💻":"📄"}</div>
          <div style={{color:C.text,fontSize:13,fontWeight:600}}>Upload seed data for {selDomain}</div>
          <div style={{color:C.muted,fontSize:11,marginTop:4}}>{selDomain==="Audio"?"WAV, MP3, FLAC files":selDomain==="Video"?"MP4, MOV, AVI clips":selDomain==="Code"?"Python, JS, TS files or ZIP":selDomain==="STEM"?"PDF, LaTeX, JSONL problems":"JSONL, CSV, PDF documents"}</div>
          <Btn color={color} sm onClick={()=>{}} style={{marginTop:12}}>Browse Files</Btn>
        </div>}
        {seedTab==="api"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["API Endpoint","https://data.provider.com/v1/..."],["API Key","sk-••••••••••••••••"],["Dataset ID","ds_12345"],["Max Records","1000"]].map(([l,ph])=><div key={l}><div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l}</div><Input placeholder={ph}/></div>)}
          <Btn color={color} sm>Test & Pull Data</Btn>
        </div>}
        {seedTab==="database"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Connection String","postgresql://..."],["Table / View","seed_data_v2"],["Filter (SQL WHERE)","domain='rlhf' AND quality>0.8"],["Row Limit","5000"]].map(([l,ph])=><div key={l}><div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l}</div><Input placeholder={ph}/></div>)}
          <Btn color={color} sm>Connect & Preview</Btn>
        </div>}
        {seedTab==="generate"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{color:C.muted,fontSize:12}}>Use AI to generate synthetic seed data for {selDomain} annotation.</div>
          <Textarea placeholder={`Describe the type of ${selDomain} data to generate. e.g. "Generate 50 diverse assistant responses for ranking, covering technical, creative, and factual topics…"`} rows={3}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn color={color} sm>🤖 Generate Seed Data</Btn>
            <Btn outline color={color} sm>Preview Schema</Btn>
          </div>
        </div>}
      </Card>
    </div>
  );
}

function ReviewPhase({color}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{borderColor:color+"44"}}>
        <div style={{color,fontWeight:800,fontSize:15,marginBottom:4}}>🔍 Review & QA</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Multi-tier quality assurance. Automated checks → peer review → senior QA → client spot-check.</div>
        <SecTitle>Integration Status</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <IntegrationBadge name="Argilla (Human Eval)" active={true}/>
          <IntegrationBadge name="Labelbox (IAA Scores)" active={false} onManual={()=>{}}/>
          <IntegrationBadge name="Scale Eval (LLM Scoring)" active={false} onManual={()=>{}}/>
        </div>
      </Card>
      <Card><SecTitle>Manual QA Actions</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["Run Auto-Validation","Validate schema, format, outliers on all submitted tasks",C.warn,"Run Now"],["Start Peer Review Round","Assign 20% of tasks to second annotator",C.accent,"Start"],["Upload Gold Set","Import known-correct tasks for benchmarking",color,"Upload"],["Trigger IAA Calculation","Compute Cohen's Kappa for current batch",C.success,"Calculate"],["Client Spot-Check","Send 5% sample to client for review",C.muted,"Send"]].map(([title,desc,c,action])=>(
            <div key={title} style={{display:"flex",alignItems:"center",gap:12,background:C.faint,borderRadius:9,padding:"10px 14px",border:`1px solid ${c}22`}}>
              <div style={{flex:1}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{title}</div><div style={{color:C.muted,fontSize:11}}>{desc}</div></div>
              <Btn sm color={c}>{action}</Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DeliveryPhase({color}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{borderColor:color+"44"}}>
        <div style={{color,fontWeight:800,fontSize:15,marginBottom:4}}>📦 Delivery</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>Package, format, and deliver approved dataset. Trigger invoicing.</div>
        <SecTitle>Integration Status</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <IntegrationBadge name="AWS S3 / GCS (Transfer)" active={true}/>
          <IntegrationBadge name="REST API (Delivery)" active={true}/>
          <IntegrationBadge name="Stripe / NetSuite (Invoice)" active={false} onManual={()=>{}}/>
        </div>
      </Card>
      <Card><SecTitle>Manual Delivery Options</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div><div style={{color:C.muted,fontSize:11,marginBottom:4}}>Output Format</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["JSONL","CSV","Parquet","JSON","Custom"].map(f=><button key={f} style={{background:f==="JSONL"?color+"33":"transparent",border:`1.5px solid ${f==="JSONL"?color:C.border}`,borderRadius:7,padding:"5px 12px",color:f==="JSONL"?color:C.muted,cursor:"pointer",fontSize:12,fontWeight:600}}>{f}</button>)}
            </div>
          </div>
          <div><div style={{color:C.muted,fontSize:11,marginBottom:4}}>Delivery Method</div><Input placeholder="s3://bucket/path/ or SFTP or REST endpoint"/></div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn color={color}>Package & Deliver</Btn>
            <Btn outline color={color} sm>Generate Invoice Manually</Btn>
            <Btn outline color={C.muted} sm>Archive Project</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DOMAIN-AWARE WORKBENCH
// ══════════════════════════════════════════════════════════════════════════════
function Workbench({role}){
  const [domain,setDomain]=useState("RL / RLHF");
  const [taskIdx,setTaskIdx]=useState(0);
  const [submitted,setSubmitted]=useState(false);
  const dc=DC[domain];
  const submit=()=>{setSubmitted(true);setTimeout(()=>{setSubmitted(false);setTaskIdx(p=>p+1);},1300);};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:800}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
        <div><h2 style={{color:C.text,margin:0,fontSize:18,fontWeight:800}}>Annotation Workbench</h2><p style={{color:C.muted,margin:"2px 0 0",fontSize:11}}>Task #{taskIdx+1} · Domain-specific interface</p></div>
      </div>
      {/* Domain selector */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {Object.keys(DC).map(d=><button key={d} onClick={()=>setDomain(d)} style={{background:domain===d?DC[d]+"33":"transparent",border:`1.5px solid ${domain===d?DC[d]:C.border}`,borderRadius:7,padding:"5px 12px",color:domain===d?DC[d]:C.muted,cursor:"pointer",fontSize:11,fontWeight:700}}>{d}</button>)}
      </div>
      <div style={{background:dc+"11",border:`1.5px solid ${dc}33`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.text}}>
        <span style={{color:dc,fontWeight:700}}>{domain} · </span>
        {{
          "RL / RLHF":"Compare two responses and select the better one. Rate confidence.",
          "Code":"Review the code snippet for bugs and quality issues.",
          "Audio":"Transcribe the audio segment and tag emotion/speaker.",
          "Video":"Draw a bounding box, classify the action, and set time range.",
          "Function Calling":"Validate the tool call against the user intent.",
          "Enterprise Workflow":"Classify the document and extract named entities.",
          "STEM":"Grade each step of the math solution.",
        }[domain]}
      </div>

      {submitted?<div style={{background:C.success+"22",border:`2px solid ${C.success}`,borderRadius:12,padding:30,textAlign:"center"}}><div style={{fontSize:30,marginBottom:8}}>✓</div><div style={{color:C.success,fontWeight:800,fontSize:16}}>Submitted!</div><div style={{color:C.muted,fontSize:12,marginTop:4}}>Loading next task…</div></div>:(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {domain==="RL / RLHF"&&<RLHFTask onSubmit={submit}/>}
          {domain==="Code"&&<CodeTask onSubmit={submit}/>}
          {domain==="Audio"&&<AudioTask onSubmit={submit}/>}
          {domain==="Video"&&<VideoTask onSubmit={submit}/>}
          {domain==="Function Calling"&&<FuncTask onSubmit={submit}/>}
          {domain==="Enterprise Workflow"&&<EnterpriseTask onSubmit={submit}/>}
          {domain==="STEM"&&<STEMTask onSubmit={submit}/>}
        </div>
      )}
    </div>
  );
}

function ConfRow({conf,setConf}){return <Card style={{padding:"10px 14px"}}><SecTitle>Confidence</SecTitle><div style={{display:"flex",gap:6,alignItems:"center"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setConf(n)} style={{background:conf>=n?"#f59e0b22":"transparent",border:`1.5px solid ${conf>=n?"#f59e0b":C.border}`,borderRadius:6,padding:"4px 10px",color:conf>=n?"#f59e0b":C.muted,cursor:"pointer",fontSize:14}}>★</button>)}<span style={{color:C.muted,fontSize:11,marginLeft:4}}>{conf?["","Very Low","Low","Medium","High","Very High"][conf]:""}</span></div></Card>;}

function RLHFTask({onSubmit}){const [sel,setSel]=useState(null);const [note,setNote]=useState("");const [conf,setConf]=useState(null);return(<><Card><SecTitle>Prompt</SecTitle><div style={{color:C.text,fontSize:13,lineHeight:1.6}}>Explain the difference between supervised and unsupervised learning.</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[["A","Supervised learning uses labeled data — the AI learns a mapping from inputs to correct outputs. Examples: image classification, spam detection.\n\nUnsupervised learning finds hidden structure in unlabeled data — like clusters or patterns. Examples: k-means, autoencoders."],["B","Supervised is when you give the AI the right answers. Unsupervised is when there are no labels. Both are types of ML."]].map(([id,txt])=><div key={id} onClick={()=>setSel(id)} style={{background:sel===id?"#be185d22":C.card,border:`2px solid ${sel===id?"#be185d":C.border}`,borderRadius:10,padding:14,cursor:"pointer"}}><div style={{fontWeight:700,color:sel===id?"#be185d":C.muted,fontSize:11,marginBottom:8}}>RESPONSE {id}{sel===id&&" ✓"}</div><div style={{color:C.text,fontSize:12,lineHeight:1.7,whiteSpace:"pre-line"}}>{txt}</div></div>)}</div><Card><SecTitle>Reasoning (optional)</SecTitle><Textarea placeholder="Why did you prefer this response?" value={note} onChange={e=>setNote(e.target.value)} rows={2}/></Card><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(sel&&conf)&&onSubmit()} disabled={!sel||!conf}>Submit Ranking →</Btn></>);}

function CodeTask({onSubmit}){const [bugs,setBugs]=useState(null);const [q,setQ]=useState(null);const [conf,setConf]=useState(null);return(<><Card><SecTitle>Task</SecTitle><div style={{color:C.text,fontSize:13}}>Identify bugs and rate quality of this Python function.</div></Card><div style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:10,padding:16,fontFamily:"monospace",fontSize:12,color:"#c9d1d9",lineHeight:1.9,whiteSpace:"pre"}}>{`def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total =+ num      # Bug: should be +=\n    return total / len(numbers)  # Bug: ZeroDivisionError\n\nresult = calculate_average([])\nprint(result)`}</div><Card><SecTitle>Bug Count</SecTitle><div style={{display:"flex",gap:8}}>{[0,1,2,3].map(n=><button key={n} onClick={()=>setBugs(n)} style={{background:bugs===n?"#4ade8033":"transparent",border:`2px solid ${bugs===n?"#4ade80":C.border}`,borderRadius:8,padding:"8px 20px",color:bugs===n?"#4ade80":C.muted,cursor:"pointer",fontSize:14,fontWeight:700}}>{n}</button>)}</div></Card><Card><SecTitle>Code Quality (★)</SecTitle><div style={{display:"flex",gap:6}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setQ(n)} style={{background:q>=n?"#4ade8022":"transparent",border:`1.5px solid ${q>=n?"#4ade80":C.border}`,borderRadius:6,padding:"5px 12px",color:q>=n?"#4ade80":C.muted,cursor:"pointer",fontSize:14}}>★</button>)}</div></Card><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(bugs!==null&&q&&conf)&&onSubmit()} disabled={bugs===null||!q||!conf}>Submit Review →</Btn></>);}

function AudioTask({onSubmit}){const [transcript,setTranscript]=useState("");const [emotion,setEmotion]=useState(null);const [speakers,setSpeakers]=useState(null);const [conf,setConf]=useState(null);return(<><Card><SecTitle>Audio Segment — 00:12 → 00:45</SecTitle><div style={{background:C.faint,borderRadius:8,padding:14,display:"flex",alignItems:"center",gap:12}}><button style={{width:40,height:40,borderRadius:"50%",background:"#38bdf822",border:"2px solid #38bdf8",color:"#38bdf8",fontSize:18,cursor:"pointer",flexShrink:0}}>▶</button><div style={{flex:1}}><div style={{display:"flex",gap:2,height:32,alignItems:"center"}}>{Array.from({length:44},(_,i)=><div key={i} style={{width:3,borderRadius:2,background:"#38bdf8",height:`${20+Math.sin(i*.7)*13}px`,opacity:.7}}/>)}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{color:C.muted,fontSize:10}}>00:12</span><span style={{color:C.muted,fontSize:10}}>00:45</span></div></div></div></Card><Card><SecTitle>Transcription</SecTitle><Textarea placeholder="Type what you hear exactly…" value={transcript} onChange={e=>setTranscript(e.target.value)} rows={3}/></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Card><SecTitle>Emotion / Intent</SecTitle><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Neutral","Happy","Frustrated","Confused","Urgent","Sad"].map(e=><button key={e} onClick={()=>setEmotion(e)} style={{background:emotion===e?"#38bdf822":"transparent",border:`1.5px solid ${emotion===e?"#38bdf8":C.border}`,borderRadius:6,padding:"5px 10px",color:emotion===e?"#38bdf8":C.muted,cursor:"pointer",fontSize:11,fontWeight:600}}>{e}</button>)}</div></Card><Card><SecTitle>Speaker Count</SecTitle><div style={{display:"flex",gap:8}}>{[1,2,3,"3+"].map(n=><button key={n} onClick={()=>setSpeakers(n)} style={{background:speakers===n?"#38bdf822":"transparent",border:`2px solid ${speakers===n?"#38bdf8":C.border}`,borderRadius:7,padding:"7px 14px",color:speakers===n?"#38bdf8":C.muted,cursor:"pointer",fontSize:13,fontWeight:700}}>{n}</button>)}</div></Card></div><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(transcript&&emotion&&speakers&&conf)&&onSubmit()} disabled={!transcript||!emotion||!speakers||!conf}>Submit Transcription →</Btn></>);}

function VideoTask({onSubmit}){const [box,setBox]=useState(false);const [action,setAction]=useState(null);const [conf,setConf]=useState(null);return(<><Card><SecTitle>Video Frame — 00:02:14</SecTitle><div style={{background:"#0a0f1a",borderRadius:8,position:"relative",height:180,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:C.muted,fontSize:11}}>[ Video frame ]</div>{box&&<div style={{position:"absolute",top:40,left:60,width:120,height:80,border:"2.5px solid #a78bfa",borderRadius:3,background:"#a78bfa11"}}><div style={{position:"absolute",top:-16,left:0,color:"#a78bfa",fontSize:10,fontWeight:700,background:C.bg,padding:"1px 5px",borderRadius:3}}>Person</div></div>}<button onClick={()=>setBox(!box)} style={{position:"absolute",bottom:8,right:8,background:"#a78bfa22",border:"1.5px solid #a78bfa",borderRadius:6,padding:"4px 10px",color:"#a78bfa",fontSize:11,cursor:"pointer",fontWeight:700}}>{box?"Clear":"+ Draw BBox"}</button></div></Card><Card><SecTitle>Action Class</SecTitle><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Walking","Running","Standing","Sitting","Waving","Gesturing","Picking up","Interacting"].map(a=><button key={a} onClick={()=>setAction(a)} style={{background:action===a?"#a78bfa22":"transparent",border:`1.5px solid ${action===a?"#a78bfa":C.border}`,borderRadius:6,padding:"5px 10px",color:action===a?"#a78bfa":C.muted,cursor:"pointer",fontSize:11,fontWeight:600}}>{a}</button>)}</div></Card><Card><SecTitle>Time Range</SecTitle><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{flex:1}}><div style={{color:C.muted,fontSize:10,marginBottom:4}}>Start</div><Input placeholder="00:02:12"/></div><span style={{color:C.muted,marginTop:14}}>→</span><div style={{flex:1}}><div style={{color:C.muted,fontSize:10,marginBottom:4}}>End</div><Input placeholder="00:02:18"/></div></div></Card><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(box&&action&&conf)&&onSubmit()} disabled={!box||!action||!conf}>Submit Annotation →</Btn></>);}

function FuncTask({onSubmit}){const [verdict,setVerdict]=useState(null);const [errs,setErrs]=useState([]);const [conf,setConf]=useState(null);const tog=e=>setErrs(p=>p.includes(e)?p.filter(x=>x!==e):[...p,e]);return(<><Card><SecTitle>User Intent</SecTitle><div style={{color:C.text,fontSize:13}}>"Book a flight from London to Tokyo departing March 5th, economy class, one adult."</div></Card><div style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:10,padding:14,fontFamily:"monospace",fontSize:12,color:"#c9d1d9",lineHeight:1.9,whiteSpace:"pre"}}>{`{\n  "tool": "search_flights",\n  "parameters": {\n    "origin": "London",\n    "destination": "Tokyo",\n    "departure_date": "2026-03-05",\n    "cabin_class": "business",  ← should be economy\n    "passengers": { "adults": 1 }\n  }\n}`}</div><Card><SecTitle>Verdict</SecTitle><div style={{display:"flex",gap:8}}>{[["Correct ✓",C.success],["Incorrect ✗",C.danger],["Partial ⚠️",C.warn]].map(([o,c])=><button key={o} onClick={()=>setVerdict(o)} style={{background:verdict===o?c+"33":"transparent",border:`2px solid ${verdict===o?c:C.border}`,borderRadius:8,padding:"8px 16px",color:verdict===o?c:C.muted,cursor:"pointer",fontSize:12,fontWeight:600}}>{o}</button>)}</div></Card><Card><SecTitle>Error Types</SecTitle><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Wrong tool","Missing param","Wrong param value","Extra param","Wrong data type","Intent mismatch"].map(e=><button key={e} onClick={()=>tog(e)} style={{background:errs.includes(e)?"#fbbf2422":"transparent",border:`1.5px solid ${errs.includes(e)?"#fbbf24":C.border}`,borderRadius:6,padding:"5px 10px",color:errs.includes(e)?"#fbbf24":C.muted,cursor:"pointer",fontSize:11,fontWeight:600}}>{e}</button>)}</div></Card><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(verdict&&conf)&&onSubmit()} disabled={!verdict||!conf}>Submit Evaluation →</Btn></>);}

function EnterpriseTask({onSubmit}){const [docType,setDocType]=useState(null);const [ents,setEnts]=useState([]);const [conf,setConf]=useState(null);const tog=e=>setEnts(p=>p.includes(e)?p.filter(x=>x!==e):[...p,e]);return(<><Card><SecTitle>Document Excerpt</SecTitle><div style={{background:C.faint,borderRadius:8,padding:14,color:C.text,fontSize:12,lineHeight:1.8,fontFamily:"Georgia,serif"}}>This <span style={{background:"#34d39933",borderRadius:3,padding:"1px 3px",color:"#34d399"}}>Service Agreement</span> is entered into as of <span style={{background:"#60a5fa33",borderRadius:3,padding:"1px 3px",color:"#60a5fa"}}>January 15, 2026</span>, between <span style={{background:"#fbbf2433",borderRadius:3,padding:"1px 3px",color:"#fbbf24"}}>Acme Corp</span> and <span style={{background:"#fbbf2433",borderRadius:3,padding:"1px 3px",color:"#fbbf24"}}>DataVault Inc</span>. Total value: <span style={{background:"#be185d33",borderRadius:3,padding:"1px 3px",color:"#be185d"}}>$240,000 USD</span>, payable quarterly…</div></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Card><SecTitle>Document Type</SecTitle><div style={{display:"flex",flexDirection:"column",gap:5}}>{["Service Agreement","NDA","Purchase Order","Invoice","Employment Contract","Other"].map(d=><button key={d} onClick={()=>setDocType(d)} style={{background:docType===d?"#34d39922":"transparent",border:`1.5px solid ${docType===d?"#34d399":C.border}`,borderRadius:6,padding:"5px 10px",color:docType===d?"#34d399":C.muted,cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"left"}}>{d}</button>)}</div></Card><Card><SecTitle>Entities Found</SecTitle><div style={{display:"flex",flexDirection:"column",gap:5}}>{["Organization names","Date/time","Monetary values","Contract parties","Payment terms","Jurisdiction"].map(e=><button key={e} onClick={()=>tog(e)} style={{background:ents.includes(e)?"#34d39922":"transparent",border:`1.5px solid ${ents.includes(e)?"#34d399":C.border}`,borderRadius:6,padding:"5px 10px",color:ents.includes(e)?"#34d399":C.muted,cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"left"}}>{ents.includes(e)?"✓ ":""}{e}</button>)}</div></Card></div><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(docType&&ents.length>0&&conf)&&onSubmit()} disabled={!docType||!ents.length||!conf}>Submit Labels →</Btn></>);}

function STEMTask({onSubmit}){const [steps,setSteps]=useState({});const [overall,setOverall]=useState(null);const [conf,setConf]=useState(null);const setS=(i,v)=>setSteps(p=>({...p,[i]:v}));const stepsData=[{n:1,t:"Let x = apples, 2x = oranges."},{n:2,t:"x + 2x = 3x = 24"},{n:3,t:"x = 8, apples = 8"},{n:4,t:"Oranges = 16. Check: 8+16=24 ✓"}];const allDone=stepsData.every(s=>steps[s.n]);return(<><Card><SecTitle>Problem</SecTitle><div style={{color:C.text,fontSize:13,lineHeight:1.6}}>A basket has 24 fruit. There are twice as many oranges as apples. How many of each?</div></Card><Card><SecTitle>Grade Each Step</SecTitle><div style={{display:"flex",flexDirection:"column",gap:8}}>{stepsData.map(s=><div key={s.n} style={{background:C.faint,borderRadius:8,padding:"10px 12px",border:`1px solid ${steps[s.n]==="correct"?C.success:steps[s.n]==="wrong"?C.danger:steps[s.n]==="partial"?C.warn:C.border}`}}><div style={{color:C.muted,fontSize:10,marginBottom:4}}>Step {s.n}</div><div style={{color:C.text,fontSize:12,marginBottom:8}}>{s.t}</div><div style={{display:"flex",gap:6}}>{[["correct","✓ Correct",C.success],["partial","⚠ Partial",C.warn],["wrong","✗ Wrong",C.danger]].map(([v,l,c])=><button key={v} onClick={()=>setS(s.n,v)} style={{background:steps[s.n]===v?c+"33":"transparent",border:`1.5px solid ${steps[s.n]===v?c:C.border}`,borderRadius:6,padding:"3px 10px",color:steps[s.n]===v?c:C.muted,cursor:"pointer",fontSize:10,fontWeight:700}}>{l}</button>)}</div></div>)}</div></Card><Card><SecTitle>Overall Score (0–10)</SecTitle><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[0,1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} onClick={()=>setOverall(n)} style={{background:overall===n?"#60a5fa33":"transparent",border:`1.5px solid ${overall===n?"#60a5fa":C.border}`,borderRadius:6,padding:"4px 10px",color:overall===n?"#60a5fa":C.muted,cursor:"pointer",fontSize:12,fontWeight:700}}>{n}</button>)}</div></Card><ConfRow conf={conf} setConf={setConf}/><Btn onClick={()=>(allDone&&overall!==null&&conf)&&onSubmit()} disabled={!allDone||overall===null||!conf}>Submit Grading →</Btn></>);}

// ══════════════════════════════════════════════════════════════════════════════
// TRAINING MODULE
// ══════════════════════════════════════════════════════════════════════════════
const TRAINING_MODULES={
  "RL / RLHF":{color:"#be185d",icon:"🤖",lessons:["What is RLHF and why it matters","Understanding the HHH framework (Helpful, Harmless, Honest)","How to compare response quality","Edge cases: refusals, ambiguity, toxicity","Calibration: avoiding length bias"],exercises:[{q:"Which response better follows the HHH framework?",a:"A",choices:["A: Clear, accurate, and appropriately cautious","B: Detailed but contains factual errors"]},{q:"A response is very long but mostly correct. How do you score it?",a:"Partial",choices:["Perfect","Partial — length ≠ quality","Incorrect"]}]},
  "Code":{color:"#4ade80",icon:"💻",lessons:["Common Python anti-patterns and bugs","Understanding code quality dimensions","How to spot off-by-one errors","Security vulnerability patterns","Reviewing documentation quality"],exercises:[{q:"How many bugs are in: total =+ num",a:"1",choices:["0","1 — should be +=","2"]},{q:"A function with no docstring but correct logic is:",a:"Partial",choices:["Perfect","Partial — missing docs","Incorrect"]}]},
  "Audio":{color:"#38bdf8",icon:"🎙️",lessons:["Principles of accurate transcription","Handling overlapping speech","Emotion and intent tagging guidelines","Dealing with accents and background noise","Speaker diarization basics"],exercises:[{q:"You hear 'gonna' in the audio. You should transcribe it as:",a:"gonna",choices:["going to","gonna","Gon na"]},{q:"Two speakers overlap briefly. You should:",a:"Tag both",choices:["Skip the overlap","Tag both speakers","Pick the louder one"]}]},
  "Video":{color:"#a78bfa",icon:"🎬",lessons:["Bounding box best practices","Action recognition taxonomy","Temporal grounding — start and end frames","Handling occlusion","When to use polygons vs rectangles"],exercises:[{q:"A person is half behind a wall. Your bbox should:",a:"Cover visible portion",choices:["Cover the full estimated body","Cover visible portion only","Skip this annotation"]},{q:"Action ends at frame 142. End time should be:",a:"Frame 142",choices:["Frame 140","Frame 142","Frame 145"]}]},
  "Function Calling":{color:"#fbbf24",icon:"⚙️",lessons:["What are tool calls and APIs","Understanding JSON schema validation","Common parameter extraction errors","Multi-turn tool chaining","Intent vs tool mismatch patterns"],exercises:[{q:"User asks for weather in Tokyo. Tool uses location:'Japan'. This is:",a:"Partial",choices:["Correct","Partial — too vague","Incorrect"]},{q:"A required parameter is missing from the call. This is:",a:"Incorrect",choices:["Correct","Partial","Incorrect"]}]},
  "Enterprise Workflow":{color:"#34d399",icon:"🏢",lessons:["Named entity recognition fundamentals","Document classification taxonomy","Extracting tabular data","Handling PII and redaction","Contract-specific terminology"],exercises:[{q:"'$240,000 USD' in a contract is a:",a:"Monetary value",choices:["Date","Monetary value","Organization"]},{q:"The document starts with 'WHEREAS parties agree…' It is likely a:",a:"Legal Agreement",choices:["Invoice","Legal Agreement","Purchase Order"]}]},
  "STEM":{color:"#60a5fa",icon:"🔬",lessons:["Grading mathematical reasoning vs. arithmetic","Partial credit frameworks","Evaluating scientific claims","Handling LaTeX and notation","Domain-specific rubrics: Physics, Chemistry, Math"],exercises:[{q:"Student writes correct method but wrong arithmetic. Grade:",a:"Partial",choices:["Correct","Partial","Incorrect"]},{q:"A proof skips a non-obvious step. Grade:",a:"Partial",choices:["Correct","Partial","Incorrect"]}]},
};

function Training(){
  const [domain,setDomain]=useState("Code");
  const [tab,setTab]=useState("learn");
  const [lesson,setLesson]=useState(0);
  const [exIdx,setExIdx]=useState(0);
  const [answer,setAnswer]=useState(null);
  const [checked,setChecked]=useState(false);
  const [score,setScore]=useState({correct:0,total:0});
  const m=TRAINING_MODULES[domain];
  const ex=m.exercises[exIdx%m.exercises.length];
  const isCorrect=answer===ex.a;

  const checkAnswer=()=>{if(!answer)return;setChecked(true);setScore(p=>({correct:p.correct+(answer===ex.a?1:0),total:p.total+1}));};
  const nextEx=()=>{setAnswer(null);setChecked(false);setExIdx(p=>p+1);};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:780}}>
      <h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Training Centre</h2>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {Object.keys(TRAINING_MODULES).map(d=><button key={d} onClick={()=>{setDomain(d);setLesson(0);setExIdx(0);setAnswer(null);setChecked(false);}} style={{background:domain===d?TRAINING_MODULES[d].color+"33":"transparent",border:`1.5px solid ${domain===d?TRAINING_MODULES[d].color:C.border}`,borderRadius:7,padding:"5px 12px",color:domain===d?TRAINING_MODULES[d].color:C.muted,cursor:"pointer",fontSize:11,fontWeight:700}}>{TRAINING_MODULES[d].icon} {d}</button>)}
      </div>

      <div style={{background:m.color+"11",border:`1.5px solid ${m.color}33`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:22}}>{m.icon}</span>
        <div style={{flex:1}}><div style={{color:m.color,fontWeight:700,fontSize:14}}>{domain} Training</div><div style={{color:C.muted,fontSize:11}}>{m.lessons.length} lessons · {m.exercises.length} exercises · Self-paced</div></div>
        <div style={{textAlign:"right"}}><div style={{color:C.success,fontWeight:700,fontSize:14}}>{score.total>0?Math.round(score.correct/score.total*100):0}%</div><div style={{color:C.muted,fontSize:10}}>Exercise score</div></div>
      </div>

      <div style={{display:"flex",gap:8}}>
        {["learn","exercise","certify"].map(t=><button key={t} onClick={()=>setTab(t)} style={{background:tab===t?m.color+"33":"transparent",border:`1px solid ${tab===t?m.color:C.border}`,borderRadius:7,padding:"6px 14px",color:tab===t?m.color:C.muted,cursor:"pointer",fontSize:12,fontWeight:tab===t?700:400,textTransform:"capitalize"}}>{t==="certify"?"Certification":t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>

      {tab==="learn"&&(
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {m.lessons.map((l,i)=><button key={i} onClick={()=>setLesson(i)} style={{background:lesson===i?m.color+"22":"transparent",border:`1px solid ${lesson===i?m.color:C.border}`,borderRadius:7,padding:"8px 10px",color:lesson===i?m.color:C.muted,cursor:"pointer",fontSize:11,fontWeight:lesson===i?700:400,textAlign:"left"}}>{i+1}. {l}</button>)}
          </div>
          <Card style={{borderColor:m.color+"33"}}>
            <div style={{color:m.color,fontWeight:700,fontSize:14,marginBottom:8}}>Lesson {lesson+1}: {m.lessons[lesson]}</div>
            <div style={{color:C.text,fontSize:13,lineHeight:1.8}}>
              {`This lesson covers the fundamentals of ${m.lessons[lesson].toLowerCase()} in the context of ${domain} annotation.\n\nKey points:\n• Understand the core principles before attempting tasks\n• Apply the guidelines consistently across all examples\n• When in doubt, refer to the annotation handbook\n• Edge cases should be escalated, not guessed\n\nBest practice: Always read the full context before labeling. Consistency is more important than speed during calibration.`}
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              {lesson>0&&<Btn sm outline color={m.color} onClick={()=>setLesson(p=>p-1)}>← Prev</Btn>}
              {lesson<m.lessons.length-1&&<Btn sm color={m.color} onClick={()=>setLesson(p=>p+1)}>Next →</Btn>}
              {lesson===m.lessons.length-1&&<Btn sm color={C.success} onClick={()=>setTab("exercise")}>Start Exercises →</Btn>}
            </div>
          </Card>
        </div>
      )}

      {tab==="exercise"&&(
        <Card style={{borderColor:m.color+"33"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{color:m.color,fontWeight:700,fontSize:14}}>Exercise {(exIdx%m.exercises.length)+1} / {m.exercises.length}</div>
            <Tag label={`Score: ${score.correct}/${score.total}`} color={score.total>0&&score.correct/score.total>=.8?C.success:score.total>0?C.warn:C.muted}/>
          </div>
          <div style={{color:C.text,fontSize:14,lineHeight:1.6,marginBottom:16,background:C.faint,borderRadius:8,padding:"12px 14px"}}>{ex.q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {ex.choices.map(choice=>{
              const isSel=answer===choice;const correct=checked&&choice===ex.a;const wrong=checked&&isSel&&choice!==ex.a;
              return(<button key={choice} onClick={()=>!checked&&setAnswer(choice)} style={{background:correct?"#10b98122":wrong?"#ef444422":isSel?m.color+"22":"transparent",border:`2px solid ${correct?C.success:wrong?C.danger:isSel?m.color:C.border}`,borderRadius:9,padding:"11px 16px",color:correct?C.success:wrong?C.danger:isSel?m.color:C.text,cursor:checked?"default":"pointer",fontSize:13,fontWeight:isSel?700:400,textAlign:"left",transition:"all .15s"}}>{correct?"✓ ":wrong?"✗ ":""}{choice}</button>);
            })}
          </div>
          {checked&&<div style={{background:isCorrect?C.success+"11":C.danger+"11",border:`1px solid ${isCorrect?C.success+"44":C.danger+"44"}`,borderRadius:8,padding:"10px 14px",marginBottom:12}}>
            <div style={{color:isCorrect?C.success:C.danger,fontWeight:700,marginBottom:4}}>{isCorrect?"✓ Correct!":"✗ Not quite"}</div>
            <div style={{color:C.text,fontSize:12}}>The correct answer is: <strong style={{color:m.color}}>{ex.a}</strong>. {isCorrect?"Well done — this is a core principle for "+domain+" annotation.":"Review Lesson "+Math.floor(exIdx/2+1)+" for more context on this."}</div>
          </div>}
          <div style={{display:"flex",gap:8}}>
            {!checked&&<Btn color={m.color} onClick={checkAnswer} disabled={!answer}>Check Answer</Btn>}
            {checked&&<Btn color={m.color} onClick={nextEx}>Next Exercise →</Btn>}
          </div>
        </Card>
      )}

      {tab==="certify"&&(
        <Card style={{borderColor:m.color+"33"}}>
          <div style={{color:m.color,fontWeight:800,fontSize:16,marginBottom:8}}>{m.icon} {domain} Certification</div>
          <div style={{color:C.muted,fontSize:12,marginBottom:16}}>Complete the full certification to unlock production tasks for this domain. Minimum passing score: 85%.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Lessons Completed",`${lesson+1}/${m.lessons.length}`,lesson>=m.lessons.length-1?C.success:C.warn],["Exercise Score",score.total>0?`${Math.round(score.correct/score.total*100)}%`:"Not started",score.total>0&&score.correct/score.total>=.85?C.success:C.warn],["Gold Set Required","20 tasks",C.muted],["Status",score.total>0&&score.correct/score.total>=.85&&lesson>=m.lessons.length-1?"Ready to certify":"Complete lessons first",score.total>0&&score.correct/score.total>=.85&&lesson>=m.lessons.length-1?C.success:C.warn]].map(([l,v,c])=>(
              <div key={l} style={{background:C.faint,borderRadius:8,padding:"10px 12px"}}><div style={{color:C.muted,fontSize:10,marginBottom:3}}>{l}</div><div style={{color:c,fontWeight:700,fontSize:14}}>{v}</div></div>
            ))}
          </div>
          <Btn color={m.color} disabled={!(score.total>0&&score.correct/score.total>=.85&&lesson>=m.lessons.length-1)}>Start Certification Exam</Btn>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// QA, TALENT, CLIENT (condensed)
// ══════════════════════════════════════════════════════════════════════════════
// ── QA SOURCES DATA ───────────────────────────────────────────────────────────
const QA_SOURCES=[
  {id:"argilla",name:"Argilla",icon:"🏷️",type:"Human Eval Platform",color:"#6366f1",
   desc:"Open-source human feedback & annotation review UI. Feeds labeler disagreement and correction data into LabelForge.",
   signal:"Labeler disagreement, correction edits, confidence scores",
   trigger:"On task submission → Argilla webhook → QA queue",
   output:"Review flags, corrected labels, annotator feedback",
   integration:"REST API → LabelForge QA Engine",
   metrics:{tasks:"12,400",flagRate:"6.2%",avgConf:"4.1/5"}},
  {id:"labelbox",name:"Labelbox",icon:"📦",type:"Annotation QA",color:"#0891b2",
   desc:"Enterprise labeling platform feeding IAA scores, review queues, and consensus signals directly into the QA dashboard.",
   signal:"IAA scores, review queue, consensus data, annotator stats",
   trigger:"Batch completion → Labelbox API → score ingestion",
   output:"Per-task quality scores, reviewer assignments",
   integration:"Labelbox GraphQL API → LabelForge",
   metrics:{tasks:"8,720",flagRate:"4.1%",avgConf:"4.3/5"}},
  {id:"scaleeval",name:"Scale Eval",icon:"⚖️",type:"Model Eval",color:"#059669",
   desc:"Automated LLM evaluation scoring rubrics (Helpfulness, Harmlessness, Honesty). Feeds model-scored quality signals.",
   signal:"LLM output quality scores (HHH rubric), benchmark evals",
   trigger:"Post-annotation → Scale Eval API batch scoring",
   output:"Helpfulness / harmlessness / honesty scores per response",
   integration:"Scale Eval REST API → QA score table",
   metrics:{tasks:"5,100",flagRate:"8.7%",avgConf:"3.9/5"}},
  {id:"autoval",name:"Auto-Validator",icon:"🤖",type:"Internal Rule Engine",color:"#d97706",
   desc:"Internal schema, format, and outlier detection running in real-time on every submitted task. First line of defence.",
   signal:"Schema errors, outlier scores, format violations",
   trigger:"Real-time on every task submission — synchronous",
   output:"Pass/fail + error type and field for each task",
   integration:"Internal rule engine → immediate QA flag + annotator notification",
   metrics:{tasks:"All tasks",flagRate:"2.2%",avgConf:"N/A"}},
  {id:"goldset",name:"Gold Set Engine",icon:"🏅",type:"Internal Benchmark",color:"#be185d",
   desc:"Hidden gold-standard tasks injected randomly into annotator queues (5–10%). Used to continuously benchmark accuracy.",
   signal:"Annotator accuracy against known-correct answers",
   trigger:"Gold tasks injected randomly — 5–10% of queue per session",
   output:"Per-annotator accuracy scores, tier promotion/demotion flags",
   integration:"Gold Set DB → Annotator perf engine → QA + Talent Hub",
   metrics:{tasks:"~1,200 gold",flagRate:"9.1% fail",avgConf:"N/A"}},
  {id:"iaa",name:"IAA Engine",icon:"📐",type:"Statistical QA",color:"#7c3aed",
   desc:"Computes Cohen's Kappa and Fleiss' Kappa across annotator pairs for every batch with 3+ annotator overlap.",
   signal:"Cohen's Kappa / Fleiss' Kappa across annotator pairs",
   trigger:"Per batch on tasks with 3+ annotator responses",
   output:"Kappa scores, low-agreement flags, adjudication queue items",
   integration:"Statistical engine → QA dashboard + dispute queue",
   metrics:{tasks:"All 3x tasks",flagRate:"κ<0.6 flagged",avgConf:"κ=0.91 avg"}},
];

const QA_TASKS=[
  {id:"q1",ann:"Aisha K.",task:"Rank RLHF responses #4821",score:98,source:"Gold Set",domain:"RL / RLHF",flag:null,tier:1,time:"2m ago"},
  {id:"q2",ann:"Chen W.",task:"Bug label Python #3302",score:72,source:"Auto-Validator",domain:"Code",flag:"Schema mismatch — field 'severity' missing",tier:0,time:"5m ago"},
  {id:"q3",ann:"Miguel R.",task:"Bounding box frame #9910",score:95,source:"Labelbox",domain:"Video",flag:null,tier:1,time:"8m ago"},
  {id:"q4",ann:"Jordan T.",task:"Math step grade #1201",score:81,source:"Gold Set",domain:"STEM",flag:"Below 85% threshold",tier:2,time:"12m ago"},
  {id:"q5",ann:"Priya S.",task:"NER contract clause #7723",score:99,source:"IAA Engine",domain:"Enterprise Workflow",flag:null,tier:1,time:"14m ago"},
  {id:"q6",ann:"Fatima N.",task:"Audio transcription #2201",score:88,source:"Argilla",domain:"Audio",flag:"Low confidence flagged by reviewer",tier:2,time:"18m ago"},
  {id:"q7",ann:"Chen W.",task:"Function call eval #5510",score:65,source:"Scale Eval",domain:"Function Calling",flag:"HHH score below threshold",tier:2,time:"22m ago"},
];

function QAView(){
  const [tab,setTab]=useState("overview");
  const [selectedTask,setSelectedTask]=useState(null);
  const [taskActions,setTaskActions]=useState({});
  const [selSource,setSelSource]=useState(null);
  const [filterDomain,setFilterDomain]=useState("All");
  const [filterTier,setFilterTier]=useState("All");

  const handleAction=(taskId,action)=>{
    setTaskActions(p=>({...p,[taskId]:action}));
    if(selectedTask?.id===taskId)setSelectedTask(null);
  };

  const filteredTasks=QA_TASKS.filter(t=>{
    if(filterDomain!=="All"&&t.domain!==filterDomain)return false;
    if(filterTier!=="All"&&String(t.tier)!==filterTier)return false;
    return true;
  });

  const tabs=[
    {id:"overview",label:"Overview"},
    {id:"sources",label:"Eval Sources"},
    {id:"tasks",label:`QA Tasks ${QA_TASKS.filter(t=>!taskActions[t.id]).length}`},
    {id:"tiers",label:"QA Tiers"},
    {id:"project-qa",label:"By Project"},
    {id:"disputes",label:"Disputes 3"},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Quality Assurance</h2>

      {/* Tab bar */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?C.accent+"33":"transparent",border:`1px solid ${tab===t.id?C.accent:C.border}`,borderRadius:7,padding:"6px 14px",color:tab===t.id?C.accentHover:C.muted,cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:400}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab==="overview"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
          <Kpi icon="📐" label="Avg IAA (κ)" value="0.91" sub="Cohen's Kappa" color={C.success}/>
          <Kpi icon="🏅" label="Gold Pass Rate" value="91.4%" sub="Last 7 days" color={C.accent}/>
          <Kpi icon="🤖" label="Auto-Val Pass" value="97.8%" sub="Schema & format" color={C.success}/>
          <Kpi icon="⚠️" label="Disputed" value="38" sub="Awaiting adjudication" color={C.warn}/>
          <Kpi icon="✗" label="Rejected" value="12" sub="Returned to annotator" color={C.danger}/>
        </div>

        {/* Signal flow */}
        <Card>
          <SecTitle color={C.accent}>Quality Signal Sources → LabelForge QA Dashboard</SecTitle>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:14}}>
            {QA_SOURCES.map(s=>(
              <div key={s.id} onClick={()=>setSelSource(selSource===s.id?null:s.id)}
                style={{flex:"1 1 160px",background:selSource===s.id?s.color+"22":C.faint,border:`1.5px solid ${selSource===s.id?s.color:s.color+"33"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <div><div style={{color:s.color,fontWeight:700,fontSize:12}}>{s.name}</div><Tag label={s.type} color={s.color} xs/></div>
                </div>
                <div style={{color:C.muted,fontSize:11,lineHeight:1.5}}>{s.desc.split(".")[0]}.</div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                  <span style={{color:C.muted,fontSize:9}}>Flag rate</span>
                  <span style={{color:s.color,fontWeight:700,fontSize:10}}>{s.metrics.flagRate}</span>
                </div>
              </div>
            ))}
          </div>
          {selSource&&(()=>{const s=QA_SOURCES.find(x=>x.id===selSource);return(
            <div style={{background:s.color+"11",border:`1.5px solid ${s.color}44`,borderRadius:10,padding:14}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:22}}>{s.icon}</span>
                <div><div style={{color:s.color,fontWeight:800,fontSize:14}}>{s.name}</div><div style={{color:C.muted,fontSize:11}}>{s.desc}</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8}}>
                {[["Signal",s.signal,"#38bdf8"],["Trigger",s.trigger,s.color],["Output",s.output,C.success],["Integration",s.integration,C.warn]].map(([k,v,c])=>(
                  <div key={k} style={{background:C.card,borderRadius:8,padding:"9px 11px",border:`1px solid ${c}22`}}>
                    <div style={{color:c,fontSize:9,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div>
                    <div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
                {Object.entries(s.metrics).map(([k,v])=>(
                  <div key={k} style={{background:C.card,borderRadius:7,padding:"6px 10px"}}>
                    <div style={{color:C.muted,fontSize:9,textTransform:"uppercase"}}>{k==="tasks"?"Tasks Processed":k==="flagRate"?"Flag Rate":"Avg Confidence"}</div>
                    <div style={{color:s.color,fontWeight:800,fontSize:14}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          );})()}
          {/* Pipeline flow */}
          <div style={{marginTop:14,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            {QA_SOURCES.map((s,i)=><span key={s.id} style={{display:"flex",alignItems:"center",gap:5}}><span style={{background:s.color+"22",color:s.color,border:`1px solid ${s.color}44`,borderRadius:6,fontSize:10,fontWeight:700,padding:"2px 8px"}}>{s.icon} {s.name}</span>{i<QA_SOURCES.length-1&&<span style={{color:C.border,fontSize:12}}>+</span>}</span>)}
            <span style={{color:C.border,fontSize:14}}>→</span>
            <span style={{background:C.accent+"33",color:C.accentHover,border:`1px solid ${C.accent}`,borderRadius:6,fontSize:10,fontWeight:700,padding:"3px 10px"}}>✦ LabelForge QA Dashboard</span>
          </div>
        </Card>

        {/* Per-project QA health */}
        <Card>
          <SecTitle>QA Health by Project</SecTitle>
          {PROJECTS.map(p=>{
            const dc=DC[p.domain];
            const iaa=(91+Math.random()*7).toFixed(1);
            return(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid ${C.border}22`,flexWrap:"wrap"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:dc,flexShrink:0}}/>
                <div style={{flex:2,minWidth:120}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{p.name}</div><div style={{color:C.muted,fontSize:10}}>{p.domain}</div></div>
                <div style={{width:100}}><Bar pct={Math.round(p.done/p.tasks*100)} color={dc}/><span style={{color:C.muted,fontSize:9}}>{Math.round(p.done/p.tasks*100)}% complete</span></div>
                <Tag label={`IAA κ=${iaa}`} color={parseFloat(iaa)>0.85?C.success:C.warn} xs/>
                <Tag label={p.status} color={p.status==="active"?C.success:p.status==="review"?C.warn:C.muted} xs/>
              </div>
            );
          })}
        </Card>
      </>}

      {/* ── EVAL SOURCES ── */}
      {tab==="sources"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {QA_SOURCES.map(s=>(
            <Card key={s.id} style={{borderColor:s.color+"44"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
                <div style={{width:46,height:46,background:s.color+"22",border:`2px solid ${s.color}55`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{color:s.color,fontWeight:800,fontSize:15}}>{s.name}</span>
                    <Tag label={s.type} color={s.color}/>
                    <Tag label={`Flag rate: ${s.metrics.flagRate}`} color={s.color} xs/>
                  </div>
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:12}}>{s.desc}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
                    {[["Signal",s.signal,"#38bdf8"],["Trigger",s.trigger,s.color],["Output",s.output,C.success],["Integration",s.integration,C.warn]].map(([k,v,c])=>(
                      <div key={k} style={{background:C.faint,borderRadius:8,padding:"9px 11px",border:`1px solid ${c}22`}}>
                        <div style={{color:c,fontSize:9,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{k}</div>
                        <div style={{color:C.text,fontSize:11,lineHeight:1.5}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
                    {Object.entries(s.metrics).map(([k,v])=>(
                      <div key={k} style={{background:C.card,borderRadius:7,padding:"6px 12px",border:`1px solid ${s.color}22`}}>
                        <div style={{color:C.muted,fontSize:9,textTransform:"uppercase"}}>{k==="tasks"?"Processed":k==="flagRate"?"Flag Rate":"Avg Conf"}</div>
                        <div style={{color:s.color,fontWeight:800,fontSize:14}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── QA TASKS ── */}
      {tab==="tasks"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Filters */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{color:C.muted,fontSize:11}}>Domain:</span>
              {["All",...Object.keys(DC)].map(d=><button key={d} onClick={()=>setFilterDomain(d)} style={{background:filterDomain===d?(DC[d]||C.accent)+"33":"transparent",border:`1px solid ${filterDomain===d?(DC[d]||C.accent):C.border}`,borderRadius:6,padding:"3px 8px",color:filterDomain===d?(DC[d]||C.accentHover):C.muted,cursor:"pointer",fontSize:10,fontWeight:filterDomain===d?700:400}}>{d==="All"?"All":d}</button>)}
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",marginLeft:8}}>
              <span style={{color:C.muted,fontSize:11}}>Tier:</span>
              {["All","0","1","2","3"].map(t=><button key={t} onClick={()=>setFilterTier(t)} style={{background:filterTier===t?C.accent+"33":"transparent",border:`1px solid ${filterTier===t?C.accent:C.border}`,borderRadius:6,padding:"3px 8px",color:filterTier===t?C.accentHover:C.muted,cursor:"pointer",fontSize:10,fontWeight:filterTier===t?700:400}}>{t==="All"?"All":t==="0"?"T0":t==="1"?"T1":t==="2"?"T2":"T3"}</button>)}
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              <Tag label={`${filteredTasks.filter(t=>!taskActions[t.id]).length} pending`} color={C.warn}/>
              <Tag label={`${filteredTasks.filter(t=>t.flag&&!taskActions[t.id]).length} flagged`} color={C.danger}/>
            </div>
          </div>

          {/* Task list */}
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.text,fontWeight:700,fontSize:13}}>QA Task Queue</span>
              <div style={{display:"flex",gap:6}}>
                <Btn sm outline color={C.success} onClick={()=>filteredTasks.forEach(t=>handleAction(t.id,"approved"))}>Approve All Passing</Btn>
              </div>
            </div>
            {filteredTasks.map(t=>{
              const action=taskActions[t.id];
              const src=QA_SOURCES.find(s=>s.name===t.source);
              return(
                <div key={t.id}>
                  <div onClick={()=>setSelectedTask(selectedTask?.id===t.id?null:t)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`,cursor:"pointer",background:action?"transparent":selectedTask?.id===t.id?C.surface+"88":"transparent",opacity:action?0.5:1,transition:"all .15s"}}
                    onMouseEnter={e=>!action&&(e.currentTarget.style.background=C.surface)}
                    onMouseLeave={e=>!action&&selectedTask?.id!==t.id&&(e.currentTarget.style.background="transparent")}>
                    {action&&<span style={{fontSize:14}}>{action==="approved"?"✅":"❌"}</span>}
                    <Tag label={`T${t.tier}`} color={t.tier===0?C.warn:t.tier===1?C.accent:t.tier===2?"#0891b2":C.success} xs/>
                    <Tag label={t.domain} color={DC[t.domain]||C.accent} xs/>
                    <div style={{flex:2,minWidth:120}}><div style={{color:action?C.muted:C.text,fontSize:12,textDecoration:action?"line-through":"none"}}>{t.task}</div><div style={{color:C.muted,fontSize:10}}>{t.ann} · {t.time}</div></div>
                    {src&&<Tag label={src.icon+" "+t.source} color={src.color} xs/>}
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:t.score>90?C.success:t.score>80?C.warn:C.danger,fontWeight:700,fontSize:12,width:34}}>{t.score}%</span>
                      <div style={{width:50}}><Bar pct={t.score} color={t.score>90?C.success:t.score>80?C.warn:C.danger}/></div>
                    </div>
                    {t.flag?<Tag label={`⚠ ${t.flag.split("—")[0]}`} color={C.danger} xs/>:<Tag label="Passed" color={C.success} xs/>}
                    {!action&&<div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                      <Btn sm color={C.success} outline onClick={()=>handleAction(t.id,"approved")}>✓</Btn>
                      <Btn sm color={C.danger} outline onClick={()=>handleAction(t.id,"rejected")}>✗</Btn>
                    </div>}
                    {action&&<Tag label={action} color={action==="approved"?C.success:C.danger} xs/>}
                    <span style={{color:C.muted,fontSize:12}}>{selectedTask?.id===t.id?"▲":"▼"}</span>
                  </div>

                  {/* Expanded task detail */}
                  {selectedTask?.id===t.id&&(
                    <div style={{background:C.faint,borderLeft:`3px solid ${DC[t.domain]||C.accent}`,padding:"14px 18px",borderBottom:`1px solid ${C.border}22`}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:14}}>
                        <div><div style={{color:C.muted,fontSize:10,fontWeight:700,marginBottom:4}}>ANNOTATOR</div><div style={{color:C.text,fontSize:12,fontWeight:600}}>{t.ann}</div><div style={{color:C.muted,fontSize:10}}>Accuracy: 94.2% (30-day avg)</div></div>
                        <div><div style={{color:C.muted,fontSize:10,fontWeight:700,marginBottom:4}}>QA SOURCE</div><div style={{color:QA_SOURCES.find(s=>s.name===t.source)?.color||C.accent,fontSize:12,fontWeight:600}}>{t.source}</div><div style={{color:C.muted,fontSize:10}}>Triggered 2 flags this session</div></div>
                        <div><div style={{color:C.muted,fontSize:10,fontWeight:700,marginBottom:4}}>SCORE BREAKDOWN</div><div style={{color:t.score>90?C.success:t.score>80?C.warn:C.danger,fontSize:22,fontWeight:800}}>{t.score}%</div></div>
                        {t.flag&&<div style={{background:C.danger+"11",border:`1px solid ${C.danger}33`,borderRadius:8,padding:"8px 10px"}}><div style={{color:C.danger,fontSize:10,fontWeight:700,marginBottom:3}}>FLAG DETAIL</div><div style={{color:C.text,fontSize:11}}>{t.flag}</div></div>}
                      </div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <Btn sm color={C.success} onClick={()=>handleAction(t.id,"approved")}>✓ Approve</Btn>
                        <Btn sm color={C.danger} onClick={()=>handleAction(t.id,"rejected")}>✗ Reject & Return</Btn>
                        <Btn sm outline color={C.warn}>⚠ Escalate to Tier 2</Btn>
                        <Btn sm outline color={C.accent}>Send to Adjudication</Btn>
                        <Btn sm outline color={C.muted}>View Full Task</Btn>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── QA TIERS ── */}
      {tab==="tiers"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card><SecTitle>Multi-Tier QA Pipeline</SecTitle>
            <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",paddingBottom:8,marginBottom:14}}>
              {[{t:"Tier 0",n:"Auto-Validation",c:C.warn},{t:"Tier 1",n:"Peer Review",c:C.accent},{t:"Tier 2",n:"Senior QA",c:"#0891b2"},{t:"Tier 3",n:"Client Check",c:C.success}].map((x,i)=>(
                <div key={x.t} style={{display:"flex",alignItems:"center",flex:1,minWidth:80}}>
                  <div style={{flex:1,background:x.c+"22",border:`1.5px solid ${x.c}44`,borderRadius:9,padding:"8px 6px",textAlign:"center"}}>
                    <div style={{color:x.c,fontWeight:800,fontSize:11}}>{x.t}</div>
                    <div style={{color:C.muted,fontSize:10}}>{x.n}</div>
                  </div>
                  {i<3&&<div style={{width:16,height:2,background:C.border,flexShrink:0}}/>}
                </div>
              ))}
            </div>
          </Card>
          {[
            {tier:"Tier 0",name:"Auto-Validation",icon:"🤖",color:C.warn,source:"Auto-Validator (Internal)",pass:"97.8%",volume:"100% of tasks",
             desc:"Every submitted task passes through automated schema, format, and outlier detection. ~100% coverage. Failures immediately returned to annotator with specific error.",
             checks:["JSON schema validation","Required field presence","Value range checks","Outlier score detection","Format & encoding validation","Duplicate submission detection"]},
            {tier:"Tier 1",name:"Peer Review",icon:"👁️",color:C.accent,source:"Argilla / Labelbox",pass:"93.2%",volume:"20% of tasks",
             desc:"Random 20% sample reviewed by a second annotator. IAA computed. Low-agreement tasks (κ < 0.6) automatically escalated to Tier 2.",
             checks:["Random 20% sampling","Second annotator assignment","IAA calculation (Cohen's κ)","Low-agreement flagging (κ<0.6)","Domain-specific rubric checks","Reviewer feedback to annotator"]},
            {tier:"Tier 2",name:"Senior QA Review",icon:"🔬",color:"#0891b2",source:"Internal + Scale Eval + Gold Set",pass:"91.4%",volume:"~8% of tasks",
             desc:"Flagged tasks reviewed by senior QA specialists. Gold set re-tests run. Model eval scoring applied via Scale Eval for LLM tasks.",
             checks:["Senior reviewer assignment","Gold set re-testing","Scale Eval model scoring","Deep rubric evaluation","Annotator performance update","Adjudication queue routing"]},
            {tier:"Tier 3",name:"Client Spot-Check",icon:"🤝",color:C.success,source:"Client / Delivered sample",pass:"90.1%",volume:"5% of tasks",
             desc:"Client receives a random 5% sample for spot-check before final delivery sign-off. Client flags feed back into QA scoring.",
             checks:["5% random sample export","Client review portal access","Client flag ingestion","QA report generation","Sign-off confirmation","Delivery unlock trigger"]},
          ].map(tier=>(
            <Card key={tier.tier} style={{borderColor:tier.color+"44"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
                <div style={{background:tier.color+"22",border:`1.5px solid ${tier.color}`,borderRadius:10,padding:"10px 12px",fontSize:24,flexShrink:0}}>{tier.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                    <span style={{color:tier.color,fontWeight:800,fontSize:15}}>{tier.tier}: {tier.name}</span>
                    <Tag label={`Pass: ${tier.pass}`} color={C.success}/>
                    <Tag label={`Coverage: ${tier.volume}`} color={C.muted}/>
                    <Tag label={`Source: ${tier.source}`} color={tier.color} xs/>
                  </div>
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:10}}>{tier.desc}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {tier.checks.map(c=>(
                      <div key={c} style={{display:"flex",alignItems:"center",gap:5,background:tier.color+"11",border:`1px solid ${tier.color}22`,borderRadius:6,padding:"3px 9px"}}>
                        <span style={{color:tier.color,fontSize:10}}>✓</span>
                        <span style={{color:C.text,fontSize:11}}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── BY PROJECT ── */}
      {tab==="project-qa"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {PROJECTS.map(p=>{
            const dc=DC[p.domain];
            const iaa=(0.88+Math.random()*0.1).toFixed(2);
            const gold=(88+Math.random()*10).toFixed(1);
            const auto=(96+Math.random()*3).toFixed(1);
            const disputed=Math.floor(Math.random()*15);
            return(
              <Card key={p.id} style={{borderColor:dc+"33"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
                  <div><div style={{color:C.text,fontWeight:700,fontSize:14}}>{p.name}</div><div style={{color:C.muted,fontSize:11}}>{p.domain} · {p.client}</div></div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <Tag label={p.status} color={p.status==="active"?C.success:p.status==="review"?C.warn:C.muted}/>
                    <Tag label={`κ=${iaa}`} color={parseFloat(iaa)>0.85?C.success:C.warn}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
                  {[["IAA Score",`κ=${iaa}`,parseFloat(iaa)>0.85?C.success:C.warn],["Gold Pass",`${gold}%`,parseFloat(gold)>90?C.success:C.warn],["Auto-Val",`${auto}%`,C.success],["Disputed",`${disputed}`,disputed>5?C.warn:C.muted]].map(([l,v,c])=>(
                    <div key={l} style={{background:C.faint,borderRadius:8,padding:"9px 12px",border:`1px solid ${c}22`}}>
                      <div style={{color:C.muted,fontSize:10}}>{l}</div>
                      <div style={{color:c,fontWeight:800,fontSize:16}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.muted,fontSize:10}}>QA Pipeline Progress</span><span style={{color:dc,fontSize:10,fontWeight:700}}>{Math.round(p.done/p.tasks*100)}% tasks through QA</span></div>
                  <Bar pct={Math.round(p.done/p.tasks*100)} color={dc} h={6}/>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── DISPUTES ── */}
      {tab==="disputes"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
            <Kpi label="Open Disputes" value="3" color={C.danger}/>
            <Kpi label="Avg Resolution Time" value="4.2h" color={C.warn}/>
            <Kpi label="Resolved This Week" value="14" color={C.success}/>
          </div>
          {[
            {id:"D-441",task:"RLHF ranking #4400",domain:"RL / RLHF",annotators:["Aisha K.","Miguel R."],disagreement:"Response A vs B — opposite rankings",status:"open",age:"2h"},
            {id:"D-438",task:"Bounding box #9801",domain:"Video",annotators:["Chen W.","Priya S."],disagreement:"BBox size discrepancy >15%",status:"open",age:"5h"},
            {id:"D-435",task:"NER clause #7600",domain:"Enterprise Workflow",annotators:["Fatima N.","Jordan T."],disagreement:"Entity type: 'Party' vs 'Organization'",status:"open",age:"9h"},
          ].map(d=>(
            <Card key={d.id} style={{borderColor:C.danger+"33"}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Tag label={d.id} color={C.danger}/>
                  <span style={{color:C.text,fontWeight:700,fontSize:13}}>{d.task}</span>
                  <Tag label={d.domain} color={DC[d.domain]||C.accent} xs/>
                </div>
                <Tag label={`Open · ${d.age} old`} color={C.warn} xs/>
              </div>
              <div style={{color:C.muted,fontSize:12,marginBottom:8}}>
                <span style={{fontWeight:600,color:C.text}}>Disagreement: </span>{d.disagreement}
              </div>
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                {d.annotators.map(a=>(
                  <div key={a} style={{background:C.faint,borderRadius:6,padding:"4px 10px",fontSize:11,color:C.text}}>👤 {a}</div>
                ))}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Btn sm color={C.success}>✓ Accept Annotator A</Btn>
                <Btn sm color={"#0891b2"}>✓ Accept Annotator B</Btn>
                <Btn sm outline color={C.accent}>Assign Senior Reviewer</Btn>
                <Btn sm outline color={C.muted}>Request Re-annotation</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TalentHub(){return(<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Talent Hub</h2><Btn>+ Onboard</Btn></div><div style={{display:"flex",flexWrap:"wrap",gap:12}}><Kpi label="Active" value="214" color={C.success}/><Kpi label="Onboarding" value="12" color={C.warn}/><Kpi label="On PIP" value="3" color={C.danger}/><Kpi label="Offboarded" value="19" color={C.muted}/></div><Card style={{padding:0,overflow:"hidden"}}><div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.text,fontWeight:700,fontSize:13}}>Roster</span></div>{[{n:"Aisha K.",tier:"Senior",domain:"RL / RLHF",acc:98.2,status:"active"},{n:"Miguel R.",tier:"Mid",domain:"Video",acc:97.5,status:"active"},{n:"Jordan T.",tier:"Junior",domain:"STEM",acc:null,status:"onboarding"},{n:"Chen W.",tier:"Mid",domain:"Code",acc:84.2,status:"pip"}].map(w=><div key={w.n} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`}}><div style={{width:30,height:30,borderRadius:"50%",background:C.accent+"33",border:`1.5px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.accent,fontWeight:700}}>{w.n[0]}</div><div style={{flex:2}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{w.n}</div><div style={{color:C.muted,fontSize:10}}>{w.tier}</div></div><Tag label={w.domain} color={DC[w.domain]||C.accent} xs/>{w.acc?<Tag label={`${w.acc}%`} color={w.acc>95?C.success:w.acc>88?C.warn:C.danger} xs/>:<Tag label="Not rated" color={C.muted} xs/>}<Tag label={w.status} color={w.status==="active"?C.success:w.status==="onboarding"?C.warn:C.danger} xs/></div>)}</Card></div>);}

function ClientDash(){const total=PROJECTS.reduce((s,p)=>s+p.tasks,0);const done=PROJECTS.reduce((s,p)=>s+p.done,0);return(<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Project Overview</h2><div style={{display:"flex",flexWrap:"wrap",gap:12}}><Kpi label="Active Projects" value={PROJECTS.filter(p=>p.status==="active").length} color={C.success}/><Kpi label="Tasks Complete" value={done.toLocaleString()} sub={`of ${total.toLocaleString()}`} color={C.accent}/><Kpi label="Avg QA Score" value="93.8%" color={C.success}/><Kpi label="Next Delivery" value="Mar 3" color={C.warn}/></div>{PROJECTS.filter(p=>p.status!=="draft").map(p=>{const pct=Math.round(p.done/p.tasks*100);const dc=DC[p.domain];return(<Card key={p.id} style={{borderColor:dc+"33"}}><div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}><div><div style={{color:C.text,fontWeight:700,fontSize:14}}>{p.name}</div><div style={{color:C.muted,fontSize:11}}>{p.domain} · Due {p.due}</div></div><div style={{display:"flex",gap:6}}><Tag label={p.status} color={p.status==="active"?C.success:C.warn}/><Tag label={`${pct}%`} color={dc}/></div></div><Bar pct={pct} color={dc} h={8}/><div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><span style={{color:C.muted,fontSize:11}}>{p.done}/{p.tasks} tasks</span><span style={{color:C.success,fontSize:11,fontWeight:700}}>QA: 94.1%</span></div></Card>);})}</div>);}

function ClientDelivery(){return(<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Delivery</h2>{[{name:"SAT Math Grading",status:"ready",date:"Feb 25",size:"12.4 MB",fmt:"JSONL"},{name:"GPT-5 RLHF Batch 11",status:"delivered",date:"Feb 10",size:"38.1 MB",fmt:"Parquet"},{name:"Contract NER 2025",status:"delivered",date:"Jan 20",size:"8.7 MB",fmt:"JSON"}].map(d=><Card key={d.name} style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}><div style={{flex:2}}><div style={{color:C.text,fontWeight:700,fontSize:13}}>{d.name}</div><div style={{color:C.muted,fontSize:11}}>{d.date} · {d.size} · {d.fmt}</div></div><Tag label={d.status} color={d.status==="ready"?C.success:C.muted}/>{d.status==="ready"?<Btn color={C.success} sm>⬇ Download</Btn>:<Btn outline color={C.muted} sm>View Report</Btn>}</Card>)}</div>);}

function NewProject({setView}){const [step,setStep]=useState(1);const [domain,setDomain]=useState(null);const [name,setName]=useState("");return(<div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:640}}><div style={{display:"flex",gap:10,alignItems:"center"}}><Btn outline sm onClick={()=>setView("workflow")}>← Back to Workflow</Btn><h2 style={{margin:0,color:C.text,fontSize:18,fontWeight:800}}>New Project</h2></div><div style={{display:"flex",gap:6,alignItems:"center"}}>{[1,2,3].map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:24,height:24,borderRadius:"50%",background:step>=s?C.accent:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step>=s?"#fff":C.muted}}>{s}</div><span style={{fontSize:11,color:step>=s?C.text:C.muted}}>{["Domain","Details","Launch"][s-1]}</span>{s<3&&<span style={{color:C.border,margin:"0 4px"}}>→</span>}</div>)}</div>{step===1&&<Card><SecTitle>Select Domain</SecTitle><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{Object.entries(DC).map(([d,c])=><button key={d} onClick={()=>setDomain(d)} style={{background:domain===d?c+"33":"transparent",border:`2px solid ${domain===d?c:C.border}`,borderRadius:9,padding:"10px 14px",color:domain===d?c:C.muted,cursor:"pointer",fontSize:12,fontWeight:600}}>{d}</button>)}</div><Btn onClick={()=>domain&&setStep(2)} disabled={!domain}>Next →</Btn></Card>}{step===2&&<Card style={{display:"flex",flexDirection:"column",gap:12}}><SecTitle>Project Details</SecTitle>{[["Project Name","e.g. RLHF Batch 14"],["Client","e.g. OpenModel AI"],["Budget ($)","120000"],["Due Date","YYYY-MM-DD"],["Min Annotators","3"]].map(([l,ph],i)=><div key={l}><div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l}</div><Input placeholder={ph} onChange={i===0?e=>setName(e.target.value):undefined}/></div>)}<div style={{display:"flex",gap:8}}><Btn outline sm onClick={()=>setStep(1)}>← Back</Btn><Btn onClick={()=>setStep(3)}>Next →</Btn></div></Card>}{step===3&&<Card><SecTitle>Review & Launch</SecTitle>{[["Domain",domain||"—"],["Project Name",name||"(untitled)"],["Consensus","Majority Vote (3 annotators)"],["QA Threshold","90%"],["Pre-labeling","Enabled"]].map(([k,v])=><div key={k} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{color:C.muted,fontSize:12,width:160}}>{k}</span><span style={{color:C.text,fontSize:12,fontWeight:500}}>{v}</span></div>)}<div style={{display:"flex",gap:8,marginTop:16}}><Btn outline sm onClick={()=>setStep(2)}>← Back</Btn><Btn color={C.success} onClick={()=>setView("delivery")}>🚀 Launch Project</Btn></div></Card>}</div>);}

function RoleManager(){return(<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Role Manager</h2><p style={{color:C.muted,fontSize:12,margin:0}}>Configure role permissions and nav access. Admin only.</p>{ROLES.map(r=><Card key={r.id} style={{borderColor:r.color+"44"}}><div style={{display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:40,height:40,borderRadius:10,background:r.color+"22",border:`1.5px solid ${r.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.icon}</div><div style={{flex:1}}><div style={{color:r.color,fontWeight:800,fontSize:14,marginBottom:4}}>{r.label}</div><div style={{color:C.muted,fontSize:12,marginBottom:8}}>{r.desc}</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{r.nav.map(n=><Tag key={n} label={NAV_META[n]?.label||n} color={r.color} xs/>)}</div></div><Btn sm outline color={r.color}>Edit Access</Btn></div></Card>)}</div>);}

function MyTasks({setView}){return(<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>My Tasks</h2><div style={{display:"flex",flexWrap:"wrap",gap:12}}><Kpi label="Assigned" value="24" color={C.accent}/><Kpi label="Completed Today" value="18" color={C.success}/><Kpi label="Accuracy" value="98.2%" color={C.success}/><Kpi label="Earnings Today" value="$42.50" color={C.warn}/></div><Card style={{padding:0,overflow:"hidden"}}><div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.text,fontWeight:700,fontSize:13}}>Task Queue</span></div>{[{domain:"RL / RLHF",task:"Rank assistant responses #4821",est:"~2 min",pay:"$0.25"},{domain:"RL / RLHF",task:"Preference comparison #4822",est:"~2 min",pay:"$0.25"},{domain:"Code",task:"Review Python snippet #3301",est:"~3 min",pay:"$0.35"},{domain:"STEM",task:"Grade math solution #1200",est:"~4 min",pay:"$0.40"}].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`,flexWrap:"wrap"}}><Tag label={t.domain} color={DC[t.domain]||C.accent}/><div style={{flex:2,color:C.text,fontSize:12}}>{t.task}</div><span style={{color:C.muted,fontSize:11}}>{t.est}</span><Tag label={t.pay} color={C.success}/><Btn sm onClick={()=>setView("workbench")}>Start →</Btn></div>)}</Card></div>);}

function MyEarnings(){return(<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>My Earnings</h2><div style={{display:"flex",flexWrap:"wrap",gap:12}}><Kpi label="This Week" value="$187.50" color={C.success}/><Kpi label="This Month" value="$724.00" color={C.success}/><Kpi label="Tasks Done" value="1,240" color={C.accent}/><Kpi label="Next Payout" value="Mar 1" color={C.warn}/></div><Card><SecTitle>Recent Payments</SecTitle>{[{date:"Feb 15",amount:"$362.00",tasks:724},{date:"Feb 1",amount:"$298.50",tasks:597},{date:"Jan 15",amount:"$63.50",tasks:127}].map(p=><div key={p.date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}22`}}><div><div style={{color:C.text,fontSize:12,fontWeight:600}}>{p.date}</div><div style={{color:C.muted,fontSize:10}}>{p.tasks} tasks</div></div><span style={{color:C.success,fontWeight:700,fontSize:14}}>{p.amount}</span></div>)}</Card></div>);}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [role,setRole]=useState(null);
  const [view,setView]=useState(null);
  const [activeProject,setActiveProject]=useState(null);

  const login=r=>{setRole(r);setView(ROLES.find(x=>x.id===r)?.defaultView||"delivery");};
  const logout=()=>{setRole(null);setView(null);};

  if(!role)return <Login onLogin={login}/>;

  const roleObj=ROLES.find(r=>r.id===role);
  const navIds=roleObj?.nav||[];
  const groups={};
  navIds.forEach(id=>{const m=NAV_META[id];if(!m)return;const g=m.group||"OTHER";if(!groups[g])groups[g]=[];groups[g].push({id,...m});});

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:196,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"16px 10px",gap:2,flexShrink:0,overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px 16px"}}>
          <div style={{width:30,height:30,background:C.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>✦</div>
          <span style={{fontWeight:800,fontSize:15,color:C.text}}>LabelForge</span>
        </div>
        <div style={{background:roleObj.color+"22",border:`1px solid ${roleObj.color}44`,borderRadius:8,padding:"7px 10px",marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:14}}>{roleObj.icon}</span>
          <div><div style={{color:roleObj.color,fontSize:11,fontWeight:700}}>{roleObj.label}</div><div style={{color:C.muted,fontSize:9}}>Active session</div></div>
        </div>
        {Object.entries(groups).map(([g,items])=>(
          <div key={g} style={{marginBottom:10}}>
            <div style={{fontSize:9,fontWeight:700,color:C.muted,letterSpacing:".1em",padding:"0 12px",marginBottom:4}}>{g}</div>
            {items.map(n=><NavBtn key={n.id} icon={n.icon} label={n.label} active={view===n.id} onClick={()=>setView(n.id)} badge={n.badge}/>)}
          </div>
        ))}
        <div style={{flex:1}}/>
        <button onClick={logout} style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",color:C.muted,cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span>↩</span>Switch Role</button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
        {view==="delivery"&&<DeliveryDashboard role={role} setView={setView} setActiveProject={setActiveProject}/>}
        {view==="workflow"&&<ProjectWorkflow setView={setView}/>}
        {view==="new-project"&&<NewProject setView={setView}/>}
        {view==="workbench"&&<Workbench role={role}/>}
        {view==="my-tasks"&&<MyTasks setView={setView}/>}
        {view==="my-earnings"&&<MyEarnings/>}
        {view==="training"&&<Training/>}
        {(view==="qa"||view==="qa-tasks")&&<QAView/>}
        {view==="talent"&&<TalentHub/>}
        {view==="client-dash"&&<ClientDash/>}
        {view==="client-delivery"&&<ClientDelivery/>}
        {view==="role-manager"&&<RoleManager/>}
        {view==="project-detail"&&activeProject&&<div style={{display:"flex",flexDirection:"column",gap:16}}><Btn outline sm onClick={()=>setView("delivery")}>← Back</Btn><Card><div style={{color:C.text,fontWeight:800,fontSize:16}}>{activeProject.name}</div><div style={{color:C.muted,fontSize:12,marginTop:4}}>{activeProject.domain} · {activeProject.client} · Due {activeProject.due}</div><div style={{marginTop:14}}><Bar pct={Math.round(activeProject.done/activeProject.tasks*100)} color={DC[activeProject.domain]} h={10}/></div></Card></div>}
      </div>
    </div>
  );
}
