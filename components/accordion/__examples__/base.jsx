import React, { useState } from 'react';
import Accordion from '~/components/accordion'; // `~` is replaced with design-system-react at runtime
import AccordionPanel from '~/components/accordion/panel'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings'; // `~` is replaced with design-system-react at runtime
import Dropdown from '~/components/menu-dropdown'; // `~` is replaced with design-system-react at runtime

const Example = (props) => {
	const [expandedPanels, setExpandedPanels] = useState({});
	const [items,setItems] = useState([
		{
			id: '1',
			summary: 'Accordion Summary',
			details: 'Accordion details - A',
		},
		{
			id: '2',
			summary: 'Accordion Summary',
			details: 'Accordion details - B',
		},
		{
			id: '3',
			summary: 'Accordion Summary',
			details: 'Accordion details - C',
		}
	])

	const menuDropdown = (selectedItem) => {
		return (
			<Dropdown
				align="right"
				id={selectedItem.id}
				assistiveText={{ icon: 'More Options' }}
				buttonVariant="icon"
				buttonClassName="slds-shrink-none"
				iconCategory="utility"
				iconName="down"
				iconVariant="border-filled"
				onSelect={(option) => {
					if (option.label === 'delete') {
						setItems(filter((item) => item.id !== selectedItem.id))
					} else if (console) {
						console.log('onSelect', event, option);
					}
				}}
				options={[
					{
						label: 'delete',
						value: 'A0',
					},
					{
						label: 'redo',
						value: 'B0',
					},
					{
						label: 'activate',
						value: 'C0',
					},
				]}
				iconSize="x-small"
			/>
		);
	}

	const togglePanel = (event, data) => {
		setExpandedPanels({
				[data.id]: !expandedPanels[data.id],
			})
		if (props.action) {
			const dataAsArray = Object.keys(data).map((id) => data[id]);
			props.action('onClick')(event, ...dataAsArray);
		} else if (console) {
			console.log('[onSelect] (event, data)', event, data);
		}
	}

	return (
			<IconSettings iconPath="/assets/icons">
				<Accordion id="base-example-accordion">
					{items.map((item, i) => {
						return (
							<AccordionPanel
								expanded={!!expandedPanels[item.id]}
								id={item.id}
								panelContentActions={menuDropdown(item)}
								key={item.id}
								onTogglePanel={(event) => togglePanel(event, item)}
								summary={item.summary}
							>
								{item.details}
							</AccordionPanel>
						);
					})}
				</Accordion>
			</IconSettings>
		);
}

Example.displayName = 'AccordionExample';
export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
