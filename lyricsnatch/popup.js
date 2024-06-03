function handlePageBody(pageBody)
{
    // This is where the source of the page arrives for display in the popup
    // so this is probably where the processing should occur!
    var bfound = 0;
    var lyricText = "";
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
      lyricText = snatchLyric(item[0], item[1], pageBody);
      if(lyricText.length > 0)
      {
        setMessage("Found lyric using '" + item[2] + "' search patterns.");
        bfound = 1;
        break;
      }
    }

    if(bfound == 0)
    {
      setMessage("Did not find any lyrics on this page.");
      lyricText = pageBody;
    }
    
    return lyricText;
}

function snatchLyric(sre, ere, content)
{
var fulre = new RegExp(sre + "(.*?)" + ere, "s");
var bfound = 0;
var matcharr = content.match(fulre);
var extract = "";
  if(matcharr != null)
  {
    extract = matcharr[1];
    extract = cleanText(extract);
  }

  return extract;
}


function cleanText(txt)
{
  // Try to remove the "expand" duplicated text
  // Failed to find a way to do this without referring to full text of the div
  // containing the duplicate truncated text block and the decoded &hellip character.
  // The random looking names suggest that they might be different for every
  // search however it seemed to work consistently for the multiple searches I tried.
  // Maybe it changes daily or something like that!
  txt = txt.replace(/<div jsname=\"U8S5sf\" class=\"rGtH5c\">.*?… <\/span><\/div><\/div>/s, "");
  txt = txt.replace(/<\/span><br>/g, "\n");       // google
  txt = txt.replace(/<\/span><br aria-hidden="true">/g, "\n");       // google
  txt = txt.replace(/<\/span><\/div>/g, "\n\n");  // google


  // Sometimes the p and br have a line terminator after and sometimes they don't
  // optionally including the terminator in the pattern, and inserting a new terminator
  // allows for both cases
  txt = txt.replace(/<p>\n{0,1}/g, "\n");
  txt = txt.replace(/<br>\n{0,1}/g, "\n");
  txt = txt.replace(/<.*?>/sgm, "");
  txt = txt.replace(/   */sgm, "");

//   $lyric =~ s/â€™/'/g;
//   $lyric =~ s/â€˜/'/g;
//   $lyric =~ s/â€œ/"/g;
//   $lyric =~ s/â€/"/g;
  return txt;
}


// Seems to be a hundered and one ways to deal with the 'Promise' that
// writeText returns. Obviously I just want to write the text and return
// like it used to do with the v2 manifest
async function writeToClipboard(clipText)
{
   let mycliptext = clipText;
   console.log("popup:AwriteToClipboard: start");   
   try
   {
      const result = await navigator.clipboard.writeText(mycliptext);
      console.log("popup:AwriteToClipboard: write successful");
   }
   catch(error)
   {
      // setMessage("Clipboard write failed!!\n" + error);
      console.log("popup:AwriteToClipboard: write failed: " + error);
   }
   console.log("popup:AwriteToClipboard: finish"); 
}

async function canWriteToClipboard()
{
let canit = false;
   console.log("popup:canWriteToClipboard: start");
   try
   {
      const result = await navigator.permissions.query({name: "clipboard-write"})
      canit = (result.state == "granted" || result.state == "prompt");
   }
   catch(error)
   {
       console.log("popup:canWriteToClipboard: clipboard-write not supported: " + error);   
       canit = true;
   }
   console.log("popup:canWriteToClipboard: finish: " + canit);
   return canit;
}

function writeToClipboardOld(clipText)
{
   console.log("popup:writeToClipboard: start");
    // try to put something on the clipboard... this is based on
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    // Wow!! It worked!
   navigator.permissions.query({name: "clipboard-write"})
   .then(result => 
   {
      if (result.state == "granted" || result.state == "prompt") 
      {
         navigator.clipboard.writeText(clipText)
         .then(() => 
         {
            console.log("popup:writeToClipboard: write successful");
         })
         .catch(() =>
         {/* failure function */
            setMessage("Clipboard write failed!!\n" + clipText);
            console.log("popup:writeToClipboard: write failed!");
         });
      }
      else
      {
         console.log("popup:writeToClipboard: No permission to write to clipboard!: " + result.state);
         setMessage("No permission to write to clipboard!");
      }
   });
   console.log("popup:writeToClipboard: finish");
}

function setMessage(msgText)
{
   var messagediv = document.querySelector('#message');
   if(messagediv) 
   {
      messagediv.innerText = msgText;
   }
   else
   {
      console.log("popup:setMessage: messge div is null: message=" + msgText);
   }
}

function doProcessPage()
{
console.log("popup:doProcessPage: start");
(async () => {
   const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
   const response = await chrome.tabs.sendMessage(tab.id, {action: "getSource"});
   
   if(response)
   {
      const result = await canWriteToClipboard();
      if(result)
      {
         var lyricText = handlePageBody(response.source);
         console.log("popup:doProcessPage: write lyric to clipboard:\n" + lyricText);
         await writeToClipboard(lyricText);
         console.log("popup:doProcessPage: lyric written to clipboard");
      }
      else
      {
         console.log("popup:doProcessPage: no permission to write to clipboard");
         setMessage("permission denied for clipboard write");
      }
   }  
   else
   {
      setMessage("empty response for sendMessage");
   }

})();
console.log("popup:doProcessPage: finish");
}

// Keep getting NotAllowedError: Document is not focused. error when running
// from onload. Doesn't seem to happen to often when running from onfocus
// but instead sometimes it just doesn't do anything until the popup is 
// is clicked.
// But at least sometimes it works - I guess going from something which
// reliably worked everytime to something which only works occasionally is
// about as good as continuous improvement gets nowadays.
//window.onload = doProcessPage;
window.onfocus = doProcessPage;
