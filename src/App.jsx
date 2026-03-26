import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

const C = {
  green1: "#B8D94E", green2: "#7CB342", green3: "#4A8C3F",
  teal: "#3A9E91", blue1: "#2E86C1", blue2: "#1A5276",
  gray: "#8A8A8A", grayDark: "#4A4A4A", grayLight: "#C5C5C5",
  bg: "#F7F9F4", white: "#FFFFFF",
  danger: "#E8734A", warn: "#F5A623", good: "#7CB342", great: "#3A9E91",
};

const DIM_LABELS = { rel: "Relações Interpessoais e Liderança", inf: "Significado do Trabalho", dem: "Demandas Laborais", mae: "Meio Ambiente e Equipamentos" };
const DIM_SHORT = { rel: "REL", inf: "INF", dem: "DEM", mae: "MAE" };
const DIM_ICONS = { rel: "🤝", inf: "✨", dem: "⚡", mae: "🏗️" };
const DIM_COLORS = { rel: C.green2, inf: C.teal, dem: C.danger, mae: C.blue1 };

const UNITS = [
  { name: "Teresina", rel: 4.9, inf: 5.5, dem: 4.1, mae: 5.2, participation: 67, participationLabel: "~67% dos colaboradores", period: "Março de 2026", color: C.green2, positives: ["Significado do trabalho com média 5,5 — altamente favorável, indicando forte senso de propósito.", "Relações interpessoais com média 4,9 — favorável, com percepção positiva de suporte e colaboração.", "Meio ambiente e equipamentos com média 5,2 — condições favoráveis.", "Condições gerais favoráveis, especialmente no significado do trabalho e relações interpessoais."], attention: ["Demandas laborais com média 4,1 — necessita atenção e monitoramento contínuo.", "Elevada intensidade das demandas de trabalho.", "Organização e fluxo de tarefas requerem aprimoramento.", "Condições estruturais do ambiente laboral podem ser melhoradas."], risks: ["Elevada intensidade das demandas de trabalho.", "Organização e fluxo de tarefas.", "Condições estruturais do ambiente laboral."], actions: ["Programação de treinamentos mensais (comunicação, gestão de carga, stress, liderança emocional).", "Encontros que promovem diálogo, escuta ativa, reconhecimento e autoconhecimento.", "Enfoque na valorização do bem-estar e desenvolvimento socioemocional.", "Monitoramento contínuo para manter e avançar no cenário positivo."], outlook: "A unidade apresenta base sólida para um ambiente organizacional saudável. Expectativa de aprimoramento nas relações e gestão de demandas, com fortalecimento da cultura de cuidado, comunicação e colaboração." },
  { name: "Caxias", rel: 4.8, inf: 5.2, dem: 3.7, mae: 4.5, participation: 70.8, participationLabel: "63 colaboradores (~70,8%)", period: "Março de 2026", color: C.blue1, positives: ["Significado do trabalho com média 5,2 — condições altamente favoráveis, fator protetivo.", "Relações interpessoais com média 4,8 — condições favoráveis de suporte e colaboração.", "Meio ambiente com média 4,5 — condições favoráveis com oportunidades de melhorias.", "Percepção do significado do trabalho elevada (5,3 na avaliação geral)."], attention: ["Demandas laborais com média 3,7 — exigem monitoramento devido ao ritmo e pressões operacionais.", "Demandas laborais abaixo da média (3,3 na avaliação geral).", "Relações interpessoais requerem monitoramento contínuo (4,2 na última avaliação).", "Ambiente físico e recursos apresentam oportunidades de aprimoramento."], risks: ["Intensidade das demandas: percepções de ritmo intenso, prazos rigorosos.", "Necessidade de fortalecer canais de comunicação e suporte gerencial.", "Condições estruturais: melhorias na organização do espaço e manutenção de equipamentos."], actions: ["Reforçar estratégias de gestão de demandas, incluindo distribuição de tarefas e priorização.", "Capacitar lideranças em competências socioemocionais, comunicação e suporte.", "Manter monitoramento contínuo, reforçando cultura de cuidado mútuo e autocuidado.", "Implementar melhorias estruturais no ambiente de trabalho e recursos materiais."], outlook: "Estrutura psicossocial globalmente favorável, especialmente no significado atribuído ao trabalho. Contudo, demandas laborais representam um ponto de atenção prioritário." },
  { name: "Piripiri", rel: 4.8, inf: 5.2, dem: 3.7, mae: 4.5, participation: 72.4, participationLabel: "~72,4% de adesão", period: "Março de 2026", color: C.teal, positives: ["Significado do trabalho com média 5,2 — altamente favorável, fator protetivo.", "Relações interpessoais com média 4,8 — favorável, com forte senso de colaboração.", "Panorama geral positivo com forte senso de propósito e boas relações.", "Meio ambiente e equipamentos com média 4,5 — favorável."], attention: ["Demandas laborais com média 3,7 — requer monitoramento prioritário.", "Intensas demandas de trabalho, especialmente na logística.", "Organização e fluxo de atividades com necessidade de melhor coordenação.", "Condições estruturais do ambiente laboral com oportunidades de melhorias."], risks: ["Intensas demandas de trabalho, especialmente na logística.", "Organização e fluxo de atividades, com necessidade de melhor coordenação.", "Condições estruturais do ambiente laboral."], actions: ["Gestão de demandas: distribuição de tarefas e planejamento.", "Fortalecimento da liderança socioemocional e comunicação.", "Promover autocuidado, gerenciamento de emoções e cultura de apoio.", "Monitoramento contínuo dos fatores psicossociais."], outlook: "O panorama é positivo, com destaque para o forte senso de propósito e boas relações. A principal atenção recai sobre as demandas laborais, potencialmente relacionadas ao ritmo intenso e prazos." },
  { name: "Picos", rel: 5.0, inf: 5.4, dem: 3.6, mae: 4.8, participation: 86.4, participationLabel: "102 colaboradores (86,4%)", period: "Março 2026 a Março 2027", color: C.blue2, positives: ["Significado do trabalho com média 5,4 — colaboradores atribuem alto valor às atividades.", "Relações interpessoais com média 5,0 — percepção de suporte e colaboração.", "Meio ambiente com média 4,8 — favorável, com possibilidades de aprimoramento.", "Maior adesão entre as unidades (86,4%), garantindo representatividade estatística."], attention: ["Demandas laborais com média 3,6 — requer monitoramento contínuo.", "Ritmo acelerado, volume de tarefas, prazos apertados, especialmente em logística e transporte.", "Organização do fluxo de trabalho: necessidade de melhor coordenação entre setores.", "Condições estruturais: melhorias na organização do espaço e na manutenção de equipamentos."], risks: ["Intensidade das demandas: maior percepção de pressão, necessidade de resposta rápida.", "Organização do trabalho: momentos de sobrecarga devido à dinâmica operacional.", "Condições físicas: adequação do ambiente e equipamentos para evitar desconfortos."], actions: ["Distribuição equilibrada de tarefas e planejamento de rotas realistas.", "Capacitações em competências socioemocionais para lideranças.", "Espaços de escuta, diálogo aberto e feedback contínuo.", "Organização e otimização do espaço de trabalho com manutenção preventiva.", "Avaliações regulares do clima e ações educativas para autogerenciamento do estresse."], outlook: "Compromisso da unidade com o bem-estar dos colaboradores e elevação da gestão de riscos psicossociais. Necessidade de continuidade das ações e monitoramento para garantir melhorias sustentáveis." },
];

