/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Badge design pattern](https://latest-216.lightningdesignsystem.com/components/badges/) in React.

// ## Dependencies

// ### React
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

// ## Constants
import { BADGE } from '../../utilities/constants';

/**
 * Badges are labels which hold small amounts of information.
 */
const Badge = (props) => {
	const generatedId = shortid.generate();

	/**
	 * Get the Badge's HTML id. Generate a new one if no ID present.
	 */
	const getId = () => {
		return props.id || generatedId;
	};

	const icon = (
		<span
			className={classNames(
				'slds-badge__icon',
				`slds-badge__icon_${props.iconAlignment}`
			)}
			style={props.style}
		>
			{props.icon}
		</span>
	);

	return (
		<span
			id={getId()}
			className={classNames(
				'slds-badge',
				{
					'slds-badge_inverse': props.color === 'inverse',
					'slds-badge_lightest': props.color === 'light',
				},
				props.className
			)}
		>
			{props.iconAlignment === 'left' ? (
				<React.Fragment>
					{icon}
					{props.content}
				</React.Fragment>
			) : (
				<React.Fragment>
					{props.content}
					{icon}
				</React.Fragment>
			)}
		</span>
	);
};

Badge.displayName = BADGE;

Badge.propTypes = {
	/**
	 * CSS classes that are applied to the component
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),

	/**
	 * Id of component, if desired. If not provided an id is automatically generated
	 */
	id: PropTypes.string,

	/**
	 * Custom styles to be passed to the component
	 */
	style: PropTypes.object,

	/**
	 * Color variant for the badge component
	 */
	color: PropTypes.oneOf(['default', 'inverse', 'light']),

	/**
	 * Icon alignment for the badge component
	 */
	iconAlignment: PropTypes.oneOf(['left', 'right']),

	/**
	 *  Content to be placed inside the badge component
	 */
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

Badge.defaultProps = {
	iconAlignment: 'left',
	color: 'default',
};

export default Badge;
