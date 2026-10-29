"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => String(new Date().getFullYear());
const getServerSnapshot = () => "";

/**
 * Tahun berjalan. Di server dirender kosong (snapshot server), lalu di klien
 * diisi tahun aktual tanpa memanggil `new Date()` saat render.
 */
export function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <>{year}</>;
}
