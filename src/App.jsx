import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/index.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home.jsx';
import Games from './pages/Games.jsx';
import GameDetails from './pages/GameDetails.jsx';
import Cart from './pages/Cart.jsx';
import { useRouteOutletAnimation } from './hooks/useRouteOutletAnimation';

/**
 * Root layout + routes. Global styles load once from ./styles/index.css.
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
