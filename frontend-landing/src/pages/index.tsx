import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Landing() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute left-0 top-0 w-full">
        <Navbar />
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
