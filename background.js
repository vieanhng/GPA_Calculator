
importScripts('js/calculatorGPA.js');

chrome.runtime.onMessage.addListener(function(message ) {
        if(message.authorizationData){
            chrome.storage.local.set({token: JSON.parse(message.authorizationData).Token});
        }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "getGPA") {
        chrome.storage.local.get(['token'], async function(result) {
            const token = result.token;
            chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
                if(token){
                    const ctdt = await getStudyProgram(token);
                    const result = await getGPA(token,ctdt);
                    sendResponse(result);
                }
            });
        });
        return true;
    }
});

function getHeader(token){
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Accept-Language", "en,vi;q=0.9,en-US;q=0.8,fr-FR;q=0.7,fr;q=0.6");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("DNT", "1");
    myHeaders.append("Origin", "https://congdaotao.tmu.edu.vn");
    myHeaders.append("Referer", "https://congdaotao.tmu.edu.vn/");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "cross-site");
    myHeaders.append("apiKey", "tmupscRBF0zT2Mqo6vMw69YMOH43IrB2RtXBS0EHit2kzvL2auxaFJBvw==");
    myHeaders.append("clientId", "tmu");
    myHeaders.append("Cookie", "ARRAffinity=1fc04dc66825147c1329509fc0f4430321db7b9a2d22612b678517e424ec1f59; ARRAffinitySameSite=1fc04dc66825147c1329509fc0f4430321db7b9a2d22612b678517e424ec1f59");
    return myHeaders
}

async function getStudyProgram(token){
    const myHeaders = getHeader(token);
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const result = await fetch("https://tmuonlineapi.azurewebsites.net/api/student/getstudyprogram", requestOptions)
        .then(response => response.json())
        .then(result => result[0].StudyProgramID)
        .catch(error => console.log('error', error));
    return result
}

async function getGPA(token,ctdt){
    const myHeaders = getHeader(token);
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const listMarks = await fetch(`https://tmuonlineapi.azurewebsites.net/api/student/marks?ctdt=${ctdt}&loai=SV`, requestOptions)
        .then(response => response.json())
        .then((result) => {
                chrome.storage.local.set({rawData: JSON.stringify(result)});
                return result.flatMap(x=>x.DanhSachDiem).flatMap(x=>x.DanhSachDiemHK)
                    .filter(item => item.NotComputeAverageScore == false && item.DiemTK_4).map( (item) => {
                return {
                    credits: Number(item.Credits),
                    grade: Number(item.DiemTK_4)
                }
            })
            }
        )
        .catch(error => console.log('error', error));
    if(listMarks){
        const result = calculateGPA(listMarks)
        return result
    }
}





