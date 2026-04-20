import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice, truncateText } from '../utils';

function GameCard({ game, onAddToCart }) {
  const rating = Math.floor(game.rating || 0);

  const cardVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Game Image */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
        <motion.img
          src={game.image || '/placeholder-game.jpg'}
          alt={game.title}
          className="w-full h-full object-cover"
          variants={imageVariants}
          onError={(e) => e.target.src = '/placeholder-game.jpg'}
        />
        <motion.div
          className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {game.genre}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Title */}
        <motion.h3
          className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {game.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-sm text-gray-600 mb-3 line-clamp-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {truncateText(game.description, 80)}
        </motion.p>

        {/* Rating */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="text-sm">
            {rating > 0 ? (
              <>
                <span className="text-yellow-400">{'⭐'.repeat(rating)}</span>
                <span className="ml-1 text-gray-600 font-medium">{game.rating || 'N/A'}</span>
              </>
            ) : (
              <span className="text-gray-400">No rating</span>
            )}
          </div>
        </motion.div>

        {/* Price and Actions */}
        <motion.div
          className="mt-auto space-y-3 border-t pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <motion.span
              className="text-2xl sm:text-3xl font-bold text-blue-600"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3, type: "spring", stiffness: 200 }}
            >
              {formatPrice(game.price)}
            </motion.span>
          </div>

          <div className="flex gap-2">
            <motion.button
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onAddToCart(game)}
            >
              Add to Cart
            </motion.button>
          </div>

          <Link
            to={`/games/${game.id}`}
            className="block text-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View Details →
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GameCard;
