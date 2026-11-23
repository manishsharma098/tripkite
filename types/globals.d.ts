export {};

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare module "csstype" {
  interface Properties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare global {
  interface Window {
    __lenis?: {
      stop(): void;
      start(): void;
      scrollTo(target: unknown, options?: object): void;
    };
  }
}
