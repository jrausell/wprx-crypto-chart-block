/**
 * React dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
//CharJS package

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {

      return <div { ...useBlockProps.save() } />;
	return null; //We are using the register_block_type render_callback to render all the block
}