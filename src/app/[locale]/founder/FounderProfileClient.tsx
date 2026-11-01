"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Film,
  Code2,
  Music,
  GraduationCap,
  Sparkles,
  Building2,
  ShieldCheck,
  Clapperboard,
  Users,
  Expand,
  X,
  Camera,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Headphones,
  Cpu,
  Layers,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/**
 * สามารถเปลี่ยน Path รูปโปรไฟล์หลัก หรือเพิ่มรูปภาพแกลเลอรีได้ที่นี่
 * โฟลเดอร์สำหรับวางรูปโปรไฟล์/เบื้องหลัง: public/images/founder/
 * โฟลเดอร์สำหรับวางรูปโปสเตอร์ภาพยนตร์: public/images/posters/
 */
const FOUNDER_MAIN_IMAGE =
  "/images/กฤศกร รัตนปทุมพงส์ KRITSAKORN RATTANAPATHUMPHONG-optimized.webp";

export interface FilmPosterItem {
  src: string;
  title: string;
  subtitle: string;
  badge: string;
  alt: string;
  isMain?: boolean;
}

/**
 * ชุดโปสเตอร์สารคดีเชิงภาพยนตร์ "4 จตุรเทพ ดาวประจำเมือง" (เวอร์ชันภาษาไทย 9 ใบ)
 * ตั้งชื่อไฟล์และ Alt Text ให้มีคำว่า "กฤศกร รัตนปทุมพงส์" เพื่อดันรูปขึ้น Google Images
 */
const FILM_POSTERS: FilmPosterItem[] = [
  {
    src: "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-ผู้กำกับ-กฤศกร-รัตนปทุมพงส์-main-th.jpg",
    title: "4 จตุรเทพ ดาวประจำเมือง",
    subtitle: "Official Main Poster (Thai Version)",
    badge: "MAIN POSTER • TH",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับภาพยนตร์ โปสเตอร์หลัก 4 จตุรเทพ ดาวประจำเมือง สารคดีเชิงภาพยนตร์",
    isMain: true,
  },
  {
    src: "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-โปสเตอร์-1-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "ตำบลดงขวาง อ.หนองขาหย่าง จ.อุทัยธานี",
    subtitle: "ความลับใต้กองเถ้าถ่าน กำลังจะถูกรื้อฟื้นขึ้นมาอีกครั้ง",
    badge: "CHAPTER POSTER 01",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์ตำบลดงขวาง อุทัยธานี",
  },
  {
    src: "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-โปสเตอร์-2-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "บ้านท่าโพ อ.หนองขาหย่าง จ.อุทัยธานี",
    subtitle: "ศรัทธาเหนือสายน้ำ นำพาวิถีแห่งปราชญ์ กลับคืนสู่แผ่นดิน",
    badge: "CHAPTER POSTER 02",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์บ้านท่าโพ อุทัยธานี",
  },
  {
    src: "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-โปสเตอร์-3-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "ตำบลดอนกลอย อ.หนองขาหย่าง จ.อุทัยธานี",
    subtitle: "เมื่อเสียงกระซิบจากผืนธรณี ปลุกวิถีแห่งบรรพชนให้ตื่นขึ้น",
    badge: "CHAPTER POSTER 03",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์ตำบลดอนกลอย อุทัยธานี",
  },
  {
    src: "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-โปสเตอร์-4-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "ตำบลหนองไผ่ อ.หนองขาหย่าง จ.อุทัยธานี",
    subtitle: "เสียงกระซิบจากเวหา จะนำพาศรัทธากลับคืนมา",
    badge: "CHAPTER POSTER 04",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์ตำบลหนองไผ่ อุทัยธานี",
  },
  {
    src: "/images/posters/1-เงาสะท้อนแห่งปาล์ม-4-จตุรเทพ-ดาวประจำเมือง-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "เงาสะท้อนแห่งปาล์ม",
    subtitle: "Character & Element Series I",
    badge: "ELEMENT SERIES 01",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์เงาสะท้อนแห่งปาล์ม",
  },
  {
    src: "/images/posters/2-รอยสักแห่งอัคคี-4-จตุรเทพ-ดาวประจำเมือง-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "รอยสักแห่งอัคคี",
    subtitle: "Character & Element Series II",
    badge: "ELEMENT SERIES 02",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์รอยสักแห่งอัคคี",
  },
  {
    src: "/images/posters/3-เงาพรายใต้น้ำ-4-จตุรเทพ-ดาวประจำเมือง-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "เงาพรายใต้น้ำ",
    subtitle: "Character & Element Series III",
    badge: "ELEMENT SERIES 03",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์เงาพรายใต้น้ำ",
  },
  {
    src: "/images/posters/4-เสียงกระซิบแห่งตำนาน-4-จตุรเทพ-ดาวประจำเมือง-กฤศกร-รัตนปทุมพงส์.jpg",
    title: "เสียงกระซิบแห่งตำนาน",
    subtitle: "Character & Element Series IV",
    badge: "ELEMENT SERIES 04",
    alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับ 4 จตุรเทพ ดาวประจำเมือง โปสเตอร์เสียงกระซิบแห่งตำนาน",
  },
];

export interface BehindTheScenesPhoto {
  src: string;
  title: string;
  subtitle: string;
  alt: string;
}

