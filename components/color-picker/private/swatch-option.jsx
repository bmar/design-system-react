import React from 'react';
import Swatch from './swatch';

const handleClick = (event, { hex, onSelect }) => {
	event.preventDefault();
	onSelect(event, { hex });
};
const selectedStyle = {
	border: '1px solid #141414',
	borderRadius: '2px',
	margin: '3px',
};

const selectedInnerStyle = {
	border: '1px solid white',
	borderRadius: '2px',
};

const displayName = 'SLDSSwatchOption';

const SwatchOption = (props) => {
	return (
		<li
			className="slds-color-picker__swatch"
			style={
				props.workingColor && props.workingColor.hex === props.color
					? selectedStyle
					: {}
			}
			role="presentation"
		>
			<a
				aria-selected={
					props.workingColor && props.workingColor.hex === props.color
				}
				className="slds-color-picker__swatch-trigger"
				onClick={(event) => {
					handleClick(event, {
						hex: props.color,
						onSelect: props.onSelect,
					});
				}}
				ref={props.swatchOptionRef}
				role="option"
				style={
					props.workingColor && props.workingColor === props.color
						? selectedInnerStyle
						: {}
				}
				tabIndex={props.tabIndex}
			>
				<Swatch color={props.color} labels={props.labels} />
			</a>
		</li>
	);
};

SwatchOption.displayName = displayName;

export default SwatchOption;
