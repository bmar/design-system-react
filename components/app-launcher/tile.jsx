/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

// # App Launcher Tile Component

// ## Dependencies

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// This component's `checkProps` which issues warnings to developers about properties when in development mode (similar to React's built in development tools)
import checkProps from './check-props';
import componentDoc from './component.json';

// ## Children
import Button from '../button';
import Highlighter from '../utilities/highlighter';
import Tooltip from '../tooltip';
import Truncate from '../utilities/truncate';

import { APP_LAUNCHER_TILE } from '../../utilities/constants';

const propTypes = {
	/**
	 * **Assistive text for accessibility.**
	 * * `dragIconText`: Text that describes the purpose of the drag handle icon.
	 */
	assistiveText: PropTypes.shape({
		dragIconText: PropTypes.string,
	}),
	/**
	 * Class names to be added to the tile.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * The description of the app. Not visible on small tiles.
	 */
	description: PropTypes.string,
	/**
	 * Heading for app description. NOTE: this prop is DEPRECATED and use should be avoided
	 */
	descriptionHeading: PropTypes.string,
	/**
	 * The `href` attribute of the tile. Please pass in bookmarkable URLs from your routing library. If the `onClick` callback is specified this URL will be prevented from changing the browser's location.
	 */
	href: PropTypes.string,
	/**
	 * Background color to be used on the icon. Only applied if iconNode is undefined
	 */
	iconBackgroundColor: PropTypes.string,
	/**
	 * Icon node for app tile. Takes priority over `iconText`
	 */
	iconNode: PropTypes.node,
	/**
	 * Text to be used as an icon. Only renders if iconNode is undefined
	 */
	iconText: PropTypes.string,
	/**
	 * Open the More Tooltip
	 */
	isOpenTooltip: PropTypes.bool,
	/**
	 * The localized text for the "More information" tooltip.
	 */
	moreLabel: PropTypes.string,
	/**
	 * Function that will be executed when clicking on a tile
	 */
	onClick: PropTypes.func,
	/**
	 * Text used to highlight content in app tiles
	 */
	search: PropTypes.string,
	/**
	 * App name for the tile's title.
	 */
	title: PropTypes.string.isRequired,

	// Future feature: add Highlighter to Truncate text (https://github.com/ShinyChang/React-Text-Truncate/issues/32)
};

const defaultProps = {
	assistiveText: {
		dragIconText: 'Reorder',
	},
	href: 'javascript:void(0);', // eslint-disable-line no-script-url
	moreLabel: ' More',
};

/**
 * App Launcher Tiles provide information and links to a user's apps
 */
const AppLauncherTile = (props) => {
	// `checkProps` issues warnings to developers about properties (similar to React's built in development tools)
	checkProps(APP_LAUNCHER_TILE, props, componentDoc);

	const handleClick = (event) => {
		if (props.onClick) {
			event.preventDefault();
			props.onClick(event, { href: props.href });
		}
	};

	const dragButtonAriaProps = { 'aria-pressed': false };
	const iconStyles = {};

	if (props.iconBackgroundColor) {
		iconStyles.backgroundColor = props.iconBackgroundColor;
	}

	return (
		<div
			className={classNames(
				'slds-app-launcher__tile slds-text-link_reset slds-is-draggable', // NOTE: while the draggable class is here for stylistic purposes, the draggable attribute is not present as draggability has not been implemented yet
				props.className
			)}
			onClick={handleClick}
			role="button"
			tabIndex="0"
		>
			<div className="slds-app-launcher__tile-figure">
				{props.iconNode || (
					<span className="slds-avatar slds-avatar_large">
						<abbr
							className="slds-avatar__initials slds-icon-custom-27"
							style={iconStyles}
							title={props.title}
						>
							{props.iconText}
						</abbr>
					</span>
				)}
				<div className="slds-m-top_xxx-small">
					<Button
						assistiveText={{
							icon: props.assistiveText.dragIconText,
						}}
						iconCategory="utility"
						iconName="rows"
						title={props.assistiveText.dragIconText}
						variant="icon"
						{...dragButtonAriaProps}
					/>
				</div>
			</div>
			<div className="slds-app-launcher__tile-body">
				<a
					href={props.href} // eslint-disable-line no-script-url
				>
					<Highlighter search={props.search}>{props.title}</Highlighter>
				</a>
				<Truncate
					line={2}
					prefix={
						props.descriptionHeading && props.descriptionHeading.toUpperCase()
					}
					suffix={props.moreLabel}
					text={props.description}
					textTruncateChild={
						<Tooltip
							align="bottom"
							content={
								<Highlighter search={props.search}>
									{props.description}
								</Highlighter>
							}
							isOpen={props.isOpenTooltip}
						>
							<Button
								className="slds-button_reset slds-text-link"
								variant="base"
							>
								{props.moreLabel}
							</Button>
						</Tooltip>
					}
					wrapper={(text, textTruncateChild) => (
						<React.Fragment>
							{props.descriptionHeading && (
								// inline style override
								<div
									className="slds-text-heading_label"
									style={{ letterSpacing: '0.025rem' }}
								>
									{props.descriptionHeading}{' '}
								</div>
							)}
							<Highlighter search={props.search}>{text}</Highlighter>
							{textTruncateChild && ' '}
							{textTruncateChild}
						</React.Fragment>
					)}
				/>
			</div>
		</div>
	);
};

AppLauncherTile.displayName = APP_LAUNCHER_TILE;
AppLauncherTile.defaultProps = defaultProps;
AppLauncherTile.propTypes = propTypes;

export default AppLauncherTile;
