import React from 'react';
import Badge from '~/components/badge';
import IconSettings from '~/components/icon-settings';

const displayName = 'badgeExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<Badge id="badge-base-example" content="423 Credits Available" />
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example;
