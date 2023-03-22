
chrome.runtime.sendMessage({authorizationData: localStorage.getItem('authorizationData')});

    var div = document.createElement("div");
    chrome.runtime.sendMessage({action: "getGPA"}, function(response) {
        if(response){
            div.innerHTML = ` GPA: <b> ${response}</b>`;
            div.className = 'gpa-badge'
        } else {
            div.innerHTML = `Please reload tab!!`;
            div.className = 'gpa-badge'
        }
    });

    document.body.appendChild(div);
