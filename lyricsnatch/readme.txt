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
used to create the .crx file, which is not a simple .zip file. When the .crx file is created there is actually
nothing you can do with it!!! The only way to install .crx file is from the Google Web Store! In other words the
only way to use your private extension is to load the unpacked version in Developer mode. Developer mode can be
turned off once the extension is loaded and it appears to continue working OK. I guess as long as it works when loaded
from a network disk it is no problem.

Phewwey. Each time Chrome starts it attempts to trick you into disabling the nice wonderful new
extension you have spent so much time and effort crafting - what a piece of shirt! Come back IE
please! all is forgiven.
I did find a suggested method which should stop this obnoxious behavour. It requires installation
of policy templates into gpedit.msc and adding the id of the wonderful new extension to a 
whitelist of extensions which are allowed.
The instructions are here: https://www.ghacks.net/2017/07/04/hide-chromes-disable-developer-mode-extensions-warning/
The policy templates came from here: https://support.google.com/chrome/a/answer/187202?hl=en
and are in the policy_templates.zip zip file. The one I used is policy_templates\windows\adm\en-GB\chrome.adm
Another fork up. This policy stuff doesn't work. Still get the obnoxious pop-up telling me to disable
my extension.

Strangely enough the disabling of the extension based on the URL, which seems to work fine "off-site"
does not behave the same in the real world. Instead of the icon going grey for unsupported sites, which
is nice a easy to see (and is what happens off-site) it now responds to a click with a menu of shirt
and the name of the extension greyed out. When the site is supported clicking the icon results in the 
expected behaviour - the lyric is loaded. This is probably due to the use of an older version off-site than
the one I installed yesterday in the real world. I have the impression google are trying suppress the 
usage of extensions by making them completely un-usable. Never mind... it still works for what I want it for,
although it's not so often I have new lyrics to grab, probalby it wont work next time I need it to!
Yuck, in fact there is now no way to distinguish between when the extension will work and when it
wont. Why the hell do they keep on forking things up - this is why I have never wanted to use Chromep with 

So I gave up with Chrome and switched to Opera which is able to run the same extensions as Chrome. This 
worked fine for a while, long enough for me to finish doing the FLAC lyrics. But then...

11-Sep-2019 On holiday I decided to start converting the mp3 lyrics. I had lyricsnatch installed in the 
Opera on Zombie and it was working OK except it didn't recognise Google. Thinking this is something I
had already fixed I managed to get the more recent copy from minnie via the VPN. I installed the packed
version and... it didn' forking work anymore. One error says that manifest version is 3 but the max 
supported version is 2, another says >all_urls> is not understood and another says script injection 
is not allowed. WWWWWW TTTTTTT FFFFFFF!!!!!! Yes zombie Opera is up to date! 
Based on the pages at "https://dev.opera.com/extensions/manifest/" it seems that a pattern for the URL must
be used so I've tried changed the version from 3 to 2 and then specifing * for the URLs and also added 
"activeTab" as I have seen some references to this in a couple of places. Now at least azlyrics pages can
be read again like they were before - Google search results are still not recognised though...

This is due to the css PageStateMatcher in background.js containing a match for a specific list of class 
names and apparently it has changed so that there are now three class names. Tried to use a * but it 
didn't work. There is preciously little in the way of help from Google for this so will have to live
with the hardcoded values for now.
