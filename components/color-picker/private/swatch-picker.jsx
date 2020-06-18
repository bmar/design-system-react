import React from 'react';
import findIndex from 'lodash.findindex';

import SwatchOption from './swatch-option';
import KEYS from '../../../utilities/key-code';
import EventUtil from '../../../utilities/event';

import { DIRECTIONS } from '../../utilities/UNSAFE_direction';
import LanguageDirection from '../../utilities/UNSAFE_direction/private/language-direction';

const displayName = 'SLDSSwatchPicker';

const SwatchPicker = (props) => {
	let swatchColorRefs = {};

	const selectPreviousColor = (event, props) => {
		const index = findIndex(
			props.swatchColors,
			(item) => item === props.color.hex
		);
		const nextIndex =
			index === -1 || index === props.swatchColors.length - 1 ? 0 : index + 1;
		const prevColor = props.swatchColors[nextIndex];
		props.onSelect(event, {
			hex: prevColor,
		});

		swatchColorRefs[prevColor].focus();
	};

	const selectNextColor = (event, props) => {
		const index = findIndex(
			props.swatchColors,
			(item) => item === props.color.hex
		);
		let prevIndex;
		if (index === 0) {
			prevIndex = props.swatchColors.length - 1;
		} else if (index === -1) {
			prevIndex = 0;
		} else {
			prevIndex = index - 1;
		}
		const nextColor = props.swatchColors[prevIndex];
		props.onSelect(event, {
			hex: nextColor,
		});

		swatchColorRefs[nextColor].focus();
	};

	const handleKeyDown = (event, props) => {
		const keyDownCallbacks = {
			[KEYS.RIGHT]: () => {
				if (props.direction === DIRECTIONS.RTL) {
					selectNextColor(event, props);
				} else {
					selectPreviousColor(event, props);
				}
			},
			[KEYS.DOWN]: () => {
				selectPreviousColor(event, props);
			},

			[KEYS.LEFT]: () => {
				if (props.direction === DIRECTIONS.RTL) {
					selectPreviousColor(event, props);
				} else {
					selectNextColor(event, props);
				}
			},
			[KEYS.UP]: () => {
				selectNextColor(event, props);
			},
		};

		if (event.keyCode) {
			if (keyDownCallbacks[event.keyCode]) {
				EventUtil.trapEvent(event);
				keyDownCallbacks[event.keyCode]();
			}
		}
	};

	const addRef = (color) => (el) => {
		swatchColorRefs[color] = el;
	};

	const isSelectedColorInSwatch = props.swatchColors.includes(props.color.hex);

	return (
		<ul
			className="slds-color-picker__swatches"
			role="listbox"
			onKeyDown={(event) => {
				handleKeyDown(event, {
					...props,
				});
			}}
		>
			{props.swatchColors.map((color, index) => (
				<SwatchOption
					color={color}
					key={color}
					labels={props.labels}
					onSelect={props.onSelect}
					swatchOptionRef={addRef(color)}
					workingColor={props.color}
					tabIndex={
						(props.color && props.color.hex === color) ||
						(index === 0 && !isSelectedColorInSwatch)
							? 0
							: -1
					}
				/>
			))}
		</ul>
	);
};

SwatchPicker.displayName = displayName;

export default LanguageDirection(SwatchPicker);
