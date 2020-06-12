import React from 'react';

import Avatar from '~/components/avatar'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';

const displayName = 'AvatarExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<Avatar inverse variant="user" label="Annie Wilson" size="medium" />
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
