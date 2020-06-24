import React from 'react';
import Example from './example';

const displayName = 'ExpressionMultipleConditionsExample';

const MultipleConditions = (props) => {
	return (
		<Example
			action={props.action}
			conditions={[
				{
					resource: '111',
				},
				{
					resource: '112',
				},
			]}
			triggerType="any"
		/>
	);
};

MultipleConditions.displayName = displayName;

export default MultipleConditions;
