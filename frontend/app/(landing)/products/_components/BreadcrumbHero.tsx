import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BreadcrumbHero = () => {
  const router = useRouter();
  return (
    <section className="relative w-full h-32 md:h-48 bg-[#f5f4ee] flex items-center justify-center overflow-hidden">
      {/* Central Trapezoid Shape */}
      <div 
        className="absolute inset-0 bg-[#DEDAD2] mx-auto w-full max-w-2xl md:max-w-4xl lg:max-w-5xl"
        style={{
          clipPath: 'polygon(15% 0%, 85% 0%, 75% 100%, 25% 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center justify-center">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
          <Link href="/" className="hover:text-black cursor-pointer transition-colors">Home</Link>
          <ChevronRight size={14} strokeWidth={3} className="text-gray-400" />
          <span className="hover:text-black cursor-pointer transition-colors">Products</span>
          <ChevronRight size={14} strokeWidth={3} className="text-gray-400" />
        </nav>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight text-black uppercase">
          Woman
        </h1>

        {/* Return Button - Absolute positioned to the right */}
        <button
        onClick={() => router.back()}
        className="hidden md:flex absolute right-6 items-center space-x-1 text-[12px] font-inter font-regular text-[#1C1C1C] hover:opacity-70 transition-opacity">
          <ChevronLeft size={14} />
          <span>Return to previous page</span>
        </button>
      </div>
    </section>
  );
};

export default BreadcrumbHero;