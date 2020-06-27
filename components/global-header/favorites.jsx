/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// # Global Header Favorites Component
// Implements the [Global Header Help design pattern](https://www.lightningdesignsystem.com/components/global-header/#Help) in React.

import React from 'react';
import PropTypes from 'prop-types';
import assign from 'lodash.assign';
import classnames from 'classnames';

import Button from '../button';
import EventUtil from '../../utilities/event';
import KEYS from '../../utilities/key-code';
import Popover from '../popover';

import { GLOBAL_HEADER_FAVORITES } from '../../utilities/constants';

const propTypes = {
	/**
	 * **Assistive text for accessibility**
	 * * `action`: Description of star button. Default is "Toggle Favorite."
	 * * `more`: Description of dropdown menu. Default is "View Favorites."
	 */
	assistiveText: PropTypes.shape({
		action: PropTypes.string,
		more: PropTypes.string,
	}),
	/**
	 * Disables the favorites action (star) button and not the related Popover."
	 */
	actionDisabled: PropTypes.bool,
	/**
	 * Controls whether the favorites action (star) button is selected or not
	 */
	actionSelected: PropTypes.bool,
	/**
	 * This event fires when the favorites action (star) button is toggled. Passes in `event, { actionSelected }`.
	 */
	onToggleActionSelected: PropTypes.func,
	/**
	 * A `Popover` component applied to the favorites more button. The props from this popover will be merged and override any default props. The `children` prop will be ignored.
	 */
	popover: PropTypes.node,
};

/**
 * A GlobalHeaderFavorites component. The favorites action is used to "favorite" a commonly used page within a user's experience. When a user "favorites" a page by pressing the favorites action, the button icon changes color with a small animation to confirm your selection.
 */
const GlobalHeaderFavorites = (props) => {
	const toggleActionSelected = (event) => {
		if (props.onToggleActionSelected) {
			props.onToggleActionSelected(event, {
				actionSelected: props.actionSelected || false,
			});
		}
	};

	const actionAriaProps = {};
	const popoverProps = assign(
		{
			align: 'bottom',
			body: <span />,
			triggerClassName: 'slds-dropdown-trigger slds-dropdown-trigger_click',
		},
		props.popover ? props.popover.props : {}
	);

	// eslint-disable-next-line fp/no-delete
	delete popoverProps.children;

	if (props.actionSelected) {
		actionAriaProps['aria-pressed'] = true;
	}

	return (
		<div className="slds-global-actions__favorites slds-dropdown-trigger slds-dropdown-trigger_click">
			<div className="slds-button-group">
				<Button
					assistiveText={{ icon: props.assistiveText.action }}
					className={classnames(
						'slds-button_icon slds-global-actions__favorites-action',
						{
							'slds-is-disabled': props.actionDisabled,
							'slds-is-selected': props.actionSelected,
						}
					)}
					disabled={props.actionDisabled}
					iconCategory="utility"
					iconName="favorite"
					iconSize="small"
					iconVariant="border"
					onClick={toggleActionSelected}
					onKeyDown={(event) => {
						if (event.keyCode === KEYS.ENTER) {
							EventUtil.trapImmediate(event);
							toggleActionSelected(event);
						}
					}}
					title={props.assistiveText.action}
					variant="icon"
					{...actionAriaProps}
				/>
				<Popover {...popoverProps}>
					<Button
						assistiveText={{ icon: props.assistiveText.more }}
						className="slds-button_icon slds-global-actions__favorites-more"
						iconCategory="utility"
						iconName="down"
						iconSize="small"
						iconVariant="border"
						style={{
							// this is needed because the popover trigger wrapper janks up the default styles
							borderLeft: '0',
							borderRadius: '0 .25rem .25rem 0',
						}}
						title={props.assistiveText.more}
						variant="icon"
					/>
				</Popover>
			</div>
		</div>
	);
};

GlobalHeaderFavorites.displayName = GLOBAL_HEADER_FAVORITES;

GlobalHeaderFavorites.defaultProps = {
	assistiveText: {
		action: 'Toggle Favorite',
		more: 'View Favorites',
	},
};

GlobalHeaderFavorites.propTypes = propTypes;

export default GlobalHeaderFavorites;
