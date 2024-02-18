import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import FeatureAnytime from '@/images/feature-anytime.svg';
import FeatureHabit from '@/images/feature-habit.svg';
import FeatureSystem from '@/images/feature-system.svg';
import FeatureDatabase from '@/images/feature-database.svg';
import FeatureFields from '@/images/feature-fields.svg';

export default function Landing() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute left-0 top-0 w-full">
        <Navbar />
      </div>
      <div className="absolute top-[90px] h-[calc(100vh-90px)] w-full overflow-auto">
        <div className="min-h-[calc(100vh-90px-72px)]">
          <Hero />
          <div className="bg-pastelgrey-100">
            <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-10 md:py-[120px]">
              <div className="flex flex-col justify-between gap-10 sm:flex-row">
                <div className="text-[28px] font-bold leading-[34px] md:text-[40px] md:leading-[56px]">
                  在自助學習系統的陪伴下，你能夠獲得...
                </div>
                <div className="text-center">
                  <Button className="px-10 py-3 text-xl">瞭解更多</Button>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-4 gap-y-10 sm:gap-x-10 md:gap-x-20">
                <div className="w-[calc(50%-8px)] bg-white sm:w-[calc((100%-80px)/3)] md:w-[calc((100%-160px)/3)]">
                  <Image src={FeatureAnytime} alt="feature-anytime" className="w-full" />
                  <div className="p-4 font-bold">隨時複習，不限次數！</div>
                </div>
                <div className="w-[calc(50%-8px)] bg-white sm:w-[calc((100%-80px)/3)] md:w-[calc((100%-160px)/3)]">
                  <Image src={FeatureHabit} alt="feature-anytime" className="w-full" />
                  <div className="p-4 font-bold">養成學習的習慣，數學再也不可怕！</div>
                </div>
                <div className="w-[calc(50%-8px)] bg-white sm:w-[calc((100%-80px)/3)] md:w-[calc((100%-160px)/3)]">
                  <Image src={FeatureSystem} alt="feature-anytime" className="w-full" />
                  <div className="p-4 font-bold">系統分析學習成效，針對弱點加強練習</div>
                </div>
                <div className="w-[calc(50%-8px)] bg-white sm:w-[calc((100%-80px)/3)] md:w-[calc((100%-160px)/3)]">
                  <Image src={FeatureDatabase} alt="feature-anytime" className="w-full" />
                  <div className="p-4 font-bold">抓住必考重點題型，考試不用猜！</div>
                </div>
                <div className="w-[calc(50%-8px)] bg-white sm:w-[calc((100%-80px)/3)] md:w-[calc((100%-160px)/3)]">
                  <Image src={FeatureFields} alt="feature-anytime" className="w-full" />
                  <div className="p-4 font-bold">掌握了數學，就可以掌握其他科目！</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}
