/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// # Checkbox Component

// Implements the [Checkbox design pattern](https://www.lightningdesignsystem.com/components/forms/#checkbox) in React.

import React, {
	useCallback,
	useRef,
	useImperativeHandle,
	forwardRef,
} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

// ### Event Helpers
import KEYS from '../../utilities/key-code';
import EventUtil from '../../utilities/event';

// This component's `checkProps` which issues warnings to developers about properties when in development mode (similar to React's built in development tools)
import checkProps from './check-props';
import componentDoc from './component.json';

import { CHECKBOX } from '../../utilities/constants';
import Icon from '../icon';

import getAriaProps from '../../utilities/get-aria-props';

const propTypes = {
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
	 * The aria-labelledby attribute establishes relationships between objects and their label(s), and its value should be one or more element IDs, which refer to elements that have the text needed for labeling. List multiple element IDs in a space delimited fashion.
	 */
	'aria-labelledby': PropTypes.string,
	/**
	 * `aria-owns` indicate that an element depends on the current one when the relation can't be determined by the hierarchy structure.
	 */
	'aria-owns': PropTypes.string,
	/**
	 * The `aria-required` attribute is used to indicate that user input is required on an element before a form can be submitted.
	 */
	'aria-required': PropTypes.bool,
	/**
	 * **Assistive text for accessibility**
	 * This object is merged with the default props object on every render.
	 * * `heading`: This is used as a visually hidden label if, no `labels.heading` is provided.
	 * * `label`: This is used as a visually hidden label if, no `labels.label` is provided.
	 */
	assistiveText: PropTypes.shape({
		heading: PropTypes.string,
		label: PropTypes.string,
	}),
	/**
	 * The Checkbox should be a controlled component, and will always be in the state specified. If checked is not defined, the state of the uncontrolled native `input` component will be used.
	 */
	checked: PropTypes.bool,
	/**
	 * This is the initial value of an uncontrolled form element and is present only
	 * to provide compatibility with hybrid framework applications that are not
	 * entirely React. It should only be used in an application without centralized
	 * state (Redux, Flux). "Controlled components" with centralized state is highly recommended. See [Code Overview](https://github.com/salesforce/design-system-react/blob/master/docs/codebase-overview.md#controlled-and-uncontrolled-components) for more information.
	 */
	defaultChecked: PropTypes.bool,
	/**
	 * Class names to be added to the outer container of the Checkbox.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Disables the Checkbox and prevents clicking it.
	 */
	disabled: PropTypes.bool,
	/**
	 * Message to display when the Checkbox is in an error state. When this is present, also visually highlights the component as in error.
	 */
	errorText: PropTypes.string,
	/**
	 * A unique ID is needed in order to support keyboard navigation and ARIA support. This ID is added to the `input` element
	 */
	id: PropTypes.string,
	/**
	 * The Checkbox will be indeterminate if its state can not be figured out or is partially checked. Once a checkbox is indeterminate, a click should cause it to be checked. Since a user cannot put a checkbox into an indeterminate state, it is assumed you are controlling the value of `checked` with the parent, also, and that this is a controlled component. **Note:** `indeterminate` proptype does nothing in the `toggle` variant, as [SLDS does not support it](https://lightningdesignsystem.com/components/forms/#flavor-checkbox-toggle-checkbox-toggle).
	 */
	indeterminate: PropTypes.bool,
	/**
	 * **Text labels for internationalization**
	 * This object is merged with the default props object on every render.
	 * * `heading`: Heading for the visual picker variant
	 * * `label`: Label for the _enabled_ state of the Toggle variant. Defaults to "Enabled".
	 * * `toggleDisabled`: Label for the _disabled_ state of the Toggle variant. Defaults to "Disabled". Note that this uses SLDS language, and meaning, of "Enabled" and "Disabled"; referring to the state of whatever the checkbox is _toggling_, not whether the checkbox itself is enabled or disabled.
	 * * `toggleEnabled`: Label for the _enabled_ state of the Toggle variant. Defaults to "Enabled".
	 */
	labels: PropTypes.shape({
		heading: PropTypes.string,
		label: PropTypes.string,
		toggleDisabled: PropTypes.string,
		toggleEnabled: PropTypes.string,
	}),
	/**
	 * Name of the submitted form parameter.
	 */
	name: PropTypes.string,
	/**
	 * This event fires when the Checkbox looses focus. It passes in `{ event }`.
	 */
	onBlur: PropTypes.func,
	/**
	 * This event fires when the Checkbox changes. Passes in `event, { checked }`. This used to be `checked, event, { checked }`.
	 */
	onChange: PropTypes.func,
	/**
	 * This event fires when the Checkbox is focused. It passes in `{ event }`.
	 */
	onFocus: PropTypes.func,
	/**
	 * This event fires when a key is pressed down. It passes in `{ event }`.
	 */
	onKeyDown: PropTypes.func,
	/**
	 * This event fires when a character is typed. See [this article](http://www.bloggingdeveloper.com/post/KeyPress-KeyDown-KeyUp-The-Difference-Between-Javascript-Key-Events.aspx) for more information. It passes in `{ event }`.
	 */
	onKeyPress: PropTypes.func,
	/**
	 * This event fires when a pressed key is released. It passes in `{ event }`.
	 */
	onKeyUp: PropTypes.func,
	/**
	 * Displays the value of the input, but does not allow changes.
	 */
	readOnly: PropTypes.bool,
	/**
	 * Highlights the Checkbox as a required field (does not perform any validation).
	 */
	required: PropTypes.bool,
	/**
	 * The aria-role of the checkbox.
	 */
	role: PropTypes.string,
	/**
	 * Which UX pattern of checkbox? The default is `base` while other option is `toggle`. (**Note:** `toggle` variant does not support the `indeterminate` feature, because [SLDS does not support it](https://lightningdesignsystem.com/components/forms/#flavor-checkbox-toggle-checkbox-toggle).)
	 */
	variant: PropTypes.oneOf(['base', 'toggle', 'button-group', 'visual-picker']),
	/**
	 * Determines whether visual picker is coverable when selected (only for visual picker variant)
	 */
	coverable: PropTypes.bool,
	/**
	 * Determines whether the visual picker should be vertical or horizontal (only for visual picker variant)
	 */
	vertical: PropTypes.bool,
	/**
	 * Allows icon to shown with checkbox (only for non-coverable visual picker variant)
	 */
	onRenderVisualPicker: PropTypes.func,
	/**
	 * Allows icon to shown if checkbox is not selected (only for visual picker variant)
	 */
	onRenderVisualPickerSelected: PropTypes.func,
	/**
	 * Allows icon to shown if checkbox is not selected (only for visual picker variant)
	 */
	onRenderVisualPickerNotSelected: PropTypes.func,
	/**
	 * Size of checkbox in case of visual composer variant
	 */
	size: PropTypes.oneOf(['medium', 'large']),
};

