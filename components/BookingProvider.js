"use client";

import { createContext, useCallback, useContext, useState } from "react";
import BookingDrawer from "./BookingDrawer";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(null);

  const openBooking = useCallback((destination, options = {}) => {
    setBooking({ destination, ...options });
  }, []);

  const closeBooking = useCallback(() => setBooking(null), []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingDrawer booking={booking} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
