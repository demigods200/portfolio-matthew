import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { SystemDesign } from "@/components/sections/SystemDesign";
import { Experiments } from "@/components/sections/Experiments";
import { HowIBuild } from "@/components/sections/HowIBuild";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <Hero />
        <FeaturedProject />
        <SystemDesign />
        <Experiments />
        <HowIBuild />
      </main>
      <Footer />
    </>
  );
}
