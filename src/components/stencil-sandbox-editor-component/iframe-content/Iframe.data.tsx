/**
 * Code Added For Reading Iframe Realated Code as txt
 */

//All imports are a copy from assets/summernote folder
//imported here as txt to load as string.
import  SummerNoteJS from './summernote-lite.js.txt';
import  IFrameJS from './iframe-slave.js.txt';
import JQuery from './jquery.js.txt';
import SummerNoteCss from './summernote-lite.min.css'

export const IframeHtml=`<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DB-SandBox-Editor</title>
  <script>${JQuery}</script>
  <style>${SummerNoteCss}</style>
  <script>${SummerNoteJS}</script>
  <style>

      html,body
      {
          height: fit-content;
          padding: 0;
          margin: 0;
          height: 100%;
      }
                .note-editor .note-statusbar {
          height: auto !important;
          cursor: default !important;
          }

          .note-editor .note-statusbar .note-resizebar {
            display: none !important;
          }



          .note-dropdown-menu
          { 
              height: max-content;
              max-height: 170px !important;
              overflow-y:auto;
          }

          .note-btn
          {
              background-color: white;
              border:none !important;
          }
          .note-btn:hover,.note-btn-primary:focus,.note-icon:hover,.active
          {
              border: none !important;
              background-color: rgba(6, 145, 187, 0.4) !important;
              
          }

          .note-toolbar
          {
              border: none;
              background-color: white;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

          }
      
  </style>
</head>
<body>
  <div id="summernote"></div>
  <script>${IFrameJS}</script>
</body>
</html>
`