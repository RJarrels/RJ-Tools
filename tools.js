document.addEventListener("DOMContentLoaded", () => {
	const newIncog = document.getElementById("newIncogButton");
	const bypassVercel = document.getElementById("bypassButton");
	const componentScanner = document.getElementById("componentScanner");
	const contentChange = document.getElementById("contentChange");
	const openAllCountries = document.getElementById("openAllCountries");
	const bypassCode = import.meta.env.VITE_VERCEL_BYPASS_PASSWORD;
	// These functions are to quicken processes down below
	// hides the main buttons
	function hideMainButtons() {
		componentScanner.style.display = "none";
		newIncog.style.display = "none";
		bypassVercel.style.display = "none";
		// openAllCountries.style.display = 'none';
	}

	// shows the main buttons
	function showMainButtons() {
		componentScanner.style.display = "flex";
		newIncog.style.display = "flex";
		bypassVercel.style.display = "flex";
		// openAllCountries.style.display = 'flex';
	}

	// Utility function to execute a script in the active tab
	async function executeInActiveTab(func) {
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		await chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: func,
		});
	}
	//----------------------------------------------------------------------------------
	// when bypass vercel button is clicked, execute script to fill password and click unlock
	bypassVercel.addEventListener("click", async () => {
		await executeInActiveTab(() => {
			const passInput = document.getElementsByName("_vercel_password")[0];
			const unlockButton = document.getElementsByClassName("submit")[0];
			if (!passInput || !unlockButton) {
				alert("Password input or unlock button not found!");
				return;
			} else {
				passInput.value = bypassCode;
				unlockButton.click();
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
		hideMainButtons();
		if (contentChange.innerHTML === "") {
			const container = document.createElement("div");
			container.id = "scannerContainer";

			const hr = document.createElement("hr");

			const p = document.createElement("p");
			p.textContent =
				"Scan the current webpage for components or clear existing highlights";

			const scanBtn = document.createElement("button");
			scanBtn.id = "scanBtn";
			scanBtn.textContent = "Scan Components";

			const clearBtn = document.createElement("button");
			clearBtn.id = "clearBtns";
			clearBtn.textContent = "Clear Highlights";

			const closeBtn = document.createElement("button");
			closeBtn.id = "closeScannerBtns";
			closeBtn.textContent = "Close Scanner";

			container.append(hr, p, scanBtn, clearBtn, closeBtn);
			contentChange.appendChild(container);
		} else {
			alert("Scanner is already open");
		}

		// will scan the current page for components and highlight them with a label
		document.getElementById("scanBtn").addEventListener("click", async () => {
			await executeInActiveTab(() => {
				let components = document.querySelectorAll("[data-cslp]");
				console.log(components);
				if (components.length !== 0) {
					// Prevent creating highlighters more than once
					if (document.querySelector(".component-highlighter")) {
						alert(
							"Components have already been highlighted. Please clear highlights before scanning again.",
						);
						return;
					} else {
						// if highlights don't already exist alert components are found and show how many were found.
						alert("Components Found: " + components.length);
						for (const component of components) {
							// creates my elements and styles the highlighter
							const componenthighlighter = document.createElement("div");
							componenthighlighter.classList.add("component-highlighter");
							const componentName = document.createElement("h4");
							componentName.classList.add("component-name-label");
							componenthighlighter.style.position = "absolute";
							componenthighlighter.style.border = "2px solid rgb(252, 0, 0)";
							componenthighlighter.style.backgroundColor =
								"rgba(0, 170, 255, 0.4)";
							componenthighlighter.style.pointerEvents = "none";
							componenthighlighter.style.transition = "all 2s ease";
							// Sets the size and position of the highlighter and allows for scrolling
							const rect = component.getBoundingClientRect();
							componenthighlighter.style.top = rect.top + window.scrollY + "px";
							componenthighlighter.style.left =
								rect.left + window.scrollX + "px";
							componenthighlighter.style.width = rect.width + "px";
							componenthighlighter.style.height = rect.height + "px";
							componenthighlighter.style.zIndex = "9999";

							// componentName styles and positions
							componentName.innerText =
								component.dataset.cslp.split(".")[0] || "Unnamed Component";
							componentName.style.fontSize = "20px";
							componentName.style.color = "white";
							componentName.style.textAlign = "center";
							componentName.style.position = "absolute";
							componentName.style.backgroundColor = "rgba(41, 41, 41, 0.8)";
							componentName.style.padding = "5px";
							componentName.style.top = rect.top + window.scrollY + 0 + "px";
							componentName.style.left = rect.left + window.scrollX + 0 + "px";
							componentName.style.zIndex = "100000";

							document.body.appendChild(componenthighlighter);
							document.body.appendChild(componentName);

							// Animation for highlighting components
							let highlightElements = document.querySelectorAll(
								".component-highlighter, .component-name-label",
							);
							highlightElements.forEach((el) =>
								el.animate(
									[
										{
											transform: "scale(0,1)",
											opacity: 0,
											transformOrigin: "center",
										},

										{
											transform: "scale(1,1)",
											opacity: 1,
											transformOrigin: "center",
										},
									],
									{
										duration: 500,
										fill: "forwards",
									},
								),
							);
						}
					}
				} else {
					alert("No Components Found");
				}
			});
		});

		// clears all highlights and labels
		document.getElementById("clearBtns").addEventListener("click", async () => {
			await executeInActiveTab(() => {
				if (!document.querySelector(".component-highlighter")) {
					alert("No highlights to clear.");
					return;
				} else {
					let highlightElements = document.querySelectorAll(
						".component-highlighter, .component-name-label",
					);
					highlightElements.forEach((el) => {
						const animation = el.animate(
							[
								{
									transform: "scale(1,1)",
									opacity: 1,
									transformOrigin: "center",
								},
								{
									transform: "scale(0,1)",
									opacity: 0,
									transformOrigin: "center",
								},
							],
							{
								duration: 500,
								fill: "forwards",
							},
						);
						animation.onfinish = () => el.remove();
					});
				}
			});
		});

		// will close the scanner content
		document
			.getElementById("closeScannerBtns")
			.addEventListener("click", () => {
				document.getElementById("scannerContainer")?.remove();
				showMainButtons();
			});
	});
});
