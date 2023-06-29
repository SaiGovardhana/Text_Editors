import { Config } from '@stencil/core';
import { rollup } from 'rollup';
//@ts-ignore
import html from 'rollup-plugin-html'
export const config: Config = {
  namespace: 'editors',

  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior:'bundle'

    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    }
  ],

  plugins:[html({includes:"**/summernote.iframe.min.html",transform(html){return html.toString()}})],
 

};
