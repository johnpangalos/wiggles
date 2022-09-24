import {
  useState,
  useEffect,
  ReactNode,
  useContext,
  Context,
  createContext,
} from "react";

type Breakpoint = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: [breakpoint: Breakpoint, value: number][] = [
  ["xxs", 0],
  ["xs", 340],
  ["sm", 640],
  ["md", 768],
  ["lg", 1024],
  ["xl", 1280],
  ["2xl", 1536],
];

type BreakpointContextProps = { currentBreakpoint: Breakpoint };
const defaultValue: Breakpoint = "xxs";

const BreakpointContext = createContext({
  currentBreakpoint: defaultValue,
}) as Context<BreakpointContextProps>;

export function useBreakpoint(): Breakpoint {
  const { currentBreakpoint } =
    useContext<BreakpointContextProps>(BreakpointContext);
  return currentBreakpoint;
}

export function BreakpointProvider({ children }: { children: ReactNode }) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("xxs");

  useEffect(() => {
    function handleResize() {
      const root = document.getElementById("root");
      const rect = root?.getBoundingClientRect();
      if (rect === undefined) return;
      const { width } = rect;
      const breakpoint = breakpoints.find(([_, value], index) => {
        if (
          width >= value &&
          (index + 1 === breakpoints?.length ||
            width < breakpoints[index + 1][1])
        )
          return true;
        return false;
      });
      if (breakpoint?.[0] === undefined) return;
      setCurrentBreakpoint(breakpoint[0]);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BreakpointContext.Provider value={{ currentBreakpoint }}>
      {children}
    </BreakpointContext.Provider>
  );
}
