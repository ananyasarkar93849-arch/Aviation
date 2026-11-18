
import React, { useCallback, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// Local: http://localhost:5000 | Vercel/production: set VITE_API_URL
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ---------- helpers ---------- */
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const isOpenNow = (hours) => {
  const now = new Date();
  const today = hours[now.getDay()];
  if (!today || today.closed) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= toMinutes(today.open) && mins < toMinutes(today.close);
};

const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
};

/* ---------- 3D tilt card (follows finger / mouse) ---------- */
const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onPointerUp={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ---------- 3D orbit hero scene ---------- */
const Orbit = () => {
  const items = ["📞", "💬", "✉️", "📍", "🎓"];
  return (
    <div className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80" style={{ perspective: 900 }}>
      {/* glow */}
      <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-[#14b8a6]/30 to-[#ff8a3d]/30 blur-2xl" />

      {/* rotating ring */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", rotateX: -15 }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((icon, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 bg-white/80 text-3xl shadow-xl backdrop-blur"
            style={{
              transform: `rotateY(${i * 72}deg) translateZ(115px)`,
              backfaceVisibility: "hidden",
            }}
          >
            {icon}
          </div>
        ))}
      </motion.div>

      {/* floating plane in the center */}
      <motion.div
        className="absolute left-1/2 top-1/2 -ml-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-4xl shadow-2xl"
        animate={{ y: [-10, 10, -10], rotate: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        ✈️
      </motion.div>
    </div>
  );
};

/* ---------- Instagram-style story circle ---------- */
const Story = ({ item, onCopy }) => {
  const handle = () => {
    if (item.copy && item.id !== "visit") onCopy(item.value);
    if (item.href) window.open(item.href, item.href.startsWith("http") ? "_blank" : "_self");
  };
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handle}
      className="flex shrink-0 flex-col items-center gap-2"
    >
      <span className="rounded-full bg-gradient-to-tr from-[#ff8a3d] via-[#ffb27a] to-[#14b8a6] p-[3px]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl sm:h-20 sm:w-20 sm:text-3xl">
          {item.icon}
        </span>
      </span>
      <span className="text-xs font-semibold text-[#2b2f36]">{item.label}</span>
    </motion.button>
  );
};

