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
   }
);

(async () => {
   console.log("ls:content:async: send setBadge message");
   const response = await chrome.runtime.sendMessage({action: "setLyricBadge"});
})();

console.log("ls:content: finish");
