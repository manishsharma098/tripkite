import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import SearchView from "@/components/SearchView";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <main>
      <PageHero
        img="1530521954074-e64f6810b32d"
        title="Find your flight"
        sub="Compare fares from the city you choose. Prices are per person and include taxes."
        crumbs={[["Search"]]}
        size="sm"
      />
      <Suspense fallback={<div className="search-loading">Loading results…</div>}>
        <SearchView />
      </Suspense>
    </main>
  );
}
