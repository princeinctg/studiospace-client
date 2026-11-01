import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedStudios } from "@/components/home/FeaturedStudios";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HostGuarantee } from "@/components/home/HostGuarantee";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <FeaturedStudios />
        <CategoryGrid />
        <HowItWorks />
        <HostGuarantee />
      </main>
      <Footer />
    </div>
  );
}
