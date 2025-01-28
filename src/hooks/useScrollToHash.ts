import { useEffect } from "react";
import { useLocation } from "react-router";

export const scrollToHashElement = (hash: string) => {
  const element = document.querySelector(hash);
  if (!element) return;

  const navbarOffset = 80; // height of your fixed navbar
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const middle = absoluteElementTop - navbarOffset;

  window.scrollTo({
    top: middle,
    behavior: "smooth",
  });
};

export const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    // Wait for any dynamic content to load
    const timeoutId = setTimeout(() => {
      if (location.hash) {
        scrollToHashElement(location.hash);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.hash]);
};
