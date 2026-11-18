
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Link } from 'react-router-dom';

/* ---------------------------- CONFIG ---------------------------- */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80';

/* ------------------------- 3D TILT CARD -------------------------- */
const TiltCard = ({ photo, index, onOpen }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 16 });
  const sy = useSpring(y, { stiffness: 160, damping: 16 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 55%)`
  );

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onClick={() => onOpen(photo)}
        whileTap={{ scale: 0.97 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl shadow-sky-200/70 ring-4 ring-white"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={photo.image}
            alt={photo.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK;
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-700/80 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          <motion.div
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 hidden md:block"
          />

          <span
            style={{ transform: 'translateZ(40px)' }}
            className="absolute left-3 top-3 rounded-full bg-yellow-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-600 shadow-md"
          >
            {photo.category}
          </span>

          <span
            style={{ transform: 'translateZ(40px)' }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-sky-600 opacity-100 shadow-md transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
          >
            🔍
          </span>
        </div>

        <div style={{ transform: 'translateZ(30px)' }} className="bg-white p-4 sm:p-5">
          <h3 className="text-lg font-extrabold text-slate-800">{photo.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{photo.desc}</p>
        </div>

        <div className="h-1.5 w-full bg-gradient-to-r from-sky-300 via-yellow-300 to-red-500" />
      </motion.div>
    </motion.div>
  );
};

/* ------------------------- LOADING SKELETON ------------------------- */
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-lg ring-4 ring-white"
      >
        <div className="aspect-[4/3] bg-sky-100" />
        <div className="space-y-3 p-5">
          <div className="h-4 w-2/3 rounded bg-sky-100" />
          <div className="h-3 w-full rounded bg-sky-50" />
        </div>
        <div className="h-1.5 bg-gradient-to-r from-sky-200 via-yellow-200 to-red-300" />
      </div>
    ))}
  </div>
);

/* ---------------------------- LIGHTBOX ---------------------------- */
const Lightbox = ({ photo, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 p-3 backdrop-blur-md sm:p-6"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-white shadow-lg transition hover:scale-110 hover:bg-red-600"
        aria-label="Close"
      >
        ✕
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-300 text-2xl font-bold text-red-600 shadow-lg transition hover:scale-110 sm:left-6"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-300 text-2xl font-bold text-red-600 shadow-lg transition hover:scale-110 sm:right-6"
        aria-label="Next"
      >
        ›
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.85, rotateY: 25 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotateY: -25 }}
          transition={{ duration: 0.35 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) onNext();
            else if (info.offset.x > 80) onPrev();
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          style={{ perspective: 1000 }}
        >
          <img
            src={photo.image}
            alt={photo.title}
            draggable={false}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK;
            }}
            className="max-h-[65vh] w-full object-cover"
          />
          <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
            <div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase text-sky-600">
                {photo.category}
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">
                {photo.title}
              </h3>
              <p className="text-sm text-slate-500 sm:text-base">{photo.desc}</p>
            </div>
            <span className="hidden text-4xl sm:block">✈️</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-sky-300 via-yellow-300 to-red-500" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

/* ----------------------------- PAGE ----------------------------- */
const Gallery = () => {
  const [data, setData] = useState({ stats: [], categories: [], photos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState('all');
  const [selected, setSelected] = useState(null);

  /* ---- Fetch from Express backend ---- */
  const loadGallery = useCallback((signal) => {
    setLoading(true);
    setError('');
    fetch(`${API_URL}/api/gallery`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError('Could not load gallery. Please check that the backend is running.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadGallery(controller.signal);
    return () => controller.abort();
  }, [loadGallery]);

  /* ---- Filter ---- */
  const filtered = useMemo(
    () =>
      active === 'all'
        ? data.photos
        : data.photos.filter((p) => p.category === active),
    [active, data.photos]
  );

  const idx = selected ? filtered.findIndex((p) => p.id === selected.id) : -1;

  const next = useCallback(() => {
    if (idx === -1) return;
    setSelected(filtered[(idx + 1) % filtered.length]);
  }, [idx, filtered]);

  const prev = useCallback(() => {
    if (idx === -1) return;
    setSelected(filtered[(idx - 1 + filtered.length) % filtered.length]);
  }, [idx, filtered]);

  const close = useCallback(() => setSelected(null), []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-100 via-white to-sky-50">
      {/* ------------------------ HERO ------------------------ */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-36 lg:pb-24">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-sky-300/50 blur-3xl" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-yellow-300/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-red-400/30 blur-3xl" />

        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[8%] top-32 text-5xl opacity-70 sm:text-7xl"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[10%] top-44 text-4xl opacity-70 sm:text-6xl"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: ['-10vw', '110vw'], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute top-24 text-3xl sm:text-5xl"
        >
          ✈️
        </motion.div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-yellow-300 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-red-600 shadow-md sm:text-sm"
          >
            📸 Skyline Moments
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-5 text-4xl font-black leading-tight text-slate-800 sm:text-6xl lg:text-7xl"
          >
            Life at{' '}
            <span className="bg-gradient-to-r from-sky-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              Skyline
            </span>{' '}
            Aviation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg"
          >
            Explore our aircraft, simulators, classrooms and proud moments.
            Every picture tells the story of a cadet chasing the sky.
          </motion.p>

          {/* Stats (from API) */}
          <div
            className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
            style={{ perspective: 800 }}
          >
            {data.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, rotateX: -60, y: 30 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, rotateY: 8, scale: 1.05 }}
                className="rounded-2xl bg-white p-4 shadow-lg shadow-sky-200 ring-2 ring-sky-100"
              >
                <div className="text-2xl font-black text-red-500 sm:text-3xl">
                  {s.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-sky-600 sm:text-sm">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------- FILTER BAR ---------------------- */}
      {data.categories.length > 0 && (
        <section className="sticky top-[64px] z-30 px-3 sm:top-[72px]">
          <div className="mx-auto max-w-5xl overflow-x-auto rounded-full bg-white/90 p-2 shadow-xl shadow-sky-200/60 ring-1 ring-sky-100 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2 sm:justify-center">
              {data.categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className="relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors sm:px-5"
                >
                  {active === c.id && (
                    <motion.span
                      layoutId="gallery-pill"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-400 shadow-md shadow-red-300"
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      active === c.id
                        ? 'text-white'
                        : 'text-slate-600 hover:text-red-500'
                    }`}
                  >
                    {c.icon} {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------ GRID ------------------------ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {loading && <SkeletonGrid />}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-2 ring-red-100">
            <div className="text-5xl">🛬</div>
            <p className="mt-3 font-semibold text-slate-700">{error}</p>
            <button
              onClick={() => loadGallery()}
              className="mt-5 rounded-full bg-red-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-red-300 transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((photo, i) => (
                  <TiltCard
                    key={photo.id}
                    photo={photo}
                    index={i}
                    onOpen={setSelected}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <p className="py-20 text-center text-slate-500">No photos found.</p>
            )}
          </>
        )}
      </section>

      {/* ------------------------- CTA ------------------------- */}
      <section className="px-4 pb-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-400 via-sky-300 to-yellow-300 p-8 text-center shadow-2xl shadow-sky-300 sm:p-14"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/40 blur-2xl" />
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl sm:text-6xl"
          >
            ✈️
          </motion.div>
          <h2 className="mt-3 text-2xl font-black text-white drop-shadow sm:text-4xl">
            Want to be in our next photo?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
            Join Skyline Aviation and start your journey from the classroom to
            the cockpit.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 rounded-full bg-red-500 px-8 py-3 font-bold text-white shadow-xl shadow-red-400/50 transition hover:bg-red-600"
            >
              Enroll Now →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ----------------------- LIGHTBOX ----------------------- */}
      <AnimatePresence>
        {selected && (
          <Lightbox
            photo={selected}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
