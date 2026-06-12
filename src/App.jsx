import { useState, useMemo } from "react";

const COACH_PW = "guada2024";
const TODAY_STR = "2026-06-10";
const TODAY = new Date(TODAY_STR + "T12:00:00");

const TYPE_COLORS = {
  "Rodaje suave": { bg: "#1a2e1a", text: "#6fcf6f", dot: "#6fcf6f" },
  "Series":       { bg: "#2e1a0a", text: "#f0a050", dot: "#f0a050" },
  "Largo":        { bg: "#0a1a2e", text: "#50a0f0", dot: "#50a0f0" },
  "Regenerativo": { bg: "#1e1a2e", text: "#b090f0", dot: "#b090f0" },
  "Tempo":        { bg: "#2e0a1a", text: "#f07090", dot: "#f07090" },
  "Fuerza":       { bg: "#2e2a0a", text: "#e0c040", dot: "#e0c040" },
  "Otro":         { bg: "#1a1a1a", text: "#aaaaaa", dot: "#aaaaaa" },
};
function tc(type) { return TYPE_COLORS[type] || TYPE_COLORS["Otro"]; }

const FEELINGS = [
  { v: 1, e: "😩", l: "Muy mal" },
  { v: 2, e: "😕", l: "Mal" },
  { v: 3, e: "😐", l: "Regular" },
  { v: 4, e: "🙂", l: "Bien" },
  { v: 5, e: "🤩", l: "Genial" },
];

