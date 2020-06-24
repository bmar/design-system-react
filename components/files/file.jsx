/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Files design pattern](https://lightningdesignsystem.com/components/files/) in React.
// Based on SLDS v2.4.0
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';
import { FILES_FILE } from '../../utilities/constants';

import FileFigure from './private/file-figure';
import FileActions from './private/file-actions';

const displayName = FILES_FILE;

const propTypes = {
	/**
	 * **Assistive text for accessibility**
	 *  * download - description for the download button if present
	 *  * image - description for the file image
	 *  * link - description for the file link
	 *  * loading - description for the loading spinner if present
	 *  * moreActions - description for the more actions dropdown if present
	 */
	assistiveText: PropTypes.shape({
		download: PropTypes.string,
		image: PropTypes.string,
		link: PropTypes.string,
		loading: PropTypes.string,
		moreActions: PropTypes.string,
	}),
	/**
	 * CSS class names to be added to the container element. `array`, `object`, or `string` are accepted.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Controls different cropping aspect ratios for the component
	 */
	crop: PropTypes.oneOf(['16-by-9', '4-by-3', '1-by-1']),
	/**
	 * HTML id for component.
	 */
	id: PropTypes.string,
	/**
	 * Action to be done on clicking download button; doesn't show download button if empty
	 */
	onClickDownload: PropTypes.func,
	/**
	 * Function that is called when image is clicked; can be used instead of href for more advanced event handling
	 */
	onClickImage: PropTypes.func,
	/**
	 * Dropdown for more actions button; doesn't show more actions button if empty
	 */
	moreActionsDropdown: PropTypes.node,
	/**
	 * Icon associated with the file. Accepts an Icon component
	 */
	icon: PropTypes.node,
	/**
	 * Icon to be shown in top left corner of File component. Accepts an Icon component
	 */
	externalIcon: PropTypes.node,
	/**
	 * Link to thumbnail image
	 */
	image: PropTypes.string,
	/**
	 * Controls whether file preview is loading
	 */
	isLoading: PropTypes.bool,
	/**
	 * Href attribute for image
	 */
	href: PropTypes.string,
	/**
	 * Labels for the File Component
	 * * image - title for the file. Required.
	 */
	labels: PropTypes.shape({
		title: PropTypes.string.isRequired,
	}),
	/**
	 *  Controls whether the file's title should be visible
	 */
	hasNoVisibleTitle: PropTypes.bool,
};

const injectMoreActionsStyles = () => {
	return (
		<style>{`
				.dsr-file__more-actions-dropdown  ul.dropdown__list li.slds-dropdown__item > a:before
				{ background: none; }
				.dsr-file__more-actions-dropdown  ul.dropdown__list li.slds-dropdown__item > a:after
				{ background: none; }
				.dsr-file__more-actions > button:first-child
				{ border-radius: 0 0.25rem 0.25rem 0!important;}
		`}</style>
	);
};

const defaultProps = {
	assistiveText: {
		download: 'download',
		link: 'Preview:',
		loading: 'loading',
		moreActions: 'more actions',
	},
	crop: '16-by-9',
	href: 'javascript:void(0);',
	isLoading: false,
	hasNoVisibleTitle: false,
};
/**
 * File is a component that represents content uploaded as an attachment.
 */
const File = (props) => {
	const generatedId = shortid.generate();

	/**
	 * Get the File's HTML id. Generate a new one if no ID present.
	 */
	const getId = () => {
		return props.id || generatedId;
	};

	const assistiveText = {
		...defaultProps.assistiveText,
		...props.assistiveText,
	};

	return (
		<div
			id={getId()}
			className={classNames(
				'slds-file',
				'slds-file_card',
				!props.hasNoVisibleTitle ? 'slds-has-title' : null,
				props.className
			)}
		>
			<figure>
				<a
					href={props.href}
					className={classNames(
						'slds-file__crop',
						props.crop ? `slds-file__crop_${props.crop}` : null
					)}
					onClick={props.onClickImage}
				>
					<FileFigure
						assistiveText={assistiveText}
						labels={{
							title: props.labels.title,
						}}
						isLoading={props.isLoading}
						image={props.image}
						icon={props.icon}
					/>
				</a>
				{!props.hasNoVisibleTitle ? (
					<figcaption className="slds-file__title slds-file__title_card">
						<div className="slds-media__figure slds-line-height_reset">
							{props.icon
								? React.cloneElement(props.icon, {
										size: 'x-small',
								  })
								: null}
						</div>
						<div className="slds-media__body">
							<span
								className="slds-file__text slds-truncate"
								title={props.labels.title}
							>
								{props.labels.title}
							</span>
						</div>
					</figcaption>
				) : null}
			</figure>
			{props.externalIcon ? (
				<div className="slds-file__external-icon">
					{React.cloneElement(props.externalIcon, {
						containerClassName: 'slds-file__icon slds-icon_container',
					})}
				</div>
			) : null}
			{props.moreActionsDropdown ? File.injectMoreActionsStyles() : null}
			<FileActions
				assistiveText={assistiveText}
				hasNoVisibleTitle={props.hasNoVisibleTitle}
				onClickDownload={props.onClickDownload}
				moreActionsDropdown={props.moreActionsDropdown}
			/>
		</div>
	);
};

File.injectMoreActionsStyles = injectMoreActionsStyles;
File.displayName = displayName;
File.propTypes = propTypes;
File.defaultProps = defaultProps;

export default File;
