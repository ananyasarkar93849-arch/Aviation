
import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  animate,
} from 'framer-motion';
import { Link } from 'react-router-dom';

// ---------- Small reusable pieces ----------

// Image with a soft fallback if the link breaks
const SafeImg = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-[#BFDDF2] via-[#D9CCF2] to-[#FFC9A8] flex items-center justify-center text-6xl`}
      >
        ✈️
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

// 3D tilt effect that follows the mouse
const TiltCard = ({ children, className = '', onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Number counting animation
const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Section heading
const SectionTitle = ({ small, title }) => (
  <motion.div
    className="text-center mb-14"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-sm font-semibold text-violet-500 shadow-sm">
      {small}
    </span>
    <h2 className="mt-4 text-3xl md:text-5xl font-bold text-slate-800">{title}</h2>
  </motion.div>
);

// ---------- Main page ----------

const Training = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchTraining = async () => {
      try {
       const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/training`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load training data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DCEBFA] via-[#E8E0FA] to-[#FFE3D0]">
        <motion.div
          className="w-14 h-14 rounded-full border-4 border-white border-t-violet-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#DCEBFA] via-[#E8E0FA] to-[#FFE3D0] px-6 text-center">
        <span className="text-5xl">🛫</span>
        <h2 className="text-2xl font-bold text-slate-800">Could not load training data</h2>
        <p className="text-slate-600">Please make sure the backend server is running on port 5000.</p>
      </div>
    );
  }

  const filteredFacilities =
    activeCategory === 'all'
      ? data.facilities
      : data.facilities.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-[#DCEBFA] via-white to-[#FFF1E6] overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative pt-36 pb-24 px-6">
        {/* floating background orbs */}
        <motion.div
          className="absolute top-20 -left-24 w-80 h-80 rounded-full bg-[#BFDDF2] blur-3xl opacity-70"
          animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 right-0 w-96 h-96 rounded-full bg-[#D9CCF2] blur-3xl opacity-70"
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-[#FFC9A8] blur-3xl opacity-60"
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-sm font-semibold text-violet-500 shadow-sm">
              ✨ Training & Facilities
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight text-slate-800">
              Where Future Pilots{' '}
              <span className="bg-gradient-to-r from-[#7FB5E0] via-[#A593E0] to-[#FF9F6B] bg-clip-text text-transparent">
                Learn To Fly
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Train with modern aircraft, a full-motion simulator and experienced instructors, all inside one
              world-class campus built for aviation careers.
            </p>

            <div className="mt-8 flex flex-row flex-nowrap gap-3">
              <a href="#facilities">
                <motion.button
                  className="px-8 py-3.5 rounded-full text-white font-semibold shadow-xl bg-gradient-to-r from-[#7FB5E0] via-[#A593E0] to-[#FF9F6B]"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Facilities
                </motion.button>
              </a>
              <Link to="/contact">
                <motion.button
                  className="px-8 py-3.5 rounded-full font-semibold text-slate-700 bg-white shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book a Campus Visit
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right 3D image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <TiltCard className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <SafeImg
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"
                  alt="Aircraft training"
                  className="w-full h-[420px] object-cover"
                />
              </div>

              {/* floating chips that pop out in 3D */}
              <motion.div
                className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl"
                style={{ transform: 'translateZ(80px)' }}
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <p className="text-xs text-slate-500">Simulator Hours</p>
                <p className="text-xl font-bold text-violet-500">2,000+</p>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-4 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl"
                style={{ transform: 'translateZ(100px)' }}
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              >
                <p className="text-xs text-slate-500">CAAB Approved</p>
                <p className="text-xl font-bold text-[#FF8F5A]">✈️ Certified</p>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {data.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.04 }}
              style={{ transformPerspective: 800 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-6 text-center shadow-lg border border-white"
            >
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#7FB5E0] to-[#FF9F6B] bg-clip-text text-transparent">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FACILITIES ================= */}
      <section id="facilities" className="px-6 py-20 bg-gradient-to-b from-transparent via-[#EFE9FB] to-transparent">
        <div className="max-w-7xl mx-auto">
          <SectionTitle small="Our Campus" title="World-Class Facilities" />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {data.categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat.id
                    ? 'text-white shadow-lg bg-gradient-to-r from-[#7FB5E0] via-[#A593E0] to-[#FF9F6B]'
                    : 'bg-white text-slate-600 shadow'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Facility cards */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredFacilities.map((facility) => (
                <motion.div
                  key={facility.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <TiltCard
                    onClick={() => setSelected(facility)}
                    className="cursor-pointer bg-white rounded-3xl overflow-hidden shadow-xl border border-white"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <SafeImg
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#A593E0]/50 to-transparent" />
                      <span
                        className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-violet-500"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        {facility.tag}
                      </span>
                    </div>

                    <div className="p-6" style={{ transform: 'translateZ(30px)' }}>
                      <h3 className="text-xl font-bold text-slate-800">{facility.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{facility.description}</p>
                      <p className="mt-4 text-sm font-semibold text-[#FF8F5A]">View details →</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ================= TRAINING JOURNEY ================= */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionTitle small="Your Path" title="Training Journey" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.phases.map((phase, index) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, rotateX: -40, y: 50 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                whileHover={{ y: -10, rotateY: 6 }}
                style={{ transformPerspective: 1000 }}
                className="relative bg-white rounded-3xl p-7 shadow-xl border border-white overflow-hidden"
              >
                <span className="absolute -top-4 -right-2 text-8xl font-black text-[#E8E0FA]">{phase.step}</span>
                <div className="relative">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE3D0] text-[#E0733F]">
                    {phase.duration}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-slate-800">{phase.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{phase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SAFETY ================= */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent via-[#DCEBFA] to-transparent">
        <div className="max-w-6xl mx-auto">
          <SectionTitle small="Safety" title="Safety & Support" />

          <div className="grid sm:grid-cols-2 gap-6">
            {data.safety.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="flex items-start gap-5 bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white"
              >
                <motion.div
                  className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#BFDDF2] via-[#D9CCF2] to-[#FFC9A8] flex items-center justify-center text-3xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl bg-gradient-to-r from-[#9EC9EA] via-[#B7A6E8] to-[#FFA97A]"
        >
          <motion.span
            className="absolute top-6 left-10 text-5xl opacity-40"
            animate={{ x: [0, 40, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          >
            ✈️
          </motion.span>

          <h2 className="relative text-3xl md:text-5xl font-extrabold text-white">
            Ready To Take Off?
          </h2>
          <p className="relative mt-4 text-white/90 max-w-xl mx-auto">
            Visit our campus, meet our instructors and see our training facilities with your own eyes.
          </p>
          <Link to="/contact">
            <motion.button
              className="relative mt-8 px-10 py-4 rounded-full bg-white text-slate-800 font-bold shadow-xl"
              whileHover={{ scale: 1.07, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              Enroll Now
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ================= DETAILS MODAL ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, rotateX: 25, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotateX: 25, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformPerspective: 1000 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              <SafeImg src={selected.image} alt={selected.title} className="w-full h-64 object-cover" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-slate-700 font-bold shadow-lg hover:bg-[#FFE3D0] transition-colors"
              >
                ✕
              </button>

              <div className="p-8">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E0FA] text-violet-500">
                  {selected.tag}
                </span>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-slate-800">{selected.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{selected.description}</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {selected.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 bg-gradient-to-r from-[#EAF3FB] to-[#FFF1E6] rounded-xl px-4 py-3"
                    >
                      <span className="text-[#FF8F5A]">✔</span>
                      <span className="text-sm font-medium text-slate-700">{point}</span>
                    </div>
                  ))}
                </div>

                <Link to="/contact" onClick={() => setSelected(null)}>
                  <motion.button
                    className="mt-8 w-full py-3.5 rounded-full text-white font-semibold shadow-lg bg-gradient-to-r from-[#7FB5E0] via-[#A593E0] to-[#FF9F6B]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book a Visit
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Training;