const statusOf = (v) => {
  if (v >= 5.0) return { label: "Altamente Favorável", color: C.great, bg: "#E8F5E9" };
  if (v >= 4.5) return { label: "Favorável", color: C.good, bg: "#F1F8E9" };
  if (v >= 4.0) return { label: "Necessita Atenção", color: C.warn, bg: "#FFF8E1" };
  return { label: "Requer Monitoramento", color: C.danger, bg: "#FFF3E0" };
};

/* FONTS — Sora for everything, Raleway Light only for the CUIDARTE logotype */
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400&family=Sora:wght@300;400;500;600;700&display=swap";
fl.rel = "stylesheet";
if (!document.head.querySelector('link[href*="Sora"]')) document.head.appendChild(fl);
const F = {
  body: "'Sora', sans-serif",
  logo: "'Raleway', sans-serif", /* matches the original clean geometric sans-serif of the CUIDARTE mark */
};

const S = {
  app: { fontFamily: F.body, background: C.bg, height: "100vh", width: "100vw", overflow: "hidden", position: "relative", color: C.grayDark },
  slide: (bg = C.bg) => ({ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "36px 48px 72px", transition: "opacity 0.5s ease, transform 0.5s ease", overflowY: "auto", overflowX: "hidden", background: bg }),
  h1: { fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.blue2, marginBottom: 2 },
  sub: { fontFamily: F.body, fontWeight: 400, fontSize: 12, color: C.gray, marginBottom: 20, letterSpacing: "0.06em", textTransform: "uppercase" },
  card: { background: C.white, borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 16px rgba(26,82,118,0.05)", border: "1px solid rgba(26,82,118,0.05)" },
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(26,82,118,0.06)", zIndex: 100 },
  dot: (a) => ({ width: a ? 24 : 9, height: 9, borderRadius: 5, background: a ? C.blue1 : "#ddd", border: "none", cursor: "pointer", transition: "all 0.3s" }),
  btn: { background: "none", border: `1.5px solid ${C.grayLight}`, borderRadius: 7, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.grayDark, fontSize: 16, transition: "all 0.2s" },
};

function AnimNum({ value, run, delay = 0 }) {
  const [d, setD] = useState(0);
  useEffect(() => { if (!run) { setD(0); return; } const t = setTimeout(() => { const s = performance.now(); const step = (n) => { const p = Math.min((n - s) / 900, 1); setD(+(value * (1 - Math.pow(1 - p, 3))).toFixed(1)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, delay); return () => clearTimeout(t); }, [value, delay, run]);
  return <span>{d}</span>;
}
function Badge({ value }) { const s = statusOf(value); return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 16, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>; }
function Petals({ size = 120, opacity = 0.15, style = {} }) { return (<svg width={size} height={size} viewBox="0 0 120 120" style={{ ...style, opacity }}><ellipse cx="45" cy="55" rx="16" ry="36" fill={C.green1} transform="rotate(-20 45 55)" /><ellipse cx="52" cy="50" rx="15" ry="34" fill={C.green2} transform="rotate(-10 52 50)" /><ellipse cx="60" cy="48" rx="14" ry="33" fill={C.green3} transform="rotate(0 60 48)" /><ellipse cx="68" cy="50" rx="14" ry="33" fill={C.teal} transform="rotate(8 68 50)" /><ellipse cx="75" cy="55" rx="15" ry="34" fill={C.blue1} transform="rotate(16 75 55)" /><ellipse cx="80" cy="60" rx="14" ry="32" fill={C.blue2} transform="rotate(22 80 60)" /></svg>); }

function GaugeBar({ value, max = 7, color, label, delay = 0, run }) {
  const [w, setW] = useState(0);
  useEffect(() => { if (!run) { setW(0); return; } const t = setTimeout(() => setW((value / max) * 100), delay + 80); return () => clearTimeout(t); }, [value, max, delay, run]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: C.grayDark }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color }}><AnimNum value={value} delay={delay} run={run} /></span>
          <Badge value={value} />
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "#EEF2E8", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}cc)`, width: `${w}%`, transition: "width 1s cubic-bezier(0.22,1,0.36,1)", transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

function BulletList({ items, color = C.gray }) { return items.map((it, i) => (<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}><span style={{ width: 5, height: 5, borderRadius: 3, background: color, marginTop: 6, flexShrink: 0 }} /><span style={{ fontSize: 11, lineHeight: 1.55, color: C.grayDark }}>{it}</span></div>)); }

function ExpandBox({ icon, title, color, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ ...S.card, cursor: "pointer", borderLeft: open ? `4px solid ${color}` : "1px solid rgba(26,82,118,0.05)", transition: "all 0.35s ease", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: open ? color : C.blue2, transition: "color 0.3s" }}>{title}</h3>
        </div>
        <span style={{ fontSize: 14, color: C.grayLight, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </div>
      <div style={{ maxHeight: open ? 600 : 0, opacity: open ? 1 : 0, transition: "max-height 0.5s ease, opacity 0.4s ease, margin 0.4s ease", marginTop: open ? 16 : 0, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function Expandable({ title, children, color = C.blue2, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (<div style={{ marginBottom: 6 }}><button onClick={() => setOpen(!open)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontFamily: F.body, fontWeight: 600, fontSize: 12, color }}><span style={{ transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0)", fontSize: 9 }}>▶</span>{title}</button>{open && <div style={{ paddingLeft: 17, paddingBottom: 4 }}>{children}</div>}</div>);
}

function CTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (<div style={{ background: C.white, border: "1px solid #e0e0e0", borderRadius: 10, padding: "10px 14px", fontSize: 11, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}><div style={{ fontWeight: 600, marginBottom: 4, color: C.grayDark, fontSize: 13 }}>{label}</div>{payload.map((p, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: p.fill || p.color, display: "inline-block" }} /><span style={{ color: C.gray }}>{p.name}:</span><span style={{ fontWeight: 600, color: C.grayDark }}>{p.value}</span></div>))}</div>);
}

/* ── SLIDE 1 — COVER (white bg, Raleway logo) ── */
function S01({ visible }) {
  return (
    <div style={{ ...S.slide(C.white), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <Petals size={180} opacity={0.18} style={{ position: "absolute", top: 30, right: 50 }} />
      <Petals size={120} opacity={0.08} style={{ position: "absolute", bottom: 90, left: 30 }} />
      <div>
        <Petals size={150} opacity={0.6} style={{ margin: "0 auto 12px" }} />
        <h1 style={{ fontFamily: F.logo, fontWeight: 300, fontSize: 44, color: C.gray, letterSpacing: "0.14em", marginBottom: 0 }}>
          CUIDARTE<span style={{ fontSize: 16, verticalAlign: "super", fontWeight: 300 }}>®</span>
        </h1>
        <p style={{ fontSize: 11, color: C.grayLight, letterSpacing: "0.22em", marginBottom: 40, fontFamily: F.logo, fontWeight: 300 }}>TERAPIAS INTEGRADAS</p>
        <div style={{ width: 50, height: 2, background: `linear-gradient(90deg, ${C.green2}, ${C.blue1})`, margin: "0 auto 28px" }} />
        <h2 style={{ fontWeight: 700, fontSize: 24, color: C.blue2, lineHeight: 1.35, maxWidth: 540, margin: "0 auto 10px" }}>Diagnóstico de Gestão de<br />Riscos Psicossociais</h2>
        <p style={{ fontSize: 14, color: C.gray }}>Programa Cuidarte Mind Corporativo — York</p>
        <p style={{ fontSize: 11, color: C.grayLight, marginTop: 14 }}>Março 2026</p>
      </div>
    </div>
  );
}

/* ── SLIDE 2 — INTRO (expandable boxes) ── */
function S02({ visible }) {
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>1. Introdução Geral</h2>
      <p style={S.sub}>Clique para expandir cada seção</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1 }}>
        <ExpandBox icon="🎯" title="Objetivo" color={C.blue2}><BulletList items={["Promover a saúde mental e gerenciar riscos psicossociais nas unidades.", "Avaliar percepções dos colaboradores sobre clima, demandas, liderança e ambiente.", "Subsidiar estratégias de intervenção e monitoramento contínuo."]} color={C.blue2} /></ExpandBox>
        <ExpandBox icon="📊" title="Metodologia" color={C.teal}><BulletList items={["Instrumento: FRP-Br / COPSOQ II + MAE — referência internacional.", "Avaliação presencial com colaboradores de todos os setores.", "Escala de 1 a 7 — quanto maior, melhor a percepção.", "4 dimensões: REL, INF, DEM e MAE."]} color={C.teal} /></ExpandBox>
        <ExpandBox icon="🏢" title="Unidades Avaliadas" color={C.green3}><BulletList items={["Teresina — ~67% de adesão.", "Caxias — 63 colaboradores (70,8%).", "Piripiri — ~72,4% de adesão.", "Picos — 102 colaboradores (86,4%)."]} color={C.green3} /></ExpandBox>
        <ExpandBox icon="📅" title="Período e Abrangência" color={C.blue1}><BulletList items={["Avaliações conduzidas em março de 2026.", "Cobertura das principais unidades operacionais da York.", "Resultados individuais e comparativos entre todas as unidades."]} color={C.blue1} /></ExpandBox>
      </div>
    </div>
  );
}

/* ── SLIDE 3 — DIMENSIONS (expandable boxes) ── */
function S03({ visible }) {
  const dims = [
    { key: "rel", desc: "Importância do suporte da liderança, reconhecimento, gestão de conflitos, assédio moral e sexual, discriminação e preconceito.", dynamics: "Exercício de escuta ativa, simulações de situações de conflito e feedback construtivo.", objectives: "Melhorar a comunicação, promover apoio mútuo, fortalecer a cultura de respeito." },
    { key: "dem", desc: "Gerenciamento do volume de trabalho, prazos, sobrecarga emocional, fadiga e estresse.", dynamics: "Oficinas de planejamento de rotina, técnicas de respiração e resiliência emocional.", objectives: "Ensinar estratégias de gerenciamento de tarefas, controle de estresse, equilíbrio trabalho-vida." },
    { key: "inf", desc: "Claridade de funções, autonomia, alinhamento de valores, reconhecimento e percepção de propósito.", dynamics: "Reflexão sobre propósito do trabalho, discussão sobre valores pessoais vs organizacionais.", objectives: "Aumentar engajamento, promover autonomia e compreensão do papel na organização." },
    { key: "mae", desc: "Condições físicas do ambiente, ergonomia, segurança, uso correto de equipamentos e EPI.", dynamics: "Treinamentos práticos de equipamentos, inspeções participativas, sugestões de melhorias.", objectives: "Garantir uso adequado de EPI, promover melhorias no ambiente físico." },
  ];
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>Dimensões Avaliadas</h2>
      <p style={S.sub}>Clique para expandir cada dimensão</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1 }}>
        {dims.map((d, i) => (
          <ExpandBox key={i} icon={DIM_ICONS[d.key]} title={DIM_LABELS[d.key]} color={DIM_COLORS[d.key]}>
            <p style={{ fontSize: 11, lineHeight: 1.55, color: C.gray, marginBottom: 10 }}>{d.desc}</p>
            <div style={{ background: `${DIM_COLORS[d.key]}0a`, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: DIM_COLORS[d.key] }}>Objetivos: </span>
              <span style={{ fontSize: 10, color: C.grayDark }}>{d.objectives}</span>
            </div>
            <div style={{ background: `${DIM_COLORS[d.key]}0a`, borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: DIM_COLORS[d.key] }}>Dinâmica: </span>
              <span style={{ fontSize: 10, color: C.grayDark }}>{d.dynamics}</span>
            </div>
          </ExpandBox>
        ))}
      </div>
      <div style={{ ...S.card, marginTop: 12, display: "flex", gap: 14, alignItems: "center", justifyContent: "center", padding: "10px 18px", flexWrap: "wrap" }}>
        {[{ c: C.great, l: "≥ 5.0 Altamente Favorável" }, { c: C.good, l: "4.5–4.9 Favorável" }, { c: C.warn, l: "4.0–4.4 Atenção" }, { c: C.danger, l: "< 4.0 Monitoramento" }].map((s, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: s.c }} />
            <span style={{ fontSize: 10, color: C.gray }}>{s.l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── SLIDES 4-7 — UNIT DETAIL (animated gauges) ── */
function UnitSlide({ visible, unit, index }) {
  const u = unit;
  const dims = ["rel", "inf", "dem", "mae"];
  const colors = [C.green2, C.teal, C.danger, C.blue1];
  const pieData = [{ name: "Adesão", value: u.participation }, { name: "", value: 100 - u.participation }];
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: u.color }} />
        <h2 style={S.h1}>2.{index + 1} Unidade {u.name}</h2>
      </div>
      <p style={S.sub}>{u.period}</p>
      <div style={{ display: "flex", gap: 18, marginBottom: 14 }}>
        <div style={{ ...S.card, flex: "1 1 55%" }}>
          <h3 style={{ fontWeight: 600, fontSize: 14, color: C.blue2, marginBottom: 14 }}>Indicadores Principais</h3>
          {dims.map((d, i) => <GaugeBar key={d} value={u[d]} color={colors[i]} label={DIM_LABELS[d]} delay={i * 150} run={visible} />)}
        </div>
        <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...S.card, textAlign: "center", padding: "14px" }}>
            <div style={{ fontSize: 10, color: C.gray, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>Adesão</div>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={40} startAngle={90} endAngle={-270} paddingAngle={2}><Cell fill={u.color} /><Cell fill="#E8EDE0" /></Pie></PieChart>
            </ResponsiveContainer>
            <div style={{ fontWeight: 700, fontSize: 22, color: u.color, marginTop: -2 }}>{u.participation}%</div>
            <div style={{ fontSize: 10, color: C.gray }}>{u.participationLabel}</div>
          </div>
          <div style={{ ...S.card, textAlign: "center", background: `linear-gradient(135deg, ${u.color}06, ${u.color}12)`, borderLeft: `3px solid ${u.color}` }}>
            <div style={{ fontSize: 10, color: u.color, fontWeight: 600 }}>Média Geral</div>
            <div style={{ fontWeight: 700, fontSize: 30, color: u.color }}>{((u.rel + u.inf + u.dem + u.mae) / 4).toFixed(1)}</div>
            <div style={{ fontSize: 10, color: C.gray }}>de 7.0</div>
          </div>
        </div>
      </div>
      <div style={{ ...S.card }}>
        <Expandable title={`✅ Pontos Positivos (${u.positives.length})`} color={C.good} defaultOpen={true}><BulletList items={u.positives} color={C.good} /></Expandable>
        <Expandable title={`⚠️ Pontos de Atenção (${u.attention.length})`} color={C.warn}><BulletList items={u.attention} color={C.warn} /></Expandable>
        <Expandable title={`🔴 Riscos Prioritários (${u.risks.length})`} color={C.danger}><BulletList items={u.risks} color={C.danger} /></Expandable>
        <Expandable title={`🎯 Ações e Estratégias (${u.actions.length})`} color={C.blue1}><BulletList items={u.actions} color={C.blue1} /></Expandable>
        <div style={{ marginTop: 6, padding: "8px 12px", background: `${u.color}08`, borderRadius: 8, borderLeft: `3px solid ${u.color}` }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: u.color }}>Perspectiva: </span>
          <span style={{ fontSize: 11, color: C.grayDark, lineHeight: 1.5 }}>{u.outlook}</span>
        </div>
      </div>
    </div>
  );
}

/* ── SLIDE 8 — COMPARATIVE (horizontal bars per dimension) ── */
function S08({ visible }) {
  const dimData = ["rel", "inf", "dem", "mae"].map(d => ({ dim: DIM_SHORT[d], fullLabel: DIM_LABELS[d], values: UNITS.map(u => ({ name: u.name, value: u[d], color: u.color })), avg: +(UNITS.reduce((s, u) => s + u[d], 0) / UNITS.length).toFixed(1) }));
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>3. Análise Comparativa Geral</h2>
      <p style={S.sub}>Indicadores por dimensão — todas as unidades</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {dimData.map((dd, di) => {
          const st = statusOf(dd.avg);
          const dk = ["rel","inf","dem","mae"][di];
          return (
            <div key={di} style={{ ...S.card, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{DIM_ICONS[dk]}</span>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 10, color: DIM_COLORS[dk], letterSpacing: "0.06em" }}>{dd.dim}</span>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.grayDark }}>{dd.fullLabel}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 20, color: st.color }}>{dd.avg}</div>
                  <Badge value={dd.avg} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {dd.values.map((v, vi) => {
                  const pct = (v.value / 7) * 100;
                  return (
                    <div key={vi} style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: C.gray }}>{v.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: v.color }}>{v.value}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: "#EEF2E8", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 4, background: v.color, width: visible ? `${pct}%` : "0%", transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${di * 150 + vi * 80}ms` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ ...S.card, marginTop: 12, background: "#FFF8E1", borderLeft: `4px solid ${C.warn}`, padding: "10px 16px" }}>
        <span style={{ fontWeight: 600, color: C.warn, fontSize: 11 }}>Padrão identificado: </span>
        <span style={{ fontSize: 11, color: C.grayDark }}>Significado do trabalho é o ponto mais forte (5,2–5,5). Demandas laborais é universalmente o mais baixo (3,5–4,1), exigindo ações prioritárias.</span>
      </div>
    </div>
  );
}

