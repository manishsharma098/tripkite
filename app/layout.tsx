import { Syne, Manrope } from "next/font/google";
import { BookingProvider } from "@/components/BookingProvider";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Effects from "@/components/Effects";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: {
    default: "Tripkite — flights, stays and trips that fit",
    template: "%s · Tripkite",
  },
  description:
    "Search flights, stays and packages, hold a fare free for 48 hours, and get your boarding pass in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} is-loading`} suppressHydrationWarning>
      <body>
        <BookingProvider>
          <Preloader />
          <SmoothScroll />
          <Effects />
          <Cursor />
          <div className="mesh" aria-hidden="true">
            <span /><span /><span />
          </div>
          <Nav />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
