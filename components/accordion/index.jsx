/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Accordion design
// pattern](https://www.lightningdesignsystem.com/components/accordion/) in
// React. Based on SLDS v2.4.3

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shortid from 'shortid';

import { ACCORDION } from '../../utilities/constants';

const propTypes = {
	/**
	 * CSS class names to be added to the accordion component. _Tested with snapshot testing._
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * HTML id for accordion component. _Tested with snapshot testing._
	 */
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * The panel content for the Accordion component. Accordion panels should be added as <AccordionPanel />. Event handler for the accordion panels should be added to `<AccordionPanel />`. Optional `panelContentActions` component may be passed as prop. _Tested with Mocha framework and snapshot testing._
	 *
	 * Example:
	 * ```
	 * <SLDSAccordion>
	 *   <SLDSAccordionpanel />
	 *   <SLDSAccordionpanel />
	 *   <SLDSAccordionpanel />
	 * </SLDSAccordion>
	 * ```
	 */
	children: PropTypes.node.isRequired,
};

/**
 * An accordion allows a user to toggle the display of sections of content.
 * The accordion component wraps accordion panels that can be selected and expanded. It accepts children to define the content displayed within.
 */
const Accordion = props => {
	const [buttonIdx, setButtonIdx] = useState({ currButtonIndex: 0 });

	const prevButtonIdx = useRef();

	useEffect(() => {
		prevButtonIdx.current = buttonIdx;
		if (
			buttonIdx !== null &&
			buttonIdx !== prevButtonIdx.current
		) {
			summaryButtons[buttonIdx.currButtonIndex].focus();
		}
	},[buttonIdx]);
	
	const summaryButtons = [];
	const generatedId = shortid.generate();

	const onClickSummary = () => {
		setButtonIdx({ currButtonIndex: null });
	}

	const onKeyDownSummary = (e) => {
		let buttonIndex = buttonIdx;
		if (buttonIndex === null) {
			buttonIndex = summaryButtons.findIndex(
				(el) => el.id === e.target.id
			);
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (buttonIndex < props.children.length - 1) {
				setButtonIdx({
					currButtonIndex: buttonIndex + 1
				});
			} else {
				setButtonIdx({ currButtonIndex: 0 });
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (buttonIndex > 0) {
				setButtonIdx({
					currButtonIndex: buttonIndex - 1
				});
			} else {
				setButtonIdx({ currButtonIndex: props.children.length - 1 });
			}
		}
	}

	const addSummaryButton = button => {
		const btnInArr = summaryButtons.find((el) => button === el);
		if (button !== null && btnInArr === undefined) {
			// eslint-disable-next-line fp/no-mutating-methods
			summaryButtons.push(button);
		}
	}

	return (
		<ul
			name={props.id || generatedId}
			className={classNames('slds-accordion', props.className)}
		>
			{React.Children.map(props.children, (child) =>
				React.cloneElement(child, {
					refs: { summaryButton: addSummaryButton.bind(this) },
					onClickSummary: onClickSummary.bind(this),
					onKeyDownSummary: onKeyDownSummary.bind(this),
				})
			)}
		</ul>
	);
}

Accordion.displayName = ACCORDION;
Accordion.propTypes = propTypes;

export default Accordion;
