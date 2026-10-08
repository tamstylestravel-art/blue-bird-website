"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Music, Film, Code, Monitor, Target, Lightbulb, Zap } from 'lucide-react';

const teamMembers = [
  {
    nameTH: "กฤศกร รัตนปทุมพงส์",
    nameEN: "(Kritsakorn Rattanapathumphong)",
    role: "Founder, Film Producer & Lead Architect (Blue Bird Composer Pro)",
    image: "/images/กฤศกร รัตนปทุมพงส์ KRITSAKORN RATTANAPATHUMPHONG-optimized.webp",
    bio: "ผู้บริหารและผู้ก่อตั้งระดับแนวหน้า โดยมีบทบาทหลักเป็น 'โปรดิวเซอร์ภาพยนตร์' และ 'ซาวด์เอนจิเนียร์' (Sound Engineer) ผู้ผสมผสานทักษะอันไร้ขีดจำกัดทั้งทางด้านเทคนิค (วิศวกรรม, คอมพิวเตอร์, ระบบเสียง, VFX) และความคิดสร้างสรรค์เข้าด้วยกันอย่างสมบูรณ์แบบ ปัจจุบันเป็นหัวหอกสำคัญในฐานะ 'หัวหน้าทีมสถาปัตยกรรมปลั๊กอิน Blue Bird Composer Pro' ภายใต้ค่าย Blue Bird Pictures Studio ผู้อยู่เบื้องหลังการออกแบบโครงสร้างระบบสุดล้ำสมัย ด้วยประสบการณ์ที่โชกโชนในการร่วมงานกับโปรเจกต์ระดับประเทศและแบรนด์ชั้นนำ อาทิ GDH, BOXX MUSIC, YUPP, โอสถสภา และสิงห์ คอร์เปอเรชั่น นอกจากนี้ยังได้รับเกียรติให้ดำรงตำแหน่งกรรมการและโปรดิวเซอร์ของสมาคมสื่อมวลชนออนไลน์ ซึ่งตอกย้ำถึงความเป็นผู้นำที่พร้อมขับเคลื่อนทั้งวงการภาพยนตร์และเทคโนโลยีไปข้างหน้าอย่างไม่หยุดยั้ง",
    socials: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    }
  },
  {
    nameTH: "ไวแอตต์ มิตเชลล์",
    nameEN: "(Wyatt Mitchell)",
    role: "Co-Founder & Core Developer",
    image: "/images/Wyatt Mitchell (ไวแอตต์ มิตเชลล์)-optimized.webp",
    bio: "นักพัฒนาซอฟต์แวร์ฝีมือฉกาจและผู้ร่วมก่อตั้ง Blue Bird Pictures Studio ผู้เป็นกำลังสำคัญในการเขียนโปรแกรมและพัฒนาระบบหลักของปลั๊กอิน Blue Bird Composer Pro ส่งตรงจากฐานการทำงานที่แคลิฟอร์เนีย ประเทศสหรัฐอเมริกา (California, USA) ด้วยความเชี่ยวชาญด้านการเขียนโค้ดเชิงลึกและสถาปัตยกรรมซอฟต์แวร์ ไวแอตต์คือผู้อยู่เบื้องหลังการแปรเปลี่ยนไอเดียสุดล้ำให้กลายเป็นโปรแกรมที่ทรงพลังและใช้งานได้จริง เขามีความหลงใหลในการสร้างสรรค์เทคโนโลยีใหม่ๆ และมุ่งมั่นที่จะยกระดับมาตรฐานการผลิตงานเสียงและภาพยนตร์ให้ก้าวล้ำไปอีกขั้น",
    socials: {
      github: "#",
      linkedin: "#",
    }
  },
  {
    nameTH: "เร็น ทานากะ",
    nameEN: "(Ren Tanaka 蓮 田中)",
    role: "Co-Developer",
    image: "/images/เร็น (Ren  蓮) ทานากะ (Tanaka  田中)-optimized.webp",
    bio: "นักพัฒนาซอฟต์แวร์ฝีมือยอดเยี่ยมส่งตรงจากกรุงโตเกียว ประเทศญี่ปุ่น (Tokyo, Japan) อีกหนึ่ง 'ผู้ร่วมพัฒนา' (Co-Developer) คนสำคัญที่อยู่เบื้องหลังความสำเร็จของปลั๊กอิน Blue Bird Composer Pro ด้วยความเชี่ยวชาญและความละเอียดอ่อนสไตล์ญี่ปุ่นในการเขียนโปรแกรม เร็นได้นำเอาวิสัยทัศน์ทางเทคโนโลยีมาผสมผสานกับการแก้ปัญหาที่ซับซ้อนได้อย่างไร้ที่ติ เขาเป็นกำลังหลักในการผลักดันโค้ดทุกบรรทัดให้โปรแกรมมีประสิทธิภาพสูงสุด และเสถียรพอที่จะตอบโจทย์การใช้งานระดับมืออาชีพอย่างแท้จริง",
    socials: {
      github: "#",
      twitter: "#",
    }
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans">
      {/* Blurred Background Image (Optimized for performance) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: `url('/images/bg_optimized.webp')` }}
      />
      {/* Dark Overlay to make text readable */}
      <div className="absolute inset-0 z-0 bg-slate-950/80" />

      {/* Background Decorative Elements (Optimized with radial gradients instead of CSS blur) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-blue-500/5 to-transparent rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-cyan-500/5 to-transparent rounded-full pointer-events-none z-0" />

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-10 md:mb-14 relative"
        >
          {/* Header Glow (Optimized for performance) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-500/5 to-transparent pointer-events-none rounded-full" />
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 text-blue-400 text-lg md:text-xl lg:text-2xl font-bold tracking-[0.3em] uppercase drop-shadow-sm"
          >
            Meet the Visionaries
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans mb-2 font-medium drop-shadow-md">
            ทำความรู้จักกับ <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              ทีมงานของเรา
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed font-light mt-4 max-w-3xl mx-auto drop-shadow-sm">
            เบื้องหลัง <span className="text-blue-400 font-medium">Blue Bird Pictures Studio</span> คือกลุ่มคนที่มุ่งมั่นสร้างสรรค์เครื่องมือที่ดีที่สุด เพื่อช่วยให้งานตัดต่อและจัดการไฟล์ของคุณง่ายขึ้นกว่าที่เคย
          </p>
        </motion.div>

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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans italic text-slate-200 leading-relaxed drop-shadow-sm mb-8 whitespace-pre-line">
              เราไม่ได้แค่เขียนโค้ด แต่เรากำลังสร้างสะพาน<br />เชื่อมระหว่าง <span className="text-blue-400 font-normal not-italic">ศิลปะและเทคโนโลยี</span> ให้เป็นเรื่องเดียวกัน
            </h2>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-[2px] bg-blue-500 mb-2"></div>
              <p className="text-lg md:text-xl font-medium text-white">Kritsakorn Rattanapathumphong</p>
              <p className="text-sm md:text-base text-blue-300/80 uppercase tracking-widest">Founder & Lead Architect</p>
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
              {/* Image Section */}
              <div className={`w-full md:w-5/12 flex-shrink-0 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
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

              {/* Text Section */}
              <div className={`w-full md:w-7/12 pt-4 md:pt-8 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                <div className="flex flex-col h-full">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-2 font-sans drop-shadow-sm">
                    {member.nameTH}
                  </h2>
                  <h3 className="text-xl md:text-2xl font-normal text-slate-300 mb-6">
                    {member.nameEN}
                  </h3>
                  
                  <div className="flex flex-col gap-3 text-blue-400 mb-8">
                    <span className="h-[2px] w-12 bg-blue-500 block"></span>
                    <p className="text-sm md:text-base font-medium tracking-widest uppercase">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="text-slate-400 leading-relaxed text-base md:text-lg lg:text-xl font-light drop-shadow-sm indent-8 md:indent-10 text-left">
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
              ปรัชญาของเรา
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center px-4 md:px-0">
            {/* Phil 1 */}
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Target size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-wide">Precision</h3>
              <p className="text-slate-400 font-light leading-relaxed">ทุกบรรทัดของโค้ดและทุกรายละเอียดของระบบ ถูกออกแบบมาเพื่อความแม่นยำและเสถียรภาพสูงสุดสำหรับระดับมืออาชีพ</p>
            </div>
            
            {/* Phil 2 */}
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <Lightbulb size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-wide">Innovation</h3>
              <p className="text-slate-400 font-light leading-relaxed">เราไม่หยุดนิ่งที่จะค้นหาขีดจำกัดใหม่ ๆ เพื่อสร้างเครื่องมือที่ล้ำสมัยและตอบโจทย์อนาคตของการผลิตสื่อ</p>
            </div>
            
            {/* Phil 3 */}
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Zap size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-wide">Performance</h3>
              <p className="text-slate-400 font-light leading-relaxed">ประสิทธิภาพคือหัวใจสำคัญ ซอฟต์แวร์ของเราต้องทำงานรวดเร็ว ไร้รอยต่อ และไม่ขัดจังหวะความคิดสร้างสรรค์ของคุณ</p>
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
                <span>Core Architecture</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>Sound Engineering</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>Film Production</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>Advanced Coding</span>
                <span className="w-2 h-2 rounded-full bg-blue-500/20"></span>
                <span>Seamless UI</span>
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
              วิสัยทัศน์
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 font-light leading-relaxed drop-shadow-md font-sans px-4 max-w-4xl mx-auto [text-wrap:balance]">
              &quot;ที่ <strong className="font-medium text-white tracking-wide">Blue Bird Pictures Studio</strong> เราไม่หยุดที่จะค้นคว้าและพัฒนาเทคโนโลยีใหม่ ๆ เพื่อมอบประสบการณ์และเครื่องมือที่ยอดเยี่ยมที่สุดให้กับ<em className="italic text-slate-200 font-normal">นักสร้างสรรค์ทั่วโลก</em> เพราะเราเชื่อว่า <span className="text-blue-400 font-medium italic">ไอเดียที่ยิ่งใหญ่คู่ควรกับเครื่องมือที่ดีที่สุด</span>&quot;
            </p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
