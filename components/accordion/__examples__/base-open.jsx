import React, { useState } from 'react';
import Accordion from '~/components/accordion'; // `~` is replaced with design-system-react at runtime
import Panel from '~/components/accordion/panel'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings'; // `~` is replaced with design-system-react at runtime

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

	const togglePanel = (event, data) => {
		setExpandedPanels({
				[data.id]: !expandedPanels[data.id],
			})
		console.log('onClick', data);
	}

	return (
		<IconSettings iconPath="/assets/icons">
			<Accordion id="base-example-accordion">
				{items.map((item) => (
					<Panel
						expanded
						id={item.id}
						key={item.id}
						onTogglePanel={() => togglePanel(event, item)}
						summary={item.summary}
					>
						{item.details}
					</Panel>
				))}
			</Accordion>
		</IconSettings>
	);
}

Example.displayName = 'AccordionExample'; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
export default Example;
