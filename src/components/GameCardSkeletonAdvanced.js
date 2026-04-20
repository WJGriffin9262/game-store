import { motion } from 'framer-motion';

function GameCardSkeletonAdvanced({ delay = 0 }) {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const shimmerVariants = {
    animate: {
      x: ["0%", "100%", "0%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-lg"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Game Image Skeleton */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          variants={shimmerVariants}
          animate="animate"
        ></motion.div>
        {/* Genre Badge Skeleton */}
        <div className="absolute top-3 right-3 bg-gray-400 px-3 py-1 rounded-full">
          <div className="w-12 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Title Skeleton */}
        <div className="mb-2">
          <motion.div
            className="h-5 sm:h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded mb-1"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          ></motion.div>
          <motion.div
            className="h-5 sm:h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-3/4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.2
            }}
          ></motion.div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-3">
          <motion.div
            className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded mb-1"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.4
            }}
          ></motion.div>
          <motion.div
            className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-5/6"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.6
            }}
          ></motion.div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.8 + i * 0.1
                }}
              ></motion.div>
            ))}
          </div>
          <motion.div
            className="w-8 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1.0
            }}
          ></motion.div>
        </div>

        {/* Price and Actions Skeleton */}
        <div className="mt-auto space-y-3 border-t pt-4">
          {/* Price Skeleton */}
          <div className="flex justify-between items-center">
            <motion.div
              className="w-20 h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1.2
              }}
            ></motion.div>
          </div>

          {/* Button Skeleton */}
          <div className="flex gap-2">
            <motion.div
              className="flex-1 h-10 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1.4
              }}
            ></motion.div>
          </div>

          {/* Link Skeleton */}
          <motion.div
            className="w-24 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded mx-auto"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1.6
            }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameCardSkeletonAdvanced;