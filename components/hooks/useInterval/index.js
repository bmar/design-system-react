import React, { useState, useEffect, useRef } from 'react';

function useInterval(func, time) {
	const savedCallbackRef = useRef();
	const timerIdRef = useRef();
	const isStartingRef = useRef(false);

	function timeOut() {
		timerIdRef.current = setTimeout(() => {
			if (isStartingRef.current) {
				savedCallbackRef.current();
				func();
			}
		}, time);
	}

	function start(fn) {
		clearTimeout(timerIdRef.current);
		isStartingRef.current = true;
		timeOut();
		if (fn) {
			return (...args) => {
				let context = this;
				return fn.apply(context, ...args);
			};
		}
	}

	function stop(fn) {
		isStartingRef.current = false;
		if (fn) {
			return (...args) => {
				let context = this;
				return fn.apply(context, ...args);
			};
		}
	}

	function meanwhile() {
		return isStartingRef.current;
	}

	useEffect(() => {
		savedCallbackRef.current = timeOut;
	});

	useEffect(() => clearTimeout(timerIdRef.current), []);

	return [start, stop, meanwhile];
}

export default useInterval;
