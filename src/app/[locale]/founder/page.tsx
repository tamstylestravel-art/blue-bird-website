import React from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FounderProfileClient from "./FounderProfileClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bluebirdpicturesstudio.com";

const FOUNDER_MAIN_IMAGE =
  "/images/กฤศกร รัตนปทุมพงส์ KRITSAKORN RATTANAPATHUMPHONG-optimized.webp";

const MAIN_POSTER_TH =
  "/images/posters/4-จตุรเทพ-ดาวประจำเมือง-ผู้กำกับ-กฤศกร-รัตนปทุมพงส์-main-th.jpg";

const MAIN_POSTER_EN =
  "/images/posters/four-elemental-guardians-4-จตุรเทพ-ดาวประจำเมือง-กฤศกร-รัตนปทุมพงส์-main-en.jpg";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Founder" });

  const title = t("metaTitle");
  const description = t("metaDescription");
  const imageAlt = t("imageAlt");

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    authors: [
      {
        name: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong)",
        url: `${BASE_URL}/${locale}/founder`,
      },
    ],
    creator: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong)",
    publisher: "Blue Bird Pictures Studio",
    keywords: [
      "กฤศกร รัตนปทุมพงส์",
      "ใหม่ กฤศกร",
      "ใหม่ กฤศกร รัตนปทุมพงส์",
      "Kritsakorn Rattanapathumphong",
      "Blue Bird Pictures Studio",
      "Blue Bird Composer Pro",
      "ผู้กำกับภาพยนตร์",
      "โปรดิวเซอร์ภาพยนตร์",
      "ซาวด์เอนจิเนียร์",
      "4 จตุรเทพ ดาวประจำเมือง",
      "จตุรเทพดาวประจำเมือง",
      "4 Elemental Guardians",
      "Four Elemental Guardians",
      "สารคดีเชิงภาพยนตร์",
      "Film Director",
      "Film Producer",
      "Sound Engineer",
      "Lead Software Architect",
      "มหาวิทยาลัยสยาม",
      "วิทยาการคอมพิวเตอร์",
      "วิทยาลัยเทคโนโลยีสยาม",
      "สยามเทค",
      "SIAM TECHNOLOGY COLLEGE",
      "โรงเรียนวัดไร่ขิงวิทยา",
      "โรงเรียนวัดไร่ขิง (สุนทรอุทิศ)",
      "โรงเรียนนาคประสิทธิ์",
      "สมาคมสื่อมวลชนออนไลน์",
    ],
    alternates: {
      canonical: `/${locale}/founder`,
      languages: {
        th: "/th/founder",
        en: "/en/founder",
        ja: "/ja/founder",
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/founder`,
      siteName: "Blue Bird Pictures Studio",
      locale: locale === "th" ? "th_TH" : locale === "ja" ? "ja_JP" : "en_US",
      type: "profile",
      firstName: "Kritsakorn",
      lastName: "Rattanapathumphong",
      images: [
        {
          url: FOUNDER_MAIN_IMAGE,
          alt: imageAlt,
        },
        {
          url: MAIN_POSTER_TH,
          alt: "4 จตุรเทพ ดาวประจำเมือง - สารคดีเชิงภาพยนตร์ จากผู้กำกับ กฤศกร รัตนปทุมพงส์",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [FOUNDER_MAIN_IMAGE],
    },
  };
}

export default async function FounderPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const pageUrl = `${BASE_URL}/${locale}/founder`;
  const personId = `${BASE_URL}/#kritsakorn-rattanapathumphong`;
  const movieId = `${BASE_URL}/#4-jaturathep-dao-prajam-mueang`;

  // โค้ด JSON-LD Schema Markup (@graph) สำหรับ Google Indexing, ProfilePage Rich Results, Google Images & Knowledge Panel
  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        name: "ประวัติ กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) | Blue Bird Pictures Studio",
        inLanguage: locale,
        mainEntity: {
          "@id": personId,
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "กฤศกร รัตนปทุมพงส์",
        alternateName: [
          "Kritsakorn Rattanapathumphong",
          "ใหม่ กฤศกร",
          "ใหม่ กฤศกร รัตนปทุมพงส์",
        ],
        url: pageUrl,
        image: [
          {
            "@type": "ImageObject",
            url: `${BASE_URL}${FOUNDER_MAIN_IMAGE}`,
            name: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) ผู้กำกับภาพยนตร์ โปรดิวเซอร์ และผู้ก่อตั้ง Blue Bird Pictures Studio",
            caption:
              "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong) — Founder, Film Director, Producer & Lead Software Architect",
          },
          {
            "@type": "ImageObject",
            url: `${BASE_URL}/images/founder/กฤศกร-รัตนปทุมพงส์-ผู้กำกับภาพยนตร์-เบื้องหลังกองถ่าย-1.jpg`,
            name: "กฤศกร รัตนปทุมพงส์ ผู้กำกับภาพยนตร์ เบื้องหลังกองถ่ายสารคดีเชิงภาพยนตร์ 4 จตุรเทพ ดาวประจำเมือง",
            caption:
              "กฤศกร รัตนปทุมพงส์ และทีมนักแสดงนำ-ทีมงาน เบื้องหลังการถ่ายทำสารคดีเชิงภาพยนตร์ 4 จตุรเทพ ดาวประจำเมือง",
          },
          {
            "@type": "ImageObject",
            url: `${BASE_URL}/images/founder/กฤศกร-รัตนปทุมพงส์-ผู้กำกับภาพยนตร์-เบื้องหลังกองถ่าย-2.jpg`,
            name: "กฤศกร รัตนปทุมพงส์ ผู้กำกับสารคดีเชิงภาพยนตร์ 4 จตุรเทพ ดาวประจำเมือง",
            caption:
              "กฤศกร รัตนปทุมพงส์ ถือสเลทกำกับภาพยนตร์ร่วมกับนักแสดงและชาวบ้านในกองถ่าย 4 จตุรเทพ ดาวประจำเมือง",
          },
        ],
        jobTitle: [
          "Founder",
          "Film Director",
          "Film Producer",
          "Sound Engineer",
          "Lead Software Architect (Blue Bird Composer Pro)",
        ],
        description:
          "ประวัติ กฤศกร รัตนปทุมพงส์ ผู้กำกับภาพยนตร์ โปรดิวเซอร์ภาพยนตร์ ซาวด์เอนจิเนียร์ และผู้พัฒนาปลั๊กอิน Blue Bird Composer Pro ผู้กำกับสารคดีเชิงภาพยนตร์ 4 จตุรเทพ ดาวประจำเมือง ดีกรีปริญญาตรีเกียรตินิยมอันดับ 1 สองสาขา (ภาพยนตร์ ม.สยาม และวิทยาการคอมพิวเตอร์)",
        worksFor: {
          "@type": "Organization",
          name: "Blue Bird Pictures Studio",
          url: BASE_URL,
        },
        memberOf: {
          "@type": "Organization",
          name: "สมาคมสื่อมวลชนออนไลน์",
        },
        alumniOf: [
          {
            "@type": "CollegeOrUniversity",
            name: "มหาวิทยาลัยสยาม (Siam University)",
            department:
              "นิเทศศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) สาขาวิชาภาพยนตร์ โทรทัศน์ และสื่อดิจิทัล",
            description:
              "นิเทศศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) สาขาวิชาภาพยนตร์ โทรทัศน์ และสื่อดิจิทัล มหาวิทยาลัยสยาม",
          },
          {
            "@type": "CollegeOrUniversity",
            name: "มหาวิทยาลัยสยาม (Siam University)",
            department:
              "วิทยาศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) สาขาวิชาวิทยาการคอมพิวเตอร์",
            description:
              "วิทยาศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสยาม",
          },
          {
            "@type": "EducationalOrganization",
            name: "วิทยาลัยเทคโนโลยีสยาม (SIAM TECHNOLOGY COLLEGE - สยามเทค)",
            department:
              "ประกาศนียบัตรวิชาชีพ (ปวช.) สาขาวิชาคอมพิวเตอร์ธุรกิจ",
            description:
              "สำเร็จการศึกษาระดับประกาศนียบัตรวิชาชีพ สาขาวิชาคอมพิวเตอร์ธุรกิจ วิทยาลัยเทคโนโลยีสยาม (สยามเทค)",
          },
          {
            "@type": "EducationalOrganization",
            name: "โรงเรียนวัดไร่ขิงวิทยา",
            description:
              "ศึกษาระดับชั้นมัธยมศึกษาปีที่ 1 ถึงมัธยมศึกษาปีที่ 3 ณ โรงเรียนวัดไร่ขิงวิทยา พร้อมปฏิบัติหน้าที่นักดนตรีสากลประจำวงดุริยางค์ของโรงเรียนอย่างต่อเนื่อง",
          },
          {
            "@type": "EducationalOrganization",
            name: "โรงเรียนวัดไร่ขิง (สุนทรอุทิศ)",
            description:
              "ศึกษาระดับชั้นประถมศึกษาปีที่ 3 ถึงประถมศึกษาปีที่ 6 ณ โรงเรียนวัดไร่ขิง (สุนทรอุทิศ) ควบคู่กับการฝึกฝนทักษะดนตรีสากลในวงดุริยางค์",
          },
          {
            "@type": "EducationalOrganization",
            name: "โรงเรียนนาคประสิทธิ์",
            description:
              "ศึกษาระดับชั้นอนุบาลปีที่ 1 ถึงประถมศึกษาปีที่ 2 ณ โรงเรียนนาคประสิทธิ์ ซึ่งเป็นจุดเริ่มต้นสำคัญของการก้าวสู่เส้นทางนักดนตรีสากลประจำวงดุริยางค์",
          },
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: "นิเทศศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) สาขาวิชาภาพยนตร์ โทรทัศน์ และสื่อดิจิทัล มหาวิทยาลัยสยาม",
            recognizedBy: {
              "@type": "CollegeOrUniversity",
              name: "มหาวิทยาลัยสยาม (Siam University)",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: "วิทยาศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสยาม",
            recognizedBy: {
              "@type": "CollegeOrUniversity",
              name: "มหาวิทยาลัยสยาม (Siam University)",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "certificate",
            name: "ประกาศนียบัตรวิชาชีพ (ปวช.) สาขาวิชาคอมพิวเตอร์ธุรกิจ วิทยาลัยเทคโนโลยีสยาม (สยามเทค)",
            recognizedBy: {
              "@type": "EducationalOrganization",
              name: "วิทยาลัยเทคโนโลยีสยาม (SIAM TECHNOLOGY COLLEGE - สยามเทค)",
            },
          },
        ],
        award: [
          "เกียรตินิยมอันดับ 1 นิเทศศาสตรบัณฑิต สาขาวิชาภาพยนตร์ โทรทัศน์ และสื่อดิจิทัล มหาวิทยาลัยสยาม",
          "เกียรตินิยมอันดับ 1 วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสยาม",
        ],
        knowsAbout: [
          "Film Direction",
          "Film Production",
          "Documentary Filmmaking",
          "Sound Engineering",
          "Software Architecture",
          "Blue Bird Composer Pro",
          "Computer Science",
          "Digital Media",
          "VFX",
          "Western Classical & Marching Band Music",
        ],
        subjectOf: [
          {
            "@id": movieId,
          },
        ],
      },
      {
        "@type": "Movie",
        "@id": movieId,
        name: "4 จตุรเทพ ดาวประจำเมือง",
        alternateName: [
          "จตุรเทพดาวประจำเมือง",
          "4 Elemental Guardians: Stars of the City",
          "Four Elemental Guardians",
        ],
        genre: "สารคดีเชิงภาพยนตร์ (Documentary Film)",
        image: [
          `${BASE_URL}${MAIN_POSTER_TH}`,
          `${BASE_URL}${MAIN_POSTER_EN}`,
        ],
        description:
          "สารคดีเชิงภาพยนตร์ จากผู้กำกับ กฤศกร รัตนปทุมพงส์ ถ่ายทอดความมหัศจรรย์แห่งภูมิปัญญาและอัตลักษณ์ของเมืองไทยผ่านธาตุทั้ง 4 (ดิน น้ำ ลม ไฟ) ณ จังหวัดอุทัยธานี",
        director: {
          "@id": personId,
        },
        actor: [
          { "@type": "Person", name: "พศิน เรืองวุฒิ" },
          { "@type": "Person", name: "ธรรมวณัฐ บวรมหาบุญบารมี" },
          { "@type": "Person", name: "กิตติกร โพธิ์ปี" },
          { "@type": "Person", name: "บุริญ ใจสิงห์" },
        ],
        productionCompany: [
          {
            "@type": "Organization",
            name: "มูลนิธิพระสีวลีศิลปินดาราสายบุญ",
          },
          {
            "@type": "Organization",
            name: "องค์การบริหารส่วนจังหวัดอุทัยธานี",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Blue Bird Pictures Studio",
            item: `${BASE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Team",
            item: `${BASE_URL}/${locale}/team`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "กฤศกร รัตนปทุมพงส์ (Kritsakorn Rattanapathumphong)",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataGraph),
        }}
      />
      <FounderProfileClient />
    </>
  );
}
