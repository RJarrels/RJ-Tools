document.addEventListener('DOMContentLoaded', () => {
  const newIncog = document.getElementById('newIncogButton');
  const bypassVercel = document.getElementById('bypassButton');

    bypassVercel.addEventListener('click', async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const passInput = document.getElementsByName('_vercel_password')[0];
          const unlockButton = document.getElementsByClassName('submit')[0];
          if (!passInput || !unlockButton) {
            alert('Password input or unlock button not found!');
            return;
          } else {
                passInput.value = "f1Tness*84321";
                unlockButton.click();
          }
        }
      });
    });

    newIncog.addEventListener("click", () => {
      chrome.windows.getAll({}, (windows) => {
        windows.forEach((win) => {
          if (win.incognito) chrome.windows.remove(win.id);
        });
        chrome.windows.create({
          url: "https://www.google.com",
          incognito: true
        });
      });
    });
});
