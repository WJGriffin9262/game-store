function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">🎮 Game Store</h3>
            <p className="text-gray-400">
              Your favorite place to buy games online. Discover, play, and enjoy the best gaming experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#games" className="text-gray-400 hover:text-blue-400 transition-colors">Games</a></li>
              <li><a href="#support" className="text-gray-400 hover:text-blue-400 transition-colors">Support</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#twitter" className="inline-flex items-center justify-center w-10 h-10 bg-slate-700 rounded-full hover:bg-blue-500 transition-colors">
                <span className="text-lg">𝕏</span>
              </a>
              <a href="#facebook" className="inline-flex items-center justify-center w-10 h-10 bg-slate-700 rounded-full hover:bg-blue-600 transition-colors">
                <span className="text-lg">f</span>
              </a>
              <a href="#instagram" className="inline-flex items-center justify-center w-10 h-10 bg-slate-700 rounded-full hover:bg-pink-500 transition-colors">
                <span className="text-lg">📷</span>
              </a>
              <a href="#discord" className="inline-flex items-center justify-center w-10 h-10 bg-slate-700 rounded-full hover:bg-indigo-500 transition-colors">
                <span className="text-lg">💬</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-gray-400 mb-4 sm:mb-0">
            &copy; {currentYear} Game Store. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
