import React from 'react';

import Illustration from '~/components/illustration'; // `~` is replaced with design-system-react at runtime

const Example = (props) => {
	return (
		<Illustration
			messageBody="Lorem ipsum dolor sit amet, consectetur"
			silenceDeprecationWarning
		/>
	);
};

Example.displayName = 'IllustrationExample';

export default Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
