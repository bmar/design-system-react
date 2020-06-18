/* eslint-disable max-lines */
/* eslint-disable react/sort-comp */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import shortid from 'shortid';
import assign from 'lodash.assign';

import checkProps from './check-props';

import CustomColor from './private/custom-color';
import Swatch from './private/swatch';
import SwatchPicker from './private/swatch-picker';

import Button from '../button';
import Input from '../input';
import Tabs from '../tabs';
import TabsPanel from '../tabs/panel';
import Popover from '../popover';

import ColorUtils from '../../utilities/color';

import { COLOR_PICKER } from '../../utilities/constants';

import componentDoc from './component.json';

const propTypes = {
	/**
	 * **Assistive text for accessibility**
	 * * `label`: Visually hidden label but read out loud by screen readers.
	 * * `hueSlider`: Instructions for hue selection input
	 * * `saturationValueGrid`: Instructions for using the grid for saturation
	 * and value selection
	 */
	assistiveText: PropTypes.shape({
		label: PropTypes.string,
		hueSlider: PropTypes.string,
		saturationValueGrid: PropTypes.string,
	}),
	/**
	 * CSS classes to be added to tag with `.slds-color-picker`. Uses `classNames` [API](https://github.com/JedWatson/classnames). _Tested with snapshot testing._
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * CSS classes to be added to tag with `.slds-popover`. Uses `classNames` [API](https://github.com/JedWatson/classnames). _Tested with snapshot testing._
	 */
	classNameMenu: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Unique ID for component.
	 */
	id: PropTypes.string,
	/**
	 * Disables the input and button.
	 */
	disabled: PropTypes.bool,
	/**
	 * Message to display when the outer input is in an error state. When this is present, also visually highlights the component as in error.
	 */
	errorText: PropTypes.string,
	/**
	 * Message to display when the custom tab input is in an error state. When this is present, also visually highlights the component as in error.
	 */
	errorTextWorkingColor: PropTypes.string,
	/**
	 * Event Callbacks
	 * * `onChange`: This function is triggered when done is clicked. This function returns `{event, { color: [string] }}`, which is a hex representation of the color.
	 * * `onClose`: This function is triggered when the menu is closed. This function returns `{event, { trigger, componentWillUnmount }}`. Trigger can have the values `cancel`, `clickOutside`, or `newPopover`.
	 * * `onOpen`: This function is triggered when the color-picker menu is mounted and added to the DOM. The parameters are `event, { portal: }`. `portal` can be used as a React tree root node.
	 * * `onRequestClose`:  This function is triggered when the user clicks outside the menu or clicks the close button. You will want to define this if color-picker is to be a controlled component. Most of the time you will want to set `isOpen` to `false` when this is triggered unless you need to validate something.
	 * 						This function returns `{event, {trigger: [string]}}` where `trigger` is either `cancel` or `clickOutside`.
	 * * `onRequestOpen`: Function called when the color-picker menu would like show.
	 * * `onValidateColor`: Function that overwrites default color validator and called when validating HEX color on outer input change. If callback returns false, errorText is shown if set.
	 * * `onValidateWorkingColor`: Function that overwrites default color validator and called when validating HEX color on custom tab inner input change. If callback returns false, errorTextWorkingColor is shown if set.
	 * * `onWorkingColorChange`: This function is triggered when working color changes (color inside the custom tab). This function returns `{event, { color: [string] }}`, which is a hex representation of the color.
	 * _Tested with Mocha framework._
	 */
	events: PropTypes.shape({
		onChange: PropTypes.func,
		onClose: PropTypes.func,
		onOpen: PropTypes.func,
		onRequestClose: PropTypes.func,
		onRequestOpen: PropTypes.func,
		onValidateColor: PropTypes.func,
		onValidateWorkingColor: PropTypes.func,
		onWorkingColorChange: PropTypes.func,
	}),
	/**
	 * By default, dialogs will flip their alignment (such as bottom to top) if they extend beyond a boundary element such as a scrolling parent or a window/viewpoint. `hasStaticAlignment` disables this behavior and allows this component to extend beyond boundary elements. _Not tested._
	 */
	hasStaticAlignment: PropTypes.bool,
	/**
	 * Hides the text input
	 */
	hideInput: PropTypes.bool,
	/**
	 * Popover open state
	 */
	isOpen: PropTypes.bool,
	/**
	 * **Text labels for internationalization**
	 * * `blueAbbreviated`: One letter abbreviation of blue color component
	 * * `cancelButton`: Text for cancel button on popover
	 * * `customTab`: Text for custom tab of popover
	 * * `customTabActiveWorkingColorSwatch`: Label for custom tab active working color swatch
	 * * `customTabTransparentSwatch`: Label for custom tab active transparent swatch
	 * * `greenAbbreviated`: One letter abbreviation of green color component
	 * * `hexLabel`: Label for input of hexadecimal color
	 * * `invalidColor`: Error message when hex color input is invalid
	 * * `invalidComponent`: Error message when a component input is invalid
	 * * `label`: An `input` label as for a `form`
	 * * `redAbbreviated`: One letter abbreviation of red color component
	 * * `swatchTab`: Label for swatch tab of popover
	 * * `submitButton`: Text for submit/done button of popover
	 */
	labels: PropTypes.shape({
		blueAbbreviated: PropTypes.string,
		cancelButton: PropTypes.string,
		customTab: PropTypes.string,
		customTabActiveWorkingColorSwatch: PropTypes.string,
		customTabTransparentSwatch: PropTypes.string,
		greenAbbreviated: PropTypes.string,
		hexLabel: PropTypes.string,
		invalidColor: PropTypes.string,
		invalidComponent: PropTypes.string,
		label: PropTypes.string,
		redAbbreviated: PropTypes.string,
		swatchTab: PropTypes.string,
		swatchTabTransparentSwatch: PropTypes.string,
		submitButton: PropTypes.string,
	}),
	/**
	 * Please select one of the following:
	 * * `absolute` - (default) The dialog will use `position: absolute` and style attributes to position itself. This allows inverted placement or flipping of the dialog.
	 * * `overflowBoundaryElement` - The dialog will overflow scrolling parents. Use on elements that are aligned to the left or right of their target and don't care about the target being within a scrolling parent. Typically this is a popover or tooltip. Dropdown menus can usually open up and down if no room exists. In order to achieve this a portal element will be created and attached to `body`. This element will render into that detached render tree.
	 * * `relative` - No styling or portals will be used. Menus will be positioned relative to their triggers. This is a great choice for HTML snapshot testing.
	 */
	menuPosition: PropTypes.oneOf([
		'absolute',
		'overflowBoundaryElement',
		'relative',
	]),
	/**
	 * An array of hex color values which is used to set the options of the
	 * swatch tab of the colorpicker popover.
	 * To specify transparent, use empty string as a value.
	 */
	swatchColors: PropTypes.arrayOf(PropTypes.string),
	/**
	 * Determines which tab is visible when dialog opens. Use this prop with `base` variant only.
	 * Defaults to `swatch` tab.
	 */
	defaultSelectedTab: PropTypes.oneOf(['swatches', 'custom']),
	/**
	 * Selects which tabs are present for the colorpicker.
	 * * `base`: both swatches and custom tabs are present
	 * * `swatches`: only swatch tab is present
	 * * `custom`: only custom tab is present
	 * _Tested with snapshot testing._
	 */
	variant: PropTypes.oneOf(['base', 'swatches', 'custom']),
	/**
	 * Current color in hexadecimal string, including # sign (eg: "#000000")
	 */
	value: PropTypes.string,
	/**
	 * Current working color in hexadecimal string, including # sign (eg: "#000000")
	 */
	valueWorking: PropTypes.string,
};

