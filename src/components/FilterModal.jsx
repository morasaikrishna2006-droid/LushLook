import React, { useState } from 'react'
import { motion } from 'framer-motion'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { y: '100vh', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
  exit: { y: '100vh', opacity: 0 },
}

export default function FilterModal({ isOpen, onClose, onApplyFilters }) {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [rating, setRating] = useState(0)

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      rating,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-end"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-t-2xl w-full max-h-[80vh] flex flex-col"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-accent/10">
          <h2 className="text-xl font-bold font-heading text-accent">Filters</h2>
          <button onClick={onClose} className="text-2xl text-accent/50 hover:text-primary">&times;</button>
        </div>

        {/* Filter Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-2 text-accent">Price Range</h3>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-secondary/50 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-accent/80 mt-2">
              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Ratings */}
          <div>
            <h3 className="font-semibold mb-2 text-accent">Minimum Rating</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="text-3xl">
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Placeholders for other filters */}
          <div className="opacity-50">
            <h3 className="font-semibold mb-2 text-accent">Availability</h3>
            <p className="text-sm text-accent/60">Date filtering coming soon.</p>
          </div>
          <div className="opacity-50">
            <h3 className="font-semibold mb-2 text-accent">Distance</h3>
            <p className="text-sm text-accent/60">Distance filtering coming soon.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-accent/10 flex gap-4">
          <button onClick={() => { setPriceRange([0, 500]); setRating(0); }} className="w-full btn btn-outline">
            Clear
          </button>
          <button onClick={handleApply} className="w-full btn btn-primary">
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}