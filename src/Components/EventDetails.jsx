import React from 'react';

const EventDetails = () => {
  return (
    <div className="bg-black text-on-primary-container w-full flex flex-col items-center">
      {/* Bento Spotlight Section */}
      

      {/* Idea Spotlight (Content Spotlight) */}
      <section className="relative z-10 w-full py-24 bg-stone-900/50 backdrop-blur-sm border-y border-white/5">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="material-symbols-outlined text-stone-600 text-5xl mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          <blockquote className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-8">
              "IT IS IN YOUR MOMENTS OF DECISION THAT YOUR <span className="text-[#eb0028]">DESTINY IS SHAPED</span>."
          </blockquote>
          <cite className="text-[#eb0028] font-bold uppercase tracking-[0.2em] text-xs not-italic">— Tony Robbins</cite>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;
