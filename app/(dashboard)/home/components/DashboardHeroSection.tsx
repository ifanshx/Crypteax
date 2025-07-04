// components/dashboard/DashboardHeroSection.tsx

"use client"
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

// Import interface Collection dari data source
import { Collection } from '@/lib/data/collections';

export type CarouselItemData = Collection;

interface DashboardHeroSectionProps {
  items: CarouselItemData[];
}

const MainBannerSlide: React.FC<{ item: CarouselItemData }> = ({ item }) => (
  <Link href={`/collections/${item.id}`} passHref>
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden cursor-pointer group">
      <Image
        src={item.bannerUrl}
        alt={item.name}
        layout="fill"
        objectFit="cover"
        className="z-0 transform group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

      <div className="absolute left-4 bottom-4 md:left-8 md:bottom-8 z-20 text-white">
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-1 md:mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          {item.name}
        </h2>
        {item.status === 'Live' && (
          <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-lg">
            <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-semibold">{item.status}</span>
          </div>
        )}
        {item.status === 'Ended' && (
          <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-lg">
            <span className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
            <span className="font-semibold">{item.status}</span>
          </div>
        )}
        {item.status === 'Coming Soon' && (
          <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-lg">
            <span className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></span>
            <span className="font-semibold">{item.status}</span>
          </div>
        )}
      </div>

      {item.mintPrice && item.status === 'Live' && (
        <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 z-20">
          <Button
            className="md:px-8 md:py-3 md:text-base bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            size="sm"
            onClick={(e) => { e.stopPropagation(); /* Logic untuk proses mint */ }}
          >
            MINT {item.mintPrice}
          </Button>
        </div>
      )}

      {item.externalUrl && item.status === 'Ended' && (
        <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 z-20">
          <Button
            className="md:px-8 md:py-3 md:text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            size="sm"
            onClick={(e) => { e.stopPropagation(); window.open(item.externalUrl!, '_blank'); }}
          >
            View on OpenSea
          </Button>
        </div>
      )}
    </div>
  </Link>
);

const DetailedThumbnailItem: React.FC<{
  item: CarouselItemData;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <div
    className={cn(
      "relative h-[120px] rounded-xl overflow-hidden shadow-md cursor-pointer",
      "flex-shrink-0",
      "w-[250px]",
      "md:w-[calc(33.33%-16px)]",
      "transition-all duration-300",
      isActive ? "border-2 border-blue-500 scale-[1.02]" : "border-2 border-transparent hover:scale-[1.01]"
    )}
    onClick={onClick}
  >
    <Image
      src={item.imageUrl}
      alt={item.name}
      layout="fill"
      objectFit="cover"
      className="z-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>

    {item.status === 'Coming Soon' && (
      <div className="absolute brightness-75 bg-gradient-to-t from-black/50 via-black/50 to-transparent inset-0 flex items-center justify-center z-20">
        <span className="text-white font-semibold text-lg">Coming Soon</span>
      </div>
    )}

    {item.status !== 'Coming Soon' && (
      <div className="absolute left-4 bottom-4 z-20 text-white">
        <h3 className="text-base sm:text-xl font-bold">{item.name}</h3>
      </div>
    )}
  </div>
);

const DotIndicator: React.FC<{ isActive: boolean; onClick: () => void; name: string }> = ({ isActive, onClick, name }) => (
  <button
    className={cn(
      "size-2 rounded-full transition-colors duration-300",
      isActive ? "bg-blue-600 w-4" : "bg-gray-300 hover:bg-gray-400",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    )}
    onClick={onClick}
    aria-label={`Go to slide ${name}`}
  />
);


export function DashboardHeroSection({ items }: DashboardHeroSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-1">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-1">
                <MainBannerSlide item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex" />
        </Carousel>
      </div>

      {isMobile ? (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((item, index) => (
            <DotIndicator
              key={item.id}
              isActive={current === index}
              onClick={() => api?.scrollTo(index)}
              name={item.name}
            />
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto space-x-6 mt-6 px-1 pb-4 scrollbar-hide">
          {items.map((item, index) => (
            <DetailedThumbnailItem
              key={item.id}
              item={item}
              isActive={current === index}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}