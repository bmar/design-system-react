import React, { useState } from 'react';

import PropTypes from 'prop-types';
import IconSettings from '~/components/icon-settings';

import Filter from '~/components/filter';

import Combobox from '~/components/combobox';

const options = {
	'show-me': [
		{ id: 1, label: 'All Products', value: 'all-products' },
		{ id: 2, label: 'All Wackamoles', value: 'all-Wackamoles' },
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
			selectedItem: options['show-me'][0],
			isActive: true,
			comboboxSelection: [options['show-me'][0]],
		},
	});

	const onChangePredicate = (event, { id }) => {
		const idSuffix = id.split('sample-panel-filtering-')[1];
		setState({
			[idSuffix]: {
				...state[idSuffix],
				selectedItem: state[idSuffix].comboboxSelection[0],
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
				<Filter
					assistiveText={{
						editFilter: 'editFilter-TEST',
						editFilterHeading: 'editFilterHeading-TEST',
						removeFilter: 'removeFilter-TEST',
					}}
					align={props.align}
					id="sample-panel-filtering-show-me"
					onChange={onChangePredicate}
					onRemove={onRemove}
					property="Show Me"
					predicate={state['show-me'].selectedItem.label}
					{...props}
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
			</IconSettings>
		)
	);
};

Example.propTypes = propTypes;
Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
