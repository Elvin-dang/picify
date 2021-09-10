import { useEffect, useRef } from "react";

export default function useOuterClick(callback: (e: any) => void | undefined) {
  const callbackRef = useRef<Function>();
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    function handleClick(e: any) {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target)
      )
        callbackRef.current(e);
    }
  }, []);

  return innerRef;
}