const defaultProps = {
	assistiveText: {
		saturationValueGrid:
			'Use arrow keys to select a saturation and brightness, on an x and y axis.',
		hueSlider: 'Select Hue',
	},
	events: {},
	labels: {
		blueAbbreviated: 'B',
		cancelButton: 'Cancel',
		customTab: 'Custom',
		customTabActiveWorkingColorSwatch: 'Working Color',
		customTabTransparentSwatch: 'Transparent Swatch',
		greenAbbreviated: 'G',
		hexLabel: 'Hex',
		invalidColor: 'The color entered is invalid',
		invalidComponent: 'The value needs to be an integer from 0-255',
		redAbbreviated: 'R',
		submitButton: 'Done',
		swatchTab: 'Default',
		swatchTabTransparentSwatch: 'Transparent Swatch',
	},
	menuPosition: 'absolute',
	swatchColors: [
		'#e3abec',
		'#c2dbf7',
		'#9fd6ff',
		'#9de7da',
		'#9df0c0',
		'#fff099',
		'#fed49a',
		'#d073e0',
		'#86baf3',
		'#5ebbff',
		'#44d8be',
		'#3be282',
		'#ffe654',
		'#ffb758',
		'#bd35bd',
		'#5779c1',
		'#5679c0',
		'#00aea9',
		'#3cba4c',
		'#f5bc25',
		'#f99221',
		'#580d8c',
		'#001970',
		'#0a2399',
		'#0b7477',
		'#0b6b50',
		'#b67e11',
		'#b85d0d',
		'',
	],
	defaultSelectedTab: 'swatches',
	variant: 'base',
};

