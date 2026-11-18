import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const COURSES = [
  { title: "Commercial Pilot License (CPL)", category: "pilot" },
  { title: "Private Pilot License (PPL)", category: "pilot" },
  { title: "Instrument Rating (IR)", category: "pilot" },
  { title: "Cabin Crew Training", category: "cabin" },
  { title: "Aviation Management Diploma", category: "management" },
  { title: "Aircraft Maintenance Engineering", category: "maintenance" },
];

const AVATAR_BG = [
  "from-coral to-coral-soft",
  "from-navy to-[#3a5bd9]",
  "from-coral-soft to-navy",
  "from-[#1b3a8f] to-coral",
];

/* ---------- Small reusable pieces ---------- */

const Heart = ({ filled, className = "h-6 w-6" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  >
    <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9z" />
  </svg>
);

const Stars = ({ value, className = "" }) => (
  <div className={`flex gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= Math.round(value) ? "text-coral" : "text-current opacity-20"}>
        ★
      </span>
    ))}
  </div>
);

const Avatar = ({ name, id, size = "h-11 w-11 text-sm" }) => (
  <div
    className={`${size} shrink-0 grid place-items-center rounded-full bg-gradient-to-br ${
      AVATAR_BG[id % AVATAR_BG.length]
    } font-bold text-white`}
  >
    {name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()}
  </div>
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const CountUp = ({ to, decimals = 0, suffix = "" }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setV });
    return () => controls.stop();
  }, [to]);
  return (
    <>
      {v.toFixed(decimals)}
      {suffix}
    </>
  );
};

// 3D tilt on mouse hover (disabled for touch so scrolling stays smooth)
const TiltCard = ({ children, className = "", max = 7 }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 16 });
  const sry = useSpring(ry, { stiffness: 150, damping: 16 });

  const onMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ---------- Hero with 3D floating cards ---------- */

const Hero3D = ({ items, avg }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 14 });
  const sy = useSpring(my, { stiffness: 80, damping: 14 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const rotX = useTransform(sy, [-0.5, 0.5], [14, -14]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const slots = [
    { cls: "top-0 left-0 w-[78%]", z: 40, rot: -6, delay: 0 },
    { cls: "top-[28%] right-0 w-[78%]", z: 90, rot: 5, delay: 0.6 },
    { cls: "bottom-0 left-[6%] w-[72%]", z: 140, rot: -3, delay: 1.2 },
  ];

  return (
    <div
      className="relative h-[400px] w-full sm:h-[470px]"
      style={{ perspective: 1200 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* back circle */}
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-navy to-navy-deep sm:h-80 sm:w-80"
          style={{ transform: "translateZ(-80px)" }}
        >
          <div className="absolute inset-0 grid place-items-center text-6xl opacity-30">✈️</div>
        </div>

        {items.slice(0, 3).map((r, i) => (
          <div
            key={r.id}
            className={`absolute ${slots[i].cls} [transform-style:preserve-3d]`}
            style={{ transform: `translateZ(${slots[i].z}px) rotateZ(${slots[i].rot}deg)` }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: slots[i].delay }}
              className="rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_25px_50px_-15px_rgba(18,40,107,0.45)]"
            >
              <div className="flex items-center gap-3">
                <Avatar name={r.name} id={r.id} size="h-9 w-9 text-xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-navy">{r.name}</p>
                  <Stars value={r.rating} className="text-xs" />
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy/70 sm:text-sm">
                “{r.message}”
              </p>
            </motion.div>
          </div>
        ))}

        {/* floating coral badge */}
        <div
          className="absolute right-4 top-2 [transform-style:preserve-3d] sm:right-1"
          style={{ transform: "translateZ(190px)" }}
        >
          <motion.div
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-xl bg-coral px-2.5 py-1 text-center text-white shadow-xl sm:rounded-2xl sm:px-4 sm:py-2"
          >
            <p className="font-display text-lg font-extrabold leading-none sm:text-2xl">{avg.toFixed(1)} ★</p>
            <p className="text-[8px] font-semibold uppercase tracking-wider sm:text-[10px]">Average rating</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------- Instagram-style story viewer ---------- */

const STORY_MS = 6;

const StoryViewer = ({ stories, startIndex, onClose, onSeen }) => {
  const [i, setI] = useState(startIndex);
  const s = stories[i];

  const next = useCallback(() => {
    if (i < stories.length - 1) setI(i + 1);
    else onClose();
  }, [i, stories.length, onClose]);
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    onSeen(s.id);
  }, [s.id, onSeen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = old;
    };
  }, [next, prev, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-deep/95 backdrop-blur-md"
    >
      <div className="relative h-[100dvh] w-full max-w-md overflow-hidden bg-navy-deep sm:h-[88vh] sm:rounded-3xl" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, rotateY: 35, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -35, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="relative h-[46%] w-full">
              <img src={s.image} alt={s.course} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/30 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col justify-between px-6 pb-8">
              <div>
                <Stars value={s.rating} className="mb-3 text-xl" />
                <p className="font-display text-xl font-semibold leading-snug text-ivory sm:text-2xl">
                  “{s.message}”
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-coral-soft">{s.name}</p>
                <p className="text-xs text-ivory/60">{s.course}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* tap zones */}
        <button aria-label="Previous story" onClick={prev} className="absolute inset-y-0 left-0 z-10 w-1/3" />
        <button aria-label="Next story" onClick={next} className="absolute inset-y-0 right-0 z-10 w-2/3" />

        {/* progress bars + header */}
        <div className="absolute inset-x-0 top-0 z-20 p-3">
          <div className="flex gap-1">
            {stories.map((st, idx) => (
              <div key={st.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                {idx < i && <div className="h-full w-full bg-white" />}
                {idx === i && (
                  <motion.div
                    key={`bar-${i}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STORY_MS, ease: "linear" }}
                    onAnimationComplete={next}
                    className="h-full bg-white"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Avatar name={s.name} id={s.id} size="h-9 w-9 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{s.name}</p>
              <p className="text-[11px] text-white/60">{formatDate(s.date)}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="relative z-30 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Review post card ---------- */

const ReviewCard = ({ r, liked, onLike }) => {
  const [burst, setBurst] = useState(false);
  const [open, setOpen] = useState(false);

  const doubleTap = () => {
    if (!liked) onLike(r.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
  };

  return (
    <TiltCard className="h-full">
      <motion.article
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_20px_50px_-20px_rgba(18,40,107,0.35)] sm:rounded-3xl"
      >
        <header className="flex items-center gap-2 p-2.5 sm:gap-3 sm:p-4">
          <Avatar name={r.name} id={r.id} size="h-8 w-8 text-[10px] sm:h-11 sm:w-11 sm:text-sm" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-xs font-bold text-navy sm:text-sm">
              {r.name}
              {r.verified && <span className="text-[10px] text-coral sm:text-xs" title="Verified cadet">✔</span>}
            </p>
            <p className="truncate text-[10px] text-navy/60 sm:text-xs">
              {r.course}
              <span className="hidden sm:inline"> · {formatDate(r.date)}</span>
            </p>
          </div>
        </header>

        {r.image && (
          <div
            onDoubleClick={doubleTap}
            className="relative aspect-square w-full cursor-pointer touch-manipulation select-none overflow-hidden sm:aspect-[4/3]"
          >
            <img
              src={r.image}
              alt={r.course}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <AnimatePresence>
              {burst && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  className="pointer-events-none absolute inset-0 grid place-items-center text-coral drop-shadow-2xl"
                >
                  <Heart filled className="h-16 w-16 sm:h-24 sm:w-24" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex flex-1 flex-col p-2.5 sm:p-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onLike(r.id)}
              aria-label={liked ? "Unlike" : "Like"}
              className={`flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm ${
                liked ? "text-coral" : "text-navy/70"
              }`}
            >
              <motion.span key={String(liked)} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                <Heart filled={liked} className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.span>
              {r.likes}
            </motion.button>
            <Stars value={r.rating} className="text-xs text-navy sm:text-lg" />
          </div>

          <p
            className={`mt-2 text-[11px] leading-relaxed text-navy/80 sm:mt-3 sm:text-sm ${
              open ? "" : "line-clamp-3"
            }`}
          >
            <span className="font-bold text-navy">{r.name.split(" ")[0]} </span>
            {r.message}
          </p>
          {r.message.length > 120 && (
            <button onClick={() => setOpen(!open)} className="mt-1 self-start text-[11px] font-bold text-coral sm:text-xs">
              {open ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </motion.article>
    </TiltCard>
  );
};

/* ---------- Review form ---------- */

const inputCls =
  "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-ivory placeholder-ivory/50 focus:outline-none focus:ring-2 focus:ring-coral";

const ReviewForm = ({ onCreated }) => {
  const [form, setForm] = useState({ name: "", course: COURSES[0].title, rating: 5, message: "" });
  const [hover, setHover] = useState(0);
  const [ui, setUi] = useState({ loading: false, error: "", done: false });

  const submit = async (e) => {
    e.preventDefault();
    setUi({ loading: true, error: "", done: false });
    try {
      const category = COURSES.find((c) => c.title === form.course)?.category || "pilot";
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      onCreated(data);
      setForm({ name: "", course: COURSES[0].title, rating: 5, message: "" });
      setUi({ loading: false, error: "", done: true });
      setTimeout(() => setUi((u) => ({ ...u, done: false })), 4000);
    } catch (err) {
      setUi({ loading: false, error: err.message, done: false });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl bg-navy-deep/60 p-5 ring-1 ring-white/10 sm:p-7">
      <input
        className={inputCls}
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        maxLength={40}
        required
      />
      <select
        className={inputCls}
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
      >
        {COURSES.map((c) => (
          <option key={c.title} value={c.title} className="text-navy">
            {c.title}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-3">
        <span className="text-sm text-ivory/70">Your rating</span>
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              type="button"
              key={n}
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.2 }}
              onMouseEnter={() => setHover(n)}
              onClick={() => setForm({ ...form, rating: n })}
              aria-label={`${n} stars`}
              className={`px-0.5 text-3xl ${n <= (hover || form.rating) ? "text-coral" : "text-ivory/25"}`}
            >
              ★
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <textarea
          className={`${inputCls} min-h-32 resize-none`}
          placeholder="Tell us about your training journey (min 20 characters)"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          maxLength={400}
          required
        />
        <p className="mt-1 text-right text-xs text-ivory/50">{form.message.length}/400</p>
      </div>

      {ui.error && <p className="text-sm font-semibold text-coral-soft">{ui.error}</p>}
      {ui.done && <p className="text-sm font-semibold text-emerald-300">Thank you! Your story is live 🎉</p>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        disabled={ui.loading}
        className="w-full rounded-full bg-coral px-6 py-3 font-bold text-white shadow-lg shadow-coral/30 disabled:opacity-60"
      >
        {ui.loading ? "Posting…" : "Post my review"}
      </motion.button>
    </form>
  );
};

/* ---------- Main page ---------- */

const Review = () => {
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [active, setActive] = useState("all");
  const [sort, setSort] = useState("newest");
  const [storyIndex, setStoryIndex] = useState(null);
  const [viewed, setViewed] = useState([]);
  const [liked, setLiked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skyline-liked") || "[]");
    } catch {
      return [];
    }
  });

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/reviews`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setCategories(data.categories);
      setReviews(data.reviews);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = async (id) => {
    const isLiked = liked.includes(id);
    const delta = isLiked ? -1 : 1;
    const nextLiked = isLiked ? liked.filter((x) => x !== id) : [...liked, id];
    setLiked(nextLiked);
    try {
      localStorage.setItem("skyline-liked", JSON.stringify(nextLiked));
    } catch {
      /* ignore storage errors */
    }
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, likes: Math.max(0, r.likes + delta) } : r)));
    try {
      await fetch(`${API}/api/reviews/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
    } catch {
      /* UI already updated; ignore network error */
    }
  };

  const markSeen = useCallback((id) => setViewed((v) => (v.includes(id) ? v : [...v, id])), []);
  const closeStory = useCallback(() => setStoryIndex(null), []);

  const stories = useMemo(() => reviews.filter((r) => r.featured), [reviews]);
  const avg = useMemo(
    () => (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0),
    [reviews]
  );
  const breakdown = useMemo(
    () => [5, 4, 3, 2, 1].map((s) => ({ star: s, count: reviews.filter((r) => r.rating === s).length })),
    [reviews]
  );
  const topReviews = useMemo(() => [...reviews].sort((a, b) => b.likes - a.likes), [reviews]);

  const visible = useMemo(() => {
    const list = active === "all" ? [...reviews] : reviews.filter((r) => r.category === active);
    if (sort === "top") list.sort((a, b) => b.rating - a.rating || b.likes - a.likes);
    else if (sort === "liked") list.sort((a, b) => b.likes - a.likes);
    else list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [reviews, active, sort]);

  const hideScroll = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory text-navy">
      {/* ===== HERO ===== */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 lg:pt-36">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-coral/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-navy/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block rounded-full border border-coral/40 bg-coral/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-coral"
            >
              Cadet Reviews
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            >
              Real cadets. <span className="italic text-coral">Real</span> take-offs.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-navy/70 sm:text-lg"
            >
              Hear from the pilots, cabin crew and engineers who trained with Skyline, in their own words.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#feed"
                className="rounded-full bg-navy px-7 py-3 text-sm font-bold text-ivory shadow-lg transition hover:-translate-y-0.5 hover:bg-navy-deep"
              >
                Read stories
              </a>
              <a
                href="#write"
                className="rounded-full border-2 border-coral px-7 py-3 text-sm font-bold text-coral transition hover:-translate-y-0.5 hover:bg-coral hover:text-white"
              >
                Share your story
              </a>
            </motion.div>

            <div className="mt-10 flex gap-8 sm:gap-12">
              <div>
                <p className="font-display text-3xl font-extrabold sm:text-4xl">
                  <CountUp to={avg} decimals={1} />
                </p>
                <p className="text-xs uppercase tracking-wider text-navy/60">Avg rating</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold sm:text-4xl">
                  <CountUp to={reviews.length} />
                </p>
                <p className="text-xs uppercase tracking-wider text-navy/60">Stories</p>
              </div>
              <div>
                <p className="font-display text-3xl font-extrabold sm:text-4xl">
                  <CountUp to={98} suffix="%" />
                </p>
                <p className="text-xs uppercase tracking-wider text-navy/60">Pass rate</p>
              </div>
            </div>
          </div>

          {topReviews.length > 0 && <Hero3D items={topReviews} avg={avg} />}
        </div>
      </section>

      {/* ===== STORIES ===== */}
      {stories.length > 0 && (
        <section className="bg-navy px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-2xl font-bold text-ivory sm:text-3xl">Cadet stories</h2>
            <p className="mt-1 text-sm text-ivory/60">Tap a circle to watch, just like Instagram.</p>
            <div className={`mt-6 flex gap-5 overflow-x-auto pb-2 ${hideScroll}`}>
              {stories.map((s, idx) => {
                const seen = viewed.includes(s.id);
                return (
                  <motion.button
                    key={s.id}
                    whileHover={{ y: -6, scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setStoryIndex(idx)}
                    className="flex w-20 shrink-0 flex-col items-center gap-2"
                  >
                    <span
                      className={`rounded-full p-[3px] ${
                        seen ? "bg-ivory/30" : "bg-gradient-to-tr from-coral via-amber-400 to-coral-soft"
                      }`}
                    >
                      <span className="block rounded-full bg-navy p-[3px]">
                        <Avatar name={s.name} id={s.id} size="h-16 w-16 text-base" />
                      </span>
                    </span>
                    <span className="w-full truncate text-center text-xs text-ivory/80">{s.name.split(" ")[0]}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== RATING SUMMARY + FEED ===== */}
      <section id="feed" className="scroll-mt-20 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {status === "ready" && reviews.length > 0 && (
            <div className="mb-12 grid items-center gap-8 rounded-3xl bg-ivory-deep p-6 sm:p-8 md:grid-cols-[auto_1fr]">
              <div className="text-center md:px-6">
                <p className="font-display text-6xl font-extrabold">{avg.toFixed(1)}</p>
                <Stars value={avg} className="justify-center text-xl text-navy" />
                <p className="mt-1 text-xs uppercase tracking-wider text-navy/60">{reviews.length} reviews</p>
              </div>
              <div className="space-y-2">
                {breakdown.map((b) => (
                  <div key={b.star} className="flex items-center gap-3 text-sm">
                    <span className="w-8 font-semibold">{b.star}★</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(b.count / reviews.length) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-coral to-coral-soft"
                      />
                    </div>
                    <span className="w-6 text-right text-navy/60">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className={`flex gap-2 overflow-x-auto pb-1 ${hideScroll}`}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${
                    active === c.id
                      ? "bg-navy text-ivory shadow-lg"
                      : "bg-white text-navy/70 ring-1 ring-navy/10 hover:text-coral"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy ring-1 ring-navy/10 focus:outline-none focus:ring-2 focus:ring-coral md:w-auto"
            >
              <option value="newest">Newest first</option>
              <option value="top">Top rated</option>
              <option value="liked">Most loved</option>
            </select>
          </div>

          {/* states */}
          {status === "loading" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 animate-pulse rounded-3xl bg-ivory-deep" />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-navy/10">
              <p className="font-semibold">Could not load reviews. Is the backend running on port 5000?</p>
              <button onClick={load} className="mt-4 rounded-full bg-coral px-6 py-2 font-bold text-white">
                Try again
              </button>
            </div>
          )}

          {status === "ready" && (
            <motion.div
              layout
              className={`flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 ${hideScroll} sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3`}
            >
              <AnimatePresence mode="popLayout">
                {visible.map((r) => (
                  <motion.div
                    layout
                    key={r.id}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="w-[47%] shrink-0 snap-start sm:w-auto"
                  >
                    <ReviewCard r={r} liked={liked.includes(r.id)} onLike={toggleLike} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {visible.length === 0 && (
                <p className="col-span-full w-full py-10 text-center text-navy/60">No stories here yet. Be the first!</p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== WRITE A REVIEW ===== */}
      <section id="write" className="scroll-mt-20 bg-navy px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ivory sm:text-4xl">
              Flown with us? <span className="italic text-coral-soft">Tell your story.</span>
            </h2>
            <p className="mt-4 max-w-md text-ivory/70">
              Your words help the next cadet choose with confidence. It takes less than a minute.
            </p>
          </div>
          <TiltCard max={4}>
            <ReviewForm
              onCreated={(r) => {
                setReviews((list) => [r, ...list]);
                setActive("all");
                setSort("newest");
              }}
            />
          </TiltCard>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-5 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-coral to-coral-soft p-8 text-center text-white shadow-2xl shadow-coral/30 sm:p-12"
        >
          <h3 className="font-display text-3xl font-extrabold sm:text-4xl">Your story starts on the runway</h3>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Join hundreds of cadets who turned their dream of flying into a career.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-full bg-navy px-8 py-3 font-bold text-ivory transition hover:-translate-y-0.5 hover:bg-navy-deep"
          >
            Enroll now
          </a>
        </motion.div>
      </section>

      {/* mobile floating button */}
      <a
        href="#write"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-xl shadow-coral/40 lg:hidden"
      >
        ✍️ Write review
      </a>

      {/* story viewer */}
      <AnimatePresence>
        {storyIndex !== null && (
          <StoryViewer stories={stories} startIndex={storyIndex} onClose={closeStory} onSeen={markSeen} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Review;