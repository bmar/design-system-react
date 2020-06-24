/* eslint-disable max-lines */
/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// # Input Component

// Implements the [Input design pattern](https://lightningdesignsystem.com/components/forms/#flavor-input) in React. Does not yet implement [fixed text](https://lightningdesignsystem.com/components/forms/#flavor-input-input-fixed-text).
// Based on SLDS v2.2.1
//

// ### React
import React, { useCallback } from 'react';

import PropTypes from 'prop-types';

// ### classNames
// [github.com/JedWatson/classnames](https://github.com/JedWatson/classnames)
// This project uses `classnames`, "a simple javascript utility for conditionally
// joining classNames together."
import classNames from 'classnames';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

import Button from '../button';

// ## Children
import InputIcon from '../icon/input-icon';
import InnerInput from './private/inner-input';
import Label from '../utilities/label';

// This component's `checkProps` which issues warnings to developers about properties when in development mode (similar to React's built in development tools)
import checkProps from './check-props';

import { INPUT } from '../../utilities/constants';
import componentDoc from './component.json';
import FieldLevelHelpTooltip from '../tooltip/private/field-level-help-tooltip';

import useInterval from '../hooks/useInterval';

const COUNTER = 'counter';
const DECREMENT = 'Decrement';
const INCREMENT = 'Increment';

const defaultProps = {
	assistiveText: {
		decrement: `${DECREMENT} ${COUNTER}`,
		increment: `${INCREMENT} ${COUNTER}`,
	},
	type: 'text',
};

const displayName = INPUT;

