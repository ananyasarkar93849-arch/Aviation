import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const planeY = useTransform(scrollYProgress, [0, 0.3], [0, -200]);
  const planeRotate = useTransform(scrollYProgress, [0, 0.3], [0, 15]);

  // ============ ANIMATION VARIANTS ============
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  // ============ FLOATING CLOUD ============
  const Cloud = ({ top, left, size, duration, delay }) => (
    <motion.div
      className="absolute opacity-20 pointer-events-none"
      style={{ top: `${top}%`, left: `${left}%` }}
      animate={{ x: [0, 100, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <svg width={size} height={size * 0.6} viewBox="0 0 200 120" fill="white">
        <ellipse cx="100" cy="80" rx="80" ry="40" />
        <ellipse cx="60" cy="60" rx="50" ry="40" />
        <ellipse cx="140" cy="65" rx="55" ry="35" />
        <ellipse cx="100" cy="50" rx="60" ry="45" />
      </svg>
    </motion.div>
  );

  // ============ STAR ============
  const Star = ({ top, left, size, delay }) => (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
    />
  );

  return (
    <div className="overflow-x-hidden">

      {/* ==================== HERO SECTION ==================== */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #191970 0%, #0d0d4a 30%, #1a0a3e 60%, #2d1b69 100%)'
        }}
      >
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at 30% 50%, #40E0D0 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, #DA70D6 0%, transparent 50%)',
              'radial-gradient(ellipse at 60% 40%, #DA70D6 0%, transparent 50%), radial-gradient(ellipse at 20% 60%, #40E0D0 0%, transparent 50%)',
              'radial-gradient(ellipse at 30% 50%, #40E0D0 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, #DA70D6 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            top={Math.random() * 80}
            left={Math.random() * 100}
            size={Math.random() * 3 + 1}
            delay={Math.random() * 3}
          />
        ))}

        {/* Clouds */}
        <Cloud top={20} left={10} size={120} duration={20} delay={0} />
        <Cloud top={40} left={60} size={90} duration={25} delay={3} />
        <Cloud top={60} left={30} size={100} duration={22} delay={6} />
        <Cloud top={15} left={75} size={80} duration={18} delay={2} />

        {/* Flying Airplane 1 */}
        <motion.div
          className="absolute z-10"
          style={{ y: planeY, rotate: planeRotate }}
          initial={{ x: '-100vw', y: 100, opacity: 0 }}
          animate={{ x: '10vw', y: -30, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut', delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 3, 0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="120" height="80" viewBox="0 0 200 120" className="drop-shadow-2xl">
              <motion.path
                d="M20,60 Q40,40 100,45 L170,50 Q180,52 175,58 L100,65 Q40,70 20,60 Z"
                fill="url(#planeGrad)"
                stroke="#40E0D0"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <path d="M80,50 L60,10 L100,45 Z" fill="#DA70D6" opacity="0.9" />
              <path d="M80,60 L60,110 L100,65 Z" fill="#DA70D6" opacity="0.7" />
              <path d="M30,55 L15,25 L45,50 Z" fill="#40E0D0" opacity="0.8" />
              <circle cx="140" cy="55" r="5" fill="#191970" />
              <circle cx="155" cy="54" r="4" fill="#191970" />
              <motion.circle
                cx="25" cy="60" r="8"
                fill="#40E0D0"
                animate={{ opacity: [0.3, 1, 0.3], r: [6, 10, 6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <defs>
                <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#40E0D0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#DA70D6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Trail */}
          <motion.div
            className="absolute top-1/2 -left-20 h-1"
            style={{
              background: 'linear-gradient(to left, #40E0D0, transparent)',
              transform: 'translateY(-50%)'
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], width: [60, 100, 60] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-4 sm:mb-6">
            <motion.span
              className="inline-block px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
              style={{
                background: 'rgba(64, 224, 208, 0.1)',
                color: '#40E0D0',
                border: '1px solid rgba(64, 224, 208, 0.3)'
              }}
              animate={{
                borderColor: ['rgba(64,224,208,0.3)', 'rgba(218,112,214,0.5)', 'rgba(64,224,208,0.3)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✈️ #1 Aviation Training Institute
            </motion.span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight"
          >
            <span className="block text-white">Skyline</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #40E0D0, #DA70D6, #40E0D0)',
                backgroundSize: '200% 200%'
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Aviation Institute
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Soar beyond the horizon and launch your aviation career with world-class training.
            <span className="block mt-2 text-sm sm:text-base md:text-lg" style={{ color: '#DA70D6' }}>
              Professional Pilot Training • Cabin Crew • Aviation Management
            </span>
          </motion.p>

          {/* CTA Buttons (NO CONTACT) */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center px-4"
          >
            <Link to="/course">
              <motion.button
                className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #40E0D0, #20B2AA)',
                  color: '#191970'
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Explore Courses</span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(135deg, #DA70D6, #40E0D0)' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link to="/about">
              <motion.button
                className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-base sm:text-lg border-2 backdrop-blur-sm"
                style={{
                  borderColor: '#DA70D6',
                  color: '#DA70D6',
                  background: 'rgba(218, 112, 214, 0.1)'
                }}
                whileHover={{ scale: 1.05, y: -3, borderColor: '#40E0D0', color: '#40E0D0' }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More →
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll Down</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#40E0D0' }}
                  animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to top, #0a0a2e, transparent)' }}
        />
      </section>


      {/* ==================== STATS SECTION ==================== */}
      <section
        className="relative py-16 sm:py-20 px-4"
        style={{ background: 'linear-gradient(180deg, #0a0a2e 0%, #191970 100%)' }}
      >
        {/* Flying Airplane 2 */}
        <motion.div
          className="absolute top-0 right-0 z-10 pointer-events-none"
          initial={{ x: '100vw', opacity: 0 }}
          whileInView={{ x: '-20vw', opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg width="80" height="50" viewBox="0 0 200 120" className="opacity-60">
              <path
                d="M180,60 Q160,40 100,45 L30,50 Q20,52 25,58 L100,65 Q160,70 180,60 Z"
                fill="url(#planeGrad2)"
                stroke="#DA70D6"
                strokeWidth="1"
              />
              <path d="M120,50 L140,10 L100,45 Z" fill="#40E0D0" opacity="0.8" />
              <path d="M120,60 L140,110 L100,65 Z" fill="#40E0D0" opacity="0.6" />
              <motion.circle
                cx="175" cy="60" r="6"
                fill="#DA70D6"
                animate={{ opacity: [0.3, 1, 0.3] }}
              />
              <defs>
                <linearGradient id="planeGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#DA70D6" />
                  <stop offset="100%" stopColor="#40E0D0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { number: '5000+', label: 'Graduates', icon: '🎓' },
              { number: '15+', label: 'Years Experience', icon: '🏆' },
              { number: '98%', label: 'Placement Rate', icon: '📈' },
              { number: '50+', label: 'Aircraft Hours', icon: '✈️' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center p-4 sm:p-6 rounded-2xl border backdrop-blur-sm"
                style={{
                  background: 'rgba(64, 224, 208, 0.05)',
                  borderColor: 'rgba(64, 224, 208, 0.2)'
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(218, 112, 214, 0.5)',
                  background: 'rgba(218, 112, 214, 0.08)'
                }}
              >
                <motion.div
                  className="text-2xl sm:text-3xl mb-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="text-2xl sm:text-3xl md:text-4xl font-black mb-1"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #40E0D0, #DA70D6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ==================== PARALLAX BANNER ==================== */}
      <section
        className="relative py-20 sm:py-28 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0a3e 0%, #191970 50%, #0d2d4a 100%)'
        }}
      >
        {/* Animated background circles */}
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 sm:w-60 sm:h-60 rounded-full opacity-10"
          style={{ background: '#40E0D0', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 sm:w-60 sm:h-60 rounded-full opacity-10"
          style={{ background: '#DA70D6', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        {/* Flying Airplane 3 */}
        <motion.div
          className="absolute top-1/2 left-0 z-10 pointer-events-none -translate-y-1/2"
          initial={{ x: '-100vw', opacity: 0 }}
          whileInView={{ x: '100vw', opacity: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 6, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg width="100" height="65" viewBox="0 0 200 120" className="opacity-70">
              <path
                d="M20,60 Q40,40 100,45 L170,50 Q180,52 175,58 L100,65 Q40,70 20,60 Z"
                fill="url(#bannerPlaneGrad)"
                stroke="#40E0D0"
                strokeWidth="1"
              />
              <path d="M80,50 L60,10 L100,45 Z" fill="#DA70D6" opacity="0.9" />
              <path d="M80,60 L60,110 L100,65 Z" fill="#DA70D6" opacity="0.7" />
              <motion.circle
                cx="25" cy="60" r="8"
                fill="#40E0D0"
                animate={{ opacity: [0.3, 1, 0.3], r: [6, 12, 6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <defs>
                <linearGradient id="bannerPlaneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#40E0D0" />
                  <stop offset="100%" stopColor="#DA70D6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight"
            >
              Your Dream of Flying{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #40E0D0, #DA70D6)' }}
              >
                Starts Here
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto px-4 leading-relaxed"
            >
              Join thousands of successful aviators who began their journey at Skyline. 
              From classroom to cockpit — we make it happen.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            >
              <Link to="/Contact">
                <motion.button
                  className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #DA70D6, #40E0D0)',
                    color: '#191970'
                  }}
                  whileHover={{ scale: 1.08, y: -3, boxShadow: '0 20px 60px rgba(218,112,214,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now ✈️
                </motion.button>
              </Link>

              <Link to="/training">
                <motion.button
                  className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-base sm:text-lg border-2"
                  style={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    background: 'rgba(255,255,255,0.05)'
                  }}
                  whileHover={{ scale: 1.05, y: -3, borderColor: '#40E0D0' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Campus Tour 🎥
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ==================== QUICK HIGHLIGHTS ==================== */}
      <section
        className="relative py-16 sm:py-20 px-4"
        style={{ background: 'linear-gradient(180deg, #191970 0%, #0d0d4a 100%)' }}
      >
        {/* Decorative Glows */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: '#40E0D0', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: '#DA70D6', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4"
              style={{
                color: '#DA70D6',
                background: 'rgba(218,112,214,0.1)',
                border: '1px solid rgba(218,112,214,0.3)'
              }}
            >
              At a Glance
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            >
              Why Students{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #40E0D0, #DA70D6)' }}
              >
                Love Skyline
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: '🌟',
                title: 'Trusted Since 2010',
                desc: 'Over a decade of excellence in aviation education with CAAB approval.',
                color: '#40E0D0'
              },
              {
                icon: '🤝',
                title: 'Airline Partnerships',
                desc: 'Direct hiring ties with major national and international airlines.',
                color: '#DA70D6'
              },
              {
                icon: '🚀',
                title: 'Career-Ready Graduates',
                desc: 'Our alumni fly, lead, and inspire across the global aviation industry.',
                color: '#40E0D0'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative p-6 sm:p-8 rounded-2xl border backdrop-blur-sm group cursor-pointer"
                style={{
                  background: 'rgba(25, 25, 112, 0.5)',
                  borderColor: 'rgba(64, 224, 208, 0.15)'
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                whileHover={{
                  y: -8,
                  borderColor: item.color,
                  boxShadow: `0 20px 60px ${item.color}20`
                }}
                transition={{ delay: index * 0.15 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${item.color}10, transparent 70%)`
                  }}
                />

                <motion.div
                  className="text-4xl sm:text-5xl mb-4 relative z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {item.icon}
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-2 relative z-10"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed relative z-10">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ==================== FINAL CTA (NO CONTACT) ==================== */}
      <section
        className="relative py-16 sm:py-20 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0a3e 0%, #191970 50%, #0d2d4a 100%)'
        }}
      >
        {/* Animated Glows */}
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full opacity-10"
          style={{ background: '#40E0D0', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full opacity-10"
          style={{ background: '#DA70D6', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        {/* Flying Airplane 4 */}
        <motion.div
          className="absolute bottom-10 right-0 z-10 pointer-events-none"
          initial={{ x: '100vw', opacity: 0 }}
          whileInView={{ x: '-30vw', opacity: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 6, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg width="70" height="45" viewBox="0 0 200 120" className="opacity-50">
              <path
                d="M180,60 Q160,40 100,45 L30,50 Q20,52 25,58 L100,65 Q160,70 180,60 Z"
                fill="#40E0D0"
                opacity="0.5"
              />
              <path d="M120,50 L140,10 L100,45 Z" fill="#DA70D6" opacity="0.6" />
            </svg>
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn} className="text-5xl sm:text-7xl mb-6">
              🛫
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6"
            >
              Ready to{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #40E0D0, #DA70D6)' }}
              >
                Take Off?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
            >
              Limited seats available for the next batch. Don't miss your chance to fly!
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            >
              <Link to="/Contact">
                <motion.button
                  className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #DA70D6, #40E0D0)',
                    color: '#191970'
                  }}
                  whileHover={{ scale: 1.08, y: -3, boxShadow: '0 20px 60px rgba(218,112,214,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Apply Now
                </motion.button>
              </Link>

              <Link to="/training">
                <motion.button
                  className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg border-2"
                  style={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    background: 'rgba(255,255,255,0.05)'
                  }}
                  whileHover={{ scale: 1.05, y: -3, borderColor: '#40E0D0' }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Programs ✈️
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;