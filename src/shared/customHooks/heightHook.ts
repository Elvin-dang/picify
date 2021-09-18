import { RefObject, useEffect, useMemo, useState } from "react";

export default function useRefHeight(
  padding: number,
  ref?: RefObject<HTMLDivElement>,
  unusedRef?: RefObject<HTMLDivElement>,
) {
  const [height, setHeight] = useState<number>(0);

  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.contentBoxSize) {
            const contentBoxSize: any = Array.isArray(entry.contentBoxSize)
              ? entry.contentBoxSize[0]
              : entry.contentBoxSize;

            setHeight(contentBoxSize.blockSize + padding * 2);
          }
        }
      }),
    [padding],
  );

  useEffect(() => {
    if (ref && ref.current) {
      observer.observe(ref.current);
    }
    if (unusedRef && unusedRef.current) {
      observer.unobserve(unusedRef.current);
    }
  }, [ref, observer, unusedRef]);

  return height;
}
