/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// # Carousel Component

// Implements the [Carousel design pattern](https://www.lightningdesignsystem.com/components/carousel/) in React.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import useInterval from '../hooks/useInterval';
import useRefResize from '../hooks/useRefResize';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

import { CAROUSEL_FUNC } from '../../utilities/constants';

import {
	canUseDOM,
	canUseEventListeners,
} from '../../utilities/execution-environment';

import CarouselIndicators from './private/carousel-indicators';
import PreviousNextCarouselNavigator from './private/previous-next-carousel-navigator';
import CarouselItem from './private/carousel-item';
import AutoplayButton from './private/auto-play-button';

// ### Event Helpers
import KEYS from '../../utilities/key-code';
import EventUtil from '../../utilities/event';

/* eslint-disable jsx-a11y/no-static-element-interactions */

// ### Default Props
const defaultProps = {
	assistiveText: {
		autoplayButton: 'Start / Stop auto-play',
		nextPanel: 'Next Panel',
		previousPanel: 'Previous Panel',
	},
	autoplayInterval: 4000,
	hasAutoplay: false,
	hasPreviousNextPanelNavigation: false,
	isInfinite: false,
	itemsPerPanel: 1,
};

// ### Display Name
// Always use the canonical component name as the React display name.
const displayName = CAROUSEL_FUNC;

// ### Prop Types
const propTypes = {
	/**
	 * Description of the carousel items for screen-readers.
	 */
	assistiveText: PropTypes.object,
	/**
	 * Interval for the autoplay iteration
	 */
	autoplayInterval: PropTypes.number,
	/**
	 * CSS classes that are applied to the main 'slds-carousel' classed component container
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Dictates the currently active/visible carousel panel. Use with `onRequestPanelChange` for a controlled carousel component. If not provided, the carousel will manage this itself via state.
	 */
	currentPanel: PropTypes.number,
	/**
	 * Boolean showing whether the autoplay button is available or not
	 */
	hasAutoplay: PropTypes.bool,
	/**
	 * Boolean for displaying the navigation indicators (left/right arrows) of the carousel
	 */
	hasPreviousNextPanelNavigation: PropTypes.bool,
	/**
	 * Id of component, if desired. If not provided an id is automatically generated
	 */
	id: PropTypes.string,
	/**
	 * Boolean that dictates whether autoplay is active or not. Use with `onRequestAutoplayToggle` for a controlled carousel component.
	 */
	isAutoplayOn: PropTypes.bool,
	/**
	 * Boolean for infinite loop navigation. Note: if not true autoplay will stop automatically at the last panel.
	 */
	isInfinite: PropTypes.bool,
	/**
	 * * **Array of item objects used by the default carousel item renderer.**
	 * Each object can contain:
	 * * `id`: The id of the carousel item. [REQUIRED]
	 * * `heading`: Primary string that will be used as the heading
	 * * `description`: Secondary string that is used to describe the item
	 * * `buttonLabel`: If assigned a call to button action will be rendered with this text, if unassigned no button is rendered
	 * * `imageAssistiveText`: Image alt text, if not present heading will be used instead
	 * * `href`: Used for item link, if not provided 'javascript:void(0);' is used instead
	 * * `src`: Item image src value
	 */
	items: PropTypes.array.isRequired,
	/**
	 * Number of items to be displayed at a time in the carousel
	 */
	itemsPerPanel: PropTypes.number,
	/**
	 * Accepts a custom carousel item rendering function
	 */
	onRenderItem: PropTypes.func,
	/**
	 * Called whenever `isAutoplayOn` is requested to be toggled on or off. Use with `isAutoplayOn` prop for a controlled carousel component. Passes an event object and a data object with the current `isAutoplayOn` value as an attribute.
	 */
	onRequestAutoplayToggle: PropTypes.func,
	/**
	 * Called whenever the panel is requested to change due to user interaction or auto-play. Use with `currentPanel` for a controlled carousel component. Passes an event object and a data object with `currentPanel` and `requestedPanel` attributes.
	 */
	onRequestPanelChange: PropTypes.func,
	/**
	 * Handler for clicking on a carousel item
	 */
	onItemClick: PropTypes.func,
};

/**
 * A carousel allows multiple pieces of featured content to occupy an allocated amount of space.
 * Currently panel index and auto play cannot be controlled by the app.
 */
