import React from 'react';

import Icon from '~/components/icon'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';

const displayName = 'IconExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<Icon
				assistiveText={{ label: 'Description of icon' }}
				category="utility"
				colorVariant="default"
				name="announcement"
				size="small"
				title="description of icon when needed"
			/>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
