import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function Landing() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute left-0 top-0 w-full">
        <Navbar />
      </div>
      <div className="absolute top-[90px] h-[calc(100vh-90px)] w-full overflow-auto">
        <div className="min-h-[calc(100vh-90px-72px)]">
          <Hero />
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}
