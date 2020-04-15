chrome.runtime.onMessage.addListener(function (message) {
  if (message == "runContentScript") {
    setTimeout(() => {
      chrome.tabs.executeScript({
        file: "logic.js",
      });
    }, 5000);
  }
});