/**
 * The Unified Color Picker component allows for a fully accessible and configurable color picker, allowing the user to pick from a set of predefined colors (swatches), or to pick a custom color using a HSB selection interface. It can be configured to show one or both of those color selection interfaces. View [component blueprint guidelines](https://lightningdesignsystem.com/components/color-picker/).
 */
const ColorPicker = (props) => {
	const generatedId = props.id || shortid.generate();
	const workingColor = ColorUtils.getNewColor(
		{
			hex: props.valueWorking || props.value,
		},
		props.events.onValidateWorkingColor
	);

	const [currentColorState, setCurrentColorState] = useState(
		props.value != null ? props.value : ''
	);
	const [disabled, setDisabled] = useState(props.disabled);
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const [workingColorState, setWorkingColorState] = useState(workingColor);
	const [previousWorkingColor, setPreviousWorkingColor] = useState(
		workingColor
	);
	const [colorErrorMessage, setColorErrorMessage] = useState(props.errorText);

	checkProps(COLOR_PICKER, props, componentDoc);

	useEffect(() => {
		setCurrentColorState(props.value);
	}, [props.value]);

	useEffect(() => {
		setWorkingColorState(
			ColorUtils.getNewColor(
				{
					hex: props.valueWorking,
				},
				props.events.onValidateWorkingColor
			)
		);
	}, [props.valueWorking]);

	useEffect(() => {
		setDisabled(props.disabled);
	}, [props.disabled]);

	const getInput = ({ labels }) => {
		return props.hideInput ? null : (
			<Input
				aria-describedby={
					!isOpen && colorErrorMessage
						? `color-picker-summary-error-${generatedId}`
						: undefined
				}
				className={classNames(
					'slds-color-picker__summary-input',
					'slds-align-top',
					{
						'slds-has-error': !!colorErrorMessage,
					}
				)}
				disabled={props.disabled}
				id={`color-picker-summary-input-${generatedId}`}
				onChange={(event) => {
					handleHexInputChange(event, { labels });
				}}
				value={currentColorState}
			/>
		);
	};

	const getDefaultTab = ({ labels }) => {
		return (
			(props.variant === 'base' || props.variant === 'swatches') && (
				<TabsPanel label={labels.swatchTab}>
					<SwatchPicker
						color={workingColorState}
						labels={labels}
						onSelect={handleSwatchSelect}
						swatchColors={props.swatchColors}
					/>
				</TabsPanel>
			)
		);
	};

	const getCustomTab = ({ labels }) => {
		return (
			(props.variant === 'base' || props.variant === 'custom') && (
				<TabsPanel label={labels.customTab}>
					<CustomColor
						assistiveText={props.assistiveText}
						id={generatedId}
						color={workingColorState}
						errorTextWorkingColor={props.errorTextWorkingColor}
						previousColor={previousWorkingColor}
						labels={labels}
						onBlueChange={handleColorChange('blue')}
						onGreenChange={handleColorChange('green')}
						onHexChange={handleColorChange('hex')}
						onHueChange={handleColorChange('hue')}
						onRedChange={handleColorChange('red')}
						onSwatchChange={handleSwatchChange}
						onSaturationValueChange={handleSaturationValueChange}
						onSaturationNavigate={handleNavigate('saturation')}
						onValueNavigate={handleNavigate('value')}
					/>
				</TabsPanel>
			)
		);
	};

	const getPopover = ({ labels }) => {
		const popoverBody = (
			<Tabs
				id={`color-picker-tabs-${generatedId}`}
				defaultSelectedIndex={props.defaultSelectedTab === 'custom' ? 1 : 0}
			>
				{getDefaultTab({ labels })}
				{getCustomTab({ labels })}
			</Tabs>
		);
		const popoverFooter = (
			<div className="slds-color-picker__selector-footer">
				<Button
					className="slds-color-picker__selector-cancel"
					id={`color-picker-footer-cancel-${generatedId}`}
					label={labels.cancelButton}
					onClick={handleCancel}
					variant="neutral"
				/>
				<Button
					className="slds-color-picker__selector-submit"
					disabled={Object.keys(workingColorState.errors || {}).length > 0}
					id={`color-picker-footer-submit-${generatedId}`}
					label={labels.submitButton}
					onClick={handleSubmitButtonClick}
					variant="brand"
				/>
			</div>
		);
		return (
			<Popover
				ariaLabelledby={`color-picker-label-${generatedId}`}
				align="bottom left"
				body={popoverBody}
				className={classNames(
					'slds-color-picker__selector',
					props.classNameMenu
				)}
				footer={popoverFooter}
				hasNoCloseButton
				hasNoNubbin
				hasStaticAlignment={props.hasStaticAlignment}
				id={`slds-color-picker__selector-${generatedId}`}
				isOpen={isOpen}
				onClose={props.onClose}
				onOpen={props.onOpen}
				onRequestClose={handleOnRequestClose}
				position={props.menuPosition}
			>
				<Button
					className="slds-color-picker__summary-button"
					disabled={props.disabled}
					iconClassName="slds-m-left_xx-small"
					iconPosition="right"
					iconVariant="more"
					id={`slds-color-picker__summary-button-${generatedId}`}
					label={<Swatch color={currentColorState} labels={labels} />}
					onClick={handleSwatchButtonClick}
					variant="icon"
				/>
			</Popover>
		);
	};

	const setWorkingColor = (event, color) => {
		const newColor = ColorUtils.getNewColor(
			color,
			props.events.onValidateWorkingColor,
			workingColorState
		);
		setWorkingColorState(newColor);
		setPreviousWorkingColor(workingColorState);

		if (props.events.onWorkingColorChange) {
			props.events.onWorkingColorChange(event, { color: newColor });
		}
	};

	const handleSwatchChange = (event) => {
		setWorkingColor(event, {
			hex: event.target.value,
		});
	};

	const handleOnRequestClose = (event, { trigger }) => {
		if (trigger === 'clickOutside' || trigger === 'cancel') {
			handleCancelState();
		}

		if (props.onRequestClose) {
			props.onRequestClose(event, { trigger });
		}
	};

	const handleClickOutside = (event) => {
		handleCancelButtonClick(event);
	};

	const handleCancel = (event) => {
		handleCancelState();

		if (props.onRequestClose) {
			props.onRequestClose(event, { trigger: 'cancel' });
		}
	};

	const handleCancelState = () => {
		const workingColor = ColorUtils.getNewColor(
			{
				// eslint-disable-next-line react/no-access-state-in-setstate
				hex: currentColorState,
			},
			props.events.onValidateWorkingColor
		);
		setIsOpen(false);
		setWorkingColorState(workingColor);
		setPreviousWorkingColor(workingColor);
	};

	const handleColorChange = (property) => {
		return (event) => {
			const colorProperties = {};
			colorProperties[property] = event.target.value;
			setWorkingColor(event, colorProperties);
		};
	};

	const handleHexInputChange = (event, { labels }) => {
		const currentColor = event.target.value;
		const namedColorHex = ColorUtils.getHexFromNamedColor(currentColor);
		let isValid = false;

		if (props.events.onValidateColor) {
			isValid = props.events.onValidateColor(currentColor);
		} else {
			isValid = namedColorHex ? true : ColorUtils.isValidHex(currentColor);
		}

		setCurrentColorState(currentColor);
		setWorkingColorState(
			ColorUtils.getNewColor(
				{
					hex: namedColorHex || currentColor,
					name: namedColorHex ? currentColor.toLowerCase() : null,
				},
				props.events.onValidateWorkingColor
			)
		);
		setColorErrorMessage(isValid ? '' : labels.invalidColor);

		if (props.events.onChange) {
			props.events.onChange(event, {
				color: currentColor,
				isValid,
			});
		}
	};

	const handleNavigate = (property) => {
		return (event, { delta }) => {
			const colorProperties = {};
			colorProperties[property] = delta;
			const newColor = ColorUtils.getDeltaColor(
				colorProperties,
				props.events.onValidateWorkingColor,
				workingColorState
			);
			setWorkingColorState(newColor);
			setPreviousWorkingColor(workingColorState);

			if (props.events.onWorkingColorChange) {
				props.events.onWorkingColorChange(event, { color: newColor });
			}
		};
	};

	const handleSaturationValueChange = (event, { saturation, value }) => {
		setWorkingColor(event, {
			saturation,
			value,
		});
	};

	const handleSubmitButtonClick = (event) => {
		setIsOpen(false);
		setCurrentColorState(workingColorState.hex);
		setColorErrorMessage('');
		if (props.events.onChange) {
			props.events.onChange(event, {
				color: workingColorState.hex,
				isValid: true,
			});
		}
	};

	const handleSwatchButtonClick = () => {
		const workingColor = ColorUtils.getNewColor(
			{
				// eslint-disable-next-line react/no-access-state-in-setstate
				hex: workingColorState.hex,
			},
			props.events.onValidateWorkingColor
		);
		setIsOpen(!isOpen);
		setWorkingColorState(workingColor);
		setPreviousWorkingColor(previousWorkingColor);
		if (props.onRequestOpen) {
			props.onRequestOpen();
		}
	};

	const handleSwatchSelect = (event, { hex }) => {
		setWorkingColor(event, {
			hex,
		});
	};

	const labels = assign({}, defaultProps.labels, props.labels);

	const wrapper = useRef();
	return (
		<div
			className={classNames('slds-color-picker', props.className)}
			ref={wrapper}
		>
			<div className="slds-color-picker__summary">
				<label
					className={classNames(
						'slds-color-picker__summary-label',
						props.assistiveText.label ? 'slds-assistive-text' : ''
					)}
					htmlFor={
						!props.hideInput
							? `color-picker-summary-input-${generatedId}`
							: undefined
					}
					id={`color-picker-label-${generatedId}`}
				>
					{props.assistiveText.label ? props.assistiveText.label : labels.label}
				</label>
				{getPopover({ labels })}
				{getInput({ labels })}
				{!isOpen && colorErrorMessage ? (
					<p
						className="slds-form-error"
						id={`color-picker-summary-error-${generatedId}`}
					>
						{colorErrorMessage}
					</p>
				) : (
					''
				)}
			</div>
		</div>
	);
};

ColorPicker.propTypes = propTypes;
ColorPicker.defaultProps = defaultProps;
ColorPicker.displayName = COLOR_PICKER;

export default ColorPicker;
