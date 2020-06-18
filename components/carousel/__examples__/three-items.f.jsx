import React from 'react';

import CarouselFunc from '~/components/carousel/index.f';
import IconSettings from '~/components/icon-settings';

import log from '~/utilities/log';

const displayName = 'ThreeItemsExample';

const items = [
	{
		buttonLabel: 'Get Started',
		id: 1,
		heading: 'Visit App Exchange',
		description: 'Extend Salesforce with the #1 business marketplace.',
		imageAssistiveText: 'Appy',
		src: '/assets/images/carousel/carousel-01.jpg',
		href: 'https://www.salesforce.com',
	},
	{
		buttonLabel: 'Get Started',
		id: 2,
		heading: 'Click to Customize',
		description:
			'Use the Object Manager to add fields, build layouts, and more.',
		imageAssistiveText: 'Apps',
		src: '/assets/images/carousel/carousel-02.jpg',
		href: 'https://www.salesforce.com',
	},
	{
		buttonLabel: 'Get Started',
		id: 3,
		heading: 'Download Salesforce Apps',
		description: "Get the mobile app that's just for Salesforce admins.",
		imageAssistiveText: 'Salesforce Apps',
		src: '/assets/images/carousel/carousel-03.jpg',
		href: 'https://www.salesforce.com',
	},
	{
		buttonLabel: 'Get Started',
		id: 4,
		heading: 'Carousel Item 4',
		description: 'Description for carousel item #4',
		imageAssistiveText: 'Apps',
		src: '/assets/images/carousel/carousel-02.jpg',
		href: 'https://www.salesforce.com',
	},
	{
		buttonLabel: 'Learn More',
		id: 5,
		heading: 'Carousel Item 5',
		description: 'Description for carousel item #5',
		imageAssistiveText: 'Appy',
		src: '/assets/images/carousel/carousel-01.jpg',
		href: 'https://www.salesforce.com',
	},
	{
		buttonLabel: 'Learn More',
		id: 6,
		heading: 'Carousel Item 6',
		description: 'Description for carousel item #6',
		imageAssistiveText: 'Salesforce Apps',
		src: '/assets/images/carousel/carousel-03.jpg',
		href: 'https://www.salesforce.com',
	},
	{
		buttonLabel: 'Learn More',
		id: 7,
		heading: 'Carousel Item 7',
		description: 'Description for carousel item #7',
		imageAssistiveText: 'Apps',
		src: '/assets/images/carousel/carousel-02.jpg',
		href: 'https://www.salesforce.com',
	},
];

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<div
				style={{
					maxWidth: '1280px',
					padding: '20px',
				}}
			>
				<CarouselFunc
					hasPreviousNextPanelNavigation
					id="carousel-three-items-example"
					items={items}
					itemsPerPanel={3}
					onItemClick={(event, data) => {
						event.preventDefault();
						log({
							action: props.action,
							event,
							eventName: 'Item Clicked',
							data,
						});
					}}
				/>
			</div>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example;
