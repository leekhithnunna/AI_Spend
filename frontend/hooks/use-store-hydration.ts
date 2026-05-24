"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True after client mount — safe for reading persisted Zustand state */
export function useStoreHydration(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
