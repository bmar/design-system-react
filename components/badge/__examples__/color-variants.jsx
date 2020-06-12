import React from 'react';
import Badge from '~/components/badge';
import IconSettings from '~/components/icon-settings';
import Icon from '~/components/icon';

const displayName = 'badgeExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<Badge
				id="badge-base-example-default"
				content="423 Credits Available"
				icon={<Icon category="utility" name="moneybag" size="xx-small" />}
			/>
			<Badge
				id="badge-base-example-light"
				color="light"
				content="423 Credits Available"
				icon={<Icon category="utility" name="moneybag" size="xx-small" />}
			/>
			<Badge
				id="badge-base-example-inverse"
				color="inverse"
				content="423 Credits Available"
				icon={
					<Icon
						category="utility"
						name="moneybag"
						size="xx-small"
						colorVariant="base"
					/>
				}
			/>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example;
