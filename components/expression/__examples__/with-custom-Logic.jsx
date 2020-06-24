import React from 'react';
import Example from './example';

const displayName = 'ExpressionWithCustomLogicExample';

const CustomLogic = (props) => {
	return (
		<Example
			action={props.action}
			conditions={[
				{
					resource: '111',
				},
				{
					resource: '',
				},
			]}
			customLogic="1 AND 2"
			triggerType="custom"
		/>
	);
};

CustomLogic.displayName = displayName;

export default CustomLogic;
