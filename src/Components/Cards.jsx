import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const speakers = [
  {
    name: "DIKSHANT",
    title: "Singer-songwriter",
    quote: "\"\"",
    image: "/Speakers/dikshant2.jpg"
  },
  {
    name: "HARINI SIVAKUMAR",
    title: "Entrepreneur",
    quote: "\"\"",
    image: "/Speakers/Harini2.jpg"
  },
  {
    name: "MUKTI GAUTAM",
    title: "Influencer",
    quote: "\"\"",
    image: "/Speakers/mukti.jpg"
  },
  {
    name: "KESHAV SADHNA",
    title: "Actor",
    quote: "\"\"",
    image: "/Speakers/keshav2.jpg"
  },
  {
    name: "SIFAT KHURANA",
    title: "Entrepreneur",
    quote: "\"\"",
    image: "/Speakers/sifat.jpg"
  },
  {
    name: "DRISHYAA DUGGAL",
    title: "Cyberpsychology Evangelist",
    quote: "\"Rethinking the Mind in the age of the Algorithm.\"",
    image: "/Speakers/drishyaa.jpg"
  },
  {
    name: "PRATEEK SETHI",
    title: "Film Producer",
    quote: "\"I am an explorer. The new excites me, the old fascinates me, the present captivates me and the future makes me smile.\"",
    image: "/Speakers/prateek.jpg"
  },
  {
    name: "TAPESH KUMAR",
    title: "Pilot",
    quote: "\"Come Fly With Me.\"",
    image: "/Speakers/tapesh.jpg"
  },
  {
    name: "PRITIKA SINGH",
    title: "Founder, CEO",
    quote: "\"You Don't Need to Push Harder. Most people were taught that success requires constant pushing. More effort. More discipline\"",
    image: "/Speakers/pritika.jpg"
  },
  {
    name: "AMARABHA BANERJEE",
    title: "Singer-songwriter",
    quote: "\"\"",
    image: "/Speakers/amarabha.jpg"
  }
];

export default function Cards() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // If we reached the end, reset to start, else scroll right
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-black text-white w-full py-24 z-10 overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#bc001e]/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-[#bc001e]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Spotlight Section */}
        <section className="px-6 md:px-12 mb-16">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center py-4">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#eb0028] to-[#8a0018]">ARCHIVE</span> OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-300 to-stone-600">VOICES</span>
            </h2>
            <p className="max-w-2xl text-stone-400 text-lg md:text-xl leading-relaxed mx-auto">
              A visual retrospective of the thinkers, builders, and dreamers who have graced the TEDx stage. Explore the legacy of "Ideas Worth Spreading."
            </p>
          </div>
        </section>

        {/* Past Speakers Slider Wrapper */}
        <section 
          className="relative px-4 md:px-12 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Desktop Overlay Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-6 md:left-16 top-[40%] -translate-y-1/2 z-30 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-[#eb0028] hover:border-[#eb0028] transition-all duration-300 text-white shadow-2xl opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
          >
            <ChevronLeft size={32} strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-6 md:right-16 top-[40%] -translate-y-1/2 z-30 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-[#eb0028] hover:border-[#eb0028] transition-all duration-300 text-white shadow-2xl opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
          >
            <ChevronRight size={32} strokeWidth={2.5} />
          </button>

          {/* Carousel Track */}
          <div 
            ref={scrollRef}
            className="flex gap-6 md:gap-10 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-proximity pb-12 px-4"
          >
            {speakers.map((speaker, index) => (
              <div key={index} className="w-[280px] md:w-[380px] flex-shrink-0 group/card cursor-pointer snap-center">
                <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border border-white/5 group-hover/card:border-[#eb0028]/30 transition-colors duration-500">
                  <img
                    alt={speaker.name}
                    className="w-full h-full object-cover object-top md:grayscale md:group-hover/card:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover/card:scale-105"
                    src={speaker.image}
                  />
                  {speaker.quote && speaker.quote !== "\"\"" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end justify-center p-8 text-center backdrop-blur-[2px]">
                      <p className="text-zinc-100 text-sm md:text-lg italic font-medium leading-relaxed transform translate-y-8 group-hover/card:translate-y-0 transition-all duration-500 pb-4">
                        {speaker.quote}
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-2">
                  <div className="h-1 w-12 bg-[#eb0028] mb-4 transition-all group-hover/card:w-full duration-500"></div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-1 uppercase whitespace-nowrap overflow-hidden text-ellipsis">{speaker.name}</h3>
                  <p className="text-[#eb0028] text-sm md:text-base font-bold tracking-widest uppercase">{speaker.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Buttons (Always visible at the bottom or hidden if preferred, but user said "on cards") */}
          <div className="flex md:hidden justify-center gap-6 mt-4">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white active:bg-[#eb0028]"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white active:bg-[#eb0028]"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
