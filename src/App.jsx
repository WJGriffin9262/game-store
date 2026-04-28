import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import Cart from './pages/Cart';
import { useRouteOutletAnimation } from './hooks/useRouteOutletAnimation';

/**
 * Root layout + routes. Global CSS is imported from ./index.css in index.js.
 */
function App() {
  const location = useLocation();
  const outletRef = useRouteOutletAnimation(location.pathname);

  return (
    <div className='app'>
      <Header />
      <main className='app__main'>
        <div ref={outletRef} className='app__outlet app__outlet--animating'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/games' element={<Games />} />
            <Route path='/games/:id' element={<GameDetails />} />
            <Route path='/cart' element={<Cart />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
