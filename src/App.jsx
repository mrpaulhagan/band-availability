import { useState } from "react";

const MEMBERS = [
  { id: "paul",  name: "Paul"  },
  { id: "phil",  name: "Phil"  },
  { id: "badge", name: "Badge" },
];

const YEAR = 2026;
const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toKey(d) {
  return d.toISOString().slice(0, 10);
}

function getWeekends() {
  const months = {};
  let d = new Date(YEAR, 0, 1);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  while (d.getFullYear() === YEAR) {
    const fri = new Date(d);
    const sat = new Date(d); sat.setDate(d.getDate() + 1);
    const sun = new Date(d); sun.setDate(d.getDate() + 2);
    const m = fri.getMonth();
    if (!months[m]) months[m] = { name: MN[m], wks: [] };
    months[m].wks.push({ fri, sat, sun });
    d.setDate(d.getDate() + 7);
  }
  return Object.values(months);
}

function fmt(fri, sun) {
  if (fri.getMonth() === sun.getMonth())
    return `${fri.getDate()}–${sun.getDate()} ${MS[fri.getMonth()]}`;
  return `${fri.getDate()} ${MS[fri.getMonth()]}–${sun.getDate()} ${MS[sun.getMonth()]}`;
}

const DAYS = ["Fri", "Sat", "Sun"];

const styles = {
  app: {
    background: "#111010", minHeight: "100vh", color: "#f0ebe0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  inner: { maxWidth: 420, margin: "0 auto" },
  topbar: {
    position: "sticky", top: 0, zIndex: 10,
    background: "#111010", borderBottom: "1px solid #2e2d2d",
    padding: "14px 16px", display: "flex", alignItems: "baseline", justifyContent: "space-between",
  },
  topbarTitle: {
    fontFamily: "'Anton', impact, sans-serif", fontSize: 20,
    letterSpacing: "0.05em", color: "#e8c87a",
  },
  topbarYear: { fontSize: 13, color: "#7a7570" },
  legend: {
    display: "flex", gap: 12, alignItems: "center",
    padding: "7px 12px", borderBottom: "1px solid #2e2d2d",
    fontSize: 11, color: "#7a7570",
  },
  leg: { display: "flex", alignItems: "center", gap: 5 },
  swatch: {
    width: 28, height: 16, borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, fontWeight: 700,
  },
  cal: { padding: "0 12px 3rem" },
  monthLabel: {
    fontFamily: "'Anton', impact, sans-serif", fontSize: 14,
    letterSpacing: "0.1em", color: "#e8c87a", textTransform: "uppercase",
    padding: "1rem 4px 0.5rem", borderBottom: "1px solid #2e2d2d", marginBottom: 8,
  },
  card: {
    background: "#1c1b1b", border: "1px solid #2e2d2d",
    borderRadius: 10, marginBottom: 8, overflow: "hidden",
  },
  cardHd: {
    display: "flex", alignItems: "baseline", justifyContent: "space-between",
    padding: "9px 12px 5px",
  },
  cardDates: { fontSize: 14, fontWeight: 500, color: "#f0ebe0" },
  cardSum:   { fontSize: 11, color: "#7a7570" },
  table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
  thName: {
    width: 58, padding: "0 6px 5px 12px", fontSize: 11, fontWeight: 400,
    color: "#7a7570", borderBottom: "1px solid #2e2d2d", textAlign: "left",
  },
  thDay: {
    padding: "0 4px 5px", textAlign: "center", fontSize: 11, fontWeight: 500,
    color: "#7a7570", letterSpacing: "0.04em", borderBottom: "1px solid #2e2d2d",
  },
  tdName: { padding: "4px 6px 4px 12px", fontSize: 13, fontWeight: 500, color: "#f0ebe0" },
  tdCell: { padding: "3px 4px", textAlign: "center" },
};

const AV_STYLE = {
  yes:  { background: "#1a5c34", color: "#a8f0c0" },
  no:   { background: "#5c1a1a", color: "#f0a8a8" },
  none: { background: "#272625", color: "#7a7570" },
};
const AV_SYM = { yes: "✓", no: "✗", none: "·" };
function nextAv(cur) { return cur === "none" ? "yes" : cur === "yes" ? "no" : "none"; }

function AvButton({ av, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...AV_STYLE[av],
        width: "100%", height: 32, borderRadius: 6, border: "none",
        fontSize: 15, cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "inherit", transition: "filter 0.1s",
      }}
      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
      onMouseLeave={e => e.currentTarget.style.filter = ""}
    >
      {AV_SYM[av]}
    </button>
  );
}

const MONTHS = getWeekends();

export default function App() {
  const [data, setData] = useState(() => {
  const d = {};
  MEMBERS.forEach(m => { d[m.id] = {}; });
  return d;
});

  function toggle(memberId, dateKey) {
    setData(prev => {
      const cur = prev[memberId][dateKey] || "none";
      return {
        ...prev,
        [memberId]: { ...prev[memberId], [dateKey]: nextAv(cur) },
      };
    });
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <div style={styles.inner}>
        <div style={styles.topbar}>
          <span style={styles.topbarTitle}>BAND AVAILABILITY</span>
          <span style={styles.topbarYear}>2026</span>
        </div>

        <div style={styles.legend}>
          <span style={styles.leg}><span style={{...styles.swatch,...AV_STYLE.yes}}>✓</span>Free</span>
          <span style={styles.leg}><span style={{...styles.swatch,...AV_STYLE.no}}>✗</span>Busy</span>
          <span style={styles.leg}><span style={{...styles.swatch,...AV_STYLE.none}}>·</span>No reply</span>
          <span style={{marginLeft:"auto",fontSize:10,fontStyle:"italic"}}>Tap to toggle</span>
        </div>

        <div style={styles.cal}>
          {MONTHS.map(mo => (
            <div key={mo.name}>
              <div style={styles.monthLabel}>{mo.name}</div>
              {mo.wks.map(({fri, sat, sun}) => {
                const dates = [fri, sat, sun];
                const keys  = dates.map(toKey);
                const best  = Math.max(...dates.map(d =>
                  MEMBERS.filter(m => data[m.id][toKey(d)] === "yes").length
                ));
                const summary = best > 0 ? `${best}/${MEMBERS.length} free on best day` : "";

                return (
                  <div key={toKey(fri)} style={styles.card}>
                    <div style={styles.cardHd}>
                      <span style={styles.cardDates}>{fmt(fri, sun)}</span>
                      {summary && <span style={styles.cardSum}>{summary}</span>}
                    </div>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.thName}></th>
                          {DAYS.map(d => <th key={d} style={styles.thDay}>{d}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {MEMBERS.map((m, mi) => (
                          <tr key={m.id} style={mi < MEMBERS.length-1 ? {borderBottom:"1px solid #2e2d2d"} : {}}>
                            <td style={styles.tdName}>{m.name}</td>
                            {keys.map(k => (
                              <td key={k} style={styles.tdCell}>
                                <AvButton
                                  av={data[m.id][k] || "none"}
                                  onClick={() => toggle(m.id, k)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
