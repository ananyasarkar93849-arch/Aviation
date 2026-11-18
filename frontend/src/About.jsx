
import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import {
  FaPlane,
  FaGlobe,
  FaShieldAlt,
  FaCogs,
  FaHeadset,
  FaBullseye,
  FaEye,
  FaHandshake,
  FaCertificate,
  FaUniversity,
  FaAward,
} from 'react-icons/fa';

/* ============ API URL ============ */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ============ FALLBACK DATA (backend off thakleo page cholbe) ============ */
const fallbackData = {
  timeline: [
    { year: '2010', title: 'Skyline Founded', desc: 'Started with a single classroom and a big dream of building aviators.' },
    { year: '2014', title: 'CAAB Approval', desc: 'Received official approval for professional aviation training programs.' },
    { year: '2018', title: 'Flight Simulator Lab', desc: 'Launched a full-motion simulator lab for real cockpit experience.' },
    { year: '2022', title: 'Airline Partnerships', desc: 'Signed hiring partnerships with national and international airlines.' },
    { year: '2026', title: 'New Training Campus', desc: 'Opened an expanded campus with advanced labs and a modern hangar.' },
  ],
  team: [
    { name: 'Capt. Rahim Chowdhury', role: 'Chief Flight Instructor', exp: '22 yrs experience' },
    { name: 'Nusrat Jahan', role: 'Head of Cabin Crew Training', exp: '14 yrs experience' },
    { name: 'Dr. Arif Hossain', role: 'Aviation Management Director', exp: '18 yrs experience' },
  ],
  accreditations: [
    { icon: 'certificate', title: 'CAAB Approved', desc: 'Recognised by the Civil Aviation Authority of Bangladesh.' },
    { icon: 'globe', title: 'ICAO Aligned Curriculum', desc: 'Syllabus follows international aviation training standards.' },
    { icon: 'university', title: 'Industry Affiliations', desc: 'Academic and training links with aviation bodies and airlines.' },
    { icon: 'award', title: 'Safety Excellence', desc: 'Consistent safety record across all flight and ground training.' },
  ],
};

const iconMap = {
  certificate: FaCertificate,
  globe: FaGlobe,
  university: FaUniversity,
  award: FaAward,
};

/* ============ ANIMATION VARIANTS ============ */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

/* ============ 3D TILT CARD (mouse + touch) ============ */
const TiltCard = ({ children, className = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 15,
  });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full h-full">
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onPointerUp={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ============ FLIP CARD (tap/click to flip) ============ */
const FlipCard = ({ icon: Icon, title, front, back }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-64 sm:h-72 cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80, damping: 14 }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-3xl bg-white border-2 border-[#A9DCF2] shadow-xl p-6 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0A3] flex items-center justify-center mb-4 shadow-md">
            <Icon className="text-3xl text-[#7A1230]" />
          </div>
          <h3 className="text-xl font-extrabold text-[#7A1230] mb-2">{title}</h3>
          <p className="text-sm text-slate-600">{front}</p>
          <span className="mt-4 text-xs font-semibold text-[#7A1230]/60 uppercase tracking-widest">
            Tap to flip
          </span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7A1230] to-[#4A0A1D] shadow-xl p-6 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Icon className="text-3xl text-[#FFE680] mb-3" />
          <p className="text-sm sm:text-base text-[#FFF6CC] leading-relaxed">{back}</p>
        </div>
      </motion.div>
    </div>
  );
};

