import { useState } from "react";

const C = {
  bg:"#0f172a",surface:"#1e293b",card:"#1a2740",border:"#2d3f55",
  accent:"#6366f1",accentHover:"#818cf8",success:"#10b981",warn:"#f59e0b",
  danger:"#ef4444",text:"#f1f5f9",muted:"#7a8fa6",faint:"#263347",
};

const DOMAIN_COLORS = {
  "RL / RLHF":"#be185d","Code":"#4ade80","Audio":"#38bdf8","Video":"#a78bfa",
  "Function Calling":"#fbbf24","Enterprise Workflow":"#34d399","STEM":"#60a5fa",
};

const Tag=({label,color,size="sm"})=>(
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,fontSize:size==="xs"?9:10,fontWeight:700,padding:size==="xs"?"1px 5px":"2px 7px",whiteSpace:"nowrap"}}>{label}</span>
);
const Progress=({pct,color=C.accent,h=5})=>(
  <div style={{background:C.border,borderRadius:99,height:h,width:"100%",overflow:"hidden"}}>
    <div style={{width:`${Math.min(pct,100)}%`,background:color,height:"100%",borderRadius:99,transition:"width 0.4s"}}/>
  </div>
);
const Stat=({label,value,sub,color=C.accent})=>(
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",flex:"1 1 100px"}}>
    <div style={{fontSize:22,fontWeight:800,color}}>{value}</div>
    <div style={{fontSize:12,fontWeight:600,color:C.text,marginTop:2}}>{label}</div>
    {sub&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}
  </div>
);
const Card=({children,style={}})=>(
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,...style}}>{children}</div>
);
const SectionTitle=({children})=>(
  <div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{children}</div>
);
const Btn=({children,onClick,color=C.accent,outline=false,small=false})=>(
  <button onClick={onClick} style={{background:outline?"transparent":color,color:outline?color:"#fff",border:`1.5px solid ${color}`,borderRadius:7,padding:small?"5px 12px":"9px 18px",fontSize:small?11:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>{children}</button>
);

const NavBtn=({icon,label,active,onClick,indent=false})=>(
  <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:active?C.accent+"22":"transparent",border:active?`1px solid ${C.accent}55`:"1px solid transparent",borderRadius:7,padding:`8px ${indent?18:12}px`,color:active?C.accentHover:C.muted,cursor:"pointer",fontSize:12,fontWeight:active?700:400,textAlign:"left",marginLeft:indent?8:0}}>
    <span style={{fontSize:14}}>{icon}</span>{label}
  </button>
);

// ── WORKFLOW STEPPER ──────────────────────────────────────────────────────────
const WORKFLOW_STEPS=[
  {id:"initiation",icon:"🎯",label:"Project Initiation",color:"#6366f1"},
  {id:"scoping",icon:"📐",label:"Scoping & Taxonomy",color:"#0891b2"},
  {id:"talent",icon:"👥",label:"Talent Allocation",color:"#d97706"},
  {id:"annotation",icon:"✏️",label:"Annotation",color:"#059669"},
  {id:"review",icon:"🔍",label:"Review & QA",color:"#dc2626"},
  {id:"delivery",icon:"📦",label:"Delivery",color:"#7c3aed"},
];

