import React from 'react';

import IconSettings from '~/components/icon-settings';
import MediaObject from '~/components/media-object'; // `~` is replaced with design-system-react at runtime
import Icon from '~/components/icon';

const displayName = 'MediaObjectExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<MediaObject
				body="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda."
				figure={<Icon category="standard" name="user" size="large" />}
			/>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
