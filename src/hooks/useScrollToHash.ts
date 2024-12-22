import { useEffect, useCallback } from "react";
import { useLocation } from "react-router";

export const useScrollToHash = () => {
	const location = useLocation();

	const scrollToElement = useCallback((hash: string) => {
		const element = document.querySelector(hash);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	}, []);

	useEffect(() => {
		if (location.hash) {
			setTimeout(() => {
				scrollToElement(location.hash);
			}, 0);
		}
	}, [location.hash, scrollToElement]);
};
