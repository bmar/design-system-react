import React from 'react';
import Files from '~/components/files';
import File from '~/components/files/file';
import IconSettings from '~/components/icon-settings';
import Icon from '~/components/icon';

const displayName = 'filesExample';

const Example = (props) => {
	return (
		<IconSettings iconPath="/assets/icons">
			<Files id="files-with-crop-example">
				<File
					id="file-crop-1-1"
					labels={{
						title: 'Proposal.pdf',
					}}
					icon={<Icon category="doctype" name="pdf" />}
					image="/assets/images/placeholder-img@16x9.jpg"
					crop="1-by-1"
				/>
				<File
					id="file-crop-16-9"
					labels={{
						title: 'Proposal.pdf',
					}}
					icon={<Icon category="doctype" name="pdf" />}
					image="/assets/images/placeholder-img@16x9.jpg"
					crop="16-by-9"
				/>
				<File
					id="file-crop-4-3"
					labels={{
						title: 'Proposal.pdf',
					}}
					icon={<Icon category="doctype" name="pdf" />}
					image="/assets/images/placeholder-img@16x9.jpg"
					href="javascript:void(0);"
					crop="4-by-3"
				/>
			</Files>
		</IconSettings>
	);
};

Example.displayName = displayName;

export default Example;