const BTS_PHOTOS: BehindTheScenesPhoto[] = [
  {
    src: "/images/founder/กฤศกร-รัตนปทุมพงส์-ผู้กำกับภาพยนตร์-เบื้องหลังกองถ่าย-2.jpg",
    title: "กฤศกร รัตนปทุมพงส์ — ผู้กำกับสารคดีเชิงภาพยนตร์ 4 จตุรเทพ ดาวประจำเมือง",
    subtitle: "Directing on Location • Uthai Thani Province",
    alt: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) ผู้กำกับภาพยนตร์ ถือสเลทในกองถ่ายสารคดีเชิงภาพยนตร์ 4 จตุรเทพ ดาวประจำเมือง",
  },
  {
    src: "/images/founder/กฤศกร-รัตนปทุมพงส์-ผู้กำกับภาพยนตร์-เบื้องหลังกองถ่าย-1.jpg",
    title: "เบื้องหลังการถ่ายทำร่วมกับทีมนักแสดงนำและทีมงานโปรดักชั่น",
    subtitle: "4 Elemental Guardians Production Crew & Cast",
    alt: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) ผู้กำกับและโปรดิวเซอร์ภาพยนตร์ ร่วมกับนักแสดงนำและทีมงานกองถ่าย 4 จตุรเทพ ดาวประจำเมือง",
  },
  {
    src: "/images/founder/กฤศกร-รัตนปทุมพงส์-สตูดิโอ-blue-bird-pictures-studio-production-suite.webp",
    title: "Blue Bird Pictures Studio — Production, Sound Engineering & Software Suite",
    subtitle: "Executive Producer, Sound Engineer & Lead Software Architect",
    alt: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) ผู้ก่อตั้ง Blue Bird Pictures Studio โปรดิวเซอร์ภาพยนตร์ ซาวด์เอนจิเนียร์ และห้องปฏิบัติการสตูดิโอ",
  },
];

export interface BrandPartner {
  id: string;
  name: string;
  subName: string;
  logoText: string;
  logo?: string;
  logoClassName?: string;
}

const BRAND_PARTNERS: BrandPartner[] = [
  {
    id: "gdh",
    name: "GDH",
    subName: "Film & Cinema Studio",
    logoText: "GDH",
    logo: "/images/brands/gdh.svg",
    logoClassName: "max-h-16",
  },
  {
    id: "boxx-music",
    name: "BOXX MUSIC",
    subName: "Music Label",
    logoText: "BOXX MUSIC",
    logo: "/images/brands/boxx-music.png",
    logoClassName: "max-h-20 scale-110",
  },
  {
    id: "yupp",
    name: "YUPP!",
    subName: "Music & Entertainment",
    logoText: "YUPP!",
    logo: "/images/brands/yupp.png",
    logoClassName: "max-h-16 invert",
  },
  {
    id: "osotspa",
    name: "โอสถสภา (Osotspa)",
    subName: "Enterprise & Commercial",
    logoText: "OSOTSPA",
    logo: "/images/brands/osotspa.svg",
    logoClassName: "max-h-14",
  },
  {
    id: "singha",
    name: "สิงห์ คอร์เปอเรชั่น",
    subName: "Singha Corporation",
    logoText: "SINGHA",
    logo: "/images/brands/singha.png",
    logoClassName: "max-h-16 scale-110",
  },
];

const SMOOTH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const THAI_MAIN_POSTER: FilmPosterItem = {
  src: "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-ผู้กำกับ-กฤศกร-รัตนปทุมพงส์-main-th.jpg",
  title: "4 จตุรเทพ ดาวประจำเมือง",
  subtitle: "Official Main Poster (Thai Version)",
  badge: "MAIN POSTER • TH",
  alt: "กฤศกร รัตนปทุมพงส์ ผู้กำกับภาพยนตร์ โปสเตอร์หลัก 4 จตุรเทพ ดาวประจำเมือง สารคดีเชิงภาพยนตร์",
  isMain: true,
};

export interface StudioGearItem {
  src: string;
  title: string;
  subtitle: string;
  badge: string;
  category: "interface" | "midi" | "monitors" | "workstation";
  alt: string;
}

