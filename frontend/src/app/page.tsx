import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import GamePreview from "@/components/GamePreview";
import SubjectBrowser from "@/components/SubjectBrowser";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Journey />
      <GamePreview />
      <SubjectBrowser />
      <Footer />
    </main>
  );
}
