import React, { useState } from 'react';

import IconSettings from '~/components/icon-settings';
import ButtonIcon from '~/components/icon/button-icon';
import ButtonStateful from '~/components/button-stateful'; // `~` is replaced with design-system-react at runtime

const displayName = 'ButtonStatefulExample';

const Example = (props) => {
	const [isActive, setIsActive] = useState(false);

	const handleOnClick = () => {
		setIsActive(!isActive);
	};

	return (
		<IconSettings iconPath="/assets/icons">
			<ButtonStateful
				assistiveText={{ icon: isActive ? 'liked' : 'not liked' }}
				icon={<ButtonIcon name="like" />}
				onClick={handleOnClick}
				variant="icon-filled"
			/>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
