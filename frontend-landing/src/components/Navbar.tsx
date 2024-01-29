import Image from 'next/image';
import IcMenu from '@/images/ic-menu.svg';

export default function Navbar() {
  return (
    <div className="flex w-full justify-between bg-grey-50 px-4 py-7 lg:px-[160px]">
      <div className="text-[28px] font-bold text-grey-900">Logo</div>
      <div className="flex gap-10 font-bold text-grey-900">
        <div>教學內容</div>
        <div>方案說明</div>
        <div>免費試看</div>
        <div>資料索取</div>
      </div>
      <Image src={IcMenu} alt="menu" className="block lg:hidden" />
    </div>
  );
}
