import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Course', path: '/course' },
    { name: 'Training & Facilities', path: '/training' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Review', path: '/review' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl">✈️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              Skyline
            </span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item, index) => (
            <Link key={item.name} to={item.path}>
              <motion.div
                className={`relative font-semibold px-2 py-1 transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -3 }}
              >
                {item.name}
                <motion.div
                  className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400"
                  initial={{ width: 0, left: '50%' }}
                  whileHover={{ width: '80%', left: '10%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link to="/contact">
          <motion.button
            className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-full shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Enroll Now
          </motion.button>
        </Link>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={isOpen ? { rotate: 45, y: 6 } : {}}
            className="w-6 h-0.5 bg-blue-600"
          />
          <motion.div
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-blue-600"
          />
          <motion.div
            animate={isOpen ? { rotate: -45, y: -6 } : {}}
            className="w-6 h-0.5 bg-blue-600"
          />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t"
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className={`block font-semibold py-2 transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    whileHover={{ x: 10 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <motion.button
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enroll Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;