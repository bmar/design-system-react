import React from 'react';
import Example from './example';

const displayName = 'ExpressionWithFormulaLogicExample';

const FormulaLogic = (props) => {
	return (
		<Example
			action={props.action}
			conditions={[
				{
					resource: '',
				},
			]}
			triggerType="formula"
		/>
	);
};

FormulaLogic.displayName = displayName;

export default FormulaLogic;