/* ── SLIDE 9 — BAR CHART ── */
function S09({ visible }) {
  const barData = ["rel", "inf", "dem", "mae"].map(d => ({ dim: DIM_SHORT[d], ...Object.fromEntries(UNITS.map(u => [u.name, u[d]])) }));
  const insights = [
    { icon: "📊", text: "Significado do trabalho (INF) é consistentemente o mais alto — de 5,2 a 5,5 — revelando forte identificação com as atividades." },
    { icon: "🔍", text: "Demandas laborais (DEM) é o menor em todas as unidades — de 3,5 a 4,1 — reforçando necessidade de ações prioritárias." },
    { icon: "🏢", text: "Picos lidera em REL (5,0) e MAE (4,8), enquanto Teresina lidera em INF (5,5) e DEM (4,1)." },
    { icon: "⚡", text: "Caxias e Piripiri têm indicadores idênticos (REL 4,8 / INF 5,2 / DEM 3,7 / MAE 4,5), sugerindo desafios similares." },
  ];
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>Comparativo — Gráfico de Barras</h2>
      <p style={S.sub}>Desempenho por dimensão em cada unidade</p>
      <div style={{ ...S.card, marginBottom: 12 }}>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={barData} barCategoryGap="18%" barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE0" vertical={false} />
            <XAxis dataKey="dim" tick={{ fontSize: 12, fontWeight: 600, fill: C.grayDark }} axisLine={{ stroke: "#E0E7D8" }} tickLine={false} />
            <YAxis domain={[0, 7]} tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false} />
            {UNITS.map(u => (<Bar key={u.name} dataKey={u.name} fill={u.color} radius={[4, 4, 0, 0]} maxBarSize={34}>{barData.map((_, j) => <Cell key={j} fillOpacity={0.88} />)}</Bar>))}
            <Tooltip content={<CTooltip />} cursor={false} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {insights.map((p, i) => (
          <div key={i} style={{ ...S.card, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16 }}>{p.icon}</span>
            <span style={{ fontSize: 11, lineHeight: 1.55, color: C.grayDark }}>{p.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SLIDE 10 — RISKS ── */
function S10({ visible }) {
  const risks = [
    { title: "Intensidade das Demandas de Trabalho", severity: "Alta", icon: "🔴", units: "Todas as unidades", desc: "Percepção de ritmo intenso, prazos rigorosos e volume elevado. Impacto direto na saúde mental, com risco de fadiga e burnout. Especialmente relevante em logística e transporte.", sColor: C.danger },
    { title: "Organização e Fluxo de Trabalho", severity: "Média-Alta", icon: "🟠", units: "Picos, Piripiri, Caxias", desc: "Necessidade de melhor coordenação entre setores, redistribuição de tarefas e planejamento de rotas e cronogramas realistas.", sColor: C.warn },
    { title: "Condições Estruturais do Ambiente", severity: "Média", icon: "🟡", units: "Caxias, Piripiri, Picos", desc: "Oportunidades de melhoria na organização do espaço, manutenção de equipamentos, adequação ergonômica.", sColor: "#D4A017" },
    { title: "Comunicação e Suporte Gerencial", severity: "Moderada", icon: "🟡", units: "Caxias", desc: "Necessidade de fortalecer canais de comunicação e suporte gerencial (4,2 na última avaliação de REL em Caxias).", sColor: "#D4A017" },
  ];
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>Riscos Psicossociais Comuns</h2>
      <p style={S.sub}>Fatores identificados em múltiplas unidades</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {risks.map((r, i) => (
          <div key={i} style={{ ...S.card, display: "flex", gap: 14, alignItems: "flex-start", borderLeft: `4px solid ${r.sColor}`, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateX(3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            <div style={{ fontSize: 26, minWidth: 32, textAlign: "center", paddingTop: 2 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <h3 style={{ fontWeight: 600, fontSize: 14, color: C.grayDark }}>{r.title}</h3>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: `${r.sColor}18`, color: r.sColor }}>Severidade: {r.severity}</span>
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.55, color: C.gray, marginBottom: 3 }}>{r.desc}</p>
              <span style={{ fontSize: 10, color: C.blue1, fontWeight: 500 }}>📍 {r.units}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SLIDE 11 — NEXT STEPS PER UNIT ── */
function S11({ visible }) {
  const [sel, setSel] = useState(0);
  const SD = {
    "Teresina": { p: ["Manter treinamentos mensais (comunicação, gestão de carga, stress, liderança emocional).", "Encontros de diálogo, escuta ativa, reconhecimento e autoconhecimento.", "Monitoramento contínuo para avançar no cenário positivo."], t: ["Comunicação assertiva e feedback construtivo.", "Gestão de carga de trabalho e priorização.", "Liderança emocional e suporte socioemocional.", "Técnicas de respiração, relaxamento e mindfulness."], l: ["Reuniões de acompanhamento periódicas.", "Grupos de escuta mensal.", "Espaço para feedbacks e sugestões."], e: ["Valorização do bem-estar e desenvolvimento socioemocional.", "Consolidação da cultura de cuidado e responsabilidade."] },
    "Caxias": { p: ["Reforçar gestão de demandas — distribuição de tarefas e priorização.", "Capacitar lideranças em competências socioemocionais e comunicação.", "Implementar melhorias estruturais no ambiente e recursos materiais."], t: ["Competências socioemocionais para líderes.", "Comunicação assertiva e suporte psicossocial.", "Gerenciamento de tarefas e controle de estresse.", "Equilíbrio entre produtividade e saúde mental."], l: ["Monitoramento contínuo com cultura de cuidado mútuo.", "Reuniões com foco nas demandas operacionais.", "Grupos de escuta mensal."], e: ["Melhorias na organização do espaço.", "Manutenção de equipamentos e adequação ergonômica.", "Fortalecimento de canais de comunicação."] },
    "Piripiri": { p: ["Gestão de demandas: distribuição de tarefas, especialmente na logística.", "Fortalecimento da liderança socioemocional e comunicação.", "Promover autocuidado e cultura de apoio."], t: ["Gestão de demandas e planejamento operacional.", "Liderança socioemocional e comunicação eficaz.", "Autocuidado e gerenciamento de emoções.", "Identificação de sinais de fadiga e burnout."], l: ["Monitoramento contínuo dos fatores psicossociais.", "Grupos de escuta para demandas.", "Reuniões de alinhamento entre setores."], e: ["Melhor coordenação entre setores.", "Melhorias nas condições estruturais.", "Otimização dos fluxos de atividades."] },
    "Picos": { p: ["Distribuição equilibrada de tarefas e cronogramas realistas.", "Capacitações socioemocionais para lideranças.", "Organização e otimização do espaço de trabalho."], t: ["Ferramentas de gestão do tempo e priorização.", "Competências socioemocionais para líderes.", "Ações educativas para autogerenciamento do estresse.", "Técnicas de resiliência emocional."], l: ["Espaços de escuta e diálogo aberto.", "Feedback contínuo e reconhecimento.", "Avaliações regulares do clima organizacional."], e: ["Manutenção preventiva de equipamentos.", "Adequação do ambiente para evitar desconfortos.", "Cultura de cuidado e responsabilidade mútua."] },
  };
  const steps = SD[UNITS[sel].name];
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>4. Próximos Passos por Unidade</h2>
      <p style={S.sub}>Clique na unidade para visualizar ações específicas</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {UNITS.map((unit, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ fontFamily: F.body, fontWeight: sel === i ? 700 : 400, fontSize: 12, padding: "7px 18px", borderRadius: 20, border: "none", cursor: "pointer", background: sel === i ? unit.color : "transparent", color: sel === i ? "#fff" : C.gray, transition: "all 0.25s" }}>{unit.name}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
        <div style={{ ...S.card, borderTop: `3px solid ${C.danger}` }}><h3 style={{ fontWeight: 600, fontSize: 13, color: C.danger, marginBottom: 10 }}>🎯 Ações Prioritárias</h3><BulletList items={steps.p} color={C.danger} /></div>
        <div style={{ ...S.card, borderTop: `3px solid ${C.blue1}` }}><h3 style={{ fontWeight: 600, fontSize: 13, color: C.blue1, marginBottom: 10 }}>📚 Capacitações e Treinamentos</h3><BulletList items={steps.t} color={C.blue1} /></div>
        <div style={{ ...S.card, borderTop: `3px solid ${C.teal}` }}><h3 style={{ fontWeight: 600, fontSize: 13, color: C.teal, marginBottom: 10 }}>👂 Espaços de Escuta e Feedback</h3><BulletList items={steps.l} color={C.teal} /></div>
        <div style={{ ...S.card, borderTop: `3px solid ${C.green2}` }}><h3 style={{ fontWeight: 600, fontSize: 13, color: C.green2, marginBottom: 10 }}>🏗️ Melhoria do Ambiente</h3><BulletList items={steps.e} color={C.green2} /></div>
      </div>
    </div>
  );
}

/* ── SLIDE 12 — GOALS ── */
function S12({ visible }) {
  const goals = [
    { metric: "Demandas Laborais", current: "3,5 – 4,1", target: "≥ 4,5", icon: "📈", desc: "Elevação do indicador DEM em todas as unidades." },
    { metric: "Relações Interpessoais", current: "4,8 – 5,0", target: "≥ 5,2", icon: "🤝", desc: "Fortalecimento do suporte e comunicação." },
    { metric: "Meio Ambiente", current: "4,4 – 5,2", target: "≥ 5,0", icon: "🏢", desc: "Melhorias estruturais e manutenção." },
    { metric: "Adesão à Avaliação", current: "67 – 86,4%", target: "≥ 85%", icon: "📊", desc: "Maior representatividade estatística." },
  ];
  const tools = ["Questionários periódicos (FRP-Br / COPSOQ).", "Reuniões de alinhamento mensais.", "Indicadores de clima trimestrais.", "Avaliações semestrais de evolução.", "Relatórios de acompanhamento.", "Grupos de escuta mensal."];
  return (
    <div style={{ ...S.slide(), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}>
      <h2 style={S.h1}>5. Metas e Indicadores de Sucesso</h2>
      <p style={S.sub}>Metas quantitativas e ferramentas de monitoramento</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {goals.map((g, i) => (
          <div key={i} style={{ ...S.card, padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{g.icon}</span>
              <h3 style={{ fontWeight: 600, fontSize: 13, color: C.blue2 }}>{g.metric}</h3>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ background: "#FFF3E0", borderRadius: 8, padding: "5px 10px", flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.warn, fontWeight: 600 }}>ATUAL</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.warn }}>{g.current}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", color: C.grayLight, fontSize: 14 }}>→</div>
              <div style={{ background: "#E8F5E9", borderRadius: 8, padding: "5px 10px", flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.good, fontWeight: 600 }}>META</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.good }}>{g.target}</div>
              </div>
            </div>
            <p style={{ fontSize: 10, color: C.gray }}>{g.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ ...S.card }}>
        <h3 style={{ fontWeight: 600, fontSize: 13, color: C.blue2, marginBottom: 10 }}>🔧 Ferramentas de Monitoramento</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <BulletList items={tools.slice(0, 3)} color={C.teal} />
          <BulletList items={tools.slice(3)} color={C.teal} />
        </div>
      </div>
    </div>
  );
}

/* ── SLIDE 13 — CLOSING (white bg, Raleway logo) ── */
function S13({ visible }) {
  const commitments = ["Compromisso da liderança com a cultura de cuidado e atenção à saúde mental.", "Necessidade de participação ativa de todos na implementação das ações.", "Continuidade das ações e do monitoramento para melhorias sustentáveis.", "Compromisso com o bem-estar dos colaboradores e elevação da gestão de riscos.", "Impacto esperado na produtividade, clima organizacional e sustentabilidade."];
  return (
    <div style={{ ...S.slide(C.white), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <Petals size={120} opacity={0.45} style={{ margin: "0 auto 20px" }} />
      <h2 style={{ fontWeight: 700, fontSize: 22, color: C.blue2, maxWidth: 500, lineHeight: 1.4, marginBottom: 12 }}>6. Encerramento e Compromisso</h2>
      <div style={{ width: 50, height: 2, background: `linear-gradient(90deg, ${C.green2}, ${C.blue1})`, margin: "0 auto 20px" }} />
      <div style={{ ...S.card, maxWidth: 520, textAlign: "left", margin: "0 auto 20px" }}>
        {commitments.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: i < 2 ? C.blue1 : C.teal, marginTop: 6, flexShrink: 0 }} />
            <span style={{ fontSize: 12, lineHeight: 1.6, color: C.grayDark }}>{c}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 14, color: C.gray, maxWidth: 420, lineHeight: 1.7, fontStyle: "italic" }}>
        "Construindo juntos uma cultura de cuidado, comunicação e responsabilidade mútua."
      </p>
      <div style={{ marginTop: 28 }}>
        <Petals size={80} opacity={0.4} style={{ margin: "0 auto 8px" }} />
        <p style={{ fontFamily: F.logo, fontWeight: 300, fontSize: 20, color: C.gray, letterSpacing: "0.14em" }}>CUIDARTE<span style={{ fontSize: 10, verticalAlign: "super" }}>®</span></p>
        <p style={{ fontFamily: F.logo, fontWeight: 300, fontSize: 9, color: C.grayLight, letterSpacing: "0.22em" }}>TERAPIAS INTEGRADAS</p>
      </div>
      <p style={{ fontSize: 10, color: C.grayLight, marginTop: 16 }}>Cuidarte Mind Corporativo — York · Março 2026</p>
    </div>
  );
}

/* ── SLIDE 14 — MENTIMETER ── */
function S14({ visible }) {
  return (
    <div style={{ ...S.slide(C.white), opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ textAlign: "center" }}>
        <Petals size={60} opacity={0.35} style={{ margin: "0 auto 12px" }} />
        <h2 style={{ ...S.h1, textAlign: "center" }}>Sua opinião importa</h2>
        <p style={{ ...S.sub, textAlign: "center" }}>Participe da enquete ao vivo</p>
      </div>
      <div style={{ position: "relative", paddingBottom: "56.25%", paddingTop: 35, height: 0, overflow: "hidden", width: "100%", maxWidth: 720, borderRadius: 14, boxShadow: "0 2px 24px rgba(26,82,118,0.10)" }}>
        <iframe
          sandbox="allow-popups allow-scripts allow-same-origin allow-presentation"
          allowFullScreen
          allowTransparency
          frameBorder="0"
          src="https://www.mentimeter.com/app/presentation/al5jq3zmrhhhia6zhxxir8k1s2zu7vhz/embed"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

/* ── MAIN ── */
const SLIDES = [
  { comp: S01, title: "Capa" }, { comp: S02, title: "1. Introdução" }, { comp: S03, title: "Dimensões" },
  { comp: (p) => <UnitSlide {...p} unit={UNITS[0]} index={0} />, title: "2.1 Teresina" },
  { comp: (p) => <UnitSlide {...p} unit={UNITS[1]} index={1} />, title: "2.2 Caxias" },
  { comp: (p) => <UnitSlide {...p} unit={UNITS[2]} index={2} />, title: "2.3 Piripiri" },
  { comp: (p) => <UnitSlide {...p} unit={UNITS[3]} index={3} />, title: "2.4 Picos" },
  { comp: S08, title: "3. Comparativo" }, { comp: S09, title: "3. Barras" }, { comp: S10, title: "Riscos" },
  { comp: S11, title: "4. Próximos Passos" }, { comp: S12, title: "5. Metas" }, { comp: S13, title: "6. Encerramento" },
  { comp: S14, title: "Enquete" },
];

/* ── VIEWPORT SCALING ── */
const BASE_W = 1280;
const BASE_H = 720;

function useScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

export default function App() {
  const [cur, setCur] = useState(0);
  const scale = useScale();
  const go = useCallback((d) => setCur(c => Math.max(0, Math.min(SLIDES.length - 1, c + d))), []);
  useEffect(() => { const h = (e) => { if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(-1); } }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [go]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})`, transformOrigin: "center center", position: "relative", fontFamily: F.body, color: C.grayDark, overflow: "hidden" }}>
        {/* progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 101, background: "#E8EDE0" }}>
          <div style={{ height: "100%", width: `${((cur + 1) / SLIDES.length) * 100}%`, background: `linear-gradient(90deg, ${C.green2}, ${C.blue1})`, transition: "width 0.4s ease" }} />
        </div>
        {/* slide counter */}
        <div style={{ position: "absolute", top: 10, right: 20, fontSize: 10, color: C.grayLight, zIndex: 101, fontWeight: 500, textAlign: "right" }}>
          <div>{cur + 1} / {SLIDES.length}</div>
          <div style={{ fontSize: 9, opacity: 0.7 }}>{SLIDES[cur].title}</div>
        </div>
        {/* slides */}
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {SLIDES.map((sd, i) => { const Comp = sd.comp; return <div key={i} style={{ pointerEvents: i === cur ? "auto" : "none" }}><Comp visible={i === cur} /></div>; })}
        </div>
        {/* nav */}
        <div style={{ ...S.nav, position: "absolute" }}>
          <button onClick={() => go(-1)} style={{ ...S.btn, opacity: cur === 0 ? 0.3 : 1 }} disabled={cur === 0}>‹</button>
          <div style={{ display: "flex", gap: 4, margin: "0 10px", alignItems: "center" }}>
            {SLIDES.map((sd, i) => <button key={i} onClick={() => setCur(i)} style={S.dot(i === cur)} title={sd.title} />)}
          </div>
          <button onClick={() => go(1)} style={{ ...S.btn, opacity: cur === SLIDES.length - 1 ? 0.3 : 1 }} disabled={cur === SLIDES.length - 1}>›</button>
        </div>
      </div>
    </div>
  );
}

