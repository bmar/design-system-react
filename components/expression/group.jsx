/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Expression Group design pattern](https://lightningdesignsystem.com/components/expression/) in React.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import assign from 'lodash.assign';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

import { EXPRESSION_GROUP } from '../../utilities/constants';

import Combobox from '../combobox';
import Button from '../button';
import Input from '../input';

const propTypes = {
	/**
	 *  **Assistive text for accessibility.**
	 * * `label`: For users of assistive technology, assistive text for the expression group's label.
	 * * `addCondition`: For users of assistive technology, assistive text for the Add Condition button's icon.
	 * * `addGroup`: For users of assistive technology, assistive text for the Add Group button's icon.
	 */
	assistiveText: PropTypes.shape({
		label: PropTypes.string,
		addCondition: PropTypes.string,
		addGroup: PropTypes.string,
	}),
	/**
	 * HTML id for ExpressionGroup component.
	 */
	id: PropTypes.string,
	/**
	 * `ExpressionGroup` children, accepts `ExpressionCondition`. (Also accepts sub-`ExpressionGroup` if `isRoot`)
	 */
	children: PropTypes.node,
	/**
	 * CSS classes to be added to the element with class `.slds-expression__group`. Uses `classNames` [API](https://github.com/JedWatson/classnames).
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Callbacks for various expression group events such as trigger change, add condition etc
	 */
	events: PropTypes.shape({
		onChangeTrigger: PropTypes.func,
		onChangeCustomLogicValue: PropTypes.func,
		onAddCondition: PropTypes.func,
		onAddGroup: PropTypes.func,
	}),
	/**
	 * If set to true, the component will focus on the first focusable input upon mounting. This is useful for accessibility when adding new groups.
	 */
	focusOnMount: PropTypes.bool,
	/**
	 * **Text labels for internationalization**
	 * This object is merged with the default props object on every render.
	 * * `addCondition`: Label for the Add Condition Button. Defaults to "Add Condition"
	 * * `addGroup`: Label for the Add Group Button. Defaults to "Add Group"
	 * * `customLogic`: Label for the text box for inputting `customLogicValue`, if the `triggerType` is `custom`. Defaults to "Custom Logic"
	 * * `label`: Label for the expression group, to indicate condition connectors based on the parent's trigger-type chosen. Defaults to ""
	 * * `takeAction`: Label for the `triggerType` selector. Defaults to "Take Action When"
	 * * `triggerAll`: Label for the `all` value within the trigger selector
	 * * `triggerAlways`: Label for the `always` value within the trigger selector
	 * * `triggerAny`: Label for the `any` value within the trigger selector
	 * * `triggerCustom`: Label for the `custom` value within the trigger selector
	 * * `triggerFormula`: Label for the `formula` value within the trigger selector
	 */
	labels: PropTypes.shape({
		addCondition: PropTypes.string,
		addGroup: PropTypes.string,
		customLogic: PropTypes.string,
		label: PropTypes.string,
		takeAction: PropTypes.string,
		triggerAll: PropTypes.string,
		triggerAlways: PropTypes.string,
		triggerAny: PropTypes.string,
		triggerCustom: PropTypes.string,
		triggerFormula: PropTypes.string,
	}),
	/**
	 * Whether the group is at root level
	 */
	isRoot: PropTypes.bool,
	/**
	 * Trigger type for the Group
	 */
	triggerType: PropTypes.oneOf(['all', 'any', 'custom', 'always', 'formula']),
	/**
	 * Sets the input for the custom logic value input box, shown if the `triggerType` is set to `custom`.
	 */
	customLogicValue: PropTypes.string,
};

const defaultProps = {
	triggerType: 'all',
	customLogicValue: '',
	labels: {
		label: '',
		takeAction: 'Take Action When',
		customLogic: 'Custom Logic',
		addCondition: 'Add Condition',
		addGroup: 'Add Group',
		triggerAll: 'All Conditions Are Met',
		triggerAny: 'Any Condition Is Met',
		triggerCustom: 'Custom Logic Is Met',
		triggerAlways: 'Always (No Criteria)',
		triggerFormula: 'Formula Evaluates To True',
	},
};

/**
 * Expression Group Component
 */
const ExpressionGroup = (props) => {
	/**
	 *  Return triggerType selected, processing the triggerType objects generated
	 */
	const triggerChange = (event, data) => {
		const selection = data.selection[0].id;
		let trigger = '';
		if (selection === '1') {
			trigger = 'all';
		} else if (selection === '2') {
			trigger = 'any';
		} else if (selection === '3') {
			trigger = 'custom';
		} else if (selection === '4') {
			trigger = 'always';
		} else if (selection === '5') {
			trigger = 'formula';
		}
		return trigger;
	};

	const generatedId = shortid.generate();

	useEffect(() => {
		if (props.focusOnMount && rootNode) {
			const input = rootNode.current.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	}, []);

	/**
	 * Get the Expression Group's HTML id. Generate a new one if no ID present.
	 */
	const getId = () => {
		return props.id || generatedId;
	};

	/**
	 * Generate and return trigger type objects, with labels either sent as props or using default props.
	 */
	const getTriggers = () => {
		const labels = assign({}, defaultProps.labels, props.labels);
		return [
			{ id: '1', label: labels.triggerAll },
			{ id: '2', label: labels.triggerAny },
			{ id: '3', label: labels.triggerCustom },
			{ id: '4', label: labels.triggerAlways },
			{ id: '5', label: labels.triggerFormula },
		];
	};

	/**
	 *  Returns object of trigger from trigger passed as prop
	 */
	const getTriggerSelection = () => {
		const selection = props.triggerType;
		const Triggers = getTriggers();
		const t = [];
		if (selection === 'all') {
			// eslint-disable-next-line fp/no-mutating-methods
			t.push(Triggers[0]);
		} else if (selection === 'any') {
			// eslint-disable-next-line fp/no-mutating-methods
			t.push(Triggers[1]);
		} else if (selection === 'custom') {
			// eslint-disable-next-line fp/no-mutating-methods
			t.push(Triggers[2]);
		} else if (selection === 'always') {
			// eslint-disable-next-line fp/no-mutating-methods
			t.push(Triggers[3]);
		} else if (selection === 'formula') {
			// eslint-disable-next-line fp/no-mutating-methods
			t.push(Triggers[4]);
		}
		return t;
	};

	const assistiveText = assign(
		{},
		defaultProps.assistiveText,
		props.assistiveText
	);
	const labels = assign({}, defaultProps.labels, props.labels);

	const triggerCombobox = (
		<Combobox
			events={{
				onSelect: (event, data) =>
					props.events.onChangeTrigger(event, {
						triggerType: ExpressionGroup.triggerChange(event, data),
					}),
			}}
			id={`${getId()}-take-action-trigger`}
			multiple={false}
			options={getTriggers()}
			variant="readonly"
			labels={{ label: labels.takeAction }}
			selection={getTriggerSelection()}
		/>
	);

	const buttons =
		props.triggerType !== 'always' && props.triggerType !== 'formula' ? (
			<div className="slds-expression__buttons">
				<Button
					iconCategory="utility"
					iconName="add"
					iconPosition="left"
					id={`${getId()}-add-condition-button`}
					label={labels.addCondition}
					assistiveText={{ icon: assistiveText.addCondition }}
					onClick={props.events.onAddCondition}
				/>
				{props.isRoot ? (
					<Button
						iconCategory="utility"
						iconName="add"
						iconPosition="left"
						id={`${getId()}-add-group-button`}
						label={labels.addGroup}
						assistiveText={{ icon: assistiveText.addGroup }}
						onClick={props.events.onAddGroup}
					/>
				) : null}
			</div>
		) : null;

	let body = null;

	if (props.triggerType !== 'always') {
		if (props.isRoot && props.triggerType === 'formula') {
			body = props.children;
		} else {
			body = (
				<React.Fragment>
					{props.triggerType === 'custom' ? (
						<Input
							label={labels.customLogic}
							className="slds-expression__custom-logic"
							id={`${getId()}-custom-logic-input`}
							value={props.customLogicValue}
							variant="base"
							onChange={props.events.onChangeCustomLogicValue}
						/>
					) : null}
					<ul>{props.children}</ul>
				</React.Fragment>
			);
		}
	}

	if (props.isRoot) {
		if (props.triggerType === 'formula') {
			return (
				<React.Fragment>
					<div className="slds-expression__options">{triggerCombobox}</div>
					{body}
				</React.Fragment>
			);
		}

		return (
			<div className={classNames(props.className)} id={getId()}>
				<div className="slds-expression__options">{triggerCombobox}</div>
				{body}
				{buttons}
			</div>
		);
	}

	const rootNode = useRef();
	return (
		<li
			className={classNames('slds-expression__group', props.className)}
			id={getId()}
			ref={rootNode}
		>
			<fieldset>
				<legend className="slds-expression__legend slds-expression__legend_group">
					<span>{labels.label}</span>
					<span className="slds-assistive-text">{assistiveText.label}</span>
				</legend>
				<div className="slds-expression__options">{triggerCombobox}</div>
				{body}
				{buttons}
			</fieldset>
		</li>
	);
};

ExpressionGroup.displayName = EXPRESSION_GROUP;
ExpressionGroup.propTypes = propTypes;
ExpressionGroup.defaultProps = defaultProps;

export default ExpressionGroup;