const defaultProps = {
	assistiveText: {},
	labels: {
		toggleDisabled: 'Disabled',
		toggleEnabled: 'Enabled',
	},
	variant: 'base',
};

/**
 * The ability to style checkboxes with CSS varies across browsers. Using this component ensures checkboxes look the same everywhere.
 */
const Checkbox = (props) => {
	checkProps(CHECKBOX, props, componentDoc);
	const generatedId = shortid.generate();

	const getId = () => props.id || generatedId;

	const getErrorId = () =>
		props.errorText ? `${getId()}-error-text` : undefined;

	const getAriaDescribedBy = ({ idArray = [] } = {}) =>
		idArray
			.concat(props['aria-describedby'], getErrorId())
			.filter(Boolean)
			.join(' ') || undefined;

	const handleChange = (event) => {
		const { checked, indeterminate, onChange } = props;

		if (typeof onChange === 'function') {
			// `target.checked` is present twice to maintain backwards compatibility. Please remove first parameter `value` on the next breaking change or when `forms/checkbox` is removed.
			if (props.oldEventParameterOrder) {
				onChange(event.target.checked, event, {
					checked: indeterminate ? true : !checked,
					indeterminate: false,
				});
			} else {
				// NEW API
				onChange(event, {
					checked: indeterminate ? true : !checked,
					indeterminate: false,
				});
			}
		}
	};

	const handleKeyDown = (event) => {
		if (event.keyCode) {
			if (event.keyCode === KEYS.ENTER || event.keyCode === KEYS.SPACE) {
				EventUtil.trapImmediate(event);
				handleChange(event);
			}
		}
	};

	const group = useRef((component) => {
		input = component;
	});
	const renderButtonGroupVariant = (
		props,
		ariaProps,
		assistiveText,
		labels
	) => (
		<span className="slds-button slds-checkbox_button">
			<input
				disabled={props.disabled}
				/* A form element should not have both checked and defaultChecked props. */
				{...(props.checked !== undefined
					? { checked: props.checked }
					: { defaultChecked: props.defaultChecked })}
				id={getId()}
				name={props.name}
				onBlur={props.onBlur}
				onChange={handleChange}
				onFocus={props.onFocus}
				onKeyDown={props.onKeyDown}
				onKeyPress={props.onKeyPress}
				onKeyUp={props.onKeyUp}
				ref={group}
				role={props.role}
				required={props.required}
				type="checkbox"
				{...ariaProps}
				aria-describedby={getAriaDescribedBy()}
			/>
			<label className="slds-checkbox_button__label" htmlFor={getId()}>
				<span className="slds-checkbox_faux">{labels.label}</span>
				{assistiveText.label ? (
					<span className="slds-assistive-text">{assistiveText.label}</span>
				) : null}
			</label>
		</span>
	);

	const basevar = useCallback((component) => {
		if (component) {
			// eslint-disable-next-line no-param-reassign
			component.indeterminate = props.indeterminate;
		}
	});
	function renderBaseVariant(props, ariaProps, assistiveText, labels, ref) {
		return (
			<div
				className={classNames(
					'slds-form-element',
					{
						'is-required': props.required,
						'slds-has-error': props.errorText,
					},
					props.className
				)}
			>
				<div className="slds-form-element__control">
					<span className="slds-checkbox">
						{props.required ? (
							<abbr className="slds-required" title="required">
								{'*'}
							</abbr>
						) : null}
						<input
							disabled={props.disabled}
							/* A form element should not have both checked and defaultChecked props. */
							{...(props.checked !== undefined
								? { checked: props.checked }
								: { defaultChecked: props.defaultChecked })}
							id={getId()}
							name={props.name}
							onBlur={props.onBlur}
							onChange={handleChange}
							onFocus={props.onFocus}
							onKeyDown={props.onKeyDown}
							onKeyPress={props.onKeyPress}
							onKeyUp={props.onKeyUp}
							ref={basevar}
							role={props.role}
							required={props.required}
							type="checkbox"
							{...ariaProps}
							aria-describedby={getAriaDescribedBy()}
						/>
						<label
							className="slds-checkbox__label"
							htmlFor={getId()}
							id={props.labelId}
						>
							<span className="slds-checkbox_faux" />
							{labels.label ? (
								<span className="slds-form-element__label">{labels.label}</span>
							) : null}
							{assistiveText.label ? (
								<span className="slds-assistive-text">
									{assistiveText.label}
								</span>
							) : null}
						</label>
					</span>
				</div>
				{props.errorText ? (
					<div className="slds-form-element__help" id={getErrorId()}>
						{props.errorText}
					</div>
				) : null}
			</div>
		);
	}

	const toggle = useRef((component) => {
		input = component;
	});
	const renderToggleVariant = (props, ariaProps, assistiveText, labels) => (
		<div
			className={classNames(
				'slds-form-element',
				{
					'is-required': props.required,
					'slds-has-error': props.errorText,
				},
				props.className
			)}
		>
			<label className="slds-checkbox_toggle slds-grid" htmlFor={getId()}>
				{props.required ? (
					<abbr className="slds-required" title="required">
						{'*'}
					</abbr>
				) : null}
				{labels.label ? (
					<span className="slds-form-element__label slds-m-bottom_none">
						{labels.label}
					</span>
				) : null}
				{assistiveText.label ? (
					<span className="slds-assistive-text">{assistiveText.label}</span>
				) : null}
				<input
					disabled={props.disabled}
					id={getId()}
					/* A form element should not have both checked and defaultChecked props. */
					{...(props.checked !== undefined
						? { checked: props.checked }
						: { defaultChecked: props.defaultChecked })}
					name={props.name}
					onBlur={props.onBlur}
					onChange={handleChange}
					onFocus={props.onFocus}
					onKeyDown={props.onKeyDown}
					onKeyPress={props.onKeyPress}
					onKeyUp={props.onKeyUp}
					ref={toggle}
					role={props.role}
					required={props.required}
					type="checkbox"
					{...ariaProps}
					aria-describedby={getAriaDescribedBy({
						idArray: [`${getId()}-desc`],
					})}
				/>
				<span
					id={`${getId()}-desc`}
					className="slds-checkbox_faux_container"
					aria-live="assertive"
				>
					<span className="slds-checkbox_faux" />
					<span className="slds-checkbox_on">{labels.toggleEnabled}</span>
					<span className="slds-checkbox_off">{labels.toggleDisabled}</span>
				</span>
			</label>
			{props.errorText ? (
				<div className="slds-form-element__help" id={getErrorId()}>
					{props.errorText}
				</div>
			) : null}
		</div>
	);

	const picker = useRef((component) => {
		input = component;
	});
	const renderVisualPickerVariant = (props, ariaProps, assistiveText) => (
		<span
			className={classNames(
				'slds-visual-picker',
				`slds-visual-picker_${props.size}`,
				props.vertical ? 'slds-visual-picker_vertical' : null
			)}
		>
			<input
				disabled={props.disabled}
				/* A form element should not have both checked and defaultChecked props. */
				{...(props.checked !== undefined
					? { checked: props.checked }
					: { defaultChecked: props.defaultChecked })}
				id={getId()}
				name={props.name}
				onBlur={props.onBlur}
				onChange={handleChange}
				onFocus={props.onFocus}
				onKeyDown={props.onKeyDown}
				onKeyPress={props.onKeyPress}
				onKeyUp={props.onKeyUp}
				ref={picker}
				role={props.role}
				required={props.required}
				type="checkbox"
				{...ariaProps}
				aria-describedby={getAriaDescribedBy()}
			/>
			<label className="slds-checkbox_button__label" htmlFor={getId()}>
				{props.coverable ? (
					<div className="slds-visual-picker__figure slds-visual-picker__icon slds-align_absolute-center">
						<span className="slds-is-selected">
							{props.onRenderVisualPickerSelected()}
						</span>
						<span className="slds-is-not-selected">
							{props.onRenderVisualPickerNotSelected()}
						</span>
					</div>
				) : (
					<span className="slds-visual-picker__figure slds-visual-picker__text slds-align_absolute-center">
						{props.onRenderVisualPicker()}
					</span>
				)}
				{!props.vertical ? (
					<span className="slds-visual-picker__body">
						{props.labels.heading ? (
							<span className="slds-text-heading_small">
								{props.labels.heading}
							</span>
						) : null}
						<span className="slds-text-title">{props.labels.label}</span>
						{assistiveText.label || assistiveText.heading ? (
							<span className="slds-assistive-text">
								{assistiveText.label || assistiveText.heading}
							</span>
						) : null}
					</span>
				) : null}
				{!props.coverable ? (
					<span className="slds-icon_container slds-visual-picker__text-check">
						<Icon
							assistiveText={props.assistiveText}
							category="utility"
							name="check"
							colorVariant="base"
							size="x-small"
						/>
					</span>
				) : null}
			</label>
		</span>
	);

	const ariaProps = getAriaProps(props);

	if (props.variant === 'toggle') {
		ariaProps['aria-describedby'] = `${getId()}-desc`;
	}

	const assistiveText = {
		...defaultProps.assistiveText,
		/* Remove backward compatibility at next breaking change */
		...(typeof props.assistiveText === 'string'
			? { label: props.assistiveText }
			: {}),
		...(typeof props.assistiveText === 'object' ? props.assistiveText : {}),
	};
	const labels = {
		...defaultProps.labels,
		/* Remove backward compatibility at next breaking change */
		...(props.label ? { label: props.label } : {}),
		...props.labels,
	};

	const subRenders = {
		base: renderBaseVariant,
		'button-group': renderButtonGroupVariant,
		toggle: renderToggleVariant,
		'visual-picker': renderVisualPickerVariant,
	};
	const variantExists = subRenders[props.variant];

	return variantExists
		? subRenders[props.variant](props, ariaProps, assistiveText, labels)
		: subRenders.base(props, ariaProps, assistiveText, labels);
};

Checkbox.displayName = CHECKBOX;
Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