const STYPES = ["Rodaje suave","Series","Largo","Regenerativo","Tempo","Fuerza","Otro"];
const DAYS = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function fmtDate(ds) {
  const d = new Date(ds + "T12:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

const BASE_ATHLETES = [];
  { id: 1, name: "Lucia Fernandez", avatar: "LF", sessions: [
    { id: 1, date: "2026-06-09", type: "Rodaje suave", distance: "10 km", pace: "6:00 min/km", description: "Rodaje facil, mantene conversacion todo el tiempo.", rpe: null, feeling: null, notes: "", done: false },
    { id: 2, date: "2026-06-11", type: "Series", distance: "8 x 400m", pace: "4:45 min/km", description: "Entrada en calor 15 min. 8 repeticiones de 400m. Recuperacion 90 seg caminando.", rpe: null, feeling: null, notes: "", done: false },
    { id: 3, date: "2026-06-14", type: "Largo", distance: "18 km", pace: "6:20 min/km", description: "Largo del domingo. Los ultimos 3 km podes soltar un poco si te sentis bien.", rpe: null, feeling: null, notes: "", done: false },
    { id: 4, date: "2026-06-17", type: "Regenerativo", distance: "6 km", pace: "6:40 min/km", description: "Muy suave, sin presion de ritmo.", rpe: null, feeling: null, notes: "", done: false },
    { id: 5, date: "2026-06-19", type: "Tempo", distance: "7 km", pace: "5:10 min/km", description: "10 min entrada calor + 5 km tempo + vuelta calma.", rpe: null, feeling: null, notes: "", done: false },
  ]},
  { id: 2, name: "Martin Gomez", avatar: "MG", sessions: [
    { id: 1, date: "2026-06-10", type: "Regenerativo", distance: "6 km", pace: "6:30 min/km", description: "Trote muy suave, escucha el cuerpo.", rpe: null, feeling: null, notes: "", done: false },
    { id: 2, date: "2026-06-12", type: "Tempo", distance: "5 km", pace: "5:10 min/km", description: "Entrada en calor 10 min. 5 km a ritmo tempo sostenido.", rpe: null, feeling: null, notes: "", done: false },
    { id: 3, date: "2026-06-15", type: "Largo", distance: "16 km", pace: "6:30 min/km", description: "Largo del domingo, tranquilo.", rpe: null, feeling: null, notes: "", done: false },
  ]},
];

const INP = { background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#F0EDE8", fontSize: 13, width: "100%", boxSizing: "border-box" };
const BTN_BACK = { background: "none", border: "none", color: "#C8B89A", fontSize: 13, cursor: "pointer", padding: "0 0 14px 0" };

// ---- CALENDAR ----------------------------------------------------------------
function Cal({ sessions, onDay, year, month, onPrev, onNext }) {
  const byDate = useMemo(() => {
    const m = {};
    sessions.forEach(s => { if (!m[s.date]) m[s.date] = []; m[s.date].push(s); });
    return m;
  }, [sessions]);

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onPrev} style={{ background: "none", border: "1px solid #2a2a2a", color: "#C8B89A", fontSize: 16, cursor: "pointer", borderRadius: 8, width: 34, height: 34 }}>{"<"}</button>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#F0EDE8" }}>{MONTHS[month]} {year}</div>
        <button onClick={onNext} style={{ background: "none", border: "1px solid #2a2a2a", color: "#C8B89A", fontSize: 16, cursor: "pointer", borderRadius: 8, width: 34, height: 34 }}>{">"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#444", fontWeight: 600, paddingBottom: 4 }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={"e" + i} />;
          const mm = String(month + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          const dateStr = year + "-" + mm + "-" + dd;
          const ds = byDate[dateStr] || [];
          const isToday = dateStr === TODAY_STR;
          return (
            <div key={day} onClick={() => ds.length && onDay(dateStr, ds)}
              style={{ aspectRatio: "1", borderRadius: 9, background: isToday ? "#1a1500" : ds.length ? "#161616" : "transparent", border: isToday ? "1.5px solid #C8B89A" : ds.length ? "1px solid #2a2a2a" : "1px solid transparent", cursor: ds.length ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: isToday ? 700 : ds.length ? 600 : 400, color: isToday ? "#C8B89A" : ds.length ? "#F0EDE8" : "#383838" }}>{day}</span>
              {ds.length > 0 && (
                <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  {ds.slice(0, 3).map((s, idx) => (
                    <div key={idx} style={{ width: 5, height: 5, borderRadius: "50%", background: s.done ? "#4CAF50" : tc(s.type).dot }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginTop: 12 }}>
        {Object.entries(TYPE_COLORS).slice(0, 5).map(([type, col]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.dot }} />
            <span style={{ fontSize: 10, color: "#444" }}>{type}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF50" }} />
          <span style={{ fontSize: 10, color: "#444" }}>Completada</span>
        </div>
      </div>
    </div>
  );
}

// ---- DAY MODAL ---------------------------------------------------------------
function DayModal({ dateStr, sessions, onSelect, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "#111", borderRadius: "20px 20px 0 0", padding: "18px 16px 32px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ width: 36, height: 4, background: "#2a2a2a", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ fontSize: 12, color: "#555", marginBottom: 12, textTransform: "capitalize" }}>{fmtDate(dateStr)}</div>
        {sessions.map(s => (
          <div key={s.id} onClick={() => onSelect(s)} style={{ background: "#161616", border: "1px solid #222", borderRadius: 12, padding: "13px 15px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.done ? "#4CAF50" : tc(s.type).dot, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, background: tc(s.type).bg, color: tc(s.type).text, borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>{s.type}</span>
              <div style={{ fontSize: 13, marginTop: 5, fontWeight: 600 }}>{s.distance} {s.done ? " - " : " | "} <span style={{ color: "#C8B89A" }}>{s.pace}</span></div>
            </div>
            {s.done && <span style={{ fontSize: 11, color: "#4CAF50" }}>OK</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- SESSION DETAIL ----------------------------------------------------------
function SessionDetail({ session, onSave, onBack, isCoach, onDelete }) {
  const [form, setForm] = useState({ rpe: session.rpe, feeling: session.feeling, notes: session.notes || "" });
  const [saved, setSaved] = useState(false);
  const c = tc(session.type);

  function save() {
    onSave({ ...session, ...form, done: true });
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 900);
  }

  return (
    <div>
      <button onClick={onBack} style={BTN_BACK}>Volver</button>
      <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 8, textTransform: "capitalize" }}>{fmtDate(session.date)}</div>
        <span style={{ fontSize: 12, background: c.bg, color: c.text, borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>{session.type}</span>
        <div style={{ display: "flex", gap: 28, marginTop: 14, marginBottom: session.description ? 14 : 0 }}>
          <div>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 2 }}>DISTANCIA</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{session.distance}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 2 }}>RITMO</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#C8B89A" }}>{session.pace}</div>
          </div>
        </div>
        {session.description && (
          <div style={{ fontSize: 13, color: "#777", lineHeight: 1.65, borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>{session.description}</div>
        )}
      </div>

      {!isCoach && (
        <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#C8B89A", marginBottom: 16 }}>Como te fue?</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 10, letterSpacing: 1 }}>SENSACION</div>
            <div style={{ display: "flex", gap: 6 }}>
              {FEELINGS.map(f => (
                <button key={f.v} onClick={() => setForm(p => ({ ...p, feeling: f.v }))}
                  style={{ flex: 1, background: form.feeling === f.v ? "rgba(200,184,154,0.1)" : "#1a1a1a", border: "1.5px solid " + (form.feeling === f.v ? "#C8B89A" : "#2a2a2a"), borderRadius: 10, padding: "9px 2px", cursor: "pointer" }}>
                  <div style={{ fontSize: 20, textAlign: "center" }}>{f.e}</div>
                  <div style={{ fontSize: 9, color: form.feeling === f.v ? "#C8B89A" : "#3a3a3a", textAlign: "center", marginTop: 3 }}>{f.l}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 10, letterSpacing: 1 }}>ESFUERZO RPE 1-10</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setForm(p => ({ ...p, rpe: n }))}
                  style={{ width: 40, height: 40, borderRadius: 8, background: form.rpe === n ? "#C8B89A" : "#1a1a1a", border: "1px solid " + (form.rpe === n ? "#C8B89A" : "#2a2a2a"), color: form.rpe === n ? "#0A0A0A" : "#F0EDE8", fontWeight: form.rpe === n ? 800 : 400, fontSize: 14, cursor: "pointer" }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 8, letterSpacing: 1 }}>NOTAS PARA GUADA</div>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Contame como te sentiste..." rows={3}
              style={{ ...INP, resize: "none" }} />
          </div>
          <button onClick={save} disabled={!form.feeling || !form.rpe}
            style={{ width: "100%", background: (!form.feeling || !form.rpe) ? "#1a1a1a" : saved ? "#1B2E1B" : "#C8B89A", color: (!form.feeling || !form.rpe) ? "#333" : saved ? "#6fcf6f" : "#0A0A0A", border: "none", borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 700, cursor: (!form.feeling || !form.rpe) ? "not-allowed" : "pointer" }}>
            {saved ? "Guardado!" : "Registrar sesion"}
          </button>
        </div>
      )}

      {isCoach && session.done && (
        <div style={{ background: "#161616", border: "1px solid #1B2E1B", borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#6fcf6f", marginBottom: 10 }}>Completada</div>
          <div style={{ display: "flex", gap: 20, marginBottom: session.notes ? 10 : 0 }}>
            {session.feeling && <div><span style={{ fontSize: 10, color: "#444" }}>SENSACION </span><span style={{ fontSize: 20 }}>{FEELINGS.find(f => f.v === session.feeling)?.e}</span></div>}
            {session.rpe && <div><span style={{ fontSize: 10, color: "#444" }}>RPE </span><span style={{ fontSize: 20, fontWeight: 700, color: "#C8B89A" }}>{session.rpe}/10</span></div>}
          </div>
          {session.notes && <div style={{ fontSize: 13, color: "#777", fontStyle: "italic" }}>"{session.notes}"</div>}
        </div>
      )}

      {isCoach && onDelete && (
        <button onClick={onDelete} style={{ width: "100%", background: "none", border: "1px solid #2a1a1a", color: "#f07070", borderRadius: 10, padding: 12, fontSize: 13, cursor: "pointer" }}>
          Eliminar sesion
        </button>
      )}
    </div>
  );
}

// ---- INSTALL GUIDE -----------------------------------------------------------
function InstallGuide({ onBack }) {
  const [tab, setTab] = useState("atleta");

  return (
    <div>
      <button onClick={onBack} style={BTN_BACK}>Volver</button>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Como usar la app</div>
      <div style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Para vos y tus atletas</div>

      <div style={{ display: "flex", background: "#111", borderRadius: 10, padding: 3, marginBottom: 20 }}>
        {[["atleta","Mis atletas"],["guada","Para mi"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ flex: 1, background: tab === k ? "#C8B89A" : "transparent", color: tab === k ? "#0A0A0A" : "#555", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: tab === k ? 700 : 400, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "atleta" && (
        <div>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8B89A", marginBottom: 12 }}>Opcion 1 - Link directo (mas facil)</div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#777", lineHeight: 1.6 }}>1. Mandales el link de la app por WhatsApp o Instagram.</p>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#777", lineHeight: 1.6 }}>2. Lo abren en Safari (iPhone) o Chrome (Android).</p>
            <p style={{ margin: 0, fontSize: 13, color: "#777", lineHeight: 1.6 }}>3. Listo, ya pueden ver su calendario.</p>
          </div>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8B89A", marginBottom: 14 }}>Opcion 2 - Guardar en el inicio del celu</div>
            <div style={{ fontSize: 11, color: "#50a0f0", letterSpacing: 1, marginBottom: 8 }}>iPHONE</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>1. Abri el link en Safari</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>2. Toca el boton de compartir (abajo)</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>3. Elegir "Agregar a pantalla de inicio"</p>
            <p style={{ margin: "0 14px 0 0", fontSize: 13, color: "#777" }}>4. Confirmar y listo</p>
            <div style={{ borderTop: "1px solid #1e1e1e", margin: "14px 0" }} />
            <div style={{ fontSize: 11, color: "#6fcf6f", letterSpacing: 1, marginBottom: 8 }}>ANDROID</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>1. Abri el link en Chrome</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>2. Toca los tres puntos arriba a la derecha</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>3. Elegir "Agregar a pantalla de inicio"</p>
            <p style={{ margin: 0, fontSize: 13, color: "#777" }}>4. Confirmar y listo</p>
          </div>
        </div>
      )}

      {tab === "guada" && (
        <div>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8B89A", marginBottom: 12 }}>Acceso de entrenadora</div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#777" }}>Desde el inicio elegir "Soy entrenadora" e ingresar con la contrasena:</p>
            <div style={{ background: "#111", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 15, color: "#C8B89A", letterSpacing: 3, textAlign: "center" }}>guada2024</div>
          </div>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8B89A", marginBottom: 12 }}>Como subir una sesion</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>1. Ingresar al panel de entrenadora</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>2. Tocar el nombre del atleta</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>3. Tocar + Sesion</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>4. Completar fecha, tipo, distancia, ritmo e indicaciones</p>
            <p style={{ margin: 0, fontSize: 13, color: "#777" }}>5. Guardar - aparece en el calendario del atleta</p>
          </div>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8B89A", marginBottom: 12 }}>Ver el progreso</div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#777" }}>Cada atleta tiene una barra de progreso en la lista.</p>
            <p style={{ margin: 0, fontSize: 13, color: "#777" }}>Entrando a una sesion completada ves el RPE, sensacion y las notas.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- ATHLETE APP -------------------------------------------------------------
function AthleteApp({ athletes, setAthletes, onHome }) {
  const [aid, setAid] = useState(null);
  const [activeS, setActiveS] = useState(null);
  const [yr, setYr] = useState(TODAY.getFullYear());
  const [mo, setMo] = useState(TODAY.getMonth());
  const [dayModal, setDayModal] = useState(null);

  const athlete = aid ? athletes.find(a => a.id === aid) : null;

  function saveSession(updated) {
    setAthletes(prev => prev.map(a => a.id !== aid ? a : { ...a, sessions: a.sessions.map(s => s.id === updated.id ? updated : s) }));
    setActiveS(null);
    setDayModal(null);
  }

  function prevM() { if (mo === 0) { setMo(11); setYr(y => y - 1); } else setMo(m => m - 1); }
  function nextM() { if (mo === 11) { setMo(0); setYr(y => y + 1); } else setMo(m => m + 1); }

  if (activeS && athlete) {
    const fresh = athlete.sessions.find(s => s.id === activeS.id) || activeS;
    return <SessionDetail session={fresh} onSave={saveSession} onBack={() => setActiveS(null)} isCoach={false} />;
  }

  if (!athlete) {
    return (
      <div>
        <button onClick={onHome} style={BTN_BACK}>Volver</button>
        <div style={{ fontSize: 13, color: "#555", marginBottom: 18 }}>Selecciona tu nombre</div>
        {athletes.map(a => {
          const done = a.sessions.filter(s => s.done).length;
          const total = a.sessions.length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <div key={a.id} onClick={() => setAid(a.id)}
              style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: "16px 18px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#0f0f1a", color: "#C8B89A", border: "1px solid rgba(200,184,154,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{a.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{a.name}</div>
                <div style={{ height: 3, background: "#222", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: "#C8B89A", borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{done}/{total} sesiones - {pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => { setAid(null); setDayModal(null); setActiveS(null); }} style={BTN_BACK}>Volver</button>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Hola, {athlete.name.split(" ")[0]}!</div>
      <div style={{ fontSize: 13, color: "#444", marginBottom: 20 }}>Toca un dia para ver tu sesion</div>
      <Cal sessions={athlete.sessions} onDay={(d, s) => s.length === 1 ? setActiveS(s[0]) : setDayModal({ date: d, sessions: s })}
        year={yr} month={mo} onPrev={prevM} onNext={nextM} />
      {dayModal && <DayModal dateStr={dayModal.date} sessions={dayModal.sessions} onSelect={s => { setActiveS(s); setDayModal(null); }} onClose={() => setDayModal(null)} />}
    </div>
  );
}

// ---- COACH APP ---------------------------------------------------------------
function CoachApp({ athletes, setAthletes }) {
  const [aid, setAid] = useState(null);
  const [activeS, setActiveS] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddA, setShowAddA] = useState(false);
  const [yr, setYr] = useState(TODAY.getFullYear());
  const [mo, setMo] = useState(TODAY.getMonth());
  const [dayModal, setDayModal] = useState(null);
  const [nS, setNS] = useState({ date: "", type: "Rodaje suave", distance: "", pace: "", description: "" });
  const [nA, setNA] = useState("");

  const athlete = aid ? athletes.find(a => a.id === aid) : null;

  function prevM() { if (mo === 0) { setMo(11); setYr(y => y - 1); } else setMo(m => m - 1); }
  function nextM() { if (mo === 11) { setMo(0); setYr(y => y + 1); } else setMo(m => m + 1); }

  function addSession() {
    if (!nS.date || !nS.distance || !nS.pace) return;
    setAthletes(prev => prev.map(a => {
      if (a.id !== aid) return a;
      const newId = (a.sessions.length ? Math.max(...a.sessions.map(s => s.id)) : 0) + 1;
      return { ...a, sessions: [...a.sessions, { ...nS, id: newId, rpe: null, feeling: null, notes: "", done: false }] };
    }));
    setNS({ date: "", type: "Rodaje suave", distance: "", pace: "", description: "" });
    setShowAdd(false);
  }

  function delSession(sid) {
    setAthletes(prev => prev.map(a => a.id !== aid ? a : { ...a, sessions: a.sessions.filter(s => s.id !== sid) }));
    setActiveS(null);
    setDayModal(null);
  }

  function addAthlete() {
    if (!nA.trim()) return;
    const initials = nA.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setAthletes(prev => [...prev, { id: Date.now(), name: nA.trim(), avatar: initials, sessions: [] }]);
    setNA("");
    setShowAddA(false);
  }

  if (activeS && athlete) {
    const fresh = athlete.sessions.find(s => s.id === activeS.id) || activeS;
    return <SessionDetail session={fresh} onSave={() => {}} onBack={() => setActiveS(null)} isCoach={true}
      onDelete={() => { if (window.confirm("Eliminar esta sesion?")) delSession(activeS.id); }} />;
  }

  if (!athlete) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: "#444" }}>{athletes.length} atletas</div>
          <button onClick={() => setShowAddA(true)} style={{ background: "#C8B89A", color: "#0A0A0A", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Atleta</button>
        </div>
        {showAddA && (
          <div style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <input value={nA} onChange={e => setNA(e.target.value)} placeholder="Nombre del atleta" style={{ ...INP, marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addAthlete} style={{ flex: 1, background: "#C8B89A", color: "#0A0A0A", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Agregar</button>
              <button onClick={() => setShowAddA(false)} style={{ flex: 1, background: "#222", color: "#666", border: "none", borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        )}
        {athletes.map(a => {
          const done = a.sessions.filter(s => s.done).length;
          const total = a.sessions.length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <div key={a.id} onClick={() => { setAid(a.id); setYr(TODAY.getFullYear()); setMo(TODAY.getMonth()); }}
              style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: "16px 18px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C8B89A", color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{a.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{a.name}</div>
                <div style={{ height: 3, background: "#222", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: "#C8B89A", borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{done}/{total} - {pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button onClick={() => { setAid(null); setShowAdd(false); setDayModal(null); }} style={{ background: "none", border: "none", color: "#C8B89A", fontSize: 13, cursor: "pointer", padding: 0 }}>Atletas</button>
        <button onClick={() => setShowAdd(true)} style={{ background: "#C8B89A", color: "#0A0A0A", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Sesion</button>
      </div>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{athlete.name}</div>
      <div style={{ fontSize: 12, color: "#444", marginBottom: 18 }}>{athlete.sessions.filter(s => s.done).length}/{athlete.sessions.length} completadas</div>

      {showAdd && (
        <div style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 14, padding: 16, marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#C8B89A", marginBottom: 12 }}>Nueva sesion</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div><div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>FECHA</div><input type="date" value={nS.date} onChange={e => setNS(p => ({ ...p, date: e.target.value }))} style={INP} /></div>
            <div><div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>TIPO</div>
              <select value={nS.type} onChange={e => setNS(p => ({ ...p, type: e.target.value }))} style={INP}>
                {STYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>DISTANCIA</div><input value={nS.distance} onChange={e => setNS(p => ({ ...p, distance: e.target.value }))} placeholder="ej: 10 km" style={INP} /></div>
            <div><div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>RITMO</div><input value={nS.pace} onChange={e => setNS(p => ({ ...p, pace: e.target.value }))} placeholder="ej: 5:30 min/km" style={INP} /></div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 4 }}>INDICACIONES</div>
            <textarea value={nS.description} onChange={e => setNS(p => ({ ...p, description: e.target.value }))} placeholder="Descripcion del entrenamiento..." rows={3} style={{ ...INP, resize: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addSession} style={{ flex: 1, background: "#C8B89A", color: "#0A0A0A", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: "#222", color: "#666", border: "none", borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      )}

      <Cal sessions={athlete.sessions} onDay={(d, s) => s.length === 1 ? setActiveS(s[0]) : setDayModal({ date: d, sessions: s })}
        year={yr} month={mo} onPrev={prevM} onNext={nextM} />
      {dayModal && <DayModal dateStr={dayModal.date} sessions={dayModal.sessions} onSelect={s => { setActiveS(s); setDayModal(null); }} onClose={() => setDayModal(null)} />}
    </div>
  );
}

// ---- LOGIN -------------------------------------------------------------------
function Login({ onLogin, onBack }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  function go() { if (pw === COACH_PW) onLogin(); else { setErr(true); setTimeout(() => setErr(false), 1400); } }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh" }}>
      <div style={{ width: "100%", maxWidth: 300, textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#C8B89A", marginBottom: 6 }}>ACCESO ENTRENADORA</div>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 24 }}>PF.GUADAGARCIASOLA</div>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} placeholder="Contrasena" autoFocus
          style={{ ...INP, textAlign: "center", letterSpacing: 4, marginBottom: 12, border: "1px solid " + (err ? "#f07070" : "#2a2a2a") }} />
        {err && <div style={{ fontSize: 12, color: "#f07070", marginBottom: 10 }}>Contrasena incorrecta</div>}
        <button onClick={go} style={{ width: "100%", background: "#C8B89A", color: "#0A0A0A", border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>Ingresar</button>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#333", fontSize: 12, cursor: "pointer" }}>Volver</button>
      </div>
    </div>
  );
}

// ---- ROOT -------------------------------------------------------------------
export default function App() {
  const [athletes, setAthletes] = useState(BASE_ATHLETES);
  const [screen, setScreen] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F0EDE8", fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #181818", padding: "14px 20px", position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#C8B89A", fontWeight: 600 }}>ENTRENAMIENTO</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#F0EDE8" }}>PF.GUADAGARCIASOLA</div>
        </div>
        {screen !== "home" && (
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "1px solid #1e1e1e", color: "#444", borderRadius: 8, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Inicio</button>
        )}
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 600, margin: "0 auto" }}>
        {screen === "home" && (
          <div style={{ paddingTop: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Bienvenida</div>
            <div style={{ fontSize: 14, color: "#444", marginBottom: 32 }}>Como queres ingresar?</div>
            <button onClick={() => setScreen("athlete")} style={{ width: "100%", background: "#161616", border: "1px solid #222", borderRadius: 16, padding: "20px 22px", color: "#F0EDE8", cursor: "pointer", textAlign: "left", marginBottom: 12, display: "block" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>🏃</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Soy atleta</div>
              <div style={{ fontSize: 13, color: "#444", marginTop: 3 }}>Ver mi calendario y registrar sesiones</div>
            </button>
            <button onClick={() => setScreen("coach-login")} style={{ width: "100%", background: "#161616", border: "1px solid #222", borderRadius: 16, padding: "20px 22px", color: "#F0EDE8", cursor: "pointer", textAlign: "left", marginBottom: 12, display: "block" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>📋</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Soy entrenadora</div>
              <div style={{ fontSize: 13, color: "#444", marginTop: 3 }}>Gestionar atletas y cargar planificaciones</div>
            </button>
            <button onClick={() => setScreen("install")} style={{ width: "100%", background: "none", border: "1px solid #181818", borderRadius: 16, padding: "14px 22px", color: "#444", cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Como instalar la app</div>
              <div style={{ fontSize: 12, color: "#333", marginTop: 3 }}>Para vos y tus atletas</div>
            </button>
          </div>
        )}
        {screen === "athlete" && <AthleteApp athletes={athletes} setAthletes={setAthletes} onHome={() => setScreen("home")} />}
        {screen === "coach-login" && <Login onLogin={() => setScreen("coach")} onBack={() => setScreen("home")} />}
        {screen === "coach" && <CoachApp athletes={athletes} setAthletes={setAthletes} />}
        {screen === "install" && <InstallGuide onBack={() => setScreen("home")} />}
      </div>
    </div>
  );
}