const STUDIO_GEAR_ITEMS: StudioGearItem[] = [
  {
    src: "/images/gear/high-end-watercooled-pc-workstation.jpg",
    title: "High-End Custom Water-Cooled Workstation",
    subtitle: "เครื่องเวิร์กสเตชันตัดต่อและโปรดักชันระบบระบายความร้อนด้วยน้ำ ปรับแต่งพิเศษสำหรับงาน 4K Cinema / Audio Render",
    badge: "WORKSTATION RIG",
    category: "workstation",
    alt: "Custom Water-Cooled Workstation Blue Bird Pictures Studio กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/daw-audio-production-timeline.jpg",
    title: "Digital Audio Workstation (DAW) & Multi-Track Production",
    subtitle: "โปรเจกต์การเรียบเรียงดนตรีและวิศวกรรมเสียงสำหรับภาพยนตร์ บนระบบ DAW ระดับมืออาชีพ",
    badge: "DAW TIMELINE",
    category: "workstation",
    alt: "Digital Audio Workstation Multi-Track Project กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/focusrite-scarlett-interface-front.jpg",
    title: "Focusrite Scarlett Professional Audio Interface",
    subtitle: "ออดิโออินเตอร์เฟสคุณภาพสูงสำหรับงานบันทึกเสียงและมิกซ์มาสเตอร์ รองรับ 48V Phantom Power",
    badge: "AUDIO INTERFACE",
    category: "interface",
    alt: "Focusrite Scarlett Audio Interface Blue Bird Pictures Studio กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/focusrite-scarlett-audio-interface-angle.jpg",
    title: "Focusrite Scarlett Precision Preamps",
    subtitle: "ปรีแอมป์ระดับสตูดิโอ ถ่ายทอดสัญญาณเสียงที่สะอาด คมชัด และมีความเที่ยงตรงสูง",
    badge: "STUDIO PREAMP",
    category: "interface",
    alt: "Focusrite Scarlett Precision Preamps กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/analog-mixing-console-overview.jpg",
    title: "Professional Multitrack Mixing Console",
    subtitle: "มิกเซอร์อนาล็อกควบคุมระดับสัญญาณเสียง ปรับแต่ง Gain, EQ, และมิกซ์เสียงรอบทิศทาง",
    badge: "MIXING CONSOLE",
    category: "interface",
    alt: "Analog Multitrack Mixing Console กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/audio-mixer-eq-knobs-detail.jpg",
    title: "Analog Channel EQ & Parametric Knobs",
    subtitle: "การควบคุมความถี่เสียงระดับฮาร์ดแวร์ เพื่อปรับแต่งมิติและเนื้อเสียงให้กลมกล่อม",
    badge: "ANALOG EQ CONTROL",
    category: "interface",
    alt: "Analog Mixing Console EQ Knobs Detail กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/mackie-big-knob-studio-controller.jpg",
    title: "Mackie Big Knob Studio Monitor Controller",
    subtitle: "คอนโทรลเลอร์ควบคุมระบบมอนิเตอร์และเลือกต้นทางสัญญาณเสียงในห้องคอนโทรลรูม",
    badge: "MONITOR CONTROLLER",
    category: "interface",
    alt: "Mackie Big Knob Studio Controller กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/mackie-cr8-xbt-multimedia-monitors.jpg",
    title: "Mackie CR8-XBT Reference Studio Monitors",
    subtitle: "ลำโพงสตูดิโอมอนิเตอร์ขนาด 8 นิ้ว กำลังขับสูง ถ่ายทอดมิติเสียงเบสและย่านความถี่ต่ำได้แม่นยำ",
    badge: "8\" STUDIO MONITORS",
    category: "monitors",
    alt: "Mackie CR8-XBT Reference Studio Monitors กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/mackie-bluetooth-running-man.jpg",
    title: "Mackie Bluetooth Wireless Reference",
    subtitle: "ระบบเชื่อมต่อเสียงไร้สายความละเอียดสูง สำหรับตรวจสอบมิติเสียงบนอุปกรณ์ผู้ฟังจริง",
    badge: "WIRELESS MONITORING",
    category: "monitors",
    alt: "Mackie Bluetooth Wireless Reference Monitor กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/mackie-professional-headphones-setup.jpg",
    title: "Mackie Professional Studio Headphones Setup",
    subtitle: "หูฟังมอนิเตอร์ระดับโปรดักชันบนสแตนด์ พร้อมบรรยากาศแสงไฟสตูดิโอ",
    badge: "MONITOR HEADPHONES",
    category: "monitors",
    alt: "Mackie Professional Studio Headphones Setup กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/mackie-studio-headphones-closeup.jpg",
    title: "Mackie Acoustic Isolation Headphone Monitoring",
    subtitle: "ไดรเวอร์ขับเสียงคุณภาพสูง ให้ความเที่ยงตรงของสัญญาณเสียงสำหรับการมิกซ์และการแกะรายละเอียด",
    badge: "ACOUSTIC ISOLATION",
    category: "monitors",
    alt: "Mackie Studio Headphones Isolation Detail กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/studio-condenser-microphone.jpg",
    title: "Large-Diaphragm Studio Condenser Microphone",
    subtitle: "ไมโครโฟนคอนเดนเซอร์ไดอะแฟรมใหญ่บน Shockmount สำหรับอัดเสียงร้อง เครื่องดนตรี และพากย์เสียง",
    badge: "CONDENSER MIC",
    category: "monitors",
    alt: "Large-Diaphragm Studio Condenser Microphone กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/akg-professional-hard-case.jpg",
    title: "AKG Professional Audio Heavy-Duty Flight Case",
    subtitle: "กล่องนิรภัยระดับมืออาชีพสำหรับปกป้องไมโครโฟนและอุปกรณ์เสียงสำหรับการบันทึกเสียงนอกสถานที่",
    badge: "FLIGHT CASE",
    category: "monitors",
    alt: "AKG Professional Audio Flight Case กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/novation-launchkey-pads-keys.jpg",
    title: "Novation Launchkey Performance Controller",
    subtitle: "คีย์บอร์ดใบ้และแพด RGB สำหรับโปรแกรมกลอง บันทึก MIDI และการแสดงสด",
    badge: "MIDI CONTROLLER",
    category: "midi",
    alt: "Novation Launchkey Performance Controller กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/novation-launchkey-controller-detail.jpg",
    title: "Novation Launchkey Wheels & Navigation",
    subtitle: "วงล้อ Pitch Bend และ Modulation ควบคุมการเปลี่ยนระดับเสียงและไดนามิกของเครื่องดนตรี",
    badge: "DYNAMIC WHEELS",
    category: "midi",
    alt: "Novation Launchkey Wheels Detail กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/midi-keyboard-synthesizer.jpg",
    title: "Synthesizer & Harmonic Master Keyboard",
    subtitle: "คีย์บอร์ดสังเคราะห์เสียงและคีย์บอร์ดมาสเตอร์สำหรับประพันธ์เพลงและออกแบบเสียงประกอบภาพยนตร์",
    badge: "MASTER SYNTHESIZER",
    category: "midi",
    alt: "Synthesizer Harmonic Master Keyboard กฤศกร รัตนปทุมพงส์",
  },
  {
    src: "/images/gear/studio-power-ups-system.jpg",
    title: "Studio Pure Sine Wave UPS & Power Conditioning",
    subtitle: "ระบบจ่ายไฟสำรองและปรับแรงดันไฟฟ้าบริสุทธิ์ ป้องกันสัญญาณรบกวนในระบบเสียงและปกป้องฮาร์ดแวร์",
    badge: "CLEAN POWER SYSTEM",
    category: "workstation",
    alt: "Studio Pure Sine Wave UPS System กฤศกร รัตนปทุมพงส์",
  },
];

