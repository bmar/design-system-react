/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// # App Launcher Link Component

// ## Dependencies

// ### React
import React from 'react';
import PropTypes from 'prop-types';

// ### classNames
// [github.com/JedWatson/classnames](https://github.com/JedWatson/classnames)
// A simple javascript utility for conditionally joining classNames together.
import classNames from 'classnames';

// ### Children
import Highlighter from '../utilities/highlighter';

// ## Constants
import { APP_LAUNCHER_LINK } from '../../utilities/constants';

// ### Prop Types
const propTypes = {
	/**
	 * Contents of the link
	 */
	children: PropTypes.node,
	/**
	 * Classes to be applied to the link
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * The `href` attribute of the link. If the `onClick` callback is specified this URL will be prevented from changing the browser's location.
	 */
	href: PropTypes.string,
	/**
	 * Callback for when the link is clicked. Passes back event and data object with href prop. Prevents click from changing browser's location if set.
	 */
	onClick: PropTypes.func,
	/**
	 * Text used to highlight content in link
	 */
	search: PropTypes.string,
	/**
	 * The title for the link. If not provided it will attempt to use child content if that content is a string.
	 */
	title: PropTypes.string,
};

// ### Default Props
const defaultProps = {
	href: 'javascript:void(0);', // eslint-disable-line no-script-url
};

// ### Display Name
// Always use the canonical component name as the React display name.
const displayName = APP_LAUNCHER_LINK;

/**
 * App Launcher Link component creates simple links to be used in "All Items" sections
 */
const AppLauncherLink = (props) => {
	let { title } = props;

	if (!title && typeof props.children === 'string') {
		title = props.children;
	}

	return (
		<a
			href={props.href} // eslint-disable-line no-script-url
			className={classNames('slds-truncate', props.className)}
			onClick={(event) => {
				if (props.onClick) {
					event.preventDefault();
					props.onClick(event, { href: props.href });
				}
			}}
			title={title}
		>
			<Highlighter search={props.search}>{props.children}</Highlighter>
		</a>
	);
};

AppLauncherLink.displayName = displayName;

export default AppLauncherLink;
