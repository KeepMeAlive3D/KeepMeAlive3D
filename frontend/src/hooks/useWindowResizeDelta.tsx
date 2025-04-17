import { useEffect, useRef } from "react";

/**
 * Gets called on window resizing with the delta between the last and the current width and height.
 */
export const useWindowResizeDelta = (
  onResizeDelta: (delta: { width: number; height: number }) => void,
) => {
  const prevSize = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      const delta = {
        width: newWidth - prevSize.current.width,
        height: newHeight - prevSize.current.height,
      };

      onResizeDelta(delta);

      prevSize.current = { width: newWidth, height: newHeight };
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [onResizeDelta]);
};
