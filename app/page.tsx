import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Trending from "@/components/Trending";
import Experiences from "@/components/Experiences";
import Deals from "@/components/Deals";
import Explore from "@/components/Explore";
import Steps from "@/components/Steps";
import Reviews from "@/components/Reviews";
import Signup from "@/components/Signup";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Trending />
      <Experiences />
      <Deals />
      <Explore />
      <Steps />
      <Reviews />
      <Signup />
    </main>
  );
}
