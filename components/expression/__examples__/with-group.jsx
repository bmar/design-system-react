import React from 'react';
import Example from './example';

const displayName = 'ExpressionWithGroupExample';

const WithGroup = (props) => {
	return (
		<Example
			action={props.action}
			conditions={[
				{
					resource: '111',
				},
				{
					isGroup: true,
					triggerType: 'any',
					conditions: [
						{
							resource: '111',
						},
						{
							resource: '',
						},
					],
				},
				{
					isGroup: true,
					triggerType: 'custom',
					customLogic: '1 & 2',
					conditions: [
						{
							resource: '111',
						},
					],
				},
			]}
			triggerType="all"
		/>
	);
};

WithGroup.displayName = displayName;

export default WithGroup;