export default function FounderProfileClient() {
  const t = useTranslations("Founder");
  const posterTrackRef = useRef<HTMLDivElement>(null);
  const currentOffsetRef = useRef<number>(0);
  const targetBoostRef = useRef<number>(0);
  const speedFactorRef = useRef<number>(1);
  const isHoverPausedRef = useRef<boolean>(false);
  const [selectedPosterIndex, setSelectedPosterIndex] = useState<number | null>(
    null
  );
  const [selectedGearIndex, setSelectedGearIndex] = useState<number | null>(
    null
  );
  const [activeGearHoverIndex, setActiveGearHoverIndex] = useState<number | null>(
    null
  );
  const [isStudioHeroModalOpen, setIsStudioHeroModalOpen] = useState<boolean>(false);

  // Keyboard navigation for Lightbox modals (ESC to close, Left/Right arrow to cycle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStudioHeroModalOpen) {
        if (e.key === "Escape") {
          setIsStudioHeroModalOpen(false);
        }
      } else if (selectedGearIndex !== null) {
        if (e.key === "Escape") {
          setSelectedGearIndex(null);
        } else if (e.key === "ArrowLeft") {
          setSelectedGearIndex(
            (prev) =>
              prev === null
                ? null
                : (prev - 1 + STUDIO_GEAR_ITEMS.length) % STUDIO_GEAR_ITEMS.length
          );
        } else if (e.key === "ArrowRight") {
          setSelectedGearIndex(
            (prev) =>
              prev === null
                ? null
                : (prev + 1) % STUDIO_GEAR_ITEMS.length
          );
        }
      } else if (selectedPosterIndex !== null) {
        if (e.key === "Escape") {
          setSelectedPosterIndex(null);
        } else if (e.key === "ArrowLeft") {
          setSelectedPosterIndex(
            (prev) =>
              prev === null
                ? null
                : (prev - 1 + FILM_POSTERS.length) % FILM_POSTERS.length
          );
        } else if (e.key === "ArrowRight") {
          setSelectedPosterIndex(
            (prev) =>
              prev === null
                ? null
                : (prev + 1) % FILM_POSTERS.length
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGearIndex, selectedPosterIndex, isStudioHeroModalOpen]);

  // ระบบเลื่อนโปสเตอร์อัตโนมัติด้วย GPU Sub-pixel translate3d (ลื่นไหลระดับ 60-144fps ไม่กระตุก)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const track = posterTrackRef.current;
      if (track) {
        const shouldPause =
          isHoverPausedRef.current || selectedPosterIndex !== null;
        const targetSpeed = shouldPause ? 0 : 1;
        // ค่อย ๆ ชะลอและออกตัวแบบนุ่มนวล (Smooth Easing)
        speedFactorRef.current +=
          (targetSpeed - speedFactorRef.current) * Math.min(dt * 6, 1);

        const baseVelocityPxPerSec = 35;
        currentOffsetRef.current +=
          baseVelocityPxPerSec * speedFactorRef.current * dt;

        // กรณีกดปุ่มเลื่อนซ้าย-ขวา ให้ค่อย ๆ ไหลแบบนุ่มนวล
        if (Math.abs(targetBoostRef.current) > 0.1) {
          const boostStep = targetBoostRef.current * Math.min(dt * 9, 1);
          currentOffsetRef.current += boostStep;
          targetBoostRef.current -= boostStep;
        }

        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (currentOffsetRef.current >= halfWidth) {
            currentOffsetRef.current -= halfWidth;
          } else if (currentOffsetRef.current < 0) {
            currentOffsetRef.current += halfWidth;
          }
        }

        track.style.transform = `translate3d(${-currentOffsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedPosterIndex]);

  const scrollPosters = (direction: "left" | "right") => {
    const stepAmount = 370;
    targetBoostRef.current += direction === "left" ? -stepAmount : stepAmount;
  };

  const educationItems = [
    {
      tag: t("edu1Tag"),
      text: t("edu1"),
      icon: GraduationCap,
      logo: "/images/education/siam-university.png",
      logoAlt: "มหาวิทยาลัยสยาม (Siam University) - กฤศกร รัตนปทุมพงส์",
      highlight: true,
    },
    {
      tag: t("edu2Tag"),
      text: t("edu2"),
      icon: Code2,
      logo: "/images/education/siam-university.png",
      logoAlt: "มหาวิทยาลัยสยาม (Siam University) วิทยาการคอมพิวเตอร์ - กฤศกร รัตนปทุมพงส์",
      highlight: true,
    },
    {
      tag: t("edu3Tag"),
      text: t("edu3"),
      icon: Code2,
      logo: "/images/education/siam-tech.jpg",
      logoAlt: "วิทยาลัยเทคโนโลยีสยาม (Siam Technology College - สยามเทค) - กฤศกร รัตนปทุมพงส์",
      highlight: true,
    },
    {
      tag: t("edu4Tag"),
      text: t("edu4"),
      icon: Music,
      logo: "/images/education/wat-rai-khing-wittaya.jpg",
      logoAlt: "โรงเรียนวัดไร่ขิงวิทยา (ม.1–ม.3) - กฤศกร รัตนปทุมพงส์",
      highlight: false,
    },
    {
      tag: t("edu5Tag"),
      text: t("edu5"),
      icon: Music,
      logo: "/images/education/wat-rai-khing-sunthorn.jpg",
      logoAlt: "โรงเรียนวัดไร่ขิง (สุนทรอุทิศ) (ป.3–ป.6) - กฤศกร รัตนปทุมพงส์",
      highlight: false,
    },
    {
      tag: t("edu6Tag"),
      text: t("edu6"),
      icon: Music,
      logo: "/images/education/nakprasith.png",
      logoAlt: "โรงเรียนนาคประสิทธิ์ (อ.1–ป.2) - กฤศกร รัตนปทุมพงส์",
      highlight: false,
    },
  ];

  const roleCards = [
    {
      icon: Film,
      title: t("role1Title"),
      desc: t("role1Desc"),
      accent: "blue" as const,
    },
    {
      icon: Code2,
      title: t("role2Title"),
      desc: t("role2Desc"),
      accent: "cyan" as const,
    },
    {
      icon: ShieldCheck,
      title: t("role3Title"),
      desc: t("role3Desc"),
      accent: "blue" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans">
      {/* Fixed Subtle Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('/images/bg_optimized.webp')` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-blue-500/5 to-transparent rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-cyan-500/5 to-transparent rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        {/* Semantic Breadcrumb Navigation with Entrance Motion */}
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SMOOTH_EASE }}
          aria-label="Breadcrumb"
          className="mb-6 flex items-center justify-between flex-wrap gap-3"
        >
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>{t("backToTeam")}</span>
          </Link>

          <ol className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Blue Bird Pictures Studio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/team"
                className="hover:text-slate-300 transition-colors"
              >
                Team
              </Link>
            </li>
            <li>/</li>
            <li className="text-blue-400 font-medium" aria-current="page">
              กฤศกร รัตนปทุมพงส์
            </li>
          </ol>
        </motion.nav>

        <article
          itemScope
          itemType="https://schema.org/Person"
          className="space-y-14"
        >
          {/* 1. HERO BIOGRAPHY SECTION: Flush Top & Bottom Alignment (items-stretch) */}
          <section
            id="biography"
            aria-labelledby="founder-heading"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
          >
            {/* Left Column: Portrait Image (Pop-up Spring Entrance) */}
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: SMOOTH_EASE }}
              className="lg:col-span-5 w-4/5 sm:w-2/3 lg:w-full mx-auto flex"
            >
              <div className="relative group w-full flex-1 flex">
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-transparent rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                <figure className="relative w-full aspect-[4/5] lg:aspect-auto lg:min-h-[460px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                  <img
                    itemProp="image"
                    src={FOUNDER_MAIN_IMAGE}
                    alt={t("imageAlt")}
                    title="กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) — ผู้กำกับภาพยนตร์ โปรดิวเซอร์ และผู้ก่อตั้ง Blue Bird Pictures Studio"
                    loading="eager"
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent pointer-events-none" />

                  {/* Bottom Badge Overlay */}
                  <figcaption className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                    <p
                      itemProp="worksFor"
                      className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase"
                    >
                      Blue Bird Pictures Studio
                    </p>
                    <p className="text-sm text-slate-200 font-medium mt-0.5">
                      กฤศกร รัตนปทุมพงส์ • Founder, Film Director & Lead Architect
                    </p>
                  </figcaption>
                </figure>
              </div>
            </motion.div>

            {/* Right Column: H1, Subtitle, Paragraph 1 (Staggered Cascade Pop-up) */}
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: SMOOTH_EASE }}
              className="lg:col-span-7 flex flex-col justify-between bg-slate-900/30 border border-slate-800/70 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: SMOOTH_EASE }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase w-fit mb-5"
                >
                  <Sparkles size={14} />
                  <span>{t("badge")}</span>
                </motion.div>

                {/* SEO H1 */}
                <motion.h1
                  id="founder-heading"
                  itemProp="name"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: SMOOTH_EASE }}
                  className="font-bold text-white tracking-tight leading-[1.2] mb-4"
                >
                  {t("h1").includes("(") ? (
                    <>
                      <span className="block text-3xl sm:text-4xl lg:text-5xl mb-2">
                        {t("h1").slice(0, t("h1").indexOf("(")).trim()}
                      </span>
                      <span className="block text-xl sm:text-2xl font-normal text-slate-300">
                        {t("h1").slice(t("h1").indexOf("("))}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl sm:text-4xl lg:text-5xl">
                      {t("h1")}
                    </span>
                  )}
                </motion.h1>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.36, ease: SMOOTH_EASE }}
                  className="mb-6"
                >
                  <span className="h-[2px] w-12 bg-blue-500 block mb-3" />
                  <p
                    itemProp="jobTitle"
                    className="text-sm sm:text-base font-medium text-blue-400 tracking-[0.15em] uppercase"
                  >
                    {t("subtitle")}
                  </p>
                </motion.div>
              </div>

              {/* Section 1 Label + SEO Paragraph 1 */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44, ease: SMOOTH_EASE }}
                className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-inner"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 mb-2.5">
                  {t("section1Label")}
                </div>
                <p
                  itemProp="description"
                  className="text-slate-200 text-base sm:text-lg leading-relaxed sm:leading-loose font-light"
                >
                  {t("paragraph1")}
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* 2. FULL-WIDTH KEY ROLES ROW (Staggered Pop-Up Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roleCards.map((card, idx) => {
              const IconComp = card.icon;
              const isCyan = card.accent === "cyan";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 28, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    transition: { duration: 0.2, delay: 0, ease: "easeOut" },
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.5 + idx * 0.1,
                    ease: SMOOTH_EASE,
                  }}
                  className={`p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 ${
                    isCyan
                      ? "hover:border-cyan-500/40"
                      : "hover:border-blue-500/40"
                  } transition-colors flex items-start gap-4 shadow-lg`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                      isCyan
                        ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400"
                        : "bg-blue-500/10 border-blue-500/25 text-blue-400"
                    }`}
                  >
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 3. H2: EDUCATION & MUSICAL BACKGROUND SECTION */}
          <motion.section
            id="education-background"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, ease: SMOOTH_EASE }}
            className="relative rounded-3xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                <Award size={16} />
                <span>Academic Excellence & Musical Roots</span>
              </div>

              {/* SEO H2 */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-snug">
                {t("h2Education")}
              </h2>

              {/* Education Intro Paragraph */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed sm:leading-loose font-light mb-10">
                {t("educationIntro")}
              </p>
            </div>

            {/* Semantic UL/LI for Google Bot Entity Extraction */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {educationItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.li
                    key={idx}
                    itemProp="alumniOf"
                    itemScope
                    itemType="https://schema.org/EducationalOrganization"
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{
                      y: -4,
                      transition: { duration: 0.2, delay: 0, ease: "easeOut" },
                    }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.08,
                      ease: SMOOTH_EASE,
                    }}
                    className="group relative rounded-2xl p-6 bg-slate-900/60 hover:bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 transition-colors duration-200 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-default"
                  >
                    <div className="flex items-center sm:items-start gap-4 sm:gap-5">
                      {item.logo ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 border border-slate-200/90 shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            itemProp="image"
                            src={item.logo}
                            alt={item.logoAlt}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-md bg-blue-500/15 border-blue-500/30 text-blue-400">
                          <IconComponent size={32} />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-400">
                          {item.tag}
                        </span>
                        <p itemProp="description" className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.section>

          {/* 4. BRAND COLLABORATIONS & WORK EXPERIENCE SHOWCASE */}
          <motion.section
            id="brand-collaborations"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, ease: SMOOTH_EASE }}
            className="relative rounded-3xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  <Building2 size={15} />
                  <span>SELECTED PROJECTS & CLIENTS</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {t("brandsLabel")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {BRAND_PARTNERS.map((brand, idx) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 26, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2, delay: 0, ease: "easeOut" },
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.08,
                    ease: SMOOTH_EASE,
                  }}
                  className="group relative rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 p-5 flex flex-col items-center justify-between text-center transition-colors shadow-lg"
                >
                  {/* Logo Slot */}
                  <div className="w-full h-24 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center p-3 mb-4 transition-all overflow-hidden shadow-sm">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={`${brand.name} - ร่วมงานกับ กฤศกร รัตนปทุมพงส์`}
                        className={`max-w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                          brand.logoClassName || "max-h-14"
                        }`}
                      />
                    ) : (
                      <span className="font-k2d font-extrabold text-lg sm:text-xl tracking-wider text-slate-900">
                        {brand.logoText}
                      </span>
                    )}
                  </div>

                  {/* Brand Name & Category */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-light">
                      {brand.subName}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 5. LUXURY CINEMA SHOWCASE: 4 จตุรเทพ ดาวประจำเมือง (DOCUMENTARY FILM • DIRECTOR) */}
          <motion.section
            id="directing-filmography"
            itemScope
            itemType="https://schema.org/Movie"
            initial={{ opacity: 0, y: 45, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.8, ease: SMOOTH_EASE }}
            className="relative rounded-3xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-10 lg:p-12 pb-8 sm:pb-10 shadow-2xl overflow-hidden"
          >
            {/* Subtle Studio Blue Ambient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Top Section Header */}
            <div className="relative z-10 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                <Clapperboard size={15} />
                <span>{t("filmBadge")}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {t("h2Directing")}
              </h2>
            </div>

            {/* Main Thai Poster + Film Credits Overview */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Main Thai Poster */}
              <div className="lg:col-span-5 w-4/5 sm:w-2/3 lg:w-full max-w-sm mx-auto">
                <motion.figure
                  initial={{ opacity: 0, y: 30, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    ease: SMOOTH_EASE,
                  }}
                  onClick={() => setSelectedPosterIndex(0)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-950 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950">
                    <img
                      itemProp="image"
                      src={THAI_MAIN_POSTER.src}
                      alt={THAI_MAIN_POSTER.alt}
                      title={THAI_MAIN_POSTER.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-950/80 border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Expand size={15} />
                  </div>
                  <figcaption className="sr-only">
                    {THAI_MAIN_POSTER.title} — {THAI_MAIN_POSTER.subtitle}
                  </figcaption>
                </motion.figure>
              </div>

              {/* Right: Film Synopsis & Credits */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: 0.2, ease: SMOOTH_EASE }}
                className="lg:col-span-7 space-y-6"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-1">
                    4 ELEMENTAL GUARDIANS : STARS OF THE CITY
                  </div>
                  <h3
                    itemProp="name"
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight mb-2"
                  >
                    {t("filmTitle")}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-blue-300">
                    {t("filmSubtitle")}
                  </p>
                </div>

                <p
                  itemProp="description"
                  className="text-slate-200 text-base sm:text-lg leading-relaxed sm:leading-loose font-light"
                >
                  {t("filmDesc")}
                </p>

                <div className="grid grid-cols-1 gap-4 pt-1">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1.5">
                      <Users size={14} />
                      <span>{t("filmCastLabel")}</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                      {t("filmCastValue")}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1.5">
                      <Award size={14} />
                      <span>{t("filmProducerLabel")}</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                      {t("filmProducerValue")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Standard Subtle Divider */}
            <div className="relative z-10 my-10 sm:my-12 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            {/* Poster Carousel Showcase Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 block mb-1">
                  OFFICIAL POSTER COLLECTION (9 POSTERS)
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  แกลเลอรีโปสเตอร์ภาพยนตร์ชุดพิเศษ (เลื่อนอัตโนมัติ หรือคลิกเพื่อดูภาพขนาดเต็ม)
                </h3>
              </div>

              {/* Prev / Next Manual Scroll Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => scrollPosters("left")}
                  aria-label="เลื่อนโปสเตอร์ไปทางซ้าย"
                  className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPosters("right")}
                  aria-label="เลื่อนโปสเตอร์ไปทางขวา"
                  className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Ultra Smooth Seamless Infinite Horizontal Carousel with Large Majestic Posters */}
            <div
              className="relative z-10 -mx-6 sm:-mx-10 lg:-mx-12 overflow-hidden pt-2 pb-2"
              onMouseEnter={() => {
                isHoverPausedRef.current = true;
              }}
              onMouseLeave={() => {
                isHoverPausedRef.current = false;
              }}
              onTouchStart={() => {
                isHoverPausedRef.current = true;
              }}
              onTouchEnd={() => {
                isHoverPausedRef.current = false;
              }}
            >
              {/* Seamless Duplicated Track for Silky Smooth Infinite Crawl */}
              <div
                ref={posterTrackRef}
                className="flex items-center gap-6 sm:gap-7 will-change-transform pl-6 sm:pl-10 lg:pl-12 py-1"
                style={{ width: "max-content" }}
              >
                {[...FILM_POSTERS, ...FILM_POSTERS].map((poster, idx) => {
                  const originalIndex = idx % FILM_POSTERS.length;
                  return (
                    <div
                      key={`${poster.src}-${idx}`}
                      onClick={() => setSelectedPosterIndex(originalIndex)}
                      className="group relative w-[220px] sm:w-[270px] md:w-[320px] lg:w-[350px] aspect-[2/3] flex-shrink-0 rounded-2xl overflow-hidden bg-slate-950 transition-transform duration-300 cursor-pointer select-none"
                    >
                      <img
                        src={poster.src}
                        alt={poster.alt}
                        title={poster.alt}
                        loading="lazy"
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Subtle hover gradient and expand pill */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-slate-900/90 border border-white/20 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <Expand size={20} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* 6. BEHIND THE SCENES & PRODUCTION GALLERY SECTION */}
          <motion.section
            id="gallery"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.75, ease: SMOOTH_EASE }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  <Camera size={15} />
                  <span>BEHIND THE SCENES & PRODUCTION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {t("galleryTitle")}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mt-1">
                  {t("gallerySubtitle")}
                </p>
              </div>
            </div>

            {/* Top 2 On-Location Directing Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BTS_PHOTOS.slice(0, 2).map((photo, idx) => (
                <motion.figure
                  key={photo.src}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.12,
                    ease: SMOOTH_EASE,
                  }}
                  className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl aspect-[16/10]"
                >
                  <img
                    itemProp="image"
                    src={photo.src}
                    alt={photo.alt}
                    title={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                  <figcaption className="absolute bottom-4 left-5 right-5">
                    <p className="text-sm sm:text-base font-semibold text-white drop-shadow">
                      {photo.title}
                    </p>
                    <span className="text-xs text-amber-300 uppercase tracking-widest block mt-0.5">
                      {photo.subtitle}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </motion.section>

          {/* 7. PRO STUDIO & PRODUCTION GEAR (FULL-BLEED IMMERSIVE STUDIO BACKGROUND - NOT IN A BOX) */}
          <section
            id="studio-gear"
            className="relative w-screen left-1/2 -translate-x-1/2 mt-16 pt-24 sm:pt-36 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 overflow-hidden select-none min-h-[1050px] lg:min-h-[1200px] flex flex-col justify-end"
          >
            {/* Grand Studio Background Image (Shifted up high so face and screens are 100% clear above text) */}
            <div className="absolute -top-40 sm:-top-60 lg:-top-80 inset-x-0 -bottom-24 sm:-bottom-32 -z-10 pointer-events-none overflow-hidden">
              <img
                src={BTS_PHOTOS[2].src}
                alt={BTS_PHOTOS[2].alt}
                title={BTS_PHOTOS[2].alt}
                className="w-full h-full object-cover object-[center_75%] sm:object-[center_70%] opacity-90 filter brightness-95 contrast-105 transform -translate-y-28 sm:-translate-y-40 lg:-translate-y-52"
              />
              {/* Soft Ambient Radial Overlay */}
              <div className="absolute inset-0 bg-radial-at-t from-transparent via-slate-950/20 to-slate-950/70 pointer-events-none" />
            </div>

            {/* Seamless Top Edge Fade (Eliminates any hard cut line, 100% smooth blend) */}
            <div className="absolute top-0 inset-x-0 h-48 sm:h-64 lg:h-80 bg-gradient-to-b from-slate-950 via-slate-950/85 to-transparent pointer-events-none z-10" />

            {/* Soft Legibility Dark Gradient Band (User-requested subtle black fade rising up behind text zone) */}
            <div className="absolute inset-x-0 bottom-0 top-[33%] sm:top-[31%] lg:top-[29%] bg-gradient-to-t from-slate-950 via-slate-950/75 via-45% to-transparent pointer-events-none z-10" />

            {/* Seamless Bottom Edge Fade (Smooth blend into footer) */}
            <div className="absolute bottom-0 inset-x-0 h-32 sm:h-44 lg:h-56 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none z-10" />

            {/* Overlaid Section Content (Brought down, no dark box covering face) */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-5 sm:space-y-6">
              {/* Centered Clean Header (No box/frame, clean floating typography) */}
              <div className="text-center max-w-3xl mx-auto space-y-2.5">
                <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400/40 shadow-xl backdrop-blur-sm">
                  <Sliders size={14} />
                  <span>{t("gearBadge")}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                  {t("gearTitle")}
                </h2>
                <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  {t("gearSubtitle")}
                </p>

                {/* Centered Button to open full studio modal */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsStudioHeroModalOpen(true)}
                    aria-label="เปิดดูภาพห้องสตูดิโอขนาดเต็ม"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-xl"
                  >
                    <Expand size={13} className="text-cyan-400" />
                    <span>ดูภาพห้องสตูดิโอขนาดเต็ม</span>
                  </button>
                </div>
              </div>

              {/* Bottom: Vertical Accordion Strips Container */}
              <div
                className="relative w-full h-[320px] sm:h-[360px] lg:h-[400px] flex items-stretch gap-1 sm:gap-1.5 lg:gap-2 rounded-3xl bg-slate-950/80 border border-slate-800/90 p-2 sm:p-2.5 lg:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-x-auto lg:overflow-hidden select-none scrollbar-thin scrollbar-thumb-slate-800"
                onMouseLeave={() => setActiveGearHoverIndex(null)}
              >
              {STUDIO_GEAR_ITEMS.map((gear, idx) => {
                const isHovered = activeGearHoverIndex === idx;
                const isAnyHovered = activeGearHoverIndex !== null;

                return (
                  <div
                    key={gear.src}
                    data-gear-index={idx}
                    onMouseEnter={() => setActiveGearHoverIndex(idx)}
                    onPointerEnter={() => setActiveGearHoverIndex(idx)}
                    onTouchStart={() => setActiveGearHoverIndex(idx)}
                    onClick={() => setSelectedGearIndex(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedGearIndex(idx);
                      }
                    }}
                    aria-label={`${gear.title} - คลิกเพื่อดูรูปขนาดเต็ม`}
                    className={`group relative h-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isHovered
                        ? "flex-[7] lg:flex-[8] min-w-[280px] sm:min-w-[360px] lg:min-w-0 border-2 border-cyan-400/90 shadow-[0_0_35px_rgba(6,182,212,0.4)] z-20"
                        : isAnyHovered
                        ? "flex-[0.35] min-w-[32px] sm:min-w-[40px] lg:min-w-0 border border-slate-800/50 opacity-45 brightness-75 hover:opacity-85 z-10"
                        : "flex-1 min-w-[38px] sm:min-w-[48px] lg:min-w-0 border border-slate-800/80 hover:border-slate-700 opacity-90 hover:opacity-100 z-10"
                    }`}
                  >
                    {/* Background Image (Black & White by default, color on hover) */}
                    <img
                      src={gear.src}
                      alt={gear.alt}
                      title={gear.title}
                      loading="lazy"
                      draggable={false}
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                        isHovered
                          ? "grayscale-0 contrast-100 brightness-100"
                          : "grayscale contrast-115 brightness-90"
                      }`}
                    />

                    {/* Gradient Overlays */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                        isHovered
                          ? "bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent opacity-90"
                          : "bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-50"
                      }`}
                    />

                    {/* Collapsed / Strip Number Badge (Visible on non-hovered slices) */}
                    <div
                      className={`absolute top-3 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${
                        isHovered ? "opacity-0" : "opacity-70 group-hover:opacity-100"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-semibold text-slate-400/80 block">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Expanded Content Overlay (Slides up on hover) */}
                    <div
                      className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 transition-all duration-400 pointer-events-none ${
                        isHovered
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase block mb-0.5">
                            {gear.badge} • #{idx + 1}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">
                            {gear.title}
                          </h3>
                          <p className="text-xs text-slate-300 font-light truncate mt-0.5 hidden sm:block">
                            {gear.subtitle}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow">
                          <Expand size={15} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </section>
        </article>
      </main>

      {/* Fullscreen Poster Lightbox Modal with Spring Pop-Up Animation */}
      <AnimatePresence>
        {selectedPosterIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedPosterIndex(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedPosterIndex(null)}
              aria-label="ปิดหน้าต่างแสดงโปสเตอร์"
              className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* Previous Poster Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPosterIndex(
                  (selectedPosterIndex - 1 + FILM_POSTERS.length) %
                    FILM_POSTERS.length
                );
              }}
              aria-label="โปสเตอร์ก่อนหน้า"
              className="fixed left-3 sm:left-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-slate-500 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Poster Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPosterIndex(
                  (selectedPosterIndex + 1) % FILM_POSTERS.length
                );
              }}
              aria-label="โปสเตอร์ถัดไป"
              className="fixed right-3 sm:right-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-slate-500 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              key={selectedPosterIndex}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              className="relative max-w-xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={FILM_POSTERS[selectedPosterIndex].src}
                alt={FILM_POSTERS[selectedPosterIndex].alt}
                className="max-h-[82vh] w-auto rounded-2xl shadow-2xl shadow-black object-contain"
              />
              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {selectedPosterIndex + 1} / {FILM_POSTERS.length}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {FILM_POSTERS[selectedPosterIndex].title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {FILM_POSTERS[selectedPosterIndex].subtitle}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Gear Lightbox Modal */}
      <AnimatePresence>
        {selectedGearIndex !== null && STUDIO_GEAR_ITEMS[selectedGearIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedGearIndex(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedGearIndex(null)}
              aria-label="ปิดหน้าต่างแสดงอุปกรณ์"
              className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* Previous Gear Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGearIndex(
                  (selectedGearIndex - 1 + STUDIO_GEAR_ITEMS.length) %
                    STUDIO_GEAR_ITEMS.length
                );
              }}
              aria-label="อุปกรณ์ก่อนหน้า"
              className="fixed left-3 sm:left-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-cyan-500 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Gear Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGearIndex(
                  (selectedGearIndex + 1) % STUDIO_GEAR_ITEMS.length
                );
              }}
              aria-label="อุปกรณ์ถัดไป"
              className="fixed right-3 sm:right-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-cyan-500 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            {/* Gear Modal Content */}
            <motion.div
              key={selectedGearIndex}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.3, ease: SMOOTH_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl backdrop-blur-md"
            >
              <div className="relative w-full max-h-[65vh] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
                <img
                  src={STUDIO_GEAR_ITEMS[selectedGearIndex].src}
                  alt={STUDIO_GEAR_ITEMS[selectedGearIndex].alt}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Gear Caption & Details */}
              <div className="w-full mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div>
                  <div className="inline-block text-[10px] font-bold tracking-widest text-cyan-400 uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 mb-1.5">
                    {STUDIO_GEAR_ITEMS[selectedGearIndex].badge}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {STUDIO_GEAR_ITEMS[selectedGearIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                    {STUDIO_GEAR_ITEMS[selectedGearIndex].subtitle}
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono flex-shrink-0 self-end sm:self-center">
                  {selectedGearIndex + 1} / {STUDIO_GEAR_ITEMS.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Fullscreen Studio Hero Modal */}
      <AnimatePresence>
        {isStudioHeroModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsStudioHeroModalOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsStudioHeroModalOpen(false)}
              aria-label="ปิดหน้าต่างแสดงภาพห้องสตูดิโอ"
              className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.3, ease: SMOOTH_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl backdrop-blur-md"
            >
              <div className="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
                <img
                  src={BTS_PHOTOS[2].src}
                  alt={BTS_PHOTOS[2].alt}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              <div className="w-full mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div>
                  <div className="inline-block text-[10px] font-bold tracking-widest text-cyan-400 uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 mb-1.5">
                    BLUE BIRD PICTURES STUDIO SUITE
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {BTS_PHOTOS[2].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                    {BTS_PHOTOS[2].subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
