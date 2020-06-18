import React, { useState, useRef } from 'react';

import KEYS from '../../../utilities/key-code';
import RadioButtonGroup from '../../../components/radio-button-group';
import Radio from '../../../components/radio-button-group/radio';
import ColorUtils from '../../../utilities/color';

const handleClick = (event, rangeIndicator, { onSaturationValueChange }) => {
	const rect = event.currentTarget.getBoundingClientRect();
	rangeIndicator.current.focus();
	onSaturationValueChange(event, {
		saturation: Math.round(((event.clientX - rect.left) / rect.width) * 100),
		value: Math.round(((rect.bottom - event.clientY) / rect.height) * 100),
	});
};

const handleKeyDown = (event, { onSaturationNavigate, onValueNavigate }) => {
	const keyDownCallbacks = {
		[KEYS.LEFT]: (multiplier) => {
			onSaturationNavigate(event, {
				delta: multiplier * -1,
			});
		},
		[KEYS.RIGHT]: (multiplier) => {
			onSaturationNavigate(event, {
				delta: multiplier,
			});
		},
		[KEYS.UP]: (multiplier) => {
			onValueNavigate(event, {
				delta: multiplier,
			});
		},
		[KEYS.DOWN]: (multiplier) => {
			onValueNavigate(event, {
				delta: multiplier * -1,
			});
		},
	};

	if (keyDownCallbacks[event.keyCode]) {
		event.preventDefault();
		keyDownCallbacks[event.keyCode](event.shiftKey ? 10 : 1);
	}
};

const selectedStyle = {
	border: '1px solid #9e9e9e',
	boxShadow: 'rgb(117, 112, 112) 1px 1px 1px',
	marginRight: '2px',
};

const unselectedStyle = {
	border: '1px solid #9e9e9e',
	marginRight: '2px',
};

const displayName = 'SLDSHsvColor';

const HsvColor = (props) => {
	const [isTransparentSelected, setIsTransparentSelected] = useState();
	const handleSwatchChange = (event) => {
		setIsTransparentSelected(event.target.value === '');
		props.onSwatchChange(event);
	};

	const isTransparent = () => props.color.hex === '';

	const style = { border: 'none', borderRadius: 'unset' };
	const swatchStyle = isTransparent()
		? { ...unselectedStyle }
		: { ...selectedStyle };
	const transparentSwatchStyle = isTransparent()
		? { ...selectedStyle }
		: { ...unselectedStyle };

	// when working color is transparent: either use the previous color or default to black
	const fallbackWorkingColor = props.previousColor.hex
		? props.previousColor
		: ColorUtils.getNewColor({ hex: '#000000' });
	const workingColor = isTransparent() ? fallbackWorkingColor : props.color;

	const rangeIndicator = useRef();

	return (
		<div>
			<p
				className="slds-assistive-text"
				id={`color-picker-instructions-${props.id}`}
			>
				{props.assistiveText.saturationValueGrid}
			</p>
			<div
				className="slds-color-picker__custom-range"
				style={{
					background: `hsl(${workingColor.hsv.hue}, 100%, 50%)`,
				}}
				onClick={(event) => {
					handleClick(event, rangeIndicator, {
						onSaturationValueChange: props.onSaturationValueChange,
					});
				}}
				role="presentation"
			>
				{/* eslint-disable jsx-a11y/anchor-has-content */}
				<a
					aria-atomic="true"
					aria-describedby={`color-picker-instructions-${props.id}`}
					aria-live="assertive"
					className="slds-color-picker__range-indicator"
					onKeyDown={(event) => {
						handleKeyDown(event, { ...props });
					}}
					ref={rangeIndicator}
					role="button"
					style={{
						bottom: `${workingColor.hsv.value}%`,
						left: `${workingColor.hsv.saturation}%`,
					}}
					tabIndex={0}
				>
					<span className="slds-assistive-text">{`Saturation ${workingColor.hsv.saturation}% Brightness: ${workingColor.hsv.value}%`}</span>
				</a>
			</div>
			<div className="slds-color-picker__hue-and-preview">
				<label
					className="slds-assistive-text"
					htmlFor={`color-picker-input-range-${props.id}`}
				>
					{props.assistiveText.hueSlider}
				</label>
				<input
					type="range"
					min="0"
					max="360"
					className="slds-color-picker__hue-slider"
					id={`color-picker-input-range-${props.id}`}
					value={workingColor.hsv.hue}
					onChange={props.onHueChange}
				/>
				<RadioButtonGroup
					name={`${props.id}-color-picker-swatch-toggle-button-group`}
					assistiveText={{ label: 'Toggle Transparency' }}
					style={style}
					onChange={handleSwatchChange}
				>
					<Radio
						checked={!isTransparent()}
						id={`color-picker-active-working-color-swatch-${props.id}`}
						key="working-color"
						labels={{
							label: props.labels.customTabActiveWorkingColorSwatch,
						}}
						style={swatchStyle}
						value={workingColor.hex}
						variant="swatch"
					/>
					<Radio
						checked={isTransparent()}
						id={`color-picker-transparent-swatch-${props.id}`}
						key="transparent"
						labels={{ label: props.labels.customTabTransparentSwatch }}
						style={transparentSwatchStyle}
						value="" // transparent
						variant="swatch"
					/>
				</RadioButtonGroup>
			</div>
		</div>
	);
};

HsvColor.displayName = displayName;

export default HsvColor;
