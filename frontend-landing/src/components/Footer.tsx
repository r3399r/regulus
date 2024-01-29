import Button from './Button';

export default function Footer() {
  return (
    <div className="flex w-full items-center justify-between bg-indigo-500 p-4 md:px-[160px]">
      <div className="text-xl font-bold text-white">聯絡我們</div>
      <Button color="white" className="px-8 py-2">
        點此聯絡
      </Button>
    </div>
  );
}
