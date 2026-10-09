"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Music, Film, Code, Monitor, Target, Lightbulb, Zap } from 'lucide-react';

import { useTranslations } from 'next-intl';

export default function TeamPage() {
  const t = useTranslations("Team");
  const teamMembers = [
    {
      name1: t("member1Name1"),
      name2: t("member1Name2"),
      role: t("member1Role"),
      image: "/images/กฤศกร รัตนปทุมพงส์ KRITSAKORN RATTANAPATHUMPHONG-optimized.webp",
      bio: t("member1Bio"),
      socials: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      }
    },
    {
      name1: t("member2Name1"),
      name2: t("member2Name2"),
      role: t("member2Role"),
      image: "/images/Wyatt Mitchell (ไวแอตต์ มิตเชลล์)-optimized.webp",
      bio: t("member2Bio"),
      socials: {
        github: "#",
        linkedin: "#",
      }
    },
    {
      name1: t("member3Name1"),
      name2: t("member3Name2"),
      role: t("member3Role"),
      image: "/images/เร็น (Ren  蓮) ทานากะ (Tanaka  田中)-optimized.webp",
      bio: t("member3Bio"),
      socials: {
        github: "#",
        twitter: "#",
      }
    }
  ];

  return (
    <div className="min-h-screen text-slate-200 relative overflow-hidden font-sans">
      
      {/* 1. Global Fixed Background (The arm). Fully bright. */}
      <div 
        className="fixed inset-0 z-[-2] bg-[length:250%_auto] sm:bg-[length:150%_auto] md:bg-cover bg-[65%_bottom] md:bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/bg_optimized.webp')` }}
      />
      
      {/* 2. Smart Dark Overlay: 
          - 0 to 100vh: Solid black (Hides arm completely under the hero banner)
          - 120vh to (Bottom - 60vh): 92% black (Makes text readable, arm is faintly visible)
          - Bottom 60vh: Fades to transparent (Reveals the arm fully at the bottom of the page)
      */}
      <div 
        className="absolute inset-0 z-[-1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(2,6,23,1) 0%, rgba(2,6,23,1) 100vh, rgba(2,6,23,0.92) 120vh, rgba(2,6,23,0.92) calc(100% - 60vh), rgba(2,6,23,0) 100%)'
        }}
      />

      {/* Background Decorative Elements (Optimized with radial gradients instead of CSS blur) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-blue-500/5 to-transparent rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-cyan-500/5 to-transparent rounded-full pointer-events-none z-0" />

      {/* Top Hero Banner with Integrated Header Content */}
      <div className="relative w-full min-h-[80vh] md:min-h-[90vh] flex flex-col justify-end pt-32 pb-8 md:pb-12 z-10">
        
        {/* Background Layer with Mask to smoothly fade into the page background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)'
          }}
        >
          <div 
            className="absolute inset-0 bg-[length:180%_auto] sm:bg-[length:140%_auto] md:bg-cover bg-[center_top_5%] md:bg-center bg-no-repeat opacity-100"
            style={{ backgroundImage: `url('/images/team-hero-bg.webp')` }}
          />
          {/* Very subtle gradients just to ensure white text has a little contrast, slightly stronger on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 md:from-slate-950/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 md:from-slate-950/50 via-slate-950/30 md:via-slate-950/10 to-transparent" />
        </div>
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl md:max-w-3xl mx-auto md:mx-0 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-4 inline-block text-blue-400 text-sm md:text-base font-bold tracking-[0.3em] uppercase drop-shadow-md"
            >
              {t("headerBadge")}
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-6 font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-[1.1] md:leading-[1.05]">
              {t("headerTitle1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {t("headerTitle2")}
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl lg:text-2xl text-slate-100 leading-relaxed font-medium drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] max-w-2xl">
              {t.rich("headerDesc", {
                highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-bold drop-shadow-sm">{chunks}</span>
              })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 pt-12 md:pt-16">

        {/* Elegant Separator */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-12" />

        {/* Founder's Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-32 relative"
        >
          {/* Quote mark decoration removed per user request */}
          
          <div className="text-center px-4 md:px-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans italic text-slate-200 leading-loose md:leading-relaxed drop-shadow-sm mb-8 whitespace-pre-line">
              {t.rich("quote", {
                highlight: (chunks) => <span className="text-blue-400 font-normal not-italic">{chunks}</span>
              })}
            </h2>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-[2px] bg-blue-500 mb-2"></div>
              <p className="text-lg md:text-xl font-medium text-white">{t("quoteName")}</p>
              <p className="text-sm md:text-base text-blue-300/80 uppercase tracking-widest">{t("quoteRole")}</p>
            </div>
          </div>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-16 md:gap-24 lg:gap-32 mb-32">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16"
            >
              {/* Image Section - Resized for mobile */}
              <div className={`w-3/4 sm:w-2/3 md:w-5/12 mx-auto md:mx-0 flex-shrink-0 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                  {/* Image wrapper with animation */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <img 
                      src={member.image} 
                      alt={member.nameEN} 
                      className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.div>
                  
                  {/* Subtle inner shadow and border overlay */}
                  <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Text Section - Centered on mobile */}
              <div className={`w-full md:w-7/12 pt-2 md:pt-8 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                <div className="flex flex-col h-full text-center md:text-left items-center md:items-start">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-2 font-sans drop-shadow-sm">
                    {member.name1}
                  </h2>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-slate-300 mb-6">
                    {member.name2}
                  </h3>
                  
                  <div className="flex flex-col items-center md:items-start gap-3 text-blue-400 mb-6 md:mb-8">
                    <span className="h-[2px] w-12 bg-blue-500 block"></span>
                    <p className="text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] uppercase">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="text-slate-300 leading-loose text-sm sm:text-base md:text-lg lg:text-xl font-light drop-shadow-sm max-w-lg md:max-w-none mx-auto md:mx-0">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-32 border-t border-slate-800/60 pt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-blue-400 font-semibold tracking-wide mb-8 drop-shadow-sm">
              {t("philosophyTitle")}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center px-4 md:px-0">
            {/* Phil 1 */}
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Target size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-wide">{t("phil1Title")}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{t("phil1Desc")}</p>
            </div>
            
            {/* Phil 2 */}
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <Lightbulb size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-wide">{t("phil2Title")}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{t("phil2Desc")}</p>
            </div>
            
            {/* Phil 3 */}
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Zap size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-wide">{t("phil3Title")}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{t("phil3Desc")}</p>
            </div>
          </div>
        </motion.div>

        {/* Infinite Marquee Section */}
        <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden bg-slate-900/30 border-y border-slate-800/40 py-6 mb-32 flex whitespace-nowrap">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex items-center gap-12 md:gap-24 text-slate-500/50 font-medium uppercase tracking-[0.2em] text-xl md:text-3xl"
          >
            {/* Duplicate content to create seamless loop */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span>{t("marquee1")}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>{t("marquee2")}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>{t("marquee3")}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>{t("marquee4")}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>{t("marquee5")}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Vision / CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto pb-12 mb-12"
        >
          {/* Background & Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/80 to-slate-950 rounded-3xl border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-hidden" />
          
          {/* Subtle Glow Effects */}
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
          
          <div className="relative px-6 py-16 md:py-20 md:px-16 text-center z-10 flex flex-col justify-center min-h-[300px]">
            <h2 className="text-3xl md:text-4xl text-blue-400 font-semibold tracking-wide mb-8 md:mb-10 drop-shadow-sm">
              {t("ctaTitle")}
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 font-light leading-relaxed drop-shadow-md font-sans px-4 max-w-4xl mx-auto [text-wrap:balance]">
              {t.rich("ctaDesc", {
                strong_highlight: (chunks) => <strong className="font-medium text-white tracking-wide">{chunks}</strong>,
                italic_highlight: (chunks) => <em className="italic text-slate-200 font-normal">{chunks}</em>,
                color_highlight: (chunks) => <span className="text-blue-400 font-medium italic">{chunks}</span>
              })}
            </p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