const propTypes = {
	/**
	 * The aria-activedescendant attribute contains the ID of the currently active child object that is part of a composite widget within the Document Object Model. It makes do with the overhead of having all or more than one child focusable. As the name specifies, it helps in managing the current active child of the composite widget.
	 */
	'aria-activedescendant': PropTypes.string,
	/**
	 * Indicates if the suggestions in a composite widget are values that complete the current textbox input.
	 */
	'aria-autocomplete': PropTypes.string,
	/**
	 * An HTML ID that is shared with ARIA-supported devices with the
	 * `aria-controls` attribute in order to relate the input with
	 * another region of the page. An example would be a select box
	 * that shows or hides a panel.
	 */
	'aria-controls': PropTypes.string,
	/**
	 * The `aria-describedby` attribute is used to indicate the IDs of the elements that describe the object. It is used to establish a relationship between widgets or groups and text that described them. This is very similar to aria-labelledby: a label describes the essence of an object, while a description provides more information that the user might need.
	 */
	'aria-describedby': PropTypes.string,
	/**
	 * Use the `aria-expanded` state to indicate whether regions of the content are collapsible, and to expose whether a region is currently expanded or collapsed.
	 */
	'aria-expanded': PropTypes.bool,
	/**
	 * Indicates that the element has a popup context menu or sub-level menu.
	 */
	'aria-haspopup': PropTypes.bool,
	/**
	 * The aria-labelledby attribute contains the element IDs of labels in objects such as input elements, widgets, and groups. The attribute establishes relationships between objects and their labels. Assistive technology, such as screen readers, use this attribute to catalog the objects in a document so that users can navigate between them. Without an element ID, the assistive technology cannot catalog the object.
	 */
	'aria-labelledby': PropTypes.string,
	/**
	 * An HTML ID that is shared with ARIA-supported devices with the
	 * `aria-controls` attribute in order to relate the input with
	 * another region of the page. An example would be a search field
	 * that shows search results.
	 */
	'aria-owns': PropTypes.string,
	/**
	 * The `aria-required` attribute is used to indicate that user input is required on an element before a form can be submitted.
	 */
	'aria-required': PropTypes.bool,
	/**
	 * **Assistive text for accessibility**
	 * * `label`: Visually hidden label but read out loud by screen readers.
	 * * `spinner`: Text for loading spinner icon.
	 */
	assistiveText: PropTypes.shape({
		label: PropTypes.string,
		spinner: PropTypes.string,
	}),
	/**
	 * Disabled brower's autocomplete when "off" is used.
	 */
	autoComplete: PropTypes.string,
	/**
	 * Elements are added after the `input`.
	 */
	children: PropTypes.node,
	/**
	 * Class names to be added to the outer container of the input.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * This is the initial value of an uncontrolled form element and
	 * is present only to provide compatibility with hybrid framework
	 * applications that are not entirely React. It should only be used
	 * in an application without centralized state (Redux, Flux).
	 * "Controlled components" with centralized state is highly recommended.
	 * See [Code Overview](https://github.com/salesforce/design-system-react/blob/master/docs/codebase-overview.md#controlled-and-uncontrolled-components) for more information.
	 */
	defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * Disables the input and prevents editing the contents.
	 */
	disabled: PropTypes.bool,
	/**
	 * Message to display when the input is in an error state. When this is present, also visually highlights the component as in error.
	 */
	errorText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	/**
	 * A [Tooltip](https://react.lightningdesignsystem.com/components/tooltips/) component that is displayed next to the label.
	 */
	fieldLevelHelpTooltip: PropTypes.node,
	/**
	 * Displays text or node to the left of the input. This follows the fixed text input UX pattern.
	 */
	fixedTextLeft: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	/**
	 * Displays text or node to the right of the input. This follows the fixed text input UX pattern.
	 */
	fixedTextRight: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	/**
	 * If true, loading spinner appears inside input on right hand side.
	 */
	hasSpinner: PropTypes.bool,
	/**
	 * Left aligned icon, must be instace of `design-system-react/components/icon/input-icon`
	 */
	iconLeft: PropTypes.node,
	/**
	 * Right aligned icon, must be instace of `design-system-react/components/icon/input-icon`
	 */
	iconRight: PropTypes.node,
	/**
	 * Every input must have a unique ID in order to support keyboard navigation and ARIA support.
	 */
	id: PropTypes.string,
	/**
	 * Displays help text under the input.
	 */
	inlineHelpText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	/**
	 * This callback exposes the input reference / DOM node to parent components. `<Parent inputRef={(inputComponent) => input = inputComponent} />
	 */
	inputRef: PropTypes.func,
	/**
	 * Displays the value of the input statically. This follows the static input UX pattern.
	 */
	isStatic: PropTypes.bool,
	/**
	 * This label appears above the input.
	 */
	label: PropTypes.string,
	/**
	 * Triggered when focus is removed.
	 */
	onBlur: PropTypes.func,
	/**
	 * This callback fires when the input changes. Passes in `event, { value }`.
	 */
	onChange: PropTypes.func,
	/**
	 * This event fires when the input is clicked.
	 */
	onClick: PropTypes.func,
	/**
	 * Triggered when component is focused.
	 */
	onFocus: PropTypes.func,
	/**
	 * Similar to `onchange`. Triggered when an element gets user input.
	 */
	onInput: PropTypes.func,
	/**
	 * Triggered when a submittable `<input>` element is invalid.
	 */
	onInvalid: PropTypes.func,
	/**
	 * Triggered when a key is pressed down
	 */
	onKeyDown: PropTypes.func,
	/**
	 * Triggered when a key is pressed and released
	 */
	onKeyPress: PropTypes.func,
	/**
	 * Triggered when a key is released
	 */
	onKeyUp: PropTypes.func,
	/**
	 * Triggered after some text has been selected in an element.
	 */
	onSelect: PropTypes.func,
	/**
	 * Fires when a form is submitted.
	 */
	onSubmit: PropTypes.func,
	/**
	 * Text that will appear in an empty input.
	 */
	placeholder: PropTypes.string,
	/**
	 * Sets the minimum number of characters that an `<input>` can accept.
	 */
	minLength: PropTypes.string,
	/**
	 * Specifies minimum accepted value for a counter input
	 */
	minValue: PropTypes.number,
	/**
	 * Sets the maximum number of characters that an `<input>` can accept.
	 */
	maxLength: PropTypes.string,
	/**
	 * Specifies maximum accepted value for a counter input
	 */
	maxValue: PropTypes.number,
	/**
	 * Name of the submitted form parameter.
	 */
	name: PropTypes.string,
	/**
	 * Displays the value of the input as read-only. This is used in the inline edit UX pattern.
	 */
	readOnly: PropTypes.bool,
	/**
	 * Highlights the input as a required field (does not perform any validation).
	 */
	required: PropTypes.bool,
	/**
	 * ARIA role
	 */
	role: PropTypes.string,
	/**
	 * Determines the step size upon increment or decrement. Can be set to decimal values.
	 */
	step: PropTypes.number,
	/**
	 * styles to be added to input
	 */
	styleInput: PropTypes.object,
	/**
	 * Custom styles to be passed to the component container
	 */
	styleContainer: PropTypes.object,
	/**
	 * The `<Input>` element includes support for all HTML5 types.
	 */
	type: PropTypes.oneOf([
		'text',
		'password',
		'datetime',
		'datetime-local',
		'date',
		'month',
		'time',
		'week',
		'number',
		'email',
		'url',
		'search',
		'tel',
		'color',
	]),
	/**
	 * The input is a controlled component, and will always display this value.
	 */
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * Which UX pattern of input? The default is `base` while other option is `counter`
	 */
	variant: PropTypes.oneOf(['base', COUNTER]),
};

