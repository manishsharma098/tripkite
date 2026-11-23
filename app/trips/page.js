import PageHero from "@/components/PageHero";
import TripsList from "@/components/TripsList";

export const metadata = { title: "My trips" };

export default function TripsPage() {
  return (
    <main>
      <PageHero
        img="1476514525535-07fb3b4ae5f1"
        title="My trips"
        sub="Everything you've booked or held, with boarding passes ready to show at the airport."
        crumbs={[["My trips"]]}
        size="sm"
      />
      <TripsList />
    </main>
  );
}
