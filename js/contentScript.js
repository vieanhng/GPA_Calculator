
chrome.runtime.sendMessage({authorizationData: localStorage.getItem('authorizationData')});

var div = document.createElement("div");

chrome.runtime.sendMessage({action: "getGPA"}, function(response) {
    div.innerHTML = ` GPA: <b> ${response}</b>`;
    div.className = 'gpa-badge'
});

document.body.appendChild(div);