import React, { useState } from 'react';
// `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';
import ExpandableSection from '~/components/expandable-section';

import log from '~/utilities/log';

const displayName = 'ExpandableSectionControlledExample';

const Example = (props) => {
	const [isOpenState, setIsOpenState] = useState(true);

	return (
		<IconSettings iconPath="/assets/icons">
			<ExpandableSection
				id="controlled-expandable-section"
				isOpen={isOpenState}
				onToggleOpen={(event, data) => {
					log({
						action: props.action,
						event,
						eventName: 'Toggle expandable section!',
						data,
					});
					setIsOpenState(!isOpenState);
				}}
				title="Section Title"
			>
				<p>
					Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
					vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris
					condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum
					dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget
					urna mollis ornare vel eu leo.
				</p>
			</ExpandableSection>
		</IconSettings>
	);
};

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
