import { useState, useEffect, useRef } from "react";
import  PixelBlast from "../components/PixelBlast"
import { useNavigate } from "react-router-dom";  // adjust import to your package path

// ─── Design tokens ───────────────────────────────────────────────
const C = {
  purple900: "#26215C",
  purple800: "#3C3489",
  purple600: "#534AB7",
  purple400: "#7F77DD",
  purple200: "#AFA9EC",
  purple100: "#CECBF6",
  purple50:  "#EEEDFE",
  teal600:   "#0F6E56",
  teal200:   "#5DCAA5",
  teal50:    "#E1F5EE",
  amber50:   "#FAEEDA",
  amber800:  "#633806",
  blue50:    "#E6F1FB",
  blue800:   "#0C447C",
  text:      "#18181B",
  textMuted: "#71717A",
  textFaint: "#A1A1AA",
  border:    "rgba(0,0,0,0.08)",
  borderMed: "rgba(0,0,0,0.14)",
  surface:   "#FFFFFF",
  surfaceAlt:"#F8F8FB",
};

// ─── Tiny helpers ─────────────────────────────────────────────────
const px = (n) => `${n}px`;

function useTypewriter(lines, speed = 38) {
  const [text, setText] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setText((p) => p + line[charIdx]);
        setCharIdx((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setText((p) => p + "\n");
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, lines, speed]);
  return text;
}

// ─── Sub-components ───────────────────────────────────────────────

function Nav() {
  const navigate = useNavigate();
  return (
    <nav style={{
      position: "relative", zIndex: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem", height: 60,
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: `0.5px solid ${C.border}`,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: C.purple600,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 17,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 16, color: C.text, letterSpacing: "-0.02em" }}>
          Code-O-Share
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {["Features", "Docs", "Pricing"].map((l) => (
          <a key={l} href="#" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => e.target.style.color = C.text}
            onMouseLeave={e => e.target.style.color = C.textMuted}
          >{l}</a>
        ))}
        <LivePill />
        <button style={{
          background: C.purple600, color: "#fff", border: "none",
          padding: "8px 18px", borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13,
          cursor: "pointer", letterSpacing: "0.01em",
        }}
        onClick={() => navigate("/login")}
        >
          Get started
        </button>
      </div>
    </nav>
  );
}

function LivePill() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: C.teal50, borderRadius: 99,
      padding: "4px 12px", fontSize: 12,
      color: C.teal600, fontFamily: "'DM Mono', monospace",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: C.teal200,
        animation: "pulse 1.6s ease-in-out infinite",
      }} />
      3 online
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      position: "relative", zIndex: 2,
      minHeight: 560, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "5rem 2rem 4rem", textAlign: "center",
    }}>
      {/* Badge */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.55s cubic-bezier(.22,.68,0,1.2)",
        display: "inline-flex", alignItems: "center", gap: 7,
        background: C.purple50, color: C.purple800,
        borderRadius: 99, padding: "5px 16px",
        border: `0.5px solid ${C.purple200}`,
        fontSize: 12, fontFamily: "'DM Mono', monospace",
        marginBottom: "1.5rem",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={C.purple600} stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Real-time · Zero setup · Always saved
      </div>

      {/* Headline */}
      <h1 style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "all 0.65s 0.08s cubic-bezier(.22,.68,0,1.2)",
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: "clamp(38px, 6vw, 64px)",
        fontWeight: 400, lineHeight: 1.12,
        color: C.text, maxWidth: 680,
        marginBottom: "1.25rem",
        letterSpacing: "-0.02em",
      }}>
        Code together,{" "}
        <em style={{ color: C.purple600, fontStyle: "italic" }}>ship faster.</em>
      </h1>

      {/* Sub */}
      <p style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "all 0.65s 0.16s cubic-bezier(.22,.68,0,1.2)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 17, color: C.textMuted,
        maxWidth: 480, lineHeight: 1.65,
        marginBottom: "2.25rem",
      }}>
        A collaborative IDE with live chat, instant code saving, and one-click retrieval — built for teams who move fast.
      </p>

      {/* CTAs */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "all 0.65s 0.24s cubic-bezier(.22,.68,0,1.2)",
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
      }}>
        <PrimaryBtn onClick={() => navigate("/login")}>
          Start free workspace →
        </PrimaryBtn>
        <GhostBtn onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}>
          Watch demo
        </GhostBtn>
      </div>
    </section>
  );
}

function PrimaryBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.purple800 : C.purple600,
        color: "#fff", border: "none",
        padding: "13px 28px", borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15,
        cursor: "pointer", transition: "background 0.18s, transform 0.14s",
        transform: hov ? "scale(1.025)" : "scale(1)",
        letterSpacing: "0.01em",
      }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(83,74,183,0.07)" : "rgba(255,255,255,0.7)",
        color: C.text, border: `0.5px solid ${C.borderMed}`,
        padding: "13px 28px", borderRadius: 10,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15,
        cursor: "pointer", transition: "all 0.18s",
        backdropFilter: "blur(8px)",
      }}
    >{children}</button>
  );
}

function Stats() {
  const items = [
    { n: "14k+", label: "Developers" },
    { n: "99.9%", label: "Uptime SLA" },
    { n: "<80ms", label: "Sync latency" },
    { n: "∞", label: "Snippet history" },
  ];
  return (
    <div style={{
      position: "relative", zIndex: 2,
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      gap: 1, background: C.border,
      borderTop: `0.5px solid ${C.border}`,
      borderBottom: `0.5px solid ${C.border}`,
    }}>
      {items.map(({ n, label }) => (
        <div key={label} style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(10px)",
          padding: "1.5rem 1rem", textAlign: "center",
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600, color: C.purple600 }}>{n}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textMuted, marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function Features() {
  const feats = [
    {
      icon: <UsersIcon />, title: "Live multiplayer editing",
      desc: "See every teammate's cursor in real time with conflict-free CRDT sync across any file.",
    },
    {
      icon: <ChatIcon />, title: "Inline live chat",
      desc: "Chat right beside your code. No context-switching, no Slack tab needed.",
    },
    {
      icon: <SaveIcon />, title: "Auto-save & versioning",
      desc: "Every keystroke saved. Revert to any moment in your session history instantly.",
    },
    {
      icon: <FolderIcon />, title: "Snippet library",
      desc: "Store, tag, and retrieve code snippets across every project — searchable forever.",
    },
  ];
  return (
    <section style={{
      position: "relative", zIndex: 2,
      padding: "4rem 2.5rem", background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(12px)",
    }}>
      <SectionLabel>Features</SectionLabel>
      <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, fontWeight: 400, color: C.text, marginBottom: 8 }}>
        Everything your team needs
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.textMuted, maxWidth: 440, lineHeight: 1.65, marginBottom: "2.5rem" }}>
        All the tools to write, collaborate, and save — without jumping between five apps.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {feats.map((f) => <FeatCard key={f.title} {...f} />)}
      </div>
    </section>
  );
}

function FeatCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.purple50 : C.surface,
        border: `0.5px solid ${hov ? C.purple200 : C.border}`,
        borderRadius: 14, padding: "1.4rem",
        transition: "all 0.2s",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: C.purple50, display: "flex",
        alignItems: "center", justifyContent: "center",
        marginBottom: 14, color: C.purple600,
      }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: 11,
      color: C.purple600, letterSpacing: "0.1em",
      textTransform: "uppercase", marginBottom: 10,
    }}>{children}</div>
  );
}

// ─── Mockup panels ────────────────────────────────────────────────

const CODE_LINES = [
  "from flask import Flask, jsonify",
  "import codesync",
  "",
  "app = Flask(__name__)",
  "",
  "@app.route('/snippets')",
  "def get_snippets():",
  "  data = codesync.retrieve(",
  "    user='priya', tag='api', limit=10",
  "  )",
  "  return jsonify(data)",
];