/* ============ SECTION HEADING ============ */
const SectionHeading = ({ tag, title, sub }) => (
  <motion.div
    className="text-center mb-10 sm:mb-14"
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
  >
    {tag && (
      <motion.span
        variants={fadeUp}
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#A9DCF2] text-[#7A1230] mb-4"
      >
        {tag}
      </motion.span>
    )}
    <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-[#7A1230]">
      {title}
    </motion.h2>
    {sub && (
      <motion.p variants={fadeUp} className="mt-3 text-slate-600 max-w-2xl mx-auto">
        {sub}
      </motion.p>
    )}
  </motion.div>
);

/* ============ MAIN ABOUT PAGE ============ */
const About = () => {
  const [data, setData] = useState(fallbackData);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const planeY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const planeX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const planeRotate = useTransform(scrollYProgress, [0, 1], [-12, 8]);
  const sunScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const cloudShift = useTransform(scrollYProgress, [0, 1], [0, -80]);

  /* Backend theke data fetch (MERN part) */
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/about`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setData({ ...fallbackData, ...json }))
      .catch(() => {
        /* backend off thakle fallback data cholbe */
      });
    return () => controller.abort();
  }, []);

  const approach = [
    { icon: FaShieldAlt, title: 'Safety First', desc: 'Strict international safety standards in every flight hour.' },
    { icon: FaCogs, title: 'Hands-on Training', desc: 'Advanced aircraft and full-motion simulators, not just theory.' },
    { icon: FaGlobe, title: 'Global Outlook', desc: 'Curriculum designed for careers with airlines worldwide.' },
    { icon: FaHeadset, title: 'Career Guidance', desc: 'Interview prep, CV help and mentoring from industry experts.' },
  ];

  return (
    <div className="overflow-x-hidden bg-[#FFFDF2] text-slate-800">
      {/* ==================== HERO ==================== */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] pt-28 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#A9DCF2] via-[#D6EFFA] to-[#FFF4BF]"
      >
        {/* Sun */}
        <motion.div
          style={{ scale: sunScale }}
          className="absolute top-16 right-[-60px] sm:right-10 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-[#FFE680] blur-2xl opacity-80"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Clouds */}
        <motion.div style={{ y: cloudShift }} className="absolute inset-0 pointer-events-none">
          {[
            { t: '18%', l: '5%', w: 160, d: 22 },
            { t: '38%', l: '60%', w: 220, d: 30 },
            { t: '62%', l: '15%', w: 190, d: 26 },
            { t: '75%', l: '70%', w: 140, d: 20 },
          ].map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/70 blur-xl"
              style={{ top: c.t, left: c.l, width: c.w, height: c.w * 0.4 }}
              animate={{ x: [0, 60, 0] }}
              transition={{ duration: c.d, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center min-h-[65vh]">
          {/* Text */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.span
              variants={fadeUp}
              className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#7A1230] text-[#FFF0A3] shadow-lg mb-5"
            >
              ✈️ About Us
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-[#7A1230]"
            >
              About
              <span className="block mt-1 bg-gradient-to-r from-[#7A1230] via-[#B8324F] to-[#7A1230] bg-clip-text text-transparent">
                Skyline Aviation Institute
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-base sm:text-lg text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              A CAAB-approved institute that has been shaping pilots, cabin crew and aviation
              managers since 2010, with discipline, safety and real cockpit experience.
            </motion.p>
          </motion.div>

          {/* 3D Plane Card */}
          <div className="relative flex justify-center items-center h-72 sm:h-96">
            <TiltCard className="relative w-full max-w-sm sm:max-w-md h-64 sm:h-80 rounded-[2rem] bg-white/50 backdrop-blur-md border border-white shadow-2xl flex items-center justify-center">
              <motion.div
                className="absolute left-4 top-1/2 h-1.5 rounded-full bg-gradient-to-r from-transparent via-white to-[#FFE680]"
                style={{ transform: 'translateZ(20px)' }}
                animate={{ width: ['30%', '55%', '30%'], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <motion.div style={{ y: planeY, x: planeX, rotate: planeRotate, z: 80 }} className="relative">
                <motion.div
                  animate={{ y: [0, -18, 0], rotate: [0, 3, 0, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FaPlane className="text-[110px] sm:text-[150px] text-[#7A1230] drop-shadow-[0_25px_25px_rgba(122,18,48,0.35)] -rotate-12" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-2 px-3 py-1.5 rounded-xl bg-[#FFE680] text-[#7A1230] text-xs sm:text-sm font-bold shadow-lg"
                style={{ transform: 'translateZ(60px)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                CAAB Approved
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-2 px-3 py-1.5 rounded-xl bg-[#7A1230] text-[#FFF0A3] text-xs sm:text-sm font-bold shadow-lg"
                style={{ transform: 'translateZ(60px)' }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                Since 2010
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ==================== WHO WE ARE ==================== */}
      <section className="py-16 sm:py-24 px-4 bg-[#FFFDF2]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center lg:text-left"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#A9DCF2] text-[#7A1230] mb-4"
            >
              Who We Are
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-[#7A1230] mb-5">
              Built on a Passion for{' '}
              <span className="bg-[#FFE680] px-2 rounded-lg">Flight</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-4">
              Skyline Aviation Institute began with a simple belief: every student with a passion
              for flight deserves world-class training. What started as a single classroom is now
              a full aviation campus with simulators, expert instructors and airline connections.
            </motion.p>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed">
              We train professional pilots, cabin crew and aviation management students, and we
              focus on discipline, safety and hands-on practice in everything we teach.
            </motion.p>
          </motion.div>

          {/* Layered 3D stack */}
          <motion.div
            initial={{ opacity: 0, rotateY: -30, x: 60 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            style={{ perspective: 1000 }}
            className="relative h-72 sm:h-96 mx-3"
          >
            <div className="absolute inset-0 rounded-3xl bg-[#FFE680] rotate-6 shadow-xl" />
            <div className="absolute inset-0 rounded-3xl bg-[#A9DCF2] -rotate-3 shadow-xl" />
            <TiltCard className="relative h-full rounded-3xl bg-gradient-to-br from-[#7A1230] to-[#4A0A1D] shadow-2xl p-6 sm:p-10 flex flex-col justify-center items-center text-center">
              <div style={{ transform: 'translateZ(50px)' }}>
                <FaPlane className="mx-auto text-5xl sm:text-6xl text-[#FFE680] mb-4" />
                <div className="text-5xl sm:text-7xl font-black text-[#FFF0A3]">2010</div>
                <div className="mt-2 text-[#D6EFFA] text-sm sm:text-base">Our journey began</div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ==================== MISSION / VISION / VALUES ==================== */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-[#D6EFFA] to-[#A9DCF2]/60">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="What Drives Us" sub="Tap a card to flip it ✈️" />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUp}>
              <FlipCard
                icon={FaBullseye}
                title="Our Mission"
                front="Why we exist"
                back="To train safe, skilled and confident aviation professionals who are ready for the airline industry from day one."
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FlipCard
                icon={FaEye}
                title="Our Vision"
                front="Where we are heading"
                back="To become the most trusted aviation training institute in South Asia, recognised across the globe."
              />
            </motion.div>
            <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1">
              <FlipCard
                icon={FaHandshake}
                title="Our Values"
                front="What we stand by"
                back="Safety, discipline, integrity and teamwork. These four values guide every lesson and every flight."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== OUR APPROACH ==================== */}
      <section className="py-16 sm:py-24 px-4 bg-[#FFFDF2]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="Our Approach"
            title="How We Train"
            sub="The principles behind every course at Skyline."
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {approach.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <TiltCard className="h-full p-6 rounded-3xl bg-white border-2 border-[#A9DCF2] shadow-lg hover:border-[#7A1230] transition-colors">
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFE680] to-[#FFD84D] flex items-center justify-center mb-4 shadow-md">
                      <f.icon className="text-2xl text-[#7A1230]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#7A1230] mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TIMELINE ==================== */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-[#A9DCF2]/60 to-[#FFF4BF]">
        <div className="max-w-4xl mx-auto">
          <SectionHeading tag="Our History" title="Our Flight Path" />

          <div className="relative">
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#7A1230] via-[#FFE680] to-[#A9DCF2]" />

            {data.timeline.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: left ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7 }}
                  className={`relative mb-10 pl-14 md:pl-0 md:w-1/2 ${
                    left ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <motion.div
                    className={`absolute top-3 left-5 md:left-auto -translate-x-1/2 w-9 h-9 rounded-full bg-[#7A1230] border-4 border-[#FFE680] flex items-center justify-center shadow-lg ${
                      left ? 'md:right-[-18px] md:translate-x-0' : 'md:left-0 md:-translate-x-1/2'
                    }`}
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                  >
                    <FaPlane className="text-[10px] text-[#FFE680]" />
                  </motion.div>

                  <div className="p-5 rounded-2xl bg-white shadow-xl border-l-4 border-[#7A1230]">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FFE680] text-[#7A1230] text-xs font-black mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-extrabold text-[#7A1230]">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== LEADERSHIP TEAM ==================== */}
      <section className="py-16 sm:py-24 px-4 bg-[#FFF4BF]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="Leadership"
            title="Meet Our Team"
            sub="Experienced professionals who have lived the aviation life."
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {data.team.map((m, i) => (
              <motion.div key={i} variants={fadeUp}>
                <TiltCard className="p-6 rounded-3xl bg-white shadow-xl border-b-4 border-[#7A1230] text-center">
                  <div style={{ transform: 'translateZ(40px)' }}>
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#7A1230] to-[#4A0A1D] border-4 border-[#A9DCF2] flex items-center justify-center text-3xl font-black text-[#FFE680] shadow-lg">
                      {m.name
                        .replace(/^(Capt\.|Dr\.)\s*/, '')
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-[#7A1230]">{m.name}</h3>
                    <p className="text-sm text-slate-600">{m.role}</p>
                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[#D6EFFA] text-[#7A1230] text-xs font-bold">
                      {m.exp}
                    </span>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== ACCREDITATION ==================== */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-br from-[#7A1230] to-[#4A0A1D] overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FFE680] opacity-10 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#A9DCF2] opacity-10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-14"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-[#FFF0A3]">
              Approvals & Recognition
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-[#D6EFFA]">
              Our standards are backed by recognised aviation authorities.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {data.accreditations.map((a, i) => {
              const Icon = iconMap[a.icon] || FaAward;
              return (
                <motion.div key={i} variants={fadeUp}>
                  <TiltCard className="h-full text-center p-6 rounded-3xl bg-white/10 border border-[#A9DCF2]/30 backdrop-blur-md">
                    <div style={{ transform: 'translateZ(40px)' }}>
                      <Icon className="mx-auto text-4xl text-[#FFE680] mb-3" />
                      <h3 className="text-base sm:text-lg font-extrabold text-[#FFF0A3]">{a.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#D6EFFA] leading-relaxed">{a.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;