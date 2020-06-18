import { useLayoutEffect, useState, useCallback } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useRefResize = (ref, callback) => {
	const [rect, setRect] = useState({
		bottom: 0,
		height: 0,
		left: 0,
		right: 0,
		top: 0,
		width: 0,
		x: 0,
		y: 0,
		offsetWidth: 0,
		offsetHeight: 0,
	});
	const [offset, setOffset] = useState({
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	const throttled = function (delay, fn) {
		let lastCall = 0;
		return (...args) => {
			let context = this;
			let current = new Date().getTime();

			if (current - lastCall < delay) {
				return;
			}
			lastCall = current;

			return fn.apply(context, ...args);
		};
	};

	const handleResize = useCallback(
		(entries) => {
			if (!Array.isArray(entries)) {
				return;
			}

			const entry = entries[0];
			setRect(entry.contentRect);
			setOffset(entry.target.getBoundingClientRect().toJSON());

			if (callback) {
				callback(entry.target.getBoundingClientRect().toJSON());
			}
		},
		[callback]
	);

	useLayoutEffect(() => {
		if (!ref.current) {
			return;
		}

		let RO = new ResizeObserver((entries) =>
			throttled(500, handleResize(entries))
		);
		RO.observe(ref.current);

		return () => {
			RO.disconnect();
			RO = null;
		};
	}, [ref]);

	return [rect, offset];
};

export default useRefResize;
