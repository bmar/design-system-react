import React, { useState } from 'react';
import Alert from '~/components/alert'; // `~` is replaced with design-system-react at runtime
import AlertContainer from '~/components/alert/container'; // `~` is replaced with design-system-react at runtime
import Icon from '~/components/icon'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';

const Example = (props) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<IconSettings iconPath="/assets/icons">
			{isOpen ? (
				<AlertContainer>
					<Alert
						dismissible
						icon={<Icon category="utility" name="user" />}
						labels={{
							heading: 'Logged in as John Smith (johnsmith@acme.com).',
							headingLink: 'Log out',
						}}
						onClickHeadingLink={() => {
							console.log('Link clicked.');
						}}
						onRequestClose={() => {
							setIsOpen(false);
						}}
					/>
				</AlertContainer>
			) : null}
		</IconSettings>
	);
};

Example.displayName = 'AlertExample';

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
