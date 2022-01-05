declare module "custom-events" {
  global {
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
}

interface CustomEventMap {
  PersonWalkComplete: CustomEvent<{ whoId: string }>;
  PersonStandComplete: CustomEvent<{ whoId: string }>;
}
