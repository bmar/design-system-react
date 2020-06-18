import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import Default from '../__examples__/default';
import DefaultWithAutoplay from '../__examples__/default-with-autoplay';
import DefaultWithNavigation from '../__examples__/default-with-navigation';
import FiveItems from '../__examples__/five-items';
import ThreeItems from '../__examples__/three-items';
import ThreeItemsControlled from '../__examples__/three-items-controlled';
import WithCustomItems from '../__examples__/with-custom-items';

import DefaultFunc from '../__examples__/default.f';
import DefaultWithAutoplayFunc from '../__examples__/default-with-autoplay.f';
import DefaultWithNavigationFunc from '../__examples__/default-with-navigation.f';
import FiveItemsFunc from '../__examples__/five-items.f';
import ThreeItemsFunc from '../__examples__/three-items.f';
import ThreeItemsControlledFunc from '../__examples__/three-items-controlled.f';
import WithCustomItemsFunc from '../__examples__/with-custom-items.f';

import { CAROUSEL } from '../../../utilities/constants';
import { CAROUSEL_FUNC } from '../../../utilities/constants';

storiesOf(CAROUSEL, module)
	.add('Default (1 item) NoImageTest', () => <Default action={action} />)
	.add('Default with navigation indicators NoImageTest', () => (
		<DefaultWithNavigation action={action} />
	))
	.add('Default with Autoplay NoImageTest', () => (
		<DefaultWithAutoplay action={action} />
	))
	.add('3 items NoImageTest', () => <ThreeItems action={action} />)
	.add('3 items controlled isInfinite NoImageTest', () => (
		<ThreeItemsControlled action={action} />
	))
	.add('5 items NoImageTest', () => <FiveItems action={action} />)
	.add('With custom items NoImageTest', () => (
		<WithCustomItems action={action} />
	));

storiesOf(CAROUSEL_FUNC, module)
	.add('⨐ Default (1 item) NoImageTest', () => <DefaultFunc action={action} />)
	.add('⨐ Default with navigation indicators NoImageTest', () => (
		<DefaultWithNavigationFunc action={action} />
	))
	.add('⨐ Default with Autoplay NoImageTest', () => (
		<DefaultWithAutoplayFunc action={action} />
	))
	.add('⨐ 3 items NoImageTest', () => <ThreeItemsFunc action={action} />)
	.add('⨐ 3 items controlled isInfinite NoImageTest', () => (
		<ThreeItemsControlledFunc action={action} />
	))
	.add('⨐ 5 items NoImageTest', () => <FiveItemsFunc action={action} />)
	.add('⨐ With custom items NoImageTest', () => (
		<WithCustomItemsFunc action={action} />
	));
