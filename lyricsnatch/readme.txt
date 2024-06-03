So LyricSnatcher worked well therefore the grassholes decided that they would totally
change the way extensions worked to ensure the it no longer works. This change is called 
manifest V3. The documentation for it is completely incomprehensible and I have
no clue how they describe what it is that I want to do.

I've tried messing around trying to tweak what is already there for V2 but it is not getting me
anywhere. I think I have found an example of what I want to do so I guess I'll just have to follow
the example, see if it works, see if it does anything useful and then see if I can adapt it for what
I want - just like I had to for the original version - talk about reinventing the wheel... and making 
it square the second time around.

The example extensions are here:
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#pin_the_extension
https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-activetab

Fiddled around with the examples and finally came up with an idea of how to recreate lyricsnatch in the brave new world of manifest V3. Unfortunately the idea only half works. The writing to clipboard keeps failing due to 'NotAllowedError: Document is not focused'. I've moved the processing into an 'onfocus' function but the error still happens, or nothing happens, or once it a while it will actually work. I suspect that it may be necessary to have the script injected into the webpage perform the clipboard write in which case it may aswell do ALL the processing. Might still need the popup for feedback for whether a lyric was found. 

To install a local extension in Chrome:

- Enter "chrome://extensions/" into the address bar
- Enable developer mode
- Click "Load unpacked" button which should now be visible at the top
- Select the directory containing the extension files
- Enjoy!

The "Lyrics Snatcher" extension

The idea of this extension is to simplify manually extracting lyrics for addition to my FLAC files.
Click the "note" icon and the extension will attempt to extract the lyric from the current page,
to clean it up and to put the text onto the clipboard ready for pasting into the an editor.

Currently the most reliable extraction is from the AZlyrics pages. I've added a search pattern for
Genius lyrics but this has not been tested with many pages. There is also an attempt to extract the
lyric as displayed in the Google search screen - this is likely to be highly unreliable as the
identifying features in the source appear to have been obfuscated and will probably change from
page to page - will need to suck it and see...

Would be interesting to have the icon change when the page is loaded from one of the
recognized sources or matches one of patterns. Tried in the past to change the icon using different coloured icons, it didn't work. The 'focus-mode' chrome example demonstrates a potential way to give an indication using 'chrome.action.setBadgeText'. 

Execution flow now appears to be:
manifest.json registers an 'action': popup.html and an icon
manifest.json injects 'content_scripts' into the web-page: content.js
   content.js: grabs the page body
               registers a message listener for action:getSource
user clicks extension button on toolbar
manifest.json -> popup.html
popup.html -> popup.js
  register an onfocus listener
  onfocus listener: sends the action:getSource message
  content.js listener: returns the page body
  page body is processed for lyric and written to the clipboard by popup.js