/* ---------- FAQ item ---------- */
const FaqItem = ({ faq, open, onToggle }) => (
  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
    <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5">
      <span className="font-semibold text-white">{faq.q}</span>
      <motion.span
        animate={{ rotate: open ? 45 : 0 }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff8a3d] text-xl font-bold text-white"
      >
        +
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 text-sm leading-relaxed text-gray-300 sm:px-5 sm:pb-5"
        >
          {faq.a}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ---------- Main page ---------- */
const Contact = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    setError(false);
    fetch(`${API}/api/contact`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard ✓");
    } catch {
      showToast("Could not copy");
    }
  };

  /* loading / error states */
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f6fbfa] px-6 text-center">
        <p className="text-lg font-semibold text-[#2b2f36]">Could not reach the server 😕</p>
        <p className="text-sm text-gray-500">Make sure the backend is running on port 5000.</p>
        <button onClick={load} className="rounded-full bg-[#ff8a3d] px-6 py-3 font-semibold text-white">
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6fbfa]">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-[#14b8a6] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const open = isOpenNow(data.hours);
  const todayIndex = new Date().getDay();
  const call = data.methods.find((m) => m.id === "call");
  const whatsapp = data.methods.find((m) => m.id === "whatsapp");
  const email = data.methods.find((m) => m.id === "email");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6fbfa] pb-24 lg:pb-0">
      {/* ================= HERO ================= */}
      <section className="relative px-5 pb-12 pt-28 sm:pt-32">
        {/* background blobs */}
        <motion.div
          className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#14b8a6]/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-20 top-60 h-64 w-64 rounded-full bg-[#ff8a3d]/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                open ? "bg-[#14b8a6]/15 text-[#0f766e]" : "bg-[#ff8a3d]/15 text-[#c2571a]"
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    open ? "bg-[#14b8a6]" : "bg-[#ff8a3d]"
                  }`}
                />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? "bg-[#14b8a6]" : "bg-[#ff8a3d]"}`} />
              </span>
              {open ? "We're open now" : "Currently closed"}
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#2b2f36] sm:text-5xl lg:text-6xl">
              Let's get you{" "}
              <span className="bg-gradient-to-r from-[#14b8a6] to-[#ff8a3d] bg-clip-text text-transparent">
                cleared for take-off
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-gray-600 sm:text-lg lg:mx-0">
              Questions about courses, fees or campus visits? Tap any option below and our team will help you right away.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <Orbit />
          </motion.div>
        </div>

        {/* story circles */}
        <div className="relative mx-auto mt-6 max-w-6xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-gray-400 lg:text-left">
            Quick connect
          </p>
          <div className="flex justify-center gap-5 overflow-x-auto pb-2 lg:justify-start">
            {data.methods.map((m) => (
              <Story key={m.id} item={m} onCopy={copyText} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.methods.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard className="h-full rounded-3xl bg-white p-6 shadow-xl shadow-[#14b8a6]/10">
                <div style={{ transform: "translateZ(40px)" }}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-2xl shadow-lg">
                    {m.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#2b2f36]">{m.label}</h3>
                  <p className="mt-1 text-sm text-gray-500">{m.hint}</p>
                  <p className="mt-3 break-words font-semibold text-[#0f766e]">{m.value}</p>

                  <div className="mt-5 flex gap-2">
                    <a
                      href={m.href}
                      target={m.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex-1 rounded-full bg-[#ff8a3d] py-2.5 text-center text-sm font-semibold text-white active:scale-95"
                    >
                      Open
                    </a>
                    {m.copy && (
                      <button
                        onClick={() => copyText(m.value)}
                        className="rounded-full border border-[#2b2f36]/15 px-4 py-2.5 text-sm font-semibold text-[#2b2f36] active:scale-95"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOURS + MAP (dark section) ================= */}
      <section className="bg-[#2b2f36] px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* hours */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Office <span className="text-[#ff8a3d]">hours</span>
            </h2>
            <div className="mt-6 space-y-2">
              {data.hours.map((h, i) => (
                <div
                  key={h.day}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm sm:text-base ${
                    i === todayIndex ? "bg-[#14b8a6] font-bold text-white" : "bg-white/5 text-gray-300"
                  }`}
                >
                  <span>
                    {h.day}
                    {i === todayIndex && " • Today"}
                  </span>
                  <span>{h.closed ? "Closed" : `${formatTime(h.open)} - ${formatTime(h.close)}`}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl border-4 border-[#14b8a6]/40 shadow-2xl"
          >
            <iframe
              title="Skyline campus location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(data.mapQuery)}&output=embed`}
              className="h-72 w-full sm:h-96 lg:h-full lg:min-h-[420px]"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold text-white sm:text-3xl">
            Quick <span className="text-[#ff8a3d]">answers</span>
          </h2>
          <div className="mt-6 space-y-3">
            {data.faqs.map((f, i) => (
              <FaqItem key={f.q} faq={f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOCIALS ================= */}
      <section className="px-5 py-14">
        <h2 className="text-center text-2xl font-extrabold text-[#2b2f36] sm:text-3xl">
          Follow the <span className="text-[#14b8a6]">journey</span>
        </h2>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {data.socials.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 text-center shadow-lg shadow-[#ff8a3d]/10"
            >
              <span className="text-3xl">{s.icon}</span>
              <span className="font-bold text-[#2b2f36]">{s.name}</span>
              <span className="text-xs text-gray-500">{s.handle}</span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ================= MOBILE STICKY ACTION BAR ================= */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-gray-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href={call?.href} className="rounded-full bg-[#2b2f36] py-3 text-center text-sm font-semibold text-white active:scale-95">
          📞 Call
        </a>
        <a href={whatsapp?.href} target="_blank" rel="noreferrer" className="rounded-full bg-[#14b8a6] py-3 text-center text-sm font-semibold text-white active:scale-95">
          💬 WhatsApp
        </a>
        <a href={email?.href} className="rounded-full bg-[#ff8a3d] py-3 text-center text-sm font-semibold text-white active:scale-95">
          ✉️ Email
        </a>
      </div>

      {/* ================= TOAST ================= */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#2b2f36] px-5 py-2.5 text-sm font-semibold text-white shadow-xl lg:bottom-8"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;