import React, { useState } from 'react';

import PropTypes from 'prop-types';
import IconSettings from '~/components/icon-settings';

import Filter from '~/components/filter';

import Combobox from '~/components/combobox';

const options = {
	'show-me': [
		{ id: '1', label: 'All Products', value: 'all-products' },
		{ id: '2', label: 'All Wackamoles', value: 'all-Wackamoles' },
	],
};

const displayName = 'FilterExample';

const propTypes = () => {
	return {
		align: PropTypes.string,
	};
};

const Example = (props) => {
	const [state, setState] = useState({
		'show-me': {
			comboboxSelection: [options['show-me'][0]],
			selectedItem: options['show-me'][0],
			isActive: true,
		},
	});

	const onChangePredicate = (event, { id }) => {
		const idSuffix = id.split('sample-panel-filtering-')[1];
		setState({
			[idSuffix]: {
				...state[idSuffix],
				selectedItem: state[idSuffix].comboboxSelection,
			},
		});
	};

	const onRemove = (event, { id }) => {
		const idSuffix = id.split('sample-panel-filtering-')[1];
		setState({
			[idSuffix]: {
				...state[idSuffix],
				isActive: false,
			},
		});
	};

	return (
		state['show-me'].isActive && (
			<IconSettings iconPath="/assets/icons">
				<div>
					<Filter
						errorLabel="Error Message"
						align={props.align}
						id="sample-panel-filtering-show-me"
						isError
						onChange={onChangePredicate}
						onRemove={onRemove}
						property="Show Me"
						predicate={state['show-me'].selectedItem.label}
					>
						<Combobox
							events={{
								onSelect: (event, data) => {
									setState({
										'show-me': {
											...state['show-me'],
											comboboxSelection: data.selection,
										},
									});
								},
							}}
							labels={{
								label: 'Show Me',
								placeholder: 'Select record type',
							}}
							menuPosition="relative"
							options={options['show-me']}
							selection={state['show-me'].comboboxSelection}
							variant="readonly"
						/>
					</Filter>
					<p
						id="sample-panel-filtering-show-me-error"
						className="slds-text-color_error slds-m-top_xx-small"
					>
						Error Message
					</p>
				</div>
			</IconSettings>
		)
	);
};

Example.propTypes = propTypes;
Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
