import React from 'react';
import Example from './example';

const displayName = 'ExpressionInitialStateExample';

const Initial = (props) => {
	return (
		<Example
			action={props.action}
			conditions={[
				{
					resource: '',
				},
			]}
			triggerType="all"
		/>
	);
};

Initial.displayName = displayName;

export default Initial;
