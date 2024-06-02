// Activation for Google originally detected a CSS string specific to the lyrics
// displayed on the search page. Unfortunately this keeps changing. The
// CSS match should be a wildcard but I can find no intelligible information
// on how to use a wildcard in the CSS option.
// Therefore switched to using "queryContains: 'lyrics'" which gives
// a positive for any lyric search whether or not the returned page has
// the actual lyrics... but better that than being unable to copy lyrics when they are there.
console.log("background: start");
console.log("background: add oninstalled listener");
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'azlyrics' }}),
          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'genius' }}),
          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'oldielyrics' }}),
          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'metrolyrics' }}),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: 'google',
//                       css: ["div[class='wwUB2c kno-fb-ctx PZPZlf']"],
                       queryContains: 'lyrics' }
            })
        ],
        actions: 
     		[  
      		new chrome.declarativeContent.ShowAction()
     		]   
      }
    ]);
  });
});


// listen for our browerAction to be clicked
console.log("background: add onclicked listener");
chrome.action.onClicked.addListener(async (tab) => {
  console.log("background:onclicked_listener:fun: start"); // This is never seen
   chrome.tabs.executeScript(tab.id, { files: ['getPagesSource.js'] });
   chrome.runtime.sendMessage({
    action: "getSource",
    source: document.documentElement.outerHTML
});
   console.log("background:onclicked_listener:fun: finish");
});

console.log("background: finish");