function WorkflowView({setView}){
  const [active,setActive]=useState("initiation");
  const step=WORKFLOW_STEPS.find(s=>s.id===active);

  const details={
    initiation:{
      desc:"Client submits a project request via API, dashboard, or account manager. Requirements are captured and a project brief is generated.",
      substeps:["Client submits brief (domain, volume, deadline, budget)","AE reviews & creates project in LabelForge","Taxonomy & ontology defined (labels, edge cases)","Kickoff checklist signed off","Project moves to Scoping"],
      inputs:["Client Brief","SOW / Contract","API payload or Dashboard form"],
      outputs:["Project record created","Taxonomy draft","Budget & timeline confirmed"],
      integrations:["Salesforce CRM → auto-populates client details","Docusign → SOW sign-off","Jira → project ticket created"],
    },
    scoping:{
      desc:"Define annotation schema, gold standard samples, instructions, and quality thresholds before any work begins.",
      substeps:["Annotation guidelines authored","Gold set created (100–500 samples)","Edge cases documented","IAA threshold set (e.g. 90%)","Pilot batch defined (50–200 tasks)"],
      inputs:["Raw sample data","Taxonomy from Initiation","Client SME input"],
      outputs:["Annotation Guidelines v1","Gold Set","Pilot task package"],
      integrations:["Google Drive / Confluence → guideline docs","Label schema stored in Ontology DB","Sample data ingested to Data Store"],
    },
    talent:{
      desc:"Match and allocate qualified annotators based on domain expertise, language, availability, and past performance.",
      substeps:["Skill-match against workforce pool","Availability check","Assign to project roster","Briefing & guideline review","Qualification test (gold tasks)"],
      inputs:["Project requirements","Workforce pool & skills registry","Availability calendar"],
      outputs:["Assigned annotator roster","Qualification scores","Briefing completion records"],
      integrations:["Workforce DB → skills & certs","Slack → annotator notifications","Calendar API → scheduling"],
    },
    annotation:{
      desc:"Annotators work on tasks in the Workbench. Model-assisted pre-labeling accelerates throughput. Progress tracked in real time.",
      substeps:["Tasks dispatched from queue","Model pre-labels (where applicable)","Annotator reviews / corrects / creates labels","Completed tasks submitted","Auto-validation runs (schema, format)"],
      inputs:["Task queue","Raw data assets","Pre-labels from ML model","Annotation guidelines"],
      outputs:["Raw annotations","Submission timestamps","Per-task metadata"],
      integrations:["ML Model APIs → pre-labeling","S3 / GCS → asset storage","Auto-validator → format checks"],
    },
    review:{
      desc:"Multi-tier QA process: automated checks → peer review → senior QA → client spot-check before sign-off.",
      substeps:["Tier 0: Auto-validation (schema, outliers)","Tier 1: Peer review (random 20%)","Tier 2: Senior QA review (flagged tasks)","Inter-annotator agreement calculated","Gold set re-test","Client spot-check & sign-off"],
      inputs:["Raw annotations","Gold set","QA rubrics","IAA threshold"],
      outputs:["Approved label set","QA report","IAA scores","Annotator feedback"],
      integrations:["Scale Eval / LabelBox → QA scoring","Argilla → human eval UI","Confidence scores from model","Dispute queue → adjudication"],
    },
    delivery:{
      desc:"Approved dataset packaged, formatted, and delivered to client via API, S3, or dashboard download. Invoice triggered.",
      substeps:["Dataset formatted (JSON, CSV, JSONL, custom)","Final QA sign-off confirmed","Delivery package built","Transferred to client (S3 / API / SFTP)","Invoice auto-generated","Project archived"],
      inputs:["Approved annotation set","Delivery format spec","Client credentials"],
      outputs:["Final dataset","Delivery report","Invoice","Project archive"],
      integrations:["AWS S3 / GCS → file transfer","REST API → programmatic delivery","Stripe / NetSuite → invoicing","Snowflake / BigQuery → data warehouse"],
    },
  };
  const d=details[active];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>End-to-End Project Workflow</h2>
        <p style={{color:C.muted,fontSize:12,margin:"4px 0 0"}}>Click each stage to explore inputs, outputs, substeps, and integrations</p>
      </div>

      {/* Timeline */}
      <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",paddingBottom:8}}>
        {WORKFLOW_STEPS.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",flex:1,minWidth:90}}>
            <div onClick={()=>setActive(s.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",padding:"10px 6px",background:active===s.id?s.color+"22":"transparent",border:`2px solid ${active===s.id?s.color:C.border}`,borderRadius:10,transition:"all 0.15s"}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <span style={{fontSize:10,fontWeight:700,color:active===s.id?s.color:C.muted,textAlign:"center",lineHeight:1.3}}>{s.label}</span>
              <div style={{width:8,height:8,borderRadius:"50%",background:active===s.id?s.color:C.border}}/>
            </div>
            {i<WORKFLOW_STEPS.length-1&&<div style={{width:20,height:2,background:C.border,flexShrink:0}}/>}
          </div>
        ))}
      </div>

      {/* Detail */}
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{fontSize:24}}>{step.icon}</span>
          <div>
            <div style={{color:step.color,fontWeight:800,fontSize:16}}>{step.label}</div>
            <div style={{color:C.muted,fontSize:12}}>{d.desc}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[
            {title:"Substeps",items:d.substeps,color:step.color,icon:"→"},
            {title:"Inputs",items:d.inputs,color:"#38bdf8",icon:"↓"},
            {title:"Outputs",items:d.outputs,color:C.success,icon:"↑"},
            {title:"Integrations",items:d.integrations,color:C.warn,icon:"⚡"},
          ].map(col=>(
            <div key={col.title} style={{background:C.faint,borderRadius:9,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:col.color,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>{col.title}</div>
              {col.items.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
                  <span style={{color:col.color,fontSize:10,marginTop:2}}>{col.icon}</span>
                  <span style={{color:C.text,fontSize:11,lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Flow arrow summary */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",justifyContent:"center"}}>
        {WORKFLOW_STEPS.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{background:s.color+"22",color:s.color,border:`1px solid ${s.color}44`,borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700}}>{s.label}</span>
            {i<WORKFLOW_STEPS.length-1&&<span style={{color:C.border,fontSize:14}}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TALENT HUB ────────────────────────────────────────────────────────────────
const TALENT=[
  {id:1,name:"Aisha K.",status:"active",stage:"annotator",domain:["RL / RLHF","Code"],acc:98.2,tasks:1240,joined:"Jan 12 2025",tier:"Senior",onboarding:100,perf:[96,97,98,98,99,98],flag:null},
  {id:2,name:"Miguel R.",status:"active",stage:"annotator",domain:["Video","Audio"],acc:97.5,tasks:890,joined:"Mar 3 2025",tier:"Mid",onboarding:100,perf:[94,95,96,97,97,97],flag:null},
  {id:3,name:"Jordan T.",status:"onboarding",stage:"training",domain:["STEM"],acc:null,tasks:0,joined:"Feb 20 2026",tier:"Junior",onboarding:60,perf:[],flag:null},
  {id:4,name:"Priya S.",status:"active",stage:"annotator",domain:["Enterprise Workflow"],acc:99.1,tasks:2100,joined:"Sep 5 2024",tier:"Senior",onboarding:100,perf:[98,99,99,99,100,99],flag:null},
  {id:5,name:"Chen W.",status:"pip",stage:"annotator",domain:["Code"],acc:84.2,tasks:340,joined:"Nov 1 2024",tier:"Mid",onboarding:100,perf:[92,89,87,85,84,84],flag:"Accuracy declining — PIP initiated"},
  {id:6,name:"Fatima N.",status:"offboarded",stage:"offboarded",domain:["Audio"],acc:97.8,tasks:1880,joined:"Jun 1 2024",tier:"Senior",onboarding:100,perf:[98,97,98,97,96,null],flag:"Contract ended — project concluded"},
];

const ONBOARDING_STEPS=["Profile verified","NDA signed","Platform walkthrough","Domain training module","Gold set qualification","First task assigned"];
const STATUS_META={active:{color:C.success,label:"Active"},onboarding:{color:C.warn,label:"Onboarding"},pip:{color:C.danger,label:"PIP"},offboarded:{color:C.muted,label:"Offboarded"}};

function TalentHub(){
  const [tab,setTab]=useState("roster");
  const [selected,setSelected]=useState(null);
  const [subTab,setSubTab]=useState("onboarding");

  if(selected){
    const t=selected;
    const sm=STATUS_META[t.status];
    return(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Btn outline onClick={()=>{setSelected(null);}} small>← Back</Btn>
          <div style={{width:38,height:38,borderRadius:"50%",background:C.accent+"33",border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:C.accent}}>{t.name[0]}</div>
          <div><div style={{color:C.text,fontWeight:800,fontSize:16}}>{t.name}</div><div style={{color:C.muted,fontSize:11}}>{t.tier} · {t.domain.join(", ")}</div></div>
          <Tag label={sm.label} color={sm.color}/>
          {t.flag&&<Tag label="⚠ Flag" color={C.danger}/>}
        </div>

        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["onboarding","performance","offboarding"].map(s=>(
            <button key={s} onClick={()=>setSubTab(s)} style={{background:subTab===s?C.accent+"33":"transparent",border:`1px solid ${subTab===s?C.accent:C.border}`,borderRadius:7,padding:"6px 14px",color:subTab===s?C.accentHover:C.muted,cursor:"pointer",fontSize:12,fontWeight:subTab===s?700:400,textTransform:"capitalize"}}>{s}</button>
          ))}
        </div>

        {subTab==="onboarding"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <SectionTitle>Onboarding Progress — {t.onboarding}%</SectionTitle>
              <Progress pct={t.onboarding} color={C.success} h={8}/>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:14}}>
                {ONBOARDING_STEPS.map((step,i)=>{
                  const done=t.onboarding>=(i+1)/ONBOARDING_STEPS.length*100;
                  const current=Math.floor(t.onboarding/100*ONBOARDING_STEPS.length)===i;
                  return(
                    <div key={step} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:done?C.success+"11":current?C.warn+"11":C.faint,border:`1px solid ${done?C.success+"44":current?C.warn+"44":C.border}`,borderRadius:8}}>
                      <span style={{fontSize:16}}>{done?"✅":current?"⏳":"⬜"}</span>
                      <span style={{color:done?C.success:current?C.warn:C.muted,fontSize:12,fontWeight:done||current?600:400}}>{step}</span>
                      {done&&<span style={{color:C.muted,fontSize:10,marginLeft:"auto"}}>Completed</span>}
                      {current&&<Tag label="In Progress" color={C.warn} size="xs"/>}
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card>
              <SectionTitle>Training Modules</SectionTitle>
              {[["Platform Basics","100%",C.success],["Annotation Guidelines","100%",C.success],["Domain: "+t.domain[0],t.onboarding>=80?"100%":"40%",t.onboarding>=80?C.success:C.warn],["Gold Set Calibration",t.onboarding>=100?"Passed":"Pending",t.onboarding>=100?C.success:C.muted]].map(([mod,stat,col])=>(
                <div key={mod} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}>
                  <span style={{color:C.text,fontSize:12}}>{mod}</span>
                  <Tag label={stat} color={col} size="xs"/>
                </div>
              ))}
            </Card>
          </div>
        )}

        {subTab==="performance"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <Stat label="Accuracy" value={t.acc?`${t.acc}%`:"N/A"} color={t.acc>95?C.success:t.acc>88?C.warn:C.danger}/>
              <Stat label="Tasks Done" value={t.tasks.toLocaleString()} color={C.accent}/>
              <Stat label="Tier" value={t.tier} color={C.warn}/>
              <Stat label="Status" value={sm.label} color={sm.color}/>
            </div>
            {t.flag&&<div style={{background:C.danger+"11",border:`1px solid ${C.danger}44`,borderRadius:10,padding:"12px 16px",color:C.danger,fontSize:12}}>⚠ {t.flag}</div>}
            <Card>
              <SectionTitle>Accuracy Trend (Last 6 Periods)</SectionTitle>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:80}}>
                {(t.perf.length?t.perf:[90,90,90,90,90,90]).map((v,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <span style={{fontSize:9,color:C.muted}}>{v||"-"}%</span>
                    <div style={{width:"100%",background:v>95?C.success:v>88?C.warn:C.danger,borderRadius:"3px 3px 0 0",height:`${v?((v-80)/20)*100:0}%`,minHeight:4,transition:"height 0.3s"}}/>
                    <span style={{fontSize:9,color:C.muted}}>P{i+1}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>Performance Actions</SectionTitle>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Btn small color={C.success}>Promote to Next Tier</Btn>
                <Btn small color={C.warn} outline>Issue Warning</Btn>
                <Btn small color={C.accent} outline>Assign Refresher</Btn>
                <Btn small color={C.danger} outline>Initiate PIP</Btn>
              </div>
            </Card>
            <Card>
              <SectionTitle>Feedback Log</SectionTitle>
              {[["QA Review","Good work on RLHF batch, watch edge cases",C.success,"Feb 10"],["Auto-Flag","3 tasks rejected by validator",C.warn,"Jan 28"],["Manager Note","Reliable, considered for Senior tier",C.accent,"Jan 15"]].map(([type,note,col,date])=>(
                <div key={note} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}22`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <Tag label={type} color={col} size="xs"/><span style={{color:C.muted,fontSize:10}}>{date}</span>
                  </div>
                  <div style={{color:C.text,fontSize:11}}>{note}</div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {subTab==="offboarding"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <SectionTitle>Offboarding Checklist</SectionTitle>
              {[
                ["Final tasks completed & reviewed","done"],
                ["Access revoked (platform, Slack, data stores)","done"],
                ["Pending payments calculated","done"],
                ["Payment issued","done"],
                ["Exit survey sent","pending"],
                ["Talent record archived","pending"],
              ].map(([item,status])=>(
                <div key={item} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}22`}}>
                  <span>{status==="done"?"✅":"⬜"}</span>
                  <span style={{color:status==="done"?C.text:C.muted,fontSize:12}}>{item}</span>
                  <Tag label={status} color={status==="done"?C.success:C.muted} size="xs" style={{marginLeft:"auto"}}/>
                </div>
              ))}
            </Card>
            <Card>
              <SectionTitle>Offboarding Actions</SectionTitle>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Btn small color={C.danger}>Revoke All Access</Btn>
                <Btn small color={C.warn} outline>Send Exit Survey</Btn>
                <Btn small color={C.muted} outline>Archive Record</Btn>
                <Btn small color={C.success} outline>Issue Final Payment</Btn>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  const filtered=TALENT.filter(t=>tab==="roster"||t.status===tab||(tab==="pip"&&t.status==="pip"));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Talent Hub</h2>
        <Btn>+ Onboard Talent</Btn>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        <Stat label="Active" value={TALENT.filter(t=>t.status==="active").length} color={C.success}/>
        <Stat label="Onboarding" value={TALENT.filter(t=>t.status==="onboarding").length} color={C.warn}/>
        <Stat label="On PIP" value={TALENT.filter(t=>t.status==="pip").length} color={C.danger}/>
        <Stat label="Offboarded" value={TALENT.filter(t=>t.status==="offboarded").length} color={C.muted}/>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["roster","active","onboarding","pip","offboarded"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?C.accent+"33":"transparent",border:`1px solid ${tab===t?C.accent:C.border}`,borderRadius:7,padding:"5px 12px",color:tab===t?C.accentHover:C.muted,cursor:"pointer",fontSize:11,fontWeight:tab===t?700:400,textTransform:"capitalize"}}>{t==="roster"?"All Talent":t}</button>
        ))}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{color:C.text,fontWeight:700,fontSize:13}}>Talent Roster</span>
          <span style={{color:C.muted,fontSize:11}}>Click a talent to manage →</span>
        </div>
        {filtered.map(t=>{
          const sm=STATUS_META[t.status];
          return(
            <div key={t.id} onClick={()=>setSelected(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.surface}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:30,height:30,borderRadius:"50%",background:C.accent+"33",border:`1.5px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.accent,fontWeight:700}}>{t.name[0]}</div>
              <div style={{flex:2}}><div style={{color:C.text,fontSize:12,fontWeight:600}}>{t.name}</div><div style={{color:C.muted,fontSize:10}}>{t.tier} · Joined {t.joined}</div></div>
              <div style={{flex:1,minWidth:80}}>{t.domain.map(d=><Tag key={d} label={d} color={DOMAIN_COLORS[d]||C.accent}/>)}</div>
              <div style={{width:100}}><Progress pct={t.onboarding} color={C.success} h={4}/><span style={{fontSize:9,color:C.muted}}>Onboarding {t.onboarding}%</span></div>
              {t.acc?<Tag label={`${t.acc}% acc`} color={t.acc>95?C.success:t.acc>88?C.warn:C.danger}/>:<Tag label="Not rated" color={C.muted}/>}
              <Tag label={sm.label} color={sm.color}/>
              {t.flag&&<span style={{fontSize:14}} title={t.flag}>⚠️</span>}
              <span style={{color:C.muted,fontSize:14}}>›</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ── QUALITY ───────────────────────────────────────────────────────────────────
const QA_SOURCES=[
  {id:"argilla",name:"Argilla",icon:"🏷️",type:"Human Eval Platform",color:"#6366f1",desc:"Open-source human feedback & annotation review UI. Feeds labeler disagreement and correction data."},
  {id:"labelbox",name:"Labelbox",icon:"📦",type:"Annotation QA",color:"#0891b2",desc:"Enterprise labeling platform feeding IAA scores, review queues, and consensus signals."},
  {id:"scaleeval",name:"Scale Eval",icon:"⚖️",type:"Model Eval",color:"#059669",desc:"Automated LLM evaluation scoring rubrics (helpfulness, harmlessness, honesty)."},
  {id:"autoval",name:"Auto-Validator",icon:"🤖",type:"Internal Rule Engine",color:"#d97706",desc:"Internal schema, format, and outlier checks running on every submitted task."},
  {id:"goldset",name:"Gold Set Engine",icon:"🏅",type:"Internal Benchmark",color:"#be185d",desc:"Hidden gold tasks injected into queues to continuously benchmark annotator accuracy."},
  {id:"iaa",name:"IAA Engine",icon:"📐",type:"Statistical QA",color:"#7c3aed",desc:"Cohen's Kappa & Fleiss Kappa computed across annotator pairs for each batch."},
];

const QA_TASKS=[
  {id:"q1",ann:"Aisha K.",task:"Rank RLHF responses #4821",score:98,source:"Gold Set",flag:null,domain:"RL / RLHF"},
  {id:"q2",ann:"Chen W.",task:"Bug label Python #3302",score:72,source:"Auto-Validator",flag:"Schema mismatch",domain:"Code"},
  {id:"q3",ann:"Miguel R.",task:"Bounding box #9910",score:95,source:"Labelbox",flag:null,domain:"Video"},
  {id:"q4",ann:"Jordan T.",task:"Math step grade #1201",score:81,source:"Gold Set",flag:"Below threshold",domain:"STEM"},
  {id:"q5",ann:"Priya S.",task:"NER contract #7723",score:99,source:"IAA Engine",flag:null,domain:"Enterprise Workflow"},
];

function QualityView(){
  const [active,setActive]=useState(null);
  const [tab,setTab]=useState("overview");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Quality Assurance</h2>

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["overview","sources","tasks","tiers"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?C.accent+"33":"transparent",border:`1px solid ${tab===t?C.accent:C.border}`,borderRadius:7,padding:"6px 14px",color:tab===t?C.accentHover:C.muted,cursor:"pointer",fontSize:12,fontWeight:tab===t?700:400,textTransform:"capitalize"}}>{t==="sources"?"Evaluation Sources":t==="tiers"?"QA Tiers":t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab==="overview"&&(
        <>
          <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
            <Stat label="Avg IAA (Kappa)" value="0.91" color={C.success} sub="Cohen's Kappa across all batches"/>
            <Stat label="Gold Pass Rate" value="91.4%" color={C.accent} sub="Last 7 days"/>
            <Stat label="Auto-Val Pass" value="97.8%" color={C.success} sub="Schema & format checks"/>
            <Stat label="Disputed" value="38" color={C.warn} sub="Awaiting adjudication"/>
            <Stat label="Rejected" value="12" color={C.danger} sub="Returned to annotator"/>
          </div>
          <Card>
            <SectionTitle>Quality Signal Sources → LabelForge QA Screen</SectionTitle>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {QA_SOURCES.map(s=>(
                <div key={s.id} style={{flex:"1 1 220px",background:C.faint,border:`1.5px solid ${s.color}44`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:18}}>{s.icon}</span>
                    <div>
                      <div style={{color:s.color,fontWeight:700,fontSize:13}}>{s.name}</div>
                      <Tag label={s.type} color={s.color} size="xs"/>
                    </div>
                  </div>
                  <div style={{color:C.muted,fontSize:11,lineHeight:1.5}}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              {QA_SOURCES.map(s=><span key={s.id} style={{color:s.color,fontSize:10,fontWeight:700}}>{s.name}</span>).reduce((acc,el,i)=>[...acc,i>0?<span key={i} style={{color:C.border}}>→</span>:null,el],[])}
              <span style={{color:C.border,fontSize:10}}>→</span>
              <span style={{background:C.accent+"33",color:C.accentHover,border:`1px solid ${C.accent}`,borderRadius:6,fontSize:10,fontWeight:700,padding:"3px 10px"}}>LabelForge QA Dashboard</span>
            </div>
          </Card>
        </>
      )}

      {tab==="sources"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {QA_SOURCES.map(s=>(
            <Card key={s.id} style={{borderColor:s.color+"44"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <span style={{fontSize:28}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{color:s.color,fontWeight:800,fontSize:15}}>{s.name}</span>
                    <Tag label={s.type} color={s.color}/>
                  </div>
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.6,marginBottom:10}}>{s.desc}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {s.id==="argilla"&&[["Signal","Labeler disagreement, correction edits, confidence scores"],["Trigger","On task submission → Argilla webhook → QA queue"],["Output","Review flags, corrected labels, annotator feedback"],["Integration","REST API → LabelForge QA Engine"]].map(([k,v])=>(
                      <div key={k} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}><div style={{color:s.color,fontSize:10,fontWeight:700,marginBottom:3}}>{k}</div><div style={{color:C.text,fontSize:11}}>{v}</div></div>
                    ))}
                    {s.id==="labelbox"&&[["Signal","IAA scores, review queue, consensus data, annotator stats"],["Trigger","Batch completion → Labelbox API → score ingestion"],["Output","Per-task quality scores, reviewer assignments"],["Integration","Labelbox GraphQL API → LabelForge"]].map(([k,v])=>(
                      <div key={k} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}><div style={{color:s.color,fontSize:10,fontWeight:700,marginBottom:3}}>{k}</div><div style={{color:C.text,fontSize:11}}>{v}</div></div>
                    ))}
                    {s.id==="scaleeval"&&[["Signal","LLM output quality scores (HHH rubric), benchmark evals"],["Trigger","Post-annotation → Scale Eval API batch scoring"],["Output","Helpfulness/harmlessness/honesty scores per response"],["Integration","Scale Eval REST API → QA score table"]].map(([k,v])=>(
                      <div key={k} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}><div style={{color:s.color,fontSize:10,fontWeight:700,marginBottom:3}}>{k}</div><div style={{color:C.text,fontSize:11}}>{v}</div></div>
                    ))}
                    {s.id==="autoval"&&[["Signal","Schema errors, outlier scores, format violations"],["Trigger","Real-time on every task submission"],["Output","Pass/fail + error type for each task"],["Integration","Internal rule engine → immediate QA flag"]].map(([k,v])=>(
                      <div key={k} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}><div style={{color:s.color,fontSize:10,fontWeight:700,marginBottom:3}}>{k}</div><div style={{color:C.text,fontSize:11}}>{v}</div></div>
                    ))}
                    {s.id==="goldset"&&[["Signal","Annotator accuracy against known-correct answers"],["Trigger","Gold tasks injected randomly (5–10% of queue)"],["Output","Per-annotator accuracy scores, tier flags"],["Integration","Gold Set DB → Annotator perf engine → QA + Talent"]].map(([k,v])=>(
                      <div key={k} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}><div style={{color:s.color,fontSize:10,fontWeight:700,marginBottom:3}}>{k}</div><div style={{color:C.text,fontSize:11}}>{v}</div></div>
                    ))}
                    {s.id==="iaa"&&[["Signal","Cohen's Kappa / Fleiss Kappa across annotator pairs"],["Trigger","Per batch on 3+ annotator overlap tasks"],["Output","Kappa scores, low-agreement flags, adjudication queue"],["Integration","Statistical engine → QA dashboard + dispute queue"]].map(([k,v])=>(
                      <div key={k} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}><div style={{color:s.color,fontSize:10,fontWeight:700,marginBottom:3}}>{k}</div><div style={{color:C.text,fontSize:11}}>{v}</div></div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==="tasks"&&(
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:C.text,fontWeight:700,fontSize:13}}>QA Task Queue</span>
            <div style={{display:"flex",gap:6}}>
              <Tag label="38 pending" color={C.warn}/>
              <Tag label="12 disputed" color={C.danger}/>
            </div>
          </div>
          {QA_TASKS.map(t=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`}}>
              <Tag label={t.domain} color={DOMAIN_COLORS[t.domain]||C.accent}/>
              <div style={{flex:2,color:C.text,fontSize:12}}>{t.task}</div>
              <div style={{color:C.muted,fontSize:11}}>{t.ann}</div>
              <Tag label={t.source} color={QA_SOURCES.find(s=>s.name===t.source)?.color||C.muted}/>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:40,fontSize:12,fontWeight:700,color:t.score>90?C.success:t.score>80?C.warn:C.danger}}>{t.score}%</div>
                <div style={{width:60}}><Progress pct={t.score} color={t.score>90?C.success:t.score>80?C.warn:C.danger}/></div>
              </div>
              {t.flag?<Tag label={t.flag} color={C.danger}/>:<Tag label="Passed" color={C.success}/>}
              <div style={{display:"flex",gap:6}}>
                <Btn small color={C.success} outline>✓ Approve</Btn>
                <Btn small color={C.danger} outline>✗ Reject</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab==="tiers"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <SectionTitle>Multi-Tier QA Pipeline</SectionTitle>
          {[
            {tier:"Tier 0",name:"Auto-Validation",icon:"🤖",color:C.warn,source:"Auto-Validator",desc:"Every submitted task passes through automated schema, format, and outlier detection. ~100% of tasks screened. Failures immediately returned to annotator.",pass:"97.8%",volume:"100% of tasks"},
            {tier:"Tier 1",name:"Peer Review",icon:"👁️",color:C.accent,source:"Argilla / Labelbox",desc:"Random 20% sample reviewed by a second annotator. IAA computed. Low-agreement tasks escalated to Tier 2.",pass:"93.2%",volume:"20% of tasks"},
            {tier:"Tier 2",name:"Senior QA Review",icon:"🔬",color:"#0891b2",source:"Internal + Scale Eval",desc:"Flagged tasks reviewed by senior QA specialists. Gold set re-tests run. Model eval scoring applied (Scale Eval).",pass:"91.4%",volume:"~8% of tasks"},
            {tier:"Tier 3",name:"Client Spot-Check",icon:"🤝",color:C.success,source:"Client / Delivered sample",desc:"Client receives a 5% random sample for spot-check before final delivery sign-off.",pass:"90.1%",volume:"5% of tasks"},
          ].map(t=>(
            <Card key={t.tier} style={{borderColor:t.color+"44"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{background:t.color+"22",border:`1.5px solid ${t.color}`,borderRadius:8,padding:"8px 10px",fontSize:20}}>{t.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                    <span style={{color:t.color,fontWeight:800,fontSize:14}}>{t.tier}: {t.name}</span>
                    <Tag label={`Pass: ${t.pass}`} color={C.success}/>
                    <Tag label={t.volume} color={C.muted}/>
                  </div>
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.5,marginBottom:6}}>{t.desc}</div>
                  <Tag label={`Source: ${t.source}`} color={t.color}/>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const PROJECTS=[
  {id:1,name:"GPT-5 RLHF Batch 12",domain:"RL / RLHF",status:"active",tasks:1240,done:870,due:"Mar 3",priority:"high"},
  {id:2,name:"CodeLlama Bug Labels",domain:"Code",status:"active",tasks:640,done:210,due:"Mar 7",priority:"med"},
  {id:3,name:"Earnings Call Audio",domain:"Audio",status:"review",tasks:320,done:320,due:"Feb 28",priority:"high"},
  {id:4,name:"Surgical Video Seg.",domain:"Video",status:"active",tasks:180,done:44,due:"Mar 15",priority:"med"},
  {id:5,name:"Tool-Use Chain Eval",domain:"Function Calling",status:"active",tasks:900,done:560,due:"Mar 5",priority:"high"},
  {id:6,name:"Contract NER 2026",domain:"Enterprise Workflow",status:"draft",tasks:400,done:0,due:"Mar 20",priority:"low"},
  {id:7,name:"SAT Math Grading",domain:"STEM",status:"review",tasks:750,done:750,due:"Feb 25",priority:"med"},
];
const STATUS_COLORS={active:C.success,review:C.warn,draft:C.muted};

function Dashboard({setView,setActiveProject}){
  const total=PROJECTS.reduce((s,p)=>s+p.tasks,0);
  const done=PROJECTS.reduce((s,p)=>s+p.done,0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h2 style={{color:C.text,margin:0,fontSize:20,fontWeight:800}}>Overview</h2><p style={{color:C.muted,margin:0,fontSize:12}}>Thu, Feb 26 2026</p></div>
        <Btn onClick={()=>setView("workflow")}>+ New Project</Btn>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        <Stat label="Total Tasks" value={total.toLocaleString()} sub="across all projects"/>
        <Stat label="Completed" value={done.toLocaleString()} sub={`${Math.round(done/total*100)}% overall`} color={C.success}/>
        <Stat label="Active Projects" value={PROJECTS.filter(p=>p.status==="active").length} color={C.warn}/>
        <Stat label="Annotators" value="248" sub="18 online now" color="#be185d"/>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:C.text,fontWeight:700,fontSize:14}}>Projects</span>
          <span style={{color:C.muted,fontSize:11}}>Click a project to manage →</span>
        </div>
        {PROJECTS.map(p=>{
          const pct=Math.round(p.done/p.tasks*100);
          const dc=DOMAIN_COLORS[p.domain];
          return(
            <div key={p.id} onClick={()=>{setActiveProject(p);setView("project");}} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",borderBottom:`1px solid ${C.border}22`,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.surface}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:10,height:10,borderRadius:"50%",background:dc,flexShrink:0}}/>
              <div style={{flex:2,minWidth:140}}><div style={{color:C.text,fontSize:13,fontWeight:600}}>{p.name}</div><div style={{color:C.muted,fontSize:11}}>{p.domain}</div></div>
              <div style={{flex:2,minWidth:120}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.muted,fontSize:10}}>{p.done}/{p.tasks}</span><span style={{color:C.text,fontSize:10,fontWeight:600}}>{pct}%</span></div>
                <Progress pct={pct} color={dc}/>
              </div>
              <Tag label={p.status} color={STATUS_COLORS[p.status]}/>
              <Tag label={p.priority} color={p.priority==="high"?C.danger:p.priority==="med"?C.warn:C.muted}/>
              <div style={{color:C.muted,fontSize:11,minWidth:50}}>Due {p.due}</div>
              <span style={{color:C.muted,fontSize:14}}>›</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ── WORKBENCH ─────────────────────────────────────────────────────────────────
function Workbench(){
  const [task,setTask]=useState(0);
  const [selected,setSelected]=useState(null);
  const [rating,setRating]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const tasks=[
    {type:"RL / RLHF",badge:"Preference Ranking",prompt:"Explain the difference between supervised and unsupervised learning.",responseA:"Supervised learning uses labeled data where correct outputs are provided during training. The model learns a mapping from inputs to outputs by minimizing prediction error. Examples: image classification, spam detection.\n\nUnsupervised learning works on unlabeled data — the model finds hidden structure. Examples: k-means clustering, autoencoders.",responseB:"Supervised is when you give the AI the right answers while training. Unsupervised is when there are no labels. Supervised is used for things like spam filters. Unsupervised finds patterns without being told what to look for."},
    {type:"Code",badge:"Bug Identification",prompt:"How many bugs are in this Python function?",code:`def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total =+ num   # Bug: should be +=\n    return total / len(numbers)  # Bug: no zero-length check\n\nresult = calculate_average([])\nprint(result)`},
    {type:"Function Calling",badge:"Tool Call Validation",prompt:"Is this tool call correct for the user intent?",intent:`User: "What's the weather in Tokyo tomorrow?"`,toolCall:`{\n  "tool": "get_weather",\n  "parameters": {\n    "location": "Tokyo",\n    "date": "2026-02-27",\n    "units": "celsius"\n  }\n}`},
  ];
  const t=tasks[task%tasks.length];
  const dc=DOMAIN_COLORS[t.type];
  const submit=()=>{
    if(selected||rating){setSubmitted(true);setTimeout(()=>{setSubmitted(false);setSelected(null);setRating(null);setTask(p=>p+1);},1200);}
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:780}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h2 style={{margin:0,color:C.text,fontSize:18,fontWeight:800}}>Annotation Workbench</h2>
        <div style={{display:"flex",gap:8}}><Tag label={`Task ${(task%tasks.length)+1}/3`} color={C.muted}/><Tag label={t.type} color={dc}/><Tag label={t.badge} color={dc}/></div>
      </div>
      <Card><SectionTitle>Task Prompt</SectionTitle><div style={{color:C.text,fontSize:13,lineHeight:1.6}}>{t.prompt}</div></Card>
      {t.type==="RL / RLHF"&&(
        <><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["A",t.responseA],["B",t.responseB]].map(([id,resp])=>(
            <div key={id} onClick={()=>setSelected(id)} style={{background:selected===id?dc+"22":C.card,border:`2px solid ${selected===id?dc:C.border}`,borderRadius:12,padding:16,cursor:"pointer",transition:"all 0.15s"}}>
              <div style={{fontWeight:700,color:selected===id?dc:C.muted,marginBottom:8,fontSize:12}}>Response {id} {selected===id&&"✓"}</div>
              <div style={{color:C.text,fontSize:12,lineHeight:1.7,whiteSpace:"pre-line"}}>{resp}</div>
            </div>
          ))}
        </div><div style={{color:C.muted,fontSize:11,textAlign:"center"}}>Select the better response</div></>
      )}
      {t.type==="Code"&&(<>
        <div style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:10,padding:16,fontFamily:"monospace",fontSize:12,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{t.code}</div>
        <div style={{color:C.text,fontSize:13,fontWeight:600}}>How many bugs?</div>
        <div style={{display:"flex",gap:8}}>{[0,1,2,3].map(n=><button key={n} onClick={()=>setSelected(String(n))} style={{background:selected===String(n)?dc+"33":"transparent",border:`2px solid ${selected===String(n)?dc:C.border}`,borderRadius:8,padding:"8px 18px",color:selected===String(n)?dc:C.muted,cursor:"pointer",fontSize:14,fontWeight:700}}>{n}</button>)}</div>
      </>)}
      {t.type==="Function Calling"&&(<>
        <Card><SectionTitle>User Intent</SectionTitle><div style={{color:C.text,fontSize:13}}>{t.intent}</div></Card>
        <div style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:10,padding:14,fontFamily:"monospace",fontSize:12,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{t.toolCall}</div>
        <div style={{color:C.text,fontSize:13,fontWeight:600}}>Is this tool call correct?</div>
        <div style={{display:"flex",gap:8}}>{["Correct ✓","Incorrect ✗","Partial ⚠️"].map(opt=><button key={opt} onClick={()=>setSelected(opt)} style={{background:selected===opt?dc+"33":"transparent",border:`2px solid ${selected===opt?dc:C.border}`,borderRadius:8,padding:"8px 14px",color:selected===opt?dc:C.muted,cursor:"pointer",fontSize:12,fontWeight:600}}>{opt}</button>)}</div>
      </>)}
      <Card><SectionTitle>Confidence</SectionTitle><div style={{display:"flex",gap:6}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} style={{background:rating>=n?"#f59e0b22":"transparent",border:`1.5px solid ${rating>=n?"#f59e0b":C.border}`,borderRadius:6,padding:"5px 10px",color:rating>=n?"#f59e0b":C.muted,cursor:"pointer",fontSize:14}}>★</button>)}<span style={{color:C.muted,fontSize:11,alignSelf:"center"}}>{rating?["","Very Low","Low","Medium","High","Very High"][rating]:""}</span></div></Card>
      <Btn onClick={submit} color={submitted?C.success:C.accent}>{submitted?"✓ Submitted — Loading next…":"Submit Annotation →"}</Btn>
    </div>
  );
}

// ── PROJECT DETAIL ────────────────────────────────────────────────────────────
function ProjectDetail({project,setView}){
  const [tab,setTab]=useState("overview");
  const pct=Math.round(project.done/project.tasks*100);
  const dc=DOMAIN_COLORS[project.domain];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Btn outline small onClick={()=>setView("dashboard")}>← Back</Btn>
        <div style={{width:10,height:10,borderRadius:"50%",background:dc}}/>
        <h2 style={{margin:0,color:C.text,fontSize:18,fontWeight:800}}>{project.name}</h2>
        <Tag label={project.domain} color={dc}/><Tag label={project.status} color={STATUS_COLORS[project.status]}/>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["overview","tasks","quality","workforce","settings"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?C.accent+"33":"transparent",border:`1px solid ${tab===t?C.accent:C.border}`,borderRadius:7,padding:"6px 14px",color:tab===t?C.accentHover:C.muted,cursor:"pointer",fontSize:12,fontWeight:tab===t?700:400,textTransform:"capitalize"}}>{t}</button>
        ))}
      </div>
      {tab==="overview"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}><Stat label="Total" value={project.tasks.toLocaleString()} color={dc}/><Stat label="Done" value={project.done.toLocaleString()} sub={`${pct}%`} color={C.success}/><Stat label="Left" value={(project.tasks-project.done).toLocaleString()} color={C.warn}/><Stat label="Due" value={project.due} color={C.muted}/></div>
        <Card><div style={{color:C.text,fontWeight:700,fontSize:13,marginBottom:12}}>Overall Progress</div><Progress pct={pct} color={dc} h={8}/><div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><span style={{color:C.muted,fontSize:11}}>{project.done} completed</span><span style={{color:C.text,fontSize:11,fontWeight:700}}>{pct}%</span></div></Card>
        <Card><div style={{color:C.text,fontWeight:700,fontSize:13,marginBottom:10}}>Batch Breakdown</div>{["Batch A","Batch B","Batch C"].map((b,i)=>{const p2=[82,61,33][i];return(<div key={b} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.muted,fontSize:12}}>{b}</span><span style={{color:C.text,fontSize:12,fontWeight:600}}>{p2}%</span></div><Progress pct={p2} color={dc}/></div>);})}</Card>
      </div>}
      {tab==="tasks"&&<Card style={{padding:0,overflow:"hidden"}}><div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><span style={{color:C.text,fontWeight:700,fontSize:13}}>Task Queue</span><Btn small>+ Add Tasks</Btn></div>{[1,2,3,4,5].map(i=><div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`}}><span style={{color:C.muted,fontSize:11,width:20}}>#{i}</span><div style={{flex:1,color:C.text,fontSize:12}}>Sample task #{i} — {project.domain}</div><Tag label={project.domain} color={dc}/><span style={{color:C.success,fontSize:11}}>Queued</span></div>)}</Card>}
      {tab==="quality"&&<div style={{display:"flex",flexDirection:"column",gap:12}}><div style={{display:"flex",flexWrap:"wrap",gap:12}}><Stat label="IAA" value="94.2%" color={C.success}/><Stat label="Gold Pass" value="91.7%" color={dc}/><Stat label="Disputed" value="38" color={C.warn}/></div><Card><SectionTitle>QA Pipeline</SectionTitle>{[["Auto-Validation","✅ Passed"],["Gold Set Test","✅ Passed"],["Human Review","⏳ In Progress"],["Adjudication","🔒 Blocked"],["Client Delivery","🔒 Blocked"]].map(([s,st])=><div key={s} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}22`}}><span style={{color:C.text,fontSize:12}}>{s}</span><span style={{fontSize:11}}>{st}</span></div>)}</Card></div>}
      {tab==="workforce"&&<Card style={{padding:0,overflow:"hidden"}}><div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.text,fontWeight:700,fontSize:13}}>Assigned Annotators</span></div>{TALENT.filter(t=>t.status==="active").map(w=><div key={w.name} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 18px",borderBottom:`1px solid ${C.border}22`}}><div style={{width:28,height:28,borderRadius:"50%",background:dc+"33",border:`1.5px solid ${dc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:dc,fontWeight:700}}>{w.name[0]}</div><div style={{flex:1,color:C.text,fontSize:12,fontWeight:600}}>{w.name}</div><Tag label={`${w.acc}% acc`} color={C.success}/><div style={{width:7,height:7,borderRadius:"50%",background:C.success}}/></div>)}</Card>}
      {tab==="settings"&&<Card style={{display:"flex",flexDirection:"column",gap:12}}>{[["Project Name",project.name],["Domain",project.domain],["Priority",project.priority],["Due","Mar 2026"],["Min Annotators","3"],["Consensus","Majority Vote"]].map(([k,v])=><div key={k} style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:160,color:C.muted,fontSize:12}}>{k}</div><div style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"7px 12px",color:C.text,fontSize:12}}>{v}</div></div>)}<Btn>Save Changes</Btn></Card>}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("dashboard");
  const [activeProject,setActiveProject]=useState(null);

  const nav=[
    {icon:"📊",label:"Dashboard",id:"dashboard",group:"main"},
    {icon:"🔄",label:"E2E Workflow",id:"workflow",group:"main"},
    {icon:"✏️",label:"Workbench",id:"workbench",group:"main"},
    {icon:"✅",label:"Quality",id:"quality",group:"main"},
    {icon:"👥",label:"Talent Hub",id:"talent",group:"talent"},
  ];

  const groups=[
    {label:"PLATFORM",items:nav.filter(n=>n.group==="main")},
    {label:"WORKFORCE",items:nav.filter(n=>n.group==="talent")},
  ];

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden",fontFamily:"'Inter',system-ui,sans-serif"}}>
      {/* Sidebar */}
      <div style={{width:196,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"16px 10px",gap:2,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px 18px"}}>
          <div style={{width:30,height:30,background:C.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>✦</div>
          <span style={{fontWeight:800,fontSize:15,color:C.text}}>LabelForge</span>
        </div>
        {groups.map(g=>(
          <div key={g.label} style={{marginBottom:12}}>
            <div style={{fontSize:9,fontWeight:700,color:C.muted,letterSpacing:"0.1em",padding:"0 12px",marginBottom:4}}>{g.label}</div>
            {g.items.map(n=><NavBtn key={n.id} icon={n.icon} label={n.label} active={view===n.id||(view==="project"&&n.id==="dashboard")} onClick={()=>setView(n.id)}/>)}
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:C.accent+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.accent,fontWeight:700}}>A</div>
          <div><div style={{fontSize:11,fontWeight:600,color:C.text}}>Admin</div><div style={{fontSize:10,color:C.muted}}>admin@labelforge.io</div></div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
        {view==="dashboard" && <Dashboard setView={setView} setActiveProject={setActiveProject}/>}
        {view==="project"   && activeProject && <ProjectDetail project={activeProject} setView={setView}/>}
        {view==="workflow"  && <WorkflowView setView={setView}/>}
        {view==="workbench" && <Workbench/>}
        {view==="quality"   && <QualityView/>}
        {view==="talent"    && <TalentHub/>}
      </div>
    </div>
  );
}
