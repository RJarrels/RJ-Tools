document.addEventListener('DOMContentLoaded', () => {
  const newIncog = document.getElementById('newIncogButton');
  const bypassVercel = document.getElementById('bypassButton');
  const componentScanner = document.getElementById("componentScanner");
  const scannerContent = document.getElementById('scannerContent');

    // when bypass vercel button is clicked, execute script to fill password and click unlock
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
          } 
          else {
                passInput.value = "f1Tness*84321";
                unlockButton.click();
          }
        }
      });
    });

    // when new incognito button is clicked, close all incognito windows and open a new one this still doesn't close the full incognito session.
    newIncog.addEventListener("click", () => {
      chrome.windows.getAll({}, (windows) => {
        windows.forEach((win) => {
          if (win.incognito) chrome.windows.remove(win.id);
        });
        chrome.windows.create({
          url: "https://www.google.com",
          incognito: true,
          state: "normal",
        });
      });
    });

    // when component canner button is clicked, open/create the scanner content/options
    componentScanner.addEventListener("click", () => {
        componentScanner.style.display = 'none';
        newIncog.style.display = 'none';
        bypassVercel.style.display = 'none';
      if (scannerContent.innerHTML === "" ) {
          scannerContent.innerHTML = `
            <hr>
          <p>Scan the current webpage for components or clear existing highlights</p>
          <button id="scanBtn">Scan Components</button>
          <button id="clearBtn">Clear Highlights</button>
          <button id="closeScannerBtn">Close Scanner</button>
          `;
         
      }
      else {
        alert("Scanner is already open");
      }

      // will scan the current page for components and highlight them with a label
      document.getElementById("scanBtn").addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          await chrome.scripting.executeScript({
          target: { tabId: tab.id },
         func: () => {
               let components = document.querySelectorAll('[class*="chakra-container"]');
                if (components.length !== 0) {
                    alert("Components Found: " + components.length);
                    for (const component of components) {
                        // creates my elements and styles the highlighter
                        const componenthighlighter = document.createElement('div');
                        componenthighlighter.classList.add('component-highlighter');
                        const componentName = document.createElement('h4');
                        componentName.classList.add('component-name-label');
                        componenthighlighter.style.position = "absolute";
                        componenthighlighter.style.border = "2px solid red";
                        componenthighlighter.style.backgroundColor = "rgba(0, 210, 252, 0.15)";
                        componenthighlighter.style.pointerEvents = "none";
                        componenthighlighter.style.transition = "all 2s ease";
                        // Sets the size and position of the highlighter and allows for scrolling
                        const rect = component.getBoundingClientRect();
                        componenthighlighter.style.top = (rect.top + window.scrollY) + "px";
                        componenthighlighter.style.left = (rect.left + window.scrollX) + "px";
                        componenthighlighter.style.width = rect.width + "px";
                        componenthighlighter.style.height = rect.height + "px";
                        componenthighlighter.style.zIndex = "9999";

                        // component label styles and positions
                        componentName.innerText = component.className;
                        componentName.style.position = "absolute";
                        componentName.style.backgroundColor = "rgba(246, 255, 0, 0.7)";
                        componentName.style.padding = "3px";
                        componentName.style.top = (rect.top + window.scrollY + 15) + "px";
                        componentName.style.left = (rect.left + window.scrollX + 15) + "px";
                        componentName.style.zIndex = "10000";

                        document.body.appendChild(componenthighlighter);
                        document.body.appendChild(componentName);
                        // Animation for highlighting components
                        let components = document.querySelectorAll('.component-highlighter, .component-name-label');
                        components.forEach(el => el.animate([
                            { 
                              transform: 'scale(0,1)',
                              opacity: 0 ,
                              transformOrigin: 'center'
                            },

                            { 
                              transform: 'scale(1,1)',
                              opacity: 1,
                              transformOrigin: 'center'
                            }
                        ], {
                            duration: 500,
                            fill: 'forwards'
                        }));
                    }
                } else {
                    alert("No Components Found");
                }
            }
        });
      });

      // clears all highlights and labels
      document.getElementById("clearBtn").addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              let components = document.querySelectorAll('.component-highlighter, .component-name-label');
                  components.forEach(el => el.animate([
                      { 
                        transform: 'scale(1,1)',
                        opacity: 1,
                        transformOrigin: 'center'
                      },
                      { 
                        transform: 'scale(0,1)',
                        opacity: 0 ,
                        transformOrigin: 'center'
                      }
                  ], {
                      duration: 500,
                      fill: 'forwards'
                    }
                  ).onfinish = () => el.remove());
            }
          });
      });

      // will close the scanner content
      document.getElementById("closeScannerBtn").addEventListener("click", () => {
        scannerContent.innerHTML = "";
        componentScanner.style.display = 'flex';
        newIncog.style.display = 'flex';
        bypassVercel.style.display = 'flex';
      });
    });
});
