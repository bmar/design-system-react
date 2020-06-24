/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Expression Condition design pattern](https://lightningdesignsystem.com/components/expression/) in React.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import assign from 'lodash.assign';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

import { EXPRESSION_CONDITION } from '../../utilities/constants';

import Combobox from '../combobox';
import Input from '../input';
import Button from '../button';

const propTypes = {
	/**
	 *  **Assistive text for accessibility.**
	 * * `title`: For users of assistive technology, title for the condition fieldset. Defaults to 'Condition'
	 * * `deleteIcon`: For users of assistive technology, assistive text for the Delete Condition button's icon. Defaults to 'Delete Condition'
	 */
	assistiveText: PropTypes.shape({
		title: PropTypes.string,
		deleteIcon: PropTypes.string,
	}),
	/**
	 * HTML id for component.
	 */
	id: PropTypes.string,
	/**
	 * CSS classes to be added to the element with class `.slds-expression__row`. Uses `classNames` [API](https://github.com/JedWatson/classnames).
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Callbacks for various expression condition events such as value change, delete etc
	 */
	events: PropTypes.shape({
		onChangeResource: PropTypes.func,
		onChangeOperator: PropTypes.func,
		onChangeValue: PropTypes.func,
		onDelete: PropTypes.func,
	}).isRequired,
	/**
	 * If set to true, the component will focus on the first focusable input upon mounting. This is useful for accessibility when adding new conditions.
	 */
	focusOnMount: PropTypes.bool,
	/**
	 * **Text labels for internationalization**
	 * This object is merged with the default props object on every
	 * * `deleteCondition`: Title for the delete condition button. Defaults to "Delete Condition".
	 * * `label`: Label for the condition, shown left-most in the row. Left empty on default.
	 * * `operator`: Label for the operator selection dropdown. Defaults to "Operator"
	 * * `resource`: Label for the resource selection dropdown. Defaults to "Resource"
	 * * `value`: Label for the value input box. Defaults to "Value"
	 */
	labels: PropTypes.shape({
		deleteCondition: PropTypes.string,
		label: PropTypes.string,
		operator: PropTypes.string,
		resource: PropTypes.string,
		value: PropTypes.string,
	}),
	/**
	 * Controls whether the condition is a sub-condition inside a ExpressionGroup
	 */
	isSubCondition: PropTypes.bool,
	/**
	 * **Array of item objects that are options in the resource selection dropdown menu.**
	 * Each object can contain:
	 * * `id`: A unique identifier string.
	 * * `label`: A primary string of text for a menu item.
	 * ```
	 * {
	 * 	id: '1',
	 * 	label: 'Resource 1',
	 * },
	 * ```
	 * Note: The dropdown uses the Combobox Component, and `resourcesList` is
	 * passed as `options` props to it, and hence shall also support more
	 * custom objects. Please refer to the Combobox documentation.
	 */
	resourcesList: PropTypes.arrayOf(PropTypes.object),
	/**
	 *  Accepts an object from the `resourcesList` which needs to be selected
	 *  for the resource dropdown menu,
	 */
	resourceSelected: PropTypes.object,
	/**
	 * **Array of item objects that are options in the operator selection dropdown menu.**
	 * Each object can contain:
	 * * `id`: A unique identifier string.
	 * * `label`: A primary string of text for a menu item.
	 * ```
	 * {
	 * 	id: '1',
	 * 	label: 'Operator 1',
	 * },
	 * ```
	 * Note: The dropdown uses the Combobox Component, and `operatorList` is
	 * passed as `options` props to it, and hence shall also support more
	 * custom objects. Please refer to the Combobox documentation.
	 */
	operatorsList: PropTypes.arrayOf(PropTypes.object),
	/**
	 *  Accepts an object from the `operatorSelected` which needs to be selected
	 *  for the operator dropdown menu,
	 */
	operatorSelected: PropTypes.object,
	/**
	 *  Sets the input value for the Value input field.
	 */
	value: PropTypes.string,
};

const defaultProps = {
	assistiveText: {
		title: 'Condition',
		deleteIcon: 'Delete Condition',
	},
	labels: {
		label: '',
		operator: 'Operator',
		resource: 'Resource',
		value: 'Value',
		deleteCondition: 'Delete Condition',
	},
	value: '',
};
/**
 * Expression Condition Component
 */
const ExpressionCondition = (props) => {
	const generatedId = shortid.generate();
	const rootNode = useRef();

	useEffect(() => {
		if (props.focusOnMount && rootNode) {
			const input = rootNode.current.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	});

	/**
	 * Get the Expression Condition's HTML id. Generate a new one if no ID present.
	 */
	const getId = () => {
		return props.id || generatedId;
	};

	const assistiveText = assign(
		{},
		defaultProps.assistiveText,
		props.assistiveText
	);
	const labels = assign({}, defaultProps.labels, props.labels);
	return (
		<li
			className={classNames(
				`slds-expression__row`,
				{ 'slds-expression__row_group': props.isSubCondition },
				props.className
			)}
			id={getId()}
			ref={rootNode}
		>
			<fieldset>
				<legend className="slds-expression__legend">
					<span>{labels.label}</span>
					<span className="slds-assistive-text">{assistiveText.title}</span>
				</legend>
				<div className="slds-grid slds-gutters_xx-small">
					<div className="slds-col">
						<Combobox
							events={{
								onSelect: props.events.onChangeResource,
							}}
							id={`${getId()}-resource-selector`}
							multiple={false}
							variant="readonly"
							labels={{ label: labels.resource }}
							options={props.resourcesList}
							selection={[props.resourceSelected]}
						/>
					</div>
					<div className="slds-col slds-grow-none">
						<Combobox
							events={{
								onSelect: props.events.onChangeOperator,
							}}
							id={`${getId()}-operator-selector`}
							multiple={false}
							variant="readonly"
							labels={{ label: labels.operator }}
							options={props.operatorsList}
							selection={[props.operatorSelected]}
							singleInputDisabled={!props.resourceSelected}
						/>
					</div>
					<div className="slds-col">
						<Input
							id={`${getId()}-input`}
							label={labels.value}
							value={props.value}
							onChange={props.events.onChangeValue}
							disabled={!props.resourceSelected}
						/>
					</div>
					<div className="slds-col slds-grow-none">
						<div className="slds-form-element">
							<span className="slds-form-element__label">&nbsp;</span>
							<div className="slds-form-element__control">
								<Button
									id={`${getId()}-delete-button`}
									variant="outline-brand"
									iconCategory="utility"
									iconName="delete"
									iconVariant="border-filled"
									onClick={props.events.onDelete}
									assistiveText={{
										icon: assistiveText.deleteIcon,
									}}
									title={labels.deleteCondition}
								/>
							</div>
						</div>
					</div>
				</div>
			</fieldset>
		</li>
	);
};

ExpressionCondition.displayName = EXPRESSION_CONDITION;
ExpressionCondition.propTypes = propTypes;
ExpressionCondition.defaultProps = defaultProps;

export default ExpressionCondition;
