import React, { useState } from 'react';
import find from 'lodash.find';
import log from '~/utilities/log';
import IconSettings from '~/components/icon-settings';
import Combobox from '~/components/combobox';
import Input from '~/components/input';
import Expression from '~/components/expression';
import ExpressionGroup from '~/components/expression/group';
import ExpressionCondition from '~/components/expression/condition';
import ExpressionFormula from '~/components/expression/formula';

const ResourcesList = [
	{ id: '111', label: 'Resource 1' },
	{ id: '112', label: 'Resource 2' },
	{ id: '113', label: 'Resource 3' },
	{ id: '114', label: 'Resource 4' },
];

const OperatorsList = [
	{ id: '1', label: 'Equals' },
	{ id: '2', label: 'Does Not Equals' },
	{ id: '3', label: 'Greater Than' },
	{ id: '4', label: 'Less Than' },
];

const getTriggerType = (i, trigger) => {
	if (trigger === 'custom') return String(i + 1);
	if (i > 0) {
		if (trigger === 'all') return 'AND';
		if (trigger === 'any') return 'OR';
	}
	return '';
};

const displayName = 'ExpressionResourceSelectedExample';

const Example = (props) => {
	const [state, setState] = useState({
		conditions: [
			{
				resource: '111',
			},
		],
		triggerType: 'all',
		customLogic: undefined,
	});

	const updateData = (i, val, type) => {
		const { conditions } = state;
		if (type === 'value') conditions[i].value = val;
		else conditions[i][type] = val.selection[0].id;
		setState({ conditions });
	};

	const updateSubData = (i, j, val, type) => {
		const { conditions } = state;
		if (type === 'value') conditions[i].conditions[j].value = val;
		else conditions[i].conditions[j][type] = val.selection[0].id;
		setState({ conditions });
	};

	const updateFormula = (data, type) => {
		const { conditions } = state;
		conditions[type] = data;
		setState({ conditions });
	};

	const addCondition = () => {
		const { conditions } = state;
		const newCondition = {
			isGroup: false,
			resource: '',
			operator: '',
			value: '',
		};
		conditions.push(newCondition);
		setState({ conditions });
	};

	const addSubCondition = (i) => {
		const { conditions } = state;
		const newCondition = {
			resource: '',
			operator: '',
			value: '',
		};
		conditions[i].conditions.push(newCondition);
		setState({ conditions });
	};

	const deleteCondition = (i) => {
		const { conditions } = state;
		if (conditions.length > 1) {
			conditions.splice(i, 1);
			setState({ conditions });
		} else {
			const newCondition = {
				resource: '',
				operator: '',
				value: '',
			};
			setState({ conditions: [newCondition] });
		}
	};

	const deleteSubCondition = (i, j) => {
		const { conditions } = state;
		if (conditions[i].conditions.length > 1) {
			conditions[i].conditions.splice(j, 1);
			setState({ conditions });
		} else {
			conditions.splice(i, 1);
			setState({ conditions });
		}
	};

	const addGroup = () => {
		if (!props.isChild) {
			const { conditions } = state;
			const newCondition = {
				resource: '',
				operator: '',
				value: '',
			};
			const newGroup = {
				isGroup: true,
				triggerType: 'all',
				conditions: [newCondition],
			};
			conditions.push(newGroup);
			setState({ conditions });
		}
	};

	const updateGroupData = (i, val, type) => {
		const { conditions } = state;
		conditions[i][type] = val;
		setState({ conditions });
	};

	return (
		<IconSettings iconPath="/assets/icons">
			<Expression
				id="expression-example"
				events={{
					onChangeTrigger: (event, data) => {
						log({
							action: props.action,
							event,
							eventName: 'Trigger Changed',
							data,
						});
						setState({ triggerType: data.triggerType });
					},
					onChangeCustomLogicValue: (event, data) => {
						log({
							action: props.action,
							event,
							eventName: 'Custom Logic Changed',
							data,
						});
						setState({ customLogic: data.value });
					},
					onAddCondition: () => {
						log({
							action: props.action,
							event,
							eventName: 'New Condition Added',
							data: null,
						});
						addCondition();
					},
					onAddGroup: () => {
						log({
							action: props.action,
							event,
							eventName: 'New Group Added',
							data: null,
						});
						addGroup();
					},
				}}
				triggerType={state.triggerType}
				customLogicValue={state.customLogic}
			>
				{state.triggerType === 'formula' ? (
					<ExpressionFormula
						id="expression-formula"
						resourceCombobox={
							<Combobox
								labels={{
									placeholder: 'Insert a Resource',
								}}
								id="expression-formula-insert-resource"
								multiple={false}
								options={ResourcesList}
								selection={
									state.conditions.resource
										? [
												find(ResourcesList, {
													id: state.conditions.resource,
												}),
										  ]
										: []
								}
								events={{
									onSelect: (event, data) => {
										updateFormula(data.selection[0].id, 'resource');
										log({
											action: props.action,
											event,
											eventName: `Formula Resource Changed`,
											data,
										});
									},
								}}
								variant="inline-listbox"
							/>
						}
						events={{
							onChangeTextEditor: (event, data) =>
								log({
									action: props.action,
									event,
									eventName: `Formula updated in Text Editor`,
									data,
								}),
							onClickCheckSyntax: () =>
								log({
									action: props.action,
									event,
									eventName: `Check Syntax Button Clicked`,
									data: null,
								}),
							onClickHelp: () =>
								log({
									action: props.action,
									event,
									eventName: `Get Help Button Clicked`,
									data: null,
								}),
						}}
						functionCombobox={
							<Combobox
								labels={{
									placeholder: 'Insert a Function',
								}}
								id="expression-formula-insert-function"
								options={ResourcesList}
								selection={
									state.conditions.function
										? [
												find(ResourcesList, {
													id: state.conditions.function,
												}),
										  ]
										: []
								}
								events={{
									onSelect: (event, data) => {
										updateFormula(data.selection[0].id, 'function');
										log({
											action: props.action,
											event,
											eventName: `Formula Function Changed`,
											data,
										});
									},
								}}
								variant="inline-listbox"
							/>
						}
						operatorInput={
							<Input
								assistiveText={{ label: 'Insert a Operator' }}
								id="insert-operator-formula"
								placeholder="Insert a Operator"
							/>
						}
					/>
				) : (
					state.conditions.map((condition, i) =>
						!condition.isGroup ? (
							<ExpressionCondition
								focusOnMount
								/* eslint-disable-next-line react/no-array-index-key */
								key={i}
								id={`expression-condition-${i}`}
								labels={{
									label: Example.getTriggerType(i, state.triggerType),
								}}
								events={{
									onChangeOperator: (event, obj) => {
										log({
											action: props.action,
											event,
											eventName: `Condition ${i} Operator Changed`,
											data: obj,
										});
										updateData(i, obj, 'operator');
									},
									onChangeResource: (event, obj) => {
										log({
											action: props.action,
											event,
											eventName: `Condition ${i} Resource Changed`,
											data: obj,
										});
										updateData(i, obj, 'resource');
									},
									onChangeValue: (event, data) => {
										log({
											action: props.action,
											event,
											eventName: `Condition ${i} Value Changed`,
											data,
										});
										updateData(i, data.value, 'value');
									},
									onDelete: () => {
										log({
											action: props.action,
											event,
											eventName: `Condition ${i} Deleted`,
											data: null,
										});
										deleteCondition(i);
									},
								}}
								resourcesList={ResourcesList}
								resourceSelected={find(ResourcesList, {
									id: condition.resource,
								})}
								operatorsList={OperatorsList}
								operatorSelected={find(OperatorsList, {
									id: condition.operator,
								})}
								value={condition.value}
							/>
						) : (
							<ExpressionGroup
								focusOnMount
								/* eslint-disable-next-line react/no-array-index-key */
								key={i}
								id={`expression-group-${i}`}
								labels={{
									label: Example.getTriggerType(i, state.triggerType),
								}}
								events={{
									onChangeCustomLogicValue: (event, data) => {
										log({
											action: props.action,
											event,
											eventName: `Custom Logic Value of Condition Group ${i} Changed`,
											data,
										});
										updateGroupData(i, data.value, 'customLogic');
									},
									onChangeTrigger: (event, data) => {
										log({
											action: props.action,
											event,
											eventName: `Trigger of Condition Group ${i} Changed`,
											data,
										});
										updateGroupData(i, data.triggerType, 'triggerType');
									},
									onAddCondition: () => {
										log({
											action: props.action,
											event,
											eventName: `New Condition added to Condition Group ${i}`,
											data: null,
										});
										addSubCondition(i);
									},
								}}
								customLogicValue={condition.customLogic}
								triggerType={condition.triggerType}
							>
								{condition.triggerType === 'formula' ? (
									<ExpressionFormula
										id={`expression-group-${i}-formula`}
										resourceCombobox={
											<Combobox
												labels={{
													placeholder: 'Insert a Resource',
												}}
												id={`expression-group-${i}-formula-resource`}
												options={ResourcesList}
												variant="inline-listbox"
											/>
										}
										events={{
											onClickCheckSyntax: log({
												action: props.action,
												event,
												eventName: `Check Syntax Button Clicked`,
												data: null,
											}),
											onClickHelp: log({
												action: props.action,
												event,
												eventName: `Get Help Button Clicked`,
												data: null,
											}),
										}}
										functionCombobox={
											<Combobox
												labels={{
													placeholder: 'Insert a Function',
												}}
												id={`expression-group-${i}-formula-function`}
												options={ResourcesList}
												variant="inline-listbox"
											/>
										}
										operatorInput={
											<Input
												assistiveText={{ label: 'Insert a Operator' }}
												id={`insert-operator-formula-${i}`}
												placeholder="Insert a Operator"
											/>
										}
									/>
								) : (
									condition.conditions.map((c, j) => (
										<ExpressionCondition
											focusOnMount
											/* eslint-disable-next-line react/no-array-index-key */
											key={j}
											id={`expression-group-${i}-condition-${j}`}
											isSubCondition
											labels={{
												label: Example.getTriggerType(j, condition.triggerType),
											}}
											events={{
												onChangeOperator: (event, obj) => {
													log({
														action: props.action,
														event,
														eventName: `Operator of Condition ${j} of Group ${i} Changed`,
														data: obj,
													});
													updateSubData(i, j, obj, 'operator');
												},
												onChangeResource: (event, obj) => {
													log({
														action: props.action,
														event,
														eventName: `Resource of Condition [${i},${j}] Changed`,
														data: obj,
													});
													updateSubData(i, j, obj, 'resource');
												},
												onChangeValue: (event, data) => {
													log({
														action: props.action,
														event,
														eventName: `Value of Condition [${i},${j}] Changed`,
														data,
													});
													updateSubData(i, j, data.value, 'value');
												},
												onDelete: () => {
													log({
														action: props.action,
														event,
														eventName: `Condition [${i},${j}] deleted`,
														data: null,
													});
													deleteSubCondition(i, j);
												},
											}}
											resourcesList={ResourcesList}
											resourceSelected={find(ResourcesList, {
												id: c.resource,
											})}
											operatorsList={OperatorsList}
											operatorSelected={find(OperatorsList, {
												id: c.operator,
											})}
											value={c.value}
										/>
									))
								)}
							</ExpressionGroup>
						)
					)
				)}
			</Expression>
		</IconSettings>
	);
};

Example.getTriggerType = getTriggerType;
Example.displayName = displayName;

export default Example;
