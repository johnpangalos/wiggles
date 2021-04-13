import { writable } from "svelte/store";

export const darkMode = writable(localStorage.getItem("darkMode") === "true");

darkMode.subscribe((val) => localStorage.setItem("darkMode", val.toString()));

export enum LogInState {
  LoggedIn,
  LoggedOut,
  Loading,
}

export const loggedIn = writable(LogInState.Loading);