/**
 * The HTML `input` with a label and error messaging.
 */
const Input = (props) => {
	let inputRef = null;
	const stepping = {
		currentDelay: 500,
		initialDelay: 500,
		speedDelay: 75,
		timeout: {},
	};

	// `checkProps` issues warnings to developers about properties (similar to React's built in development tools)
	checkProps(INPUT, props, componentDoc);

	const generatedId = shortid.generate();
	const generatedErrorId = props.errorText ? shortid.generate() : null;

	const [startInterval, stopInterval, meanwhile] = useInterval(() => {
		stepping.currentDelay = stepping.speedDelay;
		performStep(direction);
	}, stepping.currentDelay);

	const getId = () => props.id || generatedId;

	const getErrorId = () => props['aria-describedby'] || generatedErrorId;

	const getValueAsNumber = () => {
		let value = 0;

		if (props.value !== undefined) {
			value = Number(props.value);
		} else if (inputRef) {
			value = Number(inputRef.value);
		}

		return value;
	};

	const getCounterButtonIcon = (direction) => {
		const value = getValueAsNumber();
		let disabled = false;

		if (
			props.disabled ||
			(direction === INCREMENT &&
				props.maxValue !== undefined &&
				value >= props.maxValue) ||
			(direction === DECREMENT &&
				props.minValue !== undefined &&
				value <= props.minValue)
		) {
			disabled = true;
		}

		return (
			<Button
				assistiveText={{
					icon: props.assistiveText[direction.toLowerCase()],
				}}
				className={classNames(
					'slds-button_icon-small',
					`slds-input__button_${direction.toLowerCase()}`
				)}
				disabled={disabled}
				iconCategory="utility"
				iconName={direction === DECREMENT ? 'ban' : 'new'}
				onKeyDown={(event) => {
					if (event.keyCode === 13) {
						performStep(direction, event);
					}
				}}
				onKeyUp={stopStepping}
				onMouseDown={(event) => {
					performStep(direction, event);
				}}
				onMouseLeave={stopStepping}
				onMouseUp={stopStepping}
				variant="icon"
			/>
		);
	};

	// This is convoluted to maintain backwards compatibility. Please remove deprecatedProps on next breaking change.
	const getIconRender = (position, iconPositionProp) => {
		let icon;

		// Remove at next breaking change
		/* eslint-disable react/prop-types */
		const deprecatedProps = {
			assistiveText: {
				icon:
					(props[iconPositionProp] &&
						props[iconPositionProp].props.assistiveText) ||
					props.iconAssistiveText,
			},
			category:
				(props[iconPositionProp] && props[iconPositionProp].props.category) ||
				props.iconCategory,
			name:
				(props[iconPositionProp] && props[iconPositionProp].props.name) ||
				props.iconName,
			onClick:
				(props[iconPositionProp] && props[iconPositionProp].props.onClick) ||
				props.onIconClick,
		};
		/* eslint-enable react/prop-types */

		if (props[iconPositionProp] && position && props[iconPositionProp]) {
			icon = React.cloneElement(props[iconPositionProp], {
				iconPosition: `${position}`,
			});
		} else if (deprecatedProps.name) {
			icon = <InputIcon iconPosition={position} {...deprecatedProps} />;
		}

		return icon;
	};

	const setInputRef = useCallback((ref) => {
		inputRef = ref;
		if (props.inputRef) {
			props.inputRef(ref);
		}
	});

	const handleChange = (event) => {
		if (props.onChange) {
			const data = {
				value: event.target.value,
			};

			if (props.variant === COUNTER) {
				data.number = Number(data.value);
			}

			props.onChange(event, data);
		}
	};

	const performStep = (direction, event) => {
		// clearTimeout(stepping.timeout);
		stopInterval();

		const { maxValue } = props;
		const { minValue } = props;
		const step = props.step !== undefined ? Number(props.step) : 1;
		let value = getValueAsNumber();
		let valueChanged = false;

		if (direction === DECREMENT && maxValue !== undefined && value > maxValue) {
			value = Number(maxValue);
			valueChanged = true;
		} else if (
			direction === INCREMENT &&
			minValue !== undefined &&
			value < minValue
		) {
			value = Number(minValue);
			valueChanged = true;
		} else {
			const decimalPlaces =
				String(step).search(/\./) >= 0 ? String(step).split('.')[1].length : 0;
			let minOverflow = 0;

			if (minValue !== undefined) {
				minOverflow = (value - minValue) % step;
			}

			if (minOverflow > 0) {
				// Default browser inputs of type number with a min attribute alter the value upon change as needed so
				// that with enough decrements it can reach the exact min value. This behavior is reflected here
				value =
					direction === DECREMENT
						? value - minOverflow
						: value + (step - minOverflow);
			} else {
				value = direction === DECREMENT ? value - step : value + step;
			}

			value = Number(value.toFixed(decimalPlaces));

			if (
				!(maxValue !== undefined && value > maxValue) &&
				!(minValue !== undefined && value < minValue)
			) {
				valueChanged = true;
			}
		}

		if (valueChanged) {
			/*
			 * Use of `forceUpdate` is an anti-pattern. This code only executes if this `input` element is uncontrolled which this library believes is an anti-pattern, also. This code is only present to allow for the edge case of uncontrolled use of an `input`.
			 */
			if (props.value === undefined && inputRef) {
				inputRef.value = String(value);
				forceUpdate();
			} else if (props.onChange) {
				props.onChange(event, {
					number: value,
					value: String(value),
				});
			}
		}

		if (
			(direction === INCREMENT &&
				maxValue !== undefined &&
				value >= maxValue) ||
			(direction === DECREMENT && minValue !== undefined && value <= minValue)
		) {
			stopStepping();
		} else {
			// stepping.timeout = setTimeout(() => {
			// 	stepping.currentDelay = stepping.speedDelay;
			// 	performStep(direction);
			// }, stepping.currentDelay);
			startInterval();
		}
	};

	const stopStepping = () => {
		// clearTimeout(stepping.timeout);
		stopInterval();
		stepping.timeout = null;
		stepping.currentDelay = stepping.initialDelay;
	};

	const assistiveText = {
		...defaultProps.assistiveText,
		...props.assistiveText,
	};
	const inputRefRender =
		props.variant === COUNTER ? setInputRef : props.inputRef;
	let iconLeft = null;
	let iconRight = null;

	const hasRenderedLabel =
		props.label || (assistiveText && assistiveText.label);

	// Remove at next breaking change
	// this is a hack to make left the default prop unless overwritten by `iconPosition="right"`
	if (
		!!props.iconLeft ||
		((props.iconPosition === 'left' || props.iconPosition === undefined) &&
			!!props.iconName)
	) {
		iconLeft = getIconRender('left', 'iconLeft');
	} else if (props.variant === COUNTER && !props.isStatic && !props.readOnly) {
		iconLeft = getCounterButtonIcon(DECREMENT);
	}

	if (
		!!props.iconRight ||
		(props.iconPosition === 'right' && !!props.iconName)
	) {
		iconRight = getIconRender('right', 'iconRight');
	} else if (props.variant === COUNTER && !props.isStatic && !props.readOnly) {
		iconRight = getCounterButtonIcon(INCREMENT);
	}

	return (
		<div
			className={classNames(
				'slds-form-element',
				{
					'slds-has-error': props.errorText,
				},
				props.className
			)}
			style={props.styleContainer}
		>
			<Label
				assistiveText={assistiveText}
				htmlFor={props.isStatic ? undefined : getId()}
				label={props.label}
				required={props.required}
				variant={props.isStatic ? 'static' : 'base'}
			/>
			{props.fieldLevelHelpTooltip && hasRenderedLabel ? (
				<FieldLevelHelpTooltip
					assistiveText={{
						triggerLearnMoreIcon: assistiveText.fieldLevelHelpButton,
					}}
					fieldLevelHelpTooltip={props.fieldLevelHelpTooltip}
				/>
			) : null}
			<InnerInput
				aria-activedescendant={props['aria-activedescendant']}
				aria-autocomplete={props['aria-autocomplete']}
				aria-controls={props['aria-controls']}
				aria-labelledby={props['aria-labelledby']}
				aria-describedby={getErrorId()}
				aria-expanded={props['aria-expanded']}
				aria-owns={props['aria-owns']}
				aria-required={props['aria-required']}
				autoComplete={props.autoComplete}
				className={classNames({
					'slds-input_counter': props.variant === COUNTER,
					'slds-p-horizontal_none': props.variant === COUNTER && props.readOnly,
				})}
				containerProps={{
					className: 'slds-form-element__control',
				}}
				defaultValue={props.defaultValue}
				disabled={props.disabled}
				fixedTextLeft={props.fixedTextLeft}
				fixedTextRight={props.fixedTextRight}
				hasSpinner={props.hasSpinner}
				id={getId()}
				iconLeft={iconLeft}
				iconRight={iconRight}
				inlineEditTrigger={props.inlineEditTrigger}
				inlineHelpText={props.inlineHelpText}
				isStatic={props.isStatic}
				minLength={props.minLength}
				minValue={props.minValue}
				maxLength={props.maxLength}
				maxValue={props.maxValue}
				name={props.name}
				onBlur={props.onBlur}
				onChange={handleChange}
				onClick={props.onClick}
				onFocus={props.onFocus}
				onInput={props.onInput}
				onInvalid={props.onInvalid}
				onKeyDown={props.onKeyDown}
				onKeyPress={props.onKeyPress}
				onKeyUp={props.onKeyUp}
				onSelect={props.onSelect}
				onSubmit={props.onSubmit}
				placeholder={props.placeholder}
				inputRef={inputRefRender}
				readOnly={props.readOnly}
				required={props.required}
				role={props.role}
				assistiveText={props.assistiveText}
				type={props.variant === COUNTER ? 'number' : props.type}
				value={props.value}
				variant={props.variant}
				step={props.step}
				style={props.styleInput}
			/>
			{props.errorText && (
				<div id={getErrorId()} className="slds-form-element__help">
					{props.errorText}
				</div>
			)}
			{props.children}
		</div>
	);
};

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;
Input.displayName = displayName;

export default Input;
