import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import Checkout from "@/components/Checkout";

export const metadata = { title: "Checkout" };

export default function BookingPage() {
  return (
    <main>
      <PageHero
        img="1527631746610-bca00a040d60"
        title="Almost there"
        sub="Four quick steps. Nothing is charged until you confirm."
        crumbs={[["Checkout"]]}
        size="sm"
      />
      <Suspense fallback={<div className="search-loading">Loading your trip…</div>}>
        <Checkout />
      </Suspense>
    </main>
  );
}
