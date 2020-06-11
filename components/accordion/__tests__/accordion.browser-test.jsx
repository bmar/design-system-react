import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';

/* Enzyme Helpers that can mount and unmount React component instances to
 * the DOM and set `wrapper` and `dom` within Mocha's `this`
 * context [full source here](tests/enzyme-helpers.js). `this` can
 * only be referenced if inside `function () {}`.
 */

import {
	createMountNode,
	destroyMountNode,
} from '../../../tests/enzyme-helpers';

import Accordion from '../../accordion';
import IconSettings from '../../icon-settings';
import Panel from '../../accordion/panel';
import Dropdown from '../../menu-dropdown';

/* Set Chai to use chaiEnzyme for enzyme compatible assertions:
 * https://github.com/producthunt/chai-enzyme
 */

chai.use(chaiEnzyme());

/* Re-usable demo component.
 */

const propTypes = {};

const defaultProps = {};

const AccordionExample = (props) => {
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
				id="ButtonGroupExampleDropdown"
				assistiveText={{ icon: 'More Options' }}
				buttonVariant="icon"
				buttonClassName="slds-shrink-none"
				iconCategory="utility"
				iconName="down"
				iconVariant="border-filled"
				onSelect={(option) => {
					if (option.label === 'delete') {
						setState((state) => ({
							...state,
							items: items.filter((item) => item.id !== selectedItem.id),
						}));
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

	const togglePanel = (id) => {
		setExpandedPanels({
			[id]: !expandedPanels[id]
		})
	}

	return (
		<IconSettings iconPath="/assets/icons">
			<Accordion id="base-example-accordion">
				{items.map((item) => (
					<Panel
						expanded={!!expandedPanels[item.id]}
						id={item.id}
						panelContentActions={menuDropdown(item)}
						key={item.id}
						onTogglePanel={() => togglePanel(item.id)}
						summary={item.summary}
					>
						{item.details}
					</Panel>
				))}
			</Accordion>
		</IconSettings>
	);
}

AccordionExample.displayName = 'AccordionExampleComponent';
AccordionExample.propTypes = propTypes;
AccordionExample.defaultProps = defaultProps;

const AccordionWithOnePanelExample = (props) => {
	const [expandedPanels, setExpandedPanels] = useState({});
	const [item,setItem] = useState({
		id: '1',
		summary: 'Accordion Summary',
		details: 'Accordion Details',
	})

	const togglePanel = (id) => {
		setExpandedPanels({
			[id]: !expandedPanels[id]
		})
	}

	return (
		<IconSettings iconPath="/assets/icons">
			<Accordion id="base-example-accordion">
				<Panel
					expanded={!!expandedPanels[item.id]}
					id={item.id}
					key={item.id}
					onTogglePanel={() => togglePanel(item.id)}
					summary={item.summary}
				>
					{item.details}
				</Panel>
			</Accordion>
		</IconSettings>
	);
}

AccordionWithOnePanelExample.displayName =
	'AccordionWithOnePanelExampleComponent';
AccordionWithOnePanelExample.propTypes = propTypes;
AccordionWithOnePanelExample.defaultProps = defaultProps;

/* Accordion rendering tests
 */

describe('Accordion', function describeFunction() {
	describe('Renders Accordion', () => {
		let mountNode;
		let wrapper;

		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('renders an accordion', () => {
			wrapper = mount(<AccordionExample />, { attachTo: mountNode });
			const accordion = wrapper.find(Accordion);
			expect(accordion).to.be.present;
		});

		it('renders `panelContentActions` component, if passed', () => {
			wrapper = mount(<AccordionExample />, {
				attachTo: mountNode,
			});
			const panelContentActions = wrapper.find('div .slds-dropdown-trigger');
			expect(panelContentActions, 'panel dropdown component exists').to.exist;
		});

		it('renders accordion with only one panel', () => {
			wrapper = mount(<AccordionWithOnePanelExample />, {
				attachTo: mountNode,
			});
			const accordion = wrapper.find(Accordion);
			expect(accordion).to.be.present;
		});
	});

	describe('Interactions keyboard', () => {
		let mountNode;
		let wrapper;

		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('focuses the next accordion button on arrow down', () => {
			wrapper = mount(<AccordionExample />, { attachTo: mountNode });
			const accordionButtons = wrapper.find(
				'button.slds-accordion__summary-action'
			);

			accordionButtons.at(0).simulate('keyDown', {
				key: 'ArrowDown',
				keyCode: 40,
				which: 40,
			});

			expect(
				accordionButtons.at(1).getDOMNode() === document.activeElement
			).to.equal(true);
		});

		it('focuses the previous accordion button on arrow up', () => {
			wrapper = mount(<AccordionExample />, { attachTo: mountNode });
			const accordionButtons = wrapper.find(
				'button.slds-accordion__summary-action'
			);

			accordionButtons.at(0).simulate('keyDown', {
				key: 'ArrowUp',
				keyCode: 38,
				which: 38,
			});

			const lastAccordionButton = accordionButtons.at(
				accordionButtons.length - 1
			);
			expect(
				lastAccordionButton.getDOMNode() === document.activeElement
			).to.equal(true);
		});
	});

	describe('Open panel', () => {
		let mountNode;
		let wrapper;
		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('triggers a change callback on panel select', () => {
			wrapper = mount(<AccordionExample />, { attachTo: mountNode });
			const panel = () => wrapper.find('SLDSAccordionPanel').first();
			expect(panel()).to.have.prop('expanded', false);
			panel()
				.find('button.slds-accordion__summary-action')
				.simulate('click');
			expect(panel()).to.have.prop('expanded', true);
		});

		it('`aria-expanded` set to true on panel select', () => {
			wrapper = mount(<AccordionExample />, { attachTo: mountNode });
			const panel = () => wrapper.find('SLDSAccordionPanel').first();
			panel()
				.find('button.slds-accordion__summary-action')
				.simulate('click');
			expect(
				panel().find('button.slds-accordion__summary-action')
			).to.have.prop('aria-expanded', true);
		});
	});
});
