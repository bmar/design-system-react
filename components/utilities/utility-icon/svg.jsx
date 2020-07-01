/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

import React from 'react';

const displayName = 'Svg';
const Svg = (props) => {
	const getPaths = (paths) => {
		if (paths instanceof Array) {
			return paths.map((item) => <path {...item} />);
		}
		return <path key="pathSVG" {...paths} />;
	};

	const getCircles = (circles) => {
		if (circles instanceof Array) {
			return circles.map((item) => <circle {...item} />);
		}
		return <circle key="circleSVG" {...circles} />;
	};

	const getEllipses = (ellipses) => {
		if (ellipses instanceof Array) {
			return ellipses.map((item) => <ellipse {...item} />);
		}
		return <ellipse key="ellipseSVG" {...ellipses} />;
	};

	const getGroups = (groups) => {
		if (groups instanceof Array) {
			return groups.map((item) => <g>{getShapes(item)}</g>);
		}

		return <g key="groupsSVG">{getShapes(groups)}</g>;
	};

	const getShapes = (data) => {
		const shapes = [];

		if (data) {
			if (data.g) {
				// eslint-disable-next-line fp/no-mutating-methods
				shapes.push(getGroups(data.g));
			}

			if (data.ellipse) {
				// eslint-disable-next-line fp/no-mutating-methods
				shapes.push(getEllipses(data.ellipse));
			}

			if (data.circle) {
				// eslint-disable-next-line fp/no-mutating-methods
				shapes.push(getCircles(data.circle));
			}

			if (data.path) {
				// eslint-disable-next-line fp/no-mutating-methods
				shapes.push(getPaths(data.path));
			}
		}
		return shapes;
	};

	const getSVG = ({ viewBox, ...rest }, props) => (
		<svg
			aria-hidden={props['aria-hidden']}
			className={props.className}
			viewBox={viewBox}
			name={props.name}
			style={props.style}
		>
			{getShapes(rest)}
		</svg>
	);

	// const { data, ...props } = props;

	return props.data ? getSVG(props.data, props) : null;
};

export default Svg;
