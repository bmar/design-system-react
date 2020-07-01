import React from 'react';

import IconSettings from '~/components/icon-settings';
import Icon from '~/components/icon'; // `~` is replaced with design-system-react at runtime

const displayName = 'IconExample';
const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<div className="slds-grid slds-grid_pull-padded slds-grid_vertical-align-center">
				<div className="slds-col_padded">
					<Icon
						assistiveText={{ label: 'Lead' }}
						category="standard"
						colorVariant="base"
						name="lead"
					/>
				</div>
				<div className="slds-col_padded">
					<Icon
						assistiveText={{ label: 'Lock' }}
						category="utility"
						colorVariant="default"
						name="lock"
					/>
				</div>
				<div className="slds-col_padded">
					<Icon
						assistiveText={{ label: 'Lock' }}
						category="utility"
						colorVariant="light"
						name="lock"
					/>
				</div>
				<div className="slds-col_padded">
					<Icon
						assistiveText={{ label: 'Warning' }}
						category="utility"
						colorVariant="warning"
						name="warning"
					/>
				</div>
				<div className="slds-col_padded">
					<Icon
						assistiveText={{ lable: 'Warning' }}
						category="utility"
						colorVariant="error"
						name="warning"
					/>
				</div>
			</div>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
