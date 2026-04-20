import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks';

function Header() {
  const { itemCount } = useCart();

  const navItemVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const cartButtonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const cartBadgeVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    exit: { scale: 0 }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 hover:opacity-80 transition-opacity"
            >
              🎮 Game Store
            </Link>
          </motion.div>

          {/* Menu */}
          <ul className="flex items-center gap-6 sm:gap-8">
            <motion.li
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/"
                className="text-gray-300 hover:text-white font-medium transition-colors relative"
              >
                Home
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.li>
            <motion.li
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/games"
                className="text-gray-300 hover:text-white font-medium transition-colors relative"
              >
                Games
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.li>
            <motion.li
              variants={cartButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/cart"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all relative"
              >
                <span>Cart</span>
                {itemCount > 0 && (
                  <motion.span
                    className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    variants={cartBadgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    key={itemCount} // Re-animate when count changes
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </motion.li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}

export default Header;
