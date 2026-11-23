import PageHero from "@/components/PageHero";
import DestinationsBrowser from "@/components/DestinationsBrowser";

export const metadata = { title: "Destinations" };

export default function DestinationsPage() {
  return (
    <main>
      <PageHero
        img="1469854523086-cc02fe5d8800"
        title="Every place we fly to"
        sub="Ten destinations, each with flights, a hand-picked stay and a day-by-day plan."
        crumbs={[["Destinations"]]}
      />
      <DestinationsBrowser />
    </main>
  );
}
