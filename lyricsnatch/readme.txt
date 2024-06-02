So LyricSnatcher worked well therefore the grassholes decided that they would totally
change the way extensions worked to esnure the it no longer works. This is called 
manifest version 3. The documentation for it is completely incomprehensible and I have
no clue how they describe what it is that I want to do.

I've tried messing around trying to tweak what is already there for V2 but it is not getting me
anywhere. I think I have found an example of what I want to do so I guess I'll just have to follow
the example, see if it works, see if it does anything useful and then see if I can adapt it for what
I want - just like I had to for the original version - talk about reinventing the wheel... and making 
it square the second time around.

The example extensions are here:
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#pin_the_extension
https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-activetab


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

Would be interesting to have the icon change colour when the page is loaded from one of the
recognized sources or matches one of patterns. The loading from a recognized source could be
done with something like page-content example - don't know how to change the icon colour though.
Well I tried getting this to work but no luck. Basically I have no idea how to provide the "action"
part of the "rule" which I assume is performed when the URL matches one of the "conditions".
The example is for a page action, but that's not what I'm using. Apparently an extension can
have either a page action or a browse action (I have no idea what the difference is!!). It is
possible to define a "new" declarativeContent.ShowPageAction() but not a SetIcon() and apparently
it should be a browseAction.SetIcon anyway. So for now - no changing icon. Maybe the
video download will provide a clue to do this...

Execution flow appears to be:
user clicks extension button on toolbar
manifest.json -> popup.html
popup.html -> popup.js
  register a listener for action "getSource"
  onWindowLoad function triggered by window.onload event
  onWindowLoad -> getPagesSource.js
  getPagesSource.js
    executed in the current main page of the browser (called injection) and has access to its DOM
    sends a "getSource" action with the page source as the payload
  "getSource" action is picked up by the listener in popup.js.

Originally this was defined as a "browser_action" in manifest.json but I wanted to have the icon colour depend on the URL
of the current page, green for a supported page, red otherwise. I couldn't get the PageStateMatcher
(background.js) to work and all the examples refer to a ShowPageAction, which means "show the pageaction", rather
than the more obvious "the show-page action". The description of a "pageaction" mentions that having an icon which
changes requires a "pageaction" rather than a "browseraction". So I changed the manifest "browser_action" to
"page_action". The code still works!!! And now the icon is greyed when the displayed page URL does not
match the criteria in "background.js", and coloured when it does. This is good enough for me!!!

Now to package it. This appears to be as simple as putting everything in a zip file and making the extension .crx.
Well, it's not as simple as that (when is it ever??). The .crx file must be created using the "Pack extension" button
on the chrome extensions page. It will create, or force you to use the one it already created, a .pem file which
used to create the .crx file, which is not a simple .zip file [it can be opened using 7zip]. 
When the .crx file is created there is actually nothing you can do with it in Chrome or Edge, only Opera supports
loading custom extensions.

Strangely enough the disabling of the extension based on the URL, which seems to work fine "off-site"
does not behave the same in the real world. Instead of the icon going grey for unsupported sites, which
is nice a easy to see (and is what happens off-site) it now responds to a click with a menu of shirt
and the name of the extension greyed out. When the site is supported clicking the icon results in the 
expected behaviour - the lyric is loaded. This is probably due to the use of an older version off-site than
the one I installed yesterday in the real world. I have the impression google are trying suppress the 
usage of extensions by making them completely un-usable. Never mind... it still works for what I want it for,
although it's not so often I have new lyrics to grab, probalby it wont work next time I need it to!
Yuck, in fact there is now no way to distinguish between when the extension will work and when it
wont. Why the hell do they keep on forking things up - this is why I have never wanted to use Chrome. 

So I gave up with Chrome and switched to Opera which is able to run the same extensions as Chrome. This 
worked fine for a while, long enough for me to finish doing the FLAC lyrics. But then...

11-Sep-2019 On holiday I decided to start converting the mp3 lyrics. I had lyricsnatch installed in the 
Opera on Zombie and it was working OK except it didn't recognise Google. Thinking this is something I
had already fixed I managed to get the more recent copy from minnie via the VPN. I installed the packed
version and... it didn' forking work anymore. One error says that manifest version is 3 but the max 
supported version is 2, another says <all_urls> is not understood and another says script injection 
is not allowed. WWWWWW TTTTTTT FFFFFFF!!!!!! Yes zombie Opera is up to date! 
Based on the pages at "https://dev.opera.com/extensions/manifest/" it seems that a pattern for the URL must
be used so I've tried changed the version from 3 to 2 and then specifing * for the URLs and also added 
"activeTab" as I have seen some references to this in a couple of places. Now at least azlyrics pages can
be read again like they were before - Google search results are still not recognised though...

This is due to the css PageStateMatcher in background.js containing a match for a specific list of class 
names and apparently it has changed so that there are now three class names. Tried to use a * but it 
didn't work. There is preciously little in the way of help from Google for this so will have to live
with the hardcoded values for now.

26-May-2024 Tried to use lyricsnatcher on speedy only to be greeted by an mysterious error. Luckily it
worked still on chunky which got me to thinking what was wrong with speedy. Turns out speedy had an
updated version of LS. Looking at the source I realised I hod no idea what had changed or why. I also couldn't
figure out where the source for the working version was. So after some messing around with git and 
figuring out how to extract the files from the .crx I created a repo dedicated to chrome extensions with
the, in theory, main branch containg the work LS code and some branches with the code in the state 
as used by speedy, ie. not working. Now I can attempt to fix the Google lyrics using the currently working
code base which has version 1.3.4.
From what I can gather from the speedy code the manifest_version is something to do with the format
of the manifest file, not the version of the content in the file, ie. if I make changes to the value in the
manfest file then the version number should not change. 
Aaaaggggghhhhhh! Now I see why I attempted to change the manifest_version. When the unpacked code is loaded
into Opera it gives an Error message saying version 2 will be deprecated in 2024 (is it deperecated or 
no longer supported since it IS 2024). Seems it is deprecated, ie. the extension still works... the 
Google snatch finds the lyric but the line breaks are broken...

This might provide some clues for the deprecated manifest....
https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline

I think the above link means that manifest v2 will become unsupported as from the end of June 2024
so it looks liek I'll have to try to figure out what thr fork they have changed. Certainly reading the
stuff at the above link is not very helpful since I have got a clue what they are talking about - 
snatcher is just too simple for anything they say to make any sense.

Might be interesting to try the Extension Manifest Converter: https://github.com/GoogleChromeLabs/extension-manifest-converter
(maybe not, it's python, which I don't get on well with!!)


