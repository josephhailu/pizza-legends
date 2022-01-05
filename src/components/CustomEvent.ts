export enum CUSTOM_EVENTS {
  PersonWalkComplete = "PersonWalkComplete",
  PersonStandComplete = "PersonStandComplete",
}
interface CustomEventMap {
  PersonWalkComplete: CustomEvent<{ whoId: string }>;
  PersonStandComplete: CustomEvent<{ whoId: string }>;
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
  }
}
