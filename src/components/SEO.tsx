import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function SEO({
  title = "Ăn mày laptop - Kết nối yêu thương, lan tỏa hy vọng",
  description = "Hoạt động thiện nguyện thu gom laptop cũ, sửa chữa và tặng cho sinh viên có hoàn cảnh khó khăn. Kết nối nhà hảo tâm với sinh viên cần hỗ trợ laptop, xe máy, linh kiện và học phí.",
  keywords = "từ thiện, laptop, sinh viên, hỗ trợ, ăn mày laptop, laptop cũ, xe máy, học phí, linh kiện",
  ogImage = "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/561346745_10163260236397768_958191264658348908_n.jpg",
  ogUrl,
}: SEOProps) {
  const fullTitle = title.includes("Ăn mày laptop") ? title : `${title} | Ăn mày laptop`;
  const currentUrl = ogUrl || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Trần Trọng An" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Vietnamese" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
}
