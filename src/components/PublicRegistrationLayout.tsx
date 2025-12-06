import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Laptop, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

interface PublicRegistrationLayoutProps {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  children: ReactNode;
  showBackButton?: boolean;
}

export function PublicRegistrationLayout({
  title,
  description,
  seoTitle,
  seoDescription,
  seoKeywords,
  children,
  showBackButton = true,
}: PublicRegistrationLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEO title={seoTitle} description={seoDescription} keywords={seoKeywords} />
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {showBackButton && <ArrowLeft className="h-5 w-5" />}
            <Laptop className="h-6 w-6" />
            <span className="text-xl font-bold">Ăn mày laptop</span>
          </Link>
        </div>
      </header>

      {/* Registration Form */}
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="bg-background rounded-lg border p-6 md:p-8 shadow-sm">{children}</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Dự án "Ăn mày laptop" - Kết nối yêu thương, lan tỏa hy vọng</p>
        </div>
      </footer>
    </div>
  );
}
