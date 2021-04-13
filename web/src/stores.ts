import { writable } from "svelte/store";

export const darkMode = writable(localStorage.getItem("darkMode") === "true");

darkMode.subscribe((val) => localStorage.setItem("darkMode", val.toString()));
