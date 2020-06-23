import React, { useState } from 'react';
// `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';
import Checkbox from '~/components/checkbox';

const displayName = 'CheckboxExample';

const Example = (props) => {
	const [state, setState] = useState({
		mayonnaiseChecked: true,
		mustardChecked: false,
		oilChecked: true,
		vinegarChecked: false,
	});
	let previousMixedState = { ...state };

	const getAllCondimentsStatus = () => {
		let status = 'mixed';

		if (
			state.mayonnaiseChecked &&
			state.mustardChecked &&
			state.oilChecked &&
			state.vinegarChecked
		) {
			status = true;
		} else if (
			!state.mayonnaiseChecked &&
			!state.mustardChecked &&
			!state.oilChecked &&
			!state.vinegarChecked
		) {
			status = false;
		}

		return status;
	};

	const handleSubCheckboxChange = (attribute) => {
		const newState = { ...state };
		newState[attribute] = !state[attribute];
		previousMixedState = { ...newState };
		setState(newState);
	};

	const allCondimentsStatus = getAllCondimentsStatus();

	return (
		<IconSettings iconPath="/assets/icons">
			<fieldset>
				<legend className="slds-p-bottom_xx-small">
					Grouped with Tristate
				</legend>
				<Checkbox
					aria-checked={allCondimentsStatus}
					aria-controls="checkbox-mayonnaise checkbox-mustard checkbox-oil checkbox-vinegar"
					assistiveText={{
						label: 'All Condiments',
					}}
					checked={allCondimentsStatus === true || undefined}
					id="checkbox-example-all-condiments"
					indeterminate={allCondimentsStatus === 'mixed'}
					labels={{
						label: 'All Condiments',
					}}
					onChange={() => {
						const condimentsStatus = getAllCondimentsStatus();

						if (condimentsStatus === false) {
							if (
								!previousMixedState.mayonnaiseChecked &&
								!previousMixedState.mustardChecked &&
								!previousMixedState.oilChecked &&
								!previousMixedState.vinegarChecked
							) {
								setState({
									mayonnaiseChecked: true,
									mustardChecked: true,
									oilChecked: true,
									vinegarChecked: true,
								});
							} else {
								setState({ ...previousMixedState });
							}
						} else if (condimentsStatus === 'mixed') {
							previousMixedState = { ...state };
							setState({
								mayonnaiseChecked: true,
								mustardChecked: true,
								oilChecked: true,
								vinegarChecked: true,
							});
						} else {
							setState({
								mayonnaiseChecked: false,
								mustardChecked: false,
								oilChecked: false,
								vinegarChecked: false,
							});
						}
					}}
				/>
				<ul className="slds-p-left_large slds-p-top_xx-small">
					<li>
						<Checkbox
							assistiveText={{
								label: 'Mayonnaise',
							}}
							checked={state.mayonnaiseChecked}
							id="checkbox-mayonnaise"
							labels={{
								label: 'Mayonnaise',
							}}
							onChange={() => {
								handleSubCheckboxChange('mayonnaiseChecked');
							}}
						/>
					</li>
					<li>
						<Checkbox
							assistiveText={{
								label: 'Mustard',
							}}
							checked={state.mustardChecked}
							id="checkbox-mustard"
							labels={{
								label: 'Mustard',
							}}
							onChange={() => {
								handleSubCheckboxChange('mustardChecked');
							}}
						/>
					</li>
					<li>
						<Checkbox
							assistiveText={{
								label: 'Oil',
							}}
							checked={state.oilChecked}
							id="checkbox-oil"
							labels={{
								label: 'Oil',
							}}
							onChange={() => {
								handleSubCheckboxChange('oilChecked');
							}}
						/>
					</li>
					<li>
						<Checkbox
							assistiveText={{
								label: 'Vinegar',
							}}
							checked={state.vinegarChecked}
							id="checkbox-vinegar"
							labels={{
								label: 'Vinegar',
							}}
							onChange={() => {
								handleSubCheckboxChange('vinegarChecked');
							}}
						/>
					</li>
				</ul>
			</fieldset>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
