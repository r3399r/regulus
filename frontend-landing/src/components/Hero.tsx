import HeroLarge from '@/images/hero-large.svg';
import HeroMobile from '@/images/hero-mobile.svg';
import Image from 'next/image';
import Button from './Button';

export default function Hero() {
  return (
    <div className="bg-pastelgrey-50">
      <div className="px-4 pb-14 sm:px-10">
        <div className="mx-auto flex max-w-[1200px] justify-center">
          <Image src={HeroLarge} alt="hero" className="hidden md:block" />
          <Image src={HeroMobile} alt="hero" className="block md:hidden" />
        </div>
        <div className="mx-auto flex max-w-[688px] flex-col items-center border-b-4 border-r-4 border-grey-700 bg-jade-100 px-9 py-10 md:max-w-[1000px] md:border-b-8 md:border-r-8">
          <div className="border-b-8 border-indigo-300 pb-2 text-center text-[28px] font-bold leading-[34px] md:text-[40px] md:leading-[56px]">
            自助學習系統幫助你輕鬆克服!
          </div>
          <Button className="mt-8 px-10 py-3 text-xl">聯絡我們</Button>
        </div>
      </div>
    </div>
  );
}
