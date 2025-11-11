import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const featureSlides = [
  {
    image: '/carousel/discover.jpg',
    title: 'Discover Top Professionals',
    description: 'Find and connect with verified, expert beauticians in your local area.',
  },
  {
    image: '/carousel/at-home.jpg',
    title: 'Book Services at Home',
    description: 'Enjoy professional beauty treatments from the comfort of your own home.',
  },
  {
    image: '/carousel/schedule.jpg',
    title: 'Schedule with Ease',
    description: 'Select your service, pick a time, and book instantly with our real-time calendar.',
  },
];

const variants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const WelcomeScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev === featureSlides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="mb-8">
        <h1 className="text-5xl font-heading text-primary">LushLook</h1>
        <p className="text-accent mt-2">Your Beauty, Your Time, Your Place.</p>
      </div>

      {/* Feature Highlights Carousel */}
      <div className="mb-12 h-64 w-full max-w-sm relative overflow-hidden rounded-lg shadow-lg">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img src={featureSlides[currentSlide].image} alt={featureSlides[currentSlide].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-6">
              <h3 className="font-bold text-white text-xl font-heading">{featureSlides[currentSlide].title}</h3>
              <p className="text-white/90 text-sm">{featureSlides[currentSlide].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {featureSlides.map((_, index) => (
            <div key={index} onClick={() => setCurrentSlide(index)} className={`h-2 w-2 rounded-full cursor-pointer transition-all ${currentSlide === index ? 'w-4 bg-white' : 'bg-white/50'}`}></div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <Link to="/register">
          <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-pink-700 transition-colors text-lg font-bold">Get Started</button>
        </Link>
        <Link to="/login">
          <p className="text-accent mt-4">Already have an account? <span className="font-bold">Sign In</span></p>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeScreen;
