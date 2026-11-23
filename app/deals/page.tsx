import PageHero from "@/components/PageHero";
import DealsList from "@/components/DealsList";

export const metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <main>
      <PageHero
        img="1507525428034-b723cf961d3e"
        title="Fares that dropped overnight"
        sub="Every price here is lower than its 30-day average. When the timer ends, the fare goes back up."
        crumbs={[["Deals"]]}
      />
      <DealsList />
    </main>
  );
}
