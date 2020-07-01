/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// ### React
import React from 'react';

import PropTypes from 'prop-types';

// ### classNames
// [github.com/JedWatson/classnames](https://github.com/JedWatson/classnames)
// This project uses `classnames`, "a simple javascript utility for conditionally
// joining classNames together."
import classnames from 'classnames';

import { MEDIA_OBJECT } from '../../utilities/constants';

// Allow for predicatable DOM queries with `querySelectorAll(cssClasses.base)`
export const cssClasses = {
	base: 'slds-media',
	figure: 'slds-media__figure',
	body: 'slds-media__body',
};

// ### Display Name
// Always use the canonical component name as the React display name.
const displayName = MEDIA_OBJECT;

// ### Prop Types
const propTypes = {
	/**
	 * Often the body may need to be truncated for correct layout. This is only applicable if using the component within a flexbox container.
	 */
	canTruncate: PropTypes.bool,
	/**
	 * Class names to be added to the component's HTML tag with `slds-media` class.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * The body is often text such as a heading or paragraph.
	 */
	body: PropTypes.node,
	/**
	 * The figure is the optional visualization of the text within the body.
	 */
	figure: PropTypes.node,
	/**
	 * Vertically centers the body with the middle of the figure.
	 */
	verticalCenter: PropTypes.bool,
};

/**
 * When you need text and a figure next to each other, use a media object.
 */
const MediaObject = (props) => {
	return (
		<div
			className={classnames(
				cssClasses.base,
				{
					'slds-media_center': props.verticalCenter,
					'slds-has-flexi-truncate': props.canTruncate,
				},
				props.className
			)}
		>
			{props.figure ? (
				<div className={cssClasses.figure}>{props.figure} </div>
			) : null}
			<div className={cssClasses.body}>{props.body}</div>
		</div>
	);
};

MediaObject.propTypes = propTypes;
MediaObject.displayName = displayName;

export default MediaObject;
