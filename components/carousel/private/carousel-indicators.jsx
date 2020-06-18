/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// ### React
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// ### classNames
// [github.com/JedWatson/classnames](https://github.com/JedWatson/classnames)
// This project uses `classnames`, "a simple javascript utility for conditionally
// joining classNames together."
import classnames from 'classnames';

import { CAROUSEL_INDICATORS } from '../../../utilities/constants';

/**
 * CarouselIndicators is used to display the list of indicators associated to the number of panels
 * a carousel has
 */
const CarouselIndicators = (props) => {
	useEffect(() => {
		if (
			props.hasFocus &&
			CarouselIndicators[`indicator${props.currentIndex}`]
		) {
			CarouselIndicators[`indicator${props.currentIndex}`].focus();
		}
	}, [props.currentIndex]);
	const onFocus = (event) => {
		CarouselIndicators[`indicator${props.currentIndex}`].focus();
		if (props.onFocus) {
			props.onFocus(event);
		}
	};

	return (
		<ul
			className="slds-carousel__indicators slds-col slds-text-align_center"
			role="tablist"
		>
			{[...Array(props.noOfIndicators).keys()].map((index) => {
				const isSelectedPanel = index === props.currentIndex;
				const indicatorActionClassName = classnames(
					'slds-carousel__indicator-action',
					props.className,
					{
						'slds-is-active': isSelectedPanel,
					}
				);
				let assistiveText = `${index}`;
				let title = `${index}`;
				let id = '';

				if (props.items && props.items.length > 0) {
					// eslint-disable-next-line prefer-destructuring
					id = props.items[index].id;

					const startItemIndex = index * props.itemsPerPanel;
					let autoIndicatorText = '';

					// eslint-disable-next-line fp/no-loops
					for (
						let i = startItemIndex;
						i < startItemIndex + props.itemsPerPanel;
						i += 1
					) {
						if (props.items[i] && props.items[i].heading) {
							autoIndicatorText = !autoIndicatorText
								? ''
								: `${autoIndicatorText}, `;
							autoIndicatorText += props.items[i].heading;
						}
					}

					if (autoIndicatorText) {
						assistiveText = autoIndicatorText;
						title = autoIndicatorText;
					}
				}

				return (
					<li
						className="slds-carousel__indicator slds-m-horizontal_xx-small"
						key={index}
						role="presentation"
						style={{ margin: 0, padding: '0 5px' }}
					>
						<a
							ref={(component) => {
								CarouselIndicators[`indicator${index}`] = component;
							}}
							id={`indicator-id-${props.carouselId}-${index}`}
							className={indicatorActionClassName}
							role="tab"
							tabIndex={isSelectedPanel ? '0' : '-1'}
							aria-selected={isSelectedPanel}
							aria-controls={props.getPanelId({
								carouselId: props.carouselId,
								itemId: id,
							})}
							title={title}
							onBlur={props.onBlur}
							onClick={(event) => props.onClick(event, index)}
							onFocus={onFocus}
						>
							<span className="slds-assistive-text">{assistiveText}</span>
						</a>
					</li>
				);
			})}
		</ul>
	);
};

CarouselIndicators.displayName = CAROUSEL_INDICATORS;

CarouselIndicators.defaultProps = {
	currentIndex: 0,
};

// ### Prop Types
CarouselIndicators.propTypes = {
	/**
	 * Carousel HTML ID
	 */
	carouselId: PropTypes.string,
	/**
	 * CSS classes that are applied to the component
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Selected indicator
	 */
	currentIndex: PropTypes.number,
	/**
	 * Passed from carousel parent state, dictates if indicator currently has focus
	 */
	hasFocus: PropTypes.bool,
	/**
	 * Array of objects with shape, needed for building a carousel items
	 */
	items: PropTypes.array,
	/**
	 * Number of items to be displayed at a time in the carousel
	 */
	itemsPerPanel: PropTypes.number,
	/**
	 * Number of indicators to be displayed (corresponds to the number of panels in the carousel)
	 */
	noOfIndicators: PropTypes.number.isRequired,
	/**
	 * Fires on indicator blur, allows parent carousel to adjust indicatorsHaveFocus state accordingly
	 */
	onBlur: PropTypes.func,
	/**
	 * Triggered when the indicator is clicked.
	 */
	onClick: PropTypes.func,
	/**
	 * Fires on indicator focus, allows parent carousel to adjust indicatorsHaveFocus state accordingly
	 */
	onFocus: PropTypes.func,
};

export default CarouselIndicators;
