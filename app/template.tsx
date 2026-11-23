"use client";

// Re-mounts on every navigation: a dark panel slides off the screen as the new page fades in
export default function Template({ children }) {
  return (
    <>
      <div className="page-wipe" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
