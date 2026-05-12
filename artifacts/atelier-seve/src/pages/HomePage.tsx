import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { IntroStatement } from "@/components/IntroStatement";
import { Services } from "@/components/Services";
import { ThreeRitual } from "@/components/ThreeRitual";
import { ProductShowcase } from "@/components/ProductShowcase";
import { MakeupSequence } from "@/components/MakeupSequence";
import { IntakeForm } from "@/components/IntakeForm";
import { Testimonials } from "@/components/Testimonials";
import { LoyaltyOffers } from "@/components/LoyaltyOffers";
import { BeforeAfter } from "@/components/BeforeAfter";
import { BotMockup } from "@/components/BotMockup";
import { ReviewCTA } from "@/components/ReviewCTA";
import { Footer } from "@/components/Footer";
import { AIBookingWidget } from "@/components/AIBookingWidget";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-hidden selection:bg-secondary selection:text-foreground">
      <Hero />
      <Marquee />
      <IntroStatement />
      <Services />
      <ProductShowcase />
      <ThreeRitual />
      <MakeupSequence />
      <IntakeForm />
      <Testimonials />
      <LoyaltyOffers />
      <BeforeAfter />
      <BotMockup />
      <ReviewCTA />
      <Footer />
      <AIBookingWidget />
    </main>
  );
}
