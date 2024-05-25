chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'azlyrics' }}),
          new chrome.declarativeContent.PageStateMatcher({pageUrl: { hostContains: 'genius' }}),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: 'google' },
            css: ["div[class='wwUB2c kno-fb-ctx PZPZlf']"]
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
