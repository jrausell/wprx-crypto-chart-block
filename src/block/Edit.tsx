import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
   return (
      <p {...useBlockProps()}>
         {__('My First Block – hello from the editor!', 'crypto-chart-block')}
      </p>
   );
}