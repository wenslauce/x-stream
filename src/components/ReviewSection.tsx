import { useState } from 'react';
import { Star, StarHalf, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  movieId: string;
}

export default function ReviewSection({ movieId }: ReviewSectionProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`reviews-${movieId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      username: 'Anonymous User',
      rating,
      comment,
      date: new Date().toISOString(),
    };

    setReviews(prev => [newReview, ...prev]);
    localStorage.setItem(`reviews-${movieId}`, JSON.stringify([newReview, ...reviews]));
    
    setRating(0);
    setComment('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-semibold text-white">Reviews & Ratings</h3>
      </div>

      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Your Rating</label>
          <motion.div 
            className="flex gap-1"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                type="button"
                onClick={() => handleRatingChange(value)}
                className="focus:outline-none transform hover:scale-110 transition-transform"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-all duration-300",
                    value <= rating 
                      ? "text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                      : "text-gray-600"
                  )}
                />
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Your Review</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="relative w-full bg-zinc-900/80 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm"
              rows={4}
              placeholder="Share your thoughts about this title..."
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={!rating || !comment.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "px-6 py-3 rounded-lg text-white transition-all duration-300",
            "relative group overflow-hidden",
            rating && comment.trim()
              ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              : "bg-zinc-700 cursor-not-allowed"
          )}
        >
          <span className="relative z-10">Submit Review</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </form>

      <div className="space-y-4">
        <AnimatePresence>
          {reviews.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center py-6"
            >
              Be the first to review this title!
            </motion.p>
          ) : (
            <motion.div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                  <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {review.username}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "w-4 h-4 transition-colors",
                            index < review.rating
                              ? "text-cyan-400 fill-cyan-400"
                              : "text-gray-600"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 group-hover:text-white transition-colors">
                      {review.comment}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}