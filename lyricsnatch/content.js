console.log("ls:content: start");
const pageBody = document.documentElement.outerHTML;
console.log("ls:content: add listener");
chrome.runtime.onMessage.addListener(function(request,sender, sendResponse) 
   {
      console.log("ls:content: called from " + (sender.tab ?
                   "content script:" + sender.tab.url :
                   "the extension"));
      if(request.action == "getSource")
      {
         // console.log("ls:content:listener: sending pageBody=\n" + pageBody);
         console.log("ls:content:listener: sending pageBody");
         sendResponse({source: pageBody});
      }
      else if(request.action == "gotoLocation")
      {
         // Do something based on the search pattern used to find the lyric.
         // For AZLyric this means scrolling to the list of songs on the album
         // so the next lyric can be selected easily
         var loc = request.location;
         console.log("ls:content:listener: received gotoLocation message with: " + loc);
         if(loc == "AZLyrics")
         {
            document.getElementsByClassName('album-image')[0].scrollIntoView({behavior: "smooth"});
         }
         else if (loc == "Genius2" )
         {
            // document.getElementsByClassName('AlbumTracklist__Container-sc-123giuo-0')[0].scrollIntoView({behavior: "smooth"});
            document.getElementsByClassName('PrimaryAlbum__AlbumDetails-cuci8p-3')[0].scrollIntoView({behavior: "smooth"});
            
         }
      }
   });

(async () => {
   console.log("ls:content:async: send setBadge message");
   const response = await chrome.runtime.sendMessage({action: "setLyricBadge"});
})();


console.log("ls:content: finish");
