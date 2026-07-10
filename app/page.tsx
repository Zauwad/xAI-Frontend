import { TopNav } from '@/components/nav/TopNav';
import { Hero } from '@/components/hero/Hero';
import { InsightFlow } from '@/components/flow/InsightFlow';
import { DashboardPreview } from '@/components/dashboard/DashboardPreview';
import { SignatureSection } from '@/components/signature/SignatureSection';

export default function Page() {
  return (
    <main id="top" className="relative">
      <TopNav />
      <Hero />
      <InsightFlow />
      <DashboardPreview />
      <SignatureSection />
    </main>
  );
}