import React from 'react';
import Files from '~/components/files';
import File from '~/components/files/file';
import IconSettings from '~/components/icon-settings';
import Icon from '~/components/icon';

const displayName = 'filesNoImageExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<Files id="files-with-no-image-example">
				<File
					id="file-with-no-image"
					labels={{
						title: 'Proposal.pdf',
					}}
					icon={<Icon category="doctype" name="pdf" />}
				/>
			</Files>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example;
