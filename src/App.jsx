import { useState, useEffect } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Learning from './components/Learning.jsx';
import Benefits from './components/Benefits.jsx';
import Speaker from './components/Speaker.jsx';
import Pricing from './components/Pricing.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import Inscripcion from './components/Inscripcion.jsx';
import PaymentResult from './components/PaymentResult.jsx';

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/\?.*$/, '') || '#/');
  useEffect(() => {
    const onHash = () => {
      const r = window.location.hash.replace(/\?.*$/, '') || '#/';
      setRoute(r);
      // Solo resetear scroll al cambiar de "página" (rutas #/...), no en anclas #pricing
      if (r.startsWith('#/')) window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

function Landing() {
  return (
    <div className="bg-deep min-h-screen text-white">
      <Nav />
      <main>
        <Hero />
        <Learning />
        <Benefits />
        <Speaker />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  if (route === '#/inscripcion') return <Inscripcion />;
  if (route === '#/resultado') return <PaymentResult />;
  return <Landing />;
}