const CarouselFunc = (props) => {
	const { hasAutoplay, hasPreviousNextPanelNavigation, isInfinite } = props;

	let nrOfPanels = Math.ceil(props.items.length / props.itemsPerPanel);
	const stageItem = useRef(null);

	const [currentPanelState, setCurrentPanelState] = useState(
		props.currentPanel !== undefined ? props.currentPanel : 0
	);
	const [stageWidthState, setStageWidthState] = useState(0);
	const [indicatorsHaveFocus, setIndicatorsHaveFocus] = useState(false);
	const [isAutoplayOnState, setIsAutoplayOnState] = useState(
		props.isAutoplayOn !== undefined ? props.isAutoplayOn : hasAutoplay
	);
	const [translateX, setTranslateX] = useState(-1000000);

	const generatedId = shortid.generate();

	const startStageItem = (entry) => {
		if (canUseDOM) setStageWidthState(entry.width);
	};

	const [rect, offset] = useRefResize(stageItem, startStageItem);

	const [startInterval, stopInterval, meanwhile] = useInterval(
		autoplay,
		props.autoplayInterval
	);

	function autoplay() {
		if (canGoToNext()) {
			onNextPanelHandler(event);
		} else if (isInfinite) {
			setCurrentPanel(event, 0);
		} else {
			stopAutoplay(event);
		}
	}

	// componentDidMount
	let stageWidth;
	useEffect(() => {
		if (getIsAutoplayOn()) {
			startAutoplay({ mountAutoplayEvent: true });
		}
		return () => {
			// componentWillUnmount
			stopInterval();
			stopAutoplay({ unmountAutoplayEvent: true }, true);
		};
	}, []);

	// componentDidUpdate
	useEffect(() => {
		changeTranslationAutomatically();
	}, [currentPanelState, stageWidthState, props.currentPanel]);
	useEffect(() => {
		if (meanwhile() !== isAutoplayOnState && isAutoplayOnState) {
			startInterval();
		} else if (meanwhile() !== isAutoplayOnState && !isAutoplayOnState) {
			stopInterval();
		}
	}, [isAutoplayOnState]);
	useEffect(() => {
		if (props.isAutoplayOn) {
			startAutoplay({ updateAutoplayEvent: true });
		} else {
			stopAutoplay({ updateAutoplayEvent: true }, true);
		}
	}, [props.isAutoplayOn]);

	const onNextPanelHandler = (event) => {
		let next = getCurrentPanel() + 1;
		if (next > nrOfPanels - 1) {
			next = 0;
		}
		setCurrentPanel(event, next);
	};

	const onPreviousPanelHandler = (event) => {
		let prev = getCurrentPanel() - 1;
		if (prev < 0) {
			prev = nrOfPanels - 1;
		}
		setCurrentPanel(event, prev);
	};

	const onIndicatorBlur = () => {
		setIndicatorsHaveFocus(false);
	};

	const onIndicatorClickHandler = (event, panel) => {
		setCurrentPanel(event, panel);
		setIndicatorsHaveFocus(true);
		if (getIsAutoplayOn()) {
			stopAutoplay(event);
		}
	};

	const onIndicatorFocus = (event) => {
		setIndicatorsHaveFocus(true);
		if (getIsAutoplayOn()) {
			stopAutoplay(event);
		}
	};

	const onAutoplayBtnClick = (event) => {
		const isAutoplayOn = getIsAutoplayOn();

		if (props.onRequestAutoplayToggle) {
			props.onRequestAutoplayToggle(event, { isAutoplayOn });
		} else {
			const actionToTake = isAutoplayOn ? stopAutoplay : startAutoplay;
			actionToTake(event);
		}
	};

	const getPanelId = ({ carouselId, itemId }) =>
		`content-id-${carouselId}-${itemId}`;

	const getCurrentPanel = () => {
		return props.currentPanel !== undefined
			? props.currentPanel
			: currentPanelState;
	};

	const getIsAutoplayOn = () => {
		return props.isAutoplayOn !== undefined
			? props.isAutoplayOn
			: isAutoplayOnState;
	};

	const setTranslationAmount = (amount) => {
		setTranslateX(amount);
	};

	const setCurrentPanel = (event, amount) => {
		if (props.onRequestPanelChange) {
			props.onRequestPanelChange(event, {
				currentPanel: getCurrentPanel(),
				requestedPanel: amount,
			});
		} else {
			setCurrentPanelState(amount);
		}
	};

	const startAutoplay = (event) => {
		if (canUseDOM) setIsAutoplayOnState(true);
	};

	const stopAutoplay = (event, ignoreCallbacksAndStateUpdates) => {
		if (props.isAutoplayOn !== undefined) setIsAutoplayOnState(false);

		if (!ignoreCallbacksAndStateUpdates) {
			if (props.onRequestAutoplayToggle) {
				props.onRequestAutoplayToggle(event, {
					isAutoplayOn: getIsAutoplayOn(),
				});
			} else {
				setIsAutoplayOnState(false);
			}
		}
	};

	const changeTranslationAutomatically = () => {
		setTranslationAmount(
			-((stageWidthState || stageWidth) * getCurrentPanel())
		);
	};

	const canGoToNext = () => getCurrentPanel() < nrOfPanels - 1;

	const canGoToPrevious = () => getCurrentPanel() > 0;

	const handleKeyDown = (event) => {
		const keyDownCallbacks = {
			[KEYS.LEFT]: () => {
				if (isInfinite || canGoToPrevious()) {
					onPreviousPanelHandler(event);
					setIndicatorsHaveFocus(true);
					if (getIsAutoplayOn()) {
						stopAutoplay(event);
					}
				}
			},
			[KEYS.RIGHT]: () => {
				if (isInfinite || canGoToNext()) {
					onNextPanelHandler(event);
					setIndicatorsHaveFocus(true);
					if (getIsAutoplayOn()) {
						stopAutoplay(event);
					}
				}
			},
		};

		if (keyDownCallbacks[event.keyCode]) {
			EventUtil.trapImmediate(event);
			keyDownCallbacks[event.keyCode]();
		}
	};

	const currentPanel = getCurrentPanel();
	const id = props.id || generatedId;
	const isPreviousBtnDisabled = !(isInfinite || canGoToPrevious());
	const isNextBtnDisabled = !(isInfinite || canGoToNext());
	const itemWidth = (stageWidthState || stageWidth) / props.itemsPerPanel;
	const carouselMargins = hasPreviousNextPanelNavigation
		? { marginLeft: '44px', marginRight: '44px' }
		: {};
	return (
		<div
			className={classnames('slds-carousel', props.className)}
			id={id}
			onKeyDown={handleKeyDown}
		>
			<div className="slds-grid_vertical slds-col slds-path__scroller">
				{hasAutoplay && (
					<AutoplayButton
						assistiveText={props.assistiveText.autoplayButton}
						isAutoplayOn={getIsAutoplayOn()}
						onClick={onAutoplayBtnClick}
					/>
				)}
				<div className="slds-is-relative" style={carouselMargins}>
					{hasPreviousNextPanelNavigation && (
						<PreviousNextCarouselNavigator
							assistiveText={props.assistiveText.previousPanel}
							iconName="chevronleft"
							isDisabled={isPreviousBtnDisabled}
							onClick={(event) => {
								if (getIsAutoplayOn()) {
									stopAutoplay(event);
								}
								onPreviousPanelHandler(event);
							}}
							inlineStyle={{ left: '-38px' }}
						/>
					)}
					<div ref={stageItem} className="slds-carousel__stage slds-show">
						<div
							className="slds-carousel__panels slds-is-relative"
							style={{
								transform: `translateX(${translateX}px)`,
							}}
						>
							{props.items.map((item, index) => (
								<CarouselItem
									carouselId={id}
									getPanelId={getPanelId}
									onClick={(event) => {
										props.onItemClick(event, { item });
									}}
									onFocus={(event) => {
										if (getIsAutoplayOn()) {
											stopAutoplay(event);
										}
									}}
									onRenderItem={props.onRenderItem}
									{...item}
									isInCurrentPanel={
										index >= currentPanel * props.itemsPerPanel &&
										index <
											currentPanel * props.itemsPerPanel + props.itemsPerPanel
									}
									itemWidth={itemWidth}
									key={item.id}
									panelIndex={Math.ceil((index + 1) / props.itemsPerPanel) - 1}
								/>
							))}
						</div>
					</div>
					{hasPreviousNextPanelNavigation && (
						<PreviousNextCarouselNavigator
							assistiveText={props.assistiveText.nextPanel}
							iconName="chevronright"
							isDisabled={isNextBtnDisabled}
							onClick={(event) => {
								if (getIsAutoplayOn()) {
									stopAutoplay(event);
								}
								onNextPanelHandler(event);
							}}
							inlineStyle={{ right: '-38px' }}
						/>
					)}
				</div>
				<CarouselIndicators
					noOfIndicators={nrOfPanels}
					carouselId={id}
					currentIndex={currentPanel}
					getPanelId={getPanelId}
					hasFocus={indicatorsHaveFocus}
					onBlur={onIndicatorBlur}
					onClick={onIndicatorClickHandler}
					onFocus={onIndicatorFocus}
					items={props.items}
					itemsPerPanel={props.itemsPerPanel}
				/>
			</div>
		</div>
	);
};

CarouselFunc.defaultProps = defaultProps;
CarouselFunc.displayName = displayName;

export default CarouselFunc;
