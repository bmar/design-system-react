import React, { useState } from 'react';

import IconSettings from '~/components/icon-settings';
import Button from '~/components/button'; // `~` is replaced with design-system-react at runtime
import Card from '~/components/card';
import CardEmpty from '~/components/card/empty';
import CardFilter from '~/components/card/filter';
import DataTable from '~/components/data-table';
import DataTableColumn from '~/components/data-table/column';
import Icon from '~/components/icon';

const sampleItems = [
	{ id: '1', name: 'Cloudhub' },
	{ id: '2', name: 'Cloudhub + Anypoint Connectors' },
	{ id: '3', name: 'Cloud City' },
];

const displayName = 'CardExample';

const Example = (props) => {
	const [items, setItems] = useState(sampleItems);
	const [isFiltering, setIsFiltering] = useState(false);

	const handleFilterChange = (event) => {
		const filteredItems = sampleItems.filter((item) =>
			RegExp(event.target.value, 'i').test(item.name)
		);
		setIsFiltering(true);
		setItems(filteredItems);
	};

	const handleDeleteAllItems = () => {
		setIsFiltering(false);
		setItems([]);
	};

	const handleAddItem = () => {
		setItems(sampleItems);
	};

	const isEmpty = items.length === 0;

	return (
		<IconSettings iconPath="/assets/icons">
			<div className="slds-grid slds-grid_vertical">
				<Card
					id="ExampleCard"
					filter={
						(!isEmpty || isFiltering) && (
							<CardFilter onChange={handleFilterChange} />
						)
					}
					headerActions={
						!isEmpty && (
							<Button label="Delete All Items" onClick={handleDeleteAllItems} />
						)
					}
					heading="Releated Items"
					icon={<Icon category="standard" name="document" size="small" />}
					empty={
						isEmpty ? (
							<CardEmpty heading="No Related Items">
								<Button label="Add Item" onClick={handleAddItem} />
							</CardEmpty>
						) : null
					}
				>
					<DataTable items={items} id="DataTableExample-1">
						<DataTableColumn
							label="Opportunity Name"
							property="name"
							truncate
						/>
					</DataTable>
				</Card>
			</div>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
