/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    /** Swup runtime instance when `globalInstance` is enabled */
    swup?: import("swup").default;
    /** Guards layout ScriptSetup against Swup Scripts plugin re-runs */
    __yukinaScriptSetupDone?: boolean;
    /** OverlayScrollbars must only wrap `<body>` once across navigations/HMR */
    __yukinaBodyOsInitialized?: boolean;
  }
}

export {};
