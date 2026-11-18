import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  FaPlane, FaClock, FaDollarSign, FaGraduationCap, 
  FaCheck, FaArrowRight, FaSearch 
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get guaranteed Tailwind button colors (Fixes invisible button issue)
const getButtonColors = (category) => {
  switch(category) {
    case 'pilot': return 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600';
    case 'cabin': return 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600';
    case 'management': return 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600';
    case 'maintenance': return 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600';
    default: return 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600';
  }
};

// 3D Card Component
const CourseCard3D = ({ course, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  const rotateX = useTransform(() => isHovered ? -10 : 0);
  const rotateY = useTransform(() => isHovered ? 10 : 0);
  const scale = useTransform(() => isHovered ? 1.05 : 1);
  const z = useTransform(() => isHovered ? 50 : 0);

  const btnColors = getButtonColors(course.category);

  return (
    <motion.div
      ref={cardRef}
      className="relative h-[550px] cursor-pointer perspective-1000"
      initial={{ opacity: 0, y: 100, rotateY: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{
          rotateX,
          rotateY,
          scale,
          z,
          transformStyle: 'preserve-3d'
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <motion.img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6 }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80';
              }}
            />
            {/* Darker overlay for perfect text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Badge */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold border border-gray-200 shadow-lg"
              animate={{ scale: isHovered ? 1.1 : 1 }}
            >
              {course.level}
            </motion.div>

            {/* Category Icon */}
            <motion.div
              className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-2xl border border-gray-200 shadow-lg"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {course.category === 'pilot' && '✈️'}
              {course.category === 'cabin' && '👨‍✈️'}
              {course.category === 'management' && '📊'}
              {course.category === 'maintenance' && '🔧'}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 bg-white relative" style={{ transform: 'translateZ(30px)' }}>
            <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
            
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaClock className="text-blue-600" />
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaDollarSign className="text-green-600" />
                <span className="font-bold text-lg text-gray-900">{course.price}</span>
              </div>
            </div>

            {/* FIXED BUTTON: Guaranteed visible with explicit colors */}
            <motion.button
              className={`w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg ${btnColors}`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              View Details <FaArrowRight className="text-sm" />
            </motion.button>

            {/* Floating Glow Element */}
            <motion.div
              className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${btnColors}`}
              animate={{ 
                scale: isHovered ? [1, 1.3, 1] : 1,
                opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Back Side (Details) */}
        <div 
         className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 flex flex-col"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className={`h-28 ${btnColors} flex items-center justify-center`}>
            <h3 className="text-xl font-bold text-white text-center px-4">{course.title}</h3>
          </div>
          
         <div className="p-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="mb-5">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                <FaGraduationCap className="text-blue-600" /> Course Features
              </h4>
              <ul className="space-y-2.5">
                {course.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {course.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* FIXED BACK BUTTON */}
            <motion.button
              className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg ${btnColors}`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Enroll Now - {course.price}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Category Filter Button
const CategoryButton = ({ category, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base whitespace-nowrap flex items-center gap-2 transition-all ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg scale-105'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>{category.icon}</span>
    <span>{category.name}</span>
  </motion.button>
);

// Main Course Component
const Course = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses);
        setCategories(data.categories);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setIsLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/50 to-slate-100 overflow-x-hidden">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ y: backgroundY, opacity }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Flying Planes Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ x: '-100vw', y: `${20 + i * 30}%` }}
            animate={{ x: '100vw' }}
            transition={{ 
              duration: 20 + i * 5, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 7
            }}
          >
            ✈️
          </motion.div>
        ))}
      </div>

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold mb-4 shadow-lg">
              🎓 Our Programs
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Flight Path
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Professional aviation training programs designed to take you from classroom to cockpit
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses (e.g., Pilot, Cabin)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none shadow-lg bg-white/80 backdrop-blur-md transition-all"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 overflow-x-auto pb-4 px-4 max-w-5xl mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[550px] rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {filteredCourses.map((course, index) => (
                  <CourseCard3D
                    key={course.id}
                    course={course}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 p-8 sm:p-16 text-center text-white shadow-2xl"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
            />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black mb-4">
                Ready to Take Off?
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Join thousands of successful aviators who started their journey at Skyline
              </p>
              <motion.button
                className="px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Free Consultation ✈️
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '5000+', label: 'Graduates', icon: '🎓' },
              { number: '15+', label: 'Years Experience', icon: '🏆' },
              { number: '98%', label: 'Placement Rate', icon: '📈' },
              { number: '50+', label: 'Aircraft Hours', icon: '✈️' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100"
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Course;