define({ "api": [
  {
    "type": "post",
    "url": "/serviceClient/",
    "title": "File Storage Solution",
    "name": "File_Storage",
    "group": "File_Storage",
    "version": "0.0.0",
    "filename": "src/components/Upload/listing/UploadListingWeb.js",
    "groupTitle": "File_Storage"
  },
  {
    "type": "post",
    "url": "/googleLogin/",
    "title": "Login with Google Auth",
    "name": "googleLogin",
    "group": "Login",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "token",
            "optional": false,
            "field": "token",
            "description": "<p>Save token to cookie.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/components/Auth/LoginView.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/OCR_API",
    "title": "Send photo for analysing",
    "name": "OCR_API",
    "group": "OCR",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "File",
            "description": "<p>the image file from where the OCR API analyses text</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "url",
            "description": "<p>Callback URL to check if OCR API has finished analysing.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/components/Upload/UploadActions.js",
    "groupTitle": "OCR"
  },
  {
    "type": "get",
    "url": "/url",
    "title": "Get text from photo",
    "name": "OCR_API",
    "group": "OCR",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "recognitionResults",
            "description": "<p>Result of text analysing.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/components/Upload/UploadActions.js",
    "groupTitle": "OCR"
  },
  {
    "type": "post",
    "url": "/bing/v7.0/spellcheck",
    "title": "Check for spelling issues",
    "name": "Spellcheck",
    "group": "Spellcheck",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text that needs to be checked for errors.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "flaggedTokens",
            "description": "<p>Result of spellchecking</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/components/Upload/UploadActions.js",
    "groupTitle": "Spellcheck"
  }
] });
