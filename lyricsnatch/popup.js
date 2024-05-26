// 02 Jun 2019 class name of Google expand duplicate text changed
// 24 Apr 2019 Added new criteria for Google. Dump page to clipboard when no lyric found.
// 26 May 2024 Transferred third value for Google from broken 1.3.5 code, looks like it should still work
chrome.runtime.onMessage.addListener(function(request, sender) {
  // manifest.json references popup.html
  // popup.html references popup.js
  // this is sdded as an action (aka message) listener.
  // popup.js::onWindowLoad() references getPagesSource.js.
  // The action "getSource" is registered by getPagesSource.js. 
  // getPageSource.js sends the "getSource" action, presumably when the icon is clicked, and it arrives here.
  // NB getPageSource.js also adds URL filters so the icon is only enabled for supported websites.
  if (request.action == "getSource")
  {
    // This is where the source of the page arrives for display in the popup
    // so this is probably where the processing should occur!
    var bfound = 0;
    var pageBody = request.source;
    var repairs = [
      ["data-lyricid=\".*?\">", "<div class=\"f41I7", "Google3"],
      ["data-lyricid=\".*?\">", "<div class=\"xpdxpnd", "Google2"],
      ["Sorry about that. -->", "<!-- MxM banner -->", "AZLyrics"],
      ["<div class=\"lyrics\">", "</div>", "Genius"],
      ["<span style=\"display:none\".*?</span>", "<div class=\"xpdxpnd", "Google"],
      ["<div itemprop=\"text\">", "</div>", "oldielyrics"],
      ["<p class=\"verse\">", "<!--WIDGET - RELATED-->", "metrolyrics"]
    ];

    for(let item of repairs)
    {
      if(snatchLyric(item[0], item[1], pageBody) != 0)
      {
        message.innerText = "Found lyric using '" + item[2] + "' search patterns.";
        bfound = 1;
        break;
      }
    }

    if(bfound == 0)
    {
      message.innerText = "Did not find any lyrics on this page.";
      writeToClipboard(pageBody);
    }
  }
});

function snatchLyric(sre, ere, content)
{
var fulre = new RegExp(sre + "(.*?)" + ere, "s");
var bfound = 0;
var matcharr = content.match(fulre);

  if(matcharr != null)
  {
    var extract = matcharr[1];
    extract = cleanText(extract);
    writeToClipboard(extract);
    bfound = 1;
  }

  return bfound;
}


function cleanText(txt)
{
  // Try to remove the "expand" duplicated text
  // Failed to find a way to do this without referring to full text of the div
  // containing the duplicate truncated text block and the decoded &hellip character.
  // The random looking names suggest that they might be different for every
  // search however it seemed to work consistently for the multiple searches I tried.
  // Maybe it changes daily or something like that!
  // Indeed the class name changed...
   // <div jsname="U8S5sf" class="ujudUb WRZytc OULBYb">
  txt = txt.replace(/<div jsname=\"U8S5sf\" class=\"[A-Za-z0-9]{6,6} [A-Za-z0-9]{6,6} [A-Za-z0-9]{6,6}\">.*?… <\/span><\/div><\/div>/s, "");
  //txt = txt.replace(/<div jsname=\"U8S5sf\" class=\"rGtH5c\">.*?… <\/span><\/div><\/div>/s, "");
  txt = txt.replace(/<\/span><br>/g, "\n");       // google
  txt = txt.replace(/<\/span><br aria-hidden="true">/g, "\n");       // google
  txt = txt.replace(/<\/span><\/div>/g, "\n\n");  // google


  // Sometimes the p and br have a line terminator after and sometimes they don't
  // optionally including the terminator in the pattern, and inserting a new terminator
  // allows for both cases
  // Metrolyrics uses a p to seperate verses, hence the double line feed
  // maybe means I need to replace quadruple empty lines with double line feeds
  txt = txt.replace(/<p.*?>\n{0,1}/g, "\n\n");
  txt = txt.replace(/<br>\n{0,1}/g, "\n");
  txt = txt.replace(/<.*?>/sgm, "");
  txt = txt.replace(/   */sgm, "");

//   $lyric =~ s/â€™/'/g;
//   $lyric =~ s/â€˜/'/g;
//   $lyric =~ s/â€œ/"/g;
//   $lyric =~ s/â€/"/g;
   txt = txt.replace(/’/g,"'");
   txt = txt.replace(/Source:&nbsp;.*$/, ""); // Google
   // txt = txt.replace(/Â…/g,""); appears as a square in the web page, and ... in UE. Replace doesn't work.
   
  return txt;
}


function writeToClipboard(clipText)
{
    // try to put something on the clipboard... this is based on
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    // Wow!! It worked!
  navigator.permissions.query({name: "clipboard-write"}).then(
    result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(clipText).then(
          function()
          {/* success function */
          },
          function()
          {/* failure function */
            message.innerText = clipText + "\nClipboard write failed!!";
          });
      }
    });
}

function onWindowLoad()
{

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null,
  {
    file: "getPagesSource.js"
  },
  function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;
