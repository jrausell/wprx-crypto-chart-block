
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {

      return <div { ...useBlockProps.save() } />; //this div will be render by react and the attributes read to get the chart info
}