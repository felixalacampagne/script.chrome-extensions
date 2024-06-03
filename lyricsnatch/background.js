// Not required for v3 manifest
console.log("ls:background: add onmessage listener");


// NB It should still be possible to used the declaritiveContent settings used in manifest V2 version
// which would mean the hassle with disabling of empty tabs would be avoided.
// see https://developer.chrome.com/docs/extensions/reference/api/action#emulate_actions_with_declarativecontent
//chrome.runtime.onInstalled.addListener(function() {
//   // Page actions are disabled by default and enabled on select tabs
//   chrome.action.disable();
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//      // With a new rule ...
//      chrome.declarativeContent.onPageChanged.addRules([
//      {
//        conditions: [
//          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'azlyrics' }}),
//          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'genius' }}),
//          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'oldielyrics' }}),
//          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'metrolyrics' }}),
//          new chrome.declarativeContent.PageStateMatcher({
//            pageUrl: { hostContains: 'google',
//                       queryContains: 'lyrics' }
//            })
//        ],
//        actions: [new chrome.declarativeContent.ShowAction() ]
//      }
//    ]);
//  });
//})




chrome.runtime.onMessage.addListener(
async (request, sender, sendResponse) =>
   {
      console.log("ls:background: request action: " + request.action + ": called from " + (sender.tab ?
                "content script:" + sender.tab.url + " tabId:" + sender.tab.id:
                "the extension"));
       
      if(sender.tab && request.action==='setLyricBadge')
      {
         var url = sender.tab.url;
         let tabid = +sender.tab.id;
         if(url.match(/bewx2274\/Java8/i)
         || url.match(/bitbucket\.swift/i)
         || url.match(/\.cloudbees-ci\.ent\.swift\./i)
         )
         {
            
            // Badges changes when swapping from tab to tab but the icon does not.
            // await chrome.action.setIcon({path: "greennote.png"});
            await chrome.action.setBadgeText({tabId: sender.tab.id, text: "L"});
            await chrome.action.enable(+tabid);      
         }
         else
         {
            // await chrome.action.setIcon({path: "rednote.png"});
            await chrome.action.setBadgeText({ tabId: sender.tab.id, text: ""});
            // Inexplicably the parameter to disable cannot use the syntax used by setBadeText etc.
            // but MUST have the parameter specified without a name and be forced to a numeric value (the +).
            // disable does prevent the popup from being called for unsupported web-pages
            // but it does not prevent it from being called for an empty tab etc. possibly because
            // content.js is not injected and thus never sends the message.
            
            await chrome.action.disable(+tabid);
         }
      }  

   }
);
console.log("ls:background: finish");