function CodePanel() {
  const typed = useTypewriter(CODE_LINES, 32);
  const lines = typed.split("\n");

  const highlight = (line) => {
    if (!line) return "&nbsp;";
    return line
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\b(from|import|def|return)\b/g, `<kw>$1</kw>`)
      .replace(/\b(Flask|jsonify|codesync|retrieve|get_snippets|app\.route)\b/g, `<fn>$1</fn>`)
      .replace(/&#39;([^']*)&#39;/g, `<str>'$1'</str>`)
      .replace(/'([^']*)'/g, `<str>'$1'</str>`)
      .replace(/\b(\d+)\b/g, `<num>$1</num>`);
  };

  return (
    <div style={{
      background: "#0F0E1A", borderRadius: 14,
      border: `0.5px solid rgba(255,255,255,0.08)`,
      overflow: "hidden", flex: 1,
    }}>
      {/* Window chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "10px 14px",
        background: "rgba(255,255,255,0.04)",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E24B4A" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF9F27" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#639922" }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>main.py</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <AvatarBadge name="Priya" color={C.teal200} textColor={C.teal600} bg={C.teal50} />
          <AvatarBadge name="Arjun" color={C.purple400} textColor={C.purple800} bg={C.purple50} />
        </div>
      </div>
      {/* Code area */}
      <div style={{ padding: "14px 18px", minHeight: 230, overflowX: "auto" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 16, fontFamily: "'DM Mono', monospace", fontSize: 12.5, lineHeight: 1.75 }}>
            <span style={{ color: "rgba(255,255,255,0.18)", userSelect: "none", minWidth: 16, textAlign: "right" }}>{i + 1}</span>
            <span style={{ color: "#D4D0FF", flex: 1 }} dangerouslySetInnerHTML={{ __html:
              highlight(line)
                .replace(/&lt;kw&gt;/g, `<span style="color:#7F77DD">`)
                .replace(/&lt;\/kw&gt;/g, `</span>`)
                .replace(/&lt;fn&gt;/g, `<span style="color:#5DCAA5">`)
                .replace(/&lt;\/fn&gt;/g, `</span>`)
                .replace(/&lt;str&gt;/g, `<span style="color:#F0997B">`)
                .replace(/&lt;\/str&gt;/g, `</span>`)
                .replace(/&lt;num&gt;/g, `<span style="color:#FAC775">`)
                .replace(/&lt;\/num&gt;/g, `</span>`)
            }} />
            {i === lines.length - 1 && (
              <span style={{
                display: "inline-block", width: 2, height: 14,
                background: C.purple400, borderRadius: 1,
                animation: "blink 1s step-end infinite",
                verticalAlign: "middle",
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AvatarBadge({ name, color, textColor, bg }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      background: "rgba(255,255,255,0.1)", borderRadius: 99,
      padding: "3px 10px", fontSize: 10,
      fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.55)",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      {name}
    </div>
  );
}

function ChatPanel() {
  const [msgs, setMsgs] = useState([
    { from: "Priya", text: "Moved the auth check into a decorator — line 14", self: false },
    { from: "You", text: "Sick! Save this as a snippet?", self: true },
    { from: "Priya", text: 'Yep — tagging "auth-utils" now', self: false },
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { from: "You", text: input, self: true }]);
    setInput("");
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs]);

  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `0.5px solid ${C.border}`,
      overflow: "hidden", display: "flex", flexDirection: "column", flex: 1,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
        borderBottom: `0.5px solid ${C.border}`,
        background: C.surfaceAlt,
      }}>
        <ChatIcon size={15} color={C.purple600} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.textMuted, flex: 1 }}>Live chat</span>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          background: C.teal50, borderRadius: 99, padding: "3px 10px",
          fontSize: 10, color: C.teal600, fontFamily: "'DM Mono', monospace",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal200, animation: "pulse 1.6s ease-in-out infinite" }} />
          2 online
        </div>
      </div>

      <div ref={bodyRef} style={{ flex: 1, padding: 12, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, maxHeight: 180 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.self ? "flex-end" : "flex-start", gap: 2 }}>
            <div style={{ fontSize: 10, color: C.textFaint, fontFamily: "'DM Sans', sans-serif", padding: "0 4px" }}>{m.from}</div>
            <div style={{
              fontSize: 12.5, lineHeight: 1.5, padding: "7px 12px",
              borderRadius: 12, maxWidth: "85%",
              fontFamily: "'DM Sans', sans-serif",
              background: m.self ? C.purple50 : C.surfaceAlt,
              color: m.self ? C.purple900 : C.text,
              border: `0.5px solid ${m.self ? C.purple200 : C.border}`,
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 7, padding: "10px 12px", borderTop: `0.5px solid ${C.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Send a message…"
          style={{
            flex: 1, fontSize: 12, padding: "7px 11px",
            borderRadius: 8, border: `0.5px solid ${C.border}`,
            fontFamily: "'DM Sans', sans-serif", outline: "none",
            background: C.surfaceAlt, color: C.text,
          }}
        />
        <button onClick={send} style={{
          width: 32, height: 32, borderRadius: 8,
          background: C.purple600, color: "#fff",
          border: "none", cursor: "pointer", fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

function SnippetPanel() {
  const snippets = [
    { name: "Flask API boilerplate", meta: "Saved 2h ago · Priya", tag: "PY", tagBg: C.blue50, tagColor: C.blue800 },
    { name: "Auth decorator", meta: "Saved just now · Priya", tag: "PY", tagBg: C.blue50, tagColor: C.blue800 },
    { name: "SQL query helper", meta: "Saved yesterday · You", tag: "SQL", tagBg: C.amber50, tagColor: C.amber800 },
  ];
  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `0.5px solid ${C.border}`,
      overflow: "hidden", flex: 1,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
        borderBottom: `0.5px solid ${C.border}`,
        background: C.surfaceAlt,
      }}>
        <FolderIcon size={15} color={C.purple600} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.textMuted, flex: 1 }}>Snippet library</span>
        <button style={{
          fontSize: 11, padding: "3px 10px", borderRadius: 99,
          background: C.purple600, color: "#fff", border: "none", cursor: "pointer",
          fontFamily: "'DM Mono', monospace",
        }}>+ Save current</button>
      </div>
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {snippets.map((s) => <SnippetRow key={s.name} {...s} />)}
      </div>
    </div>
  );
}

function SnippetRow({ name, meta, tag, tagBg, tagColor }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
        borderRadius: 9, border: `0.5px solid ${hov ? C.purple200 : C.border}`,
        cursor: "pointer", transition: "all 0.15s",
        background: hov ? C.purple50 : "transparent",
      }}
    >
      <CodeFileIcon color={C.purple600} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12.5, color: C.text }}>{name}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textFaint }}>{meta}</div>
      </div>
      <div style={{
        fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 600,
        padding: "2px 8px", borderRadius: 99,
        background: tagBg, color: tagColor,
      }}>{tag}</div>
    </div>
  );
}

function MockupSection() {
  return (
    <section id="demo-section" style={{
      position: "relative", zIndex: 2,
      padding: "0 2.5rem 4rem",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
        <CodePanel />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ChatPanel />
          <SnippetPanel />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, title: "Create a workspace", desc: "Open a room, pick your language, get a shareable link instantly." },
    { n: 2, title: "Invite teammates", desc: "Share the link — no signup required for collaborators." },
    { n: 3, title: "Code & chat live", desc: "Edit together, discuss inline, sync in under 80ms." },
    { n: 4, title: "Save & retrieve", desc: "One click saves to your snippet library, searchable forever." },
  ];
  return (
    <section style={{
      position: "relative", zIndex: 2,
      padding: "4rem 2.5rem",
      background: "rgba(255,255,255,0.65)",
      backdropFilter: "blur(12px)",
      borderTop: `0.5px solid ${C.border}`,
    }}>
      <SectionLabel>How it works</SectionLabel>
      <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 30, fontWeight: 400, color: C.text, marginBottom: "2.5rem" }}>
        Up and running in seconds
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, position: "relative" }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ position: "relative", paddingRight: i < 3 ? 24 : 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: C.purple50, color: C.purple800,
              fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14,
            }}>{s.n}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{s.desc}</div>
            {i < 3 && (
              <div style={{
                position: "absolute", top: 18, right: 0,
                width: 20, height: 1, background: C.borderMed,
              }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 2, padding: "2rem 2.5rem",
      borderTop: `0.5px solid ${C.border}`,
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: C.purple600,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 14, color: C.text }}>Code-O-Share</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.textFaint }}>© 2026</span>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {["Features", "Pricing", "Docs", "GitHub", "Privacy"].map((l) => (
          <a key={l} href="#" style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: C.textMuted, textDecoration: "none" }}>{l}</a>
        ))}
      </div>
    </footer>
  );
}

// ─── SVG icon helpers ─────────────────────────────────────────────
function UsersIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function ChatIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function SaveIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  );
}
function FolderIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function CodeFileIcon({ color = "currentColor" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/>
    </svg>
  );
}

// ─── Root ─────────────────────────────────────────────────────────
export default function CodeSyncLanding() {
  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(0.82); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F3FF; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(83,74,183,0.25); border-radius: 2px; }
      `}</style>

      <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>

        {/* PixelBlast background — covers the entire page */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          pointerEvents: "none",
        }}>
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#B497CF"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.25}
            transparent
          />
        </div>

        {/* Page content stack */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Nav />
          <Hero />
          <Stats />
          <Features />
          <MockupSection />
          <HowItWorks />
          <Footer />
        </div>

      </div>
    </>
  );
}