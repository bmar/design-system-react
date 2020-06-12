/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Button Group design pattern](https://lightningdesignsystem.com/components/button-groups/) in React.
// Based on SLDS v2.1.1

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import assign from 'lodash.assign';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

import { BUTTON_GROUP } from '../../utilities/constants';

const propTypes = {
	/**
	 * Children are expected to be components. If last button triggers a dropdown menu, use Dropdown instead of Button. _Tested with snapshot testing._
	 */
	children: PropTypes.node.isRequired,
	/**
	 * CSS classes added to `slds-button-group` or `slds-checkbox_button-group` tag
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * If the `labels.label` prop is set, a `.slds-form-element` classed fieldset element is added as a container. This prop applies classes to that element
	 */
	classNameContainer: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * HTML id for component.
	 */
	id: PropTypes.string,
	/**
	 * **Text labels for internationalization**
	 * This object is merged with the default props object on every render.
	 * * `error`: Message to display when any of Checkboxes are in an error state. _Tested with snapshot testing._
	 * * `label`: This label appears above the button group. _Tested with snapshot testing._
	 */
	labels: PropTypes.shape({
		error: PropTypes.string,
		label: PropTypes.string,
	}),
	/**
	 * Use checkbox variant for "Checkbox Button Group" styling and add Checkbox components as children _Tested with snapshot testing._
	 */
	variant: PropTypes.oneOf(['checkbox', 'list']),
};

const defaultProps = { labels: {} };

/**
 * The ButtonGroup component wraps other components (ie. Button, MenuDropdown, PopoverTooltip, Checkboxes, etc).
 */
const ButtonGroup = (props) => {
	const generatedId = shortid.generate();

	const getId = () => {
		return props.id || generatedId;
	};

	// Merge objects of strings with their default object
	const labels = assign({}, defaultProps.labels, props.labels);

	const zeroIndexLength = React.Children.count(props.children) - 1;
	let { children } = props;
	if (zeroIndexLength > 0) {
		children = React.Children.map(props.children, (child, index) => {
			let newChild;
			if (index === zeroIndexLength) {
				newChild = React.cloneElement(child, {
					triggerClassName: 'slds-button_last',
				});
			}

			return newChild || child;
		});
	}

	let component;

	if (props.variant === 'checkbox') {
		children = React.Children.map(props.children, (child) => {
			const cloneProps = {
				variant: 'button-group',
			};
			if (labels.error) {
				cloneProps['aria-describedby'] = `button-group-error-${getId()}`;
			}
			return React.cloneElement(child, cloneProps);
		});

		component = (
			<div
				className={classNames('slds-checkbox_button-group', props.className)}
				id={getId()}
			>
				{children}
			</div>
		);
	} else if (props.variant === 'list') {
		component = (
			<ul
				className={classNames('slds-button-group-list', props.className)}
				id={getId()}
			>
				{React.Children.map(props.children, (child) => (
					<li>{child}</li>
				))}
			</ul>
		);
	} else {
		component = (
			<div
				className={classNames('slds-button-group', props.className)}
				id={getId()}
				role="group"
			>
				{children}
			</div>
		);
	}

	if (props.variant === 'checkbox' || props.labels.label) {
		component = (
			<fieldset
				className={classNames(
					'slds-form-element',
					{
						'slds-has-error': labels.error,
					},
					props.classNameContainer
				)}
			>
				<legend className="slds-form-element__legend slds-form-element__label">
					{props.labels.label}
				</legend>
				<div className="slds-form-element__control">
					{component}
					{labels.error ? (
						<div
							className="slds-form-element__help"
							id={`button-group-error-${getId()}`}
						>
							{labels.error}
						</div>
					) : null}
				</div>
			</fieldset>
		);
	}

	return component;
};

ButtonGroup.displayName = BUTTON_GROUP;
ButtonGroup.propTypes = propTypes;
ButtonGroup.defaultProps = defaultProps;

export default ButtonGroup;
