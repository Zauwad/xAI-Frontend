import { TopNav } from '@/components/nav/TopNav';
import { Hero } from '@/components/hero/Hero';
import { AskXai } from '@/components/ask/AskXai';
import { InsightFlow } from '@/components/flow/InsightFlow';
import { DashboardPreview } from '@/components/dashboard/DashboardPreview';
import { Automations } from '@/components/automations/Automations';
import { SignatureSection } from '@/components/signature/SignatureSection';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <main id="top" className="relative">
      <TopNav />
      <Hero />
      <AskXai />
      <InsightFlow />
      <DashboardPreview />
      <Automations />
      <SignatureSection />
      <Footer />
    </main>
  );
}