
document.addEventListener('DOMContentLoaded', function () {
    let data = [];

    chrome.storage.local.get(['rawData'], function (result) {
        console.log('Value of key1:', result.rawData);
    });
    chrome.storage.local.get(['rawData'], (results) => {
        data = JSON.parse(results.rawData);
        if (data) {
            const data2 = data.flatMap(x => x.DanhSachDiem).flatMap(x => x.DanhSachDiemHK)
                .filter(item => item.NotComputeAverageScore == false && item.DiemTK_4).map((item) => {
                    return {
                        CurriculumName: item.CurriculumName,
                        credits: Number(item.Credits),
                        grade: Number(item.DiemTK_4)
                    }
                })

            const data3 = data.flatMap(
                x => ({
                    NamHoc: x.NamHoc, HocKy: x.DanhSachDiem.flatMap(
                        hks => ({
                            tenHK: hks.HocKy, dsDiem: hks.DanhSachDiemHK
                                .filter(item => item.NotComputeAverageScore == false && item.DiemTK_4)
                                .map(mon => ({grade: mon.DiemTK_4, credits: mon.Credits}))
                        }))
                }))

            let result = getYearHtml("GPA Tổng",calculateGPA(data2),'',true);
            data3.forEach((namhoc, i) => {
                let semester_list = "";
                let title = "";
                let gpa = "";
                if (namhoc.NamHoc) {
                    title = namhoc.NamHoc
                } else {
                    title = "Điểm chuyển/Miễn/Bảo Lưu";
                }
                gpa = calculateGPA([...namhoc.HocKy.flatMap(hk => hk.dsDiem)])
                namhoc.HocKy.forEach((hocky, j) => {
                    if (hocky.tenHK) {
                        semester_list += getSemester(hocky.tenHK,calculateGPA(hocky.dsDiem))
                    }
                });
                result += getYearHtml(title,gpa,semester_list);
            });

            document.querySelector('.content').innerHTML = result;

            const yearBoxes = document.querySelectorAll('.year-box');
            yearBoxes.forEach(yearBox => {
                yearBox.addEventListener('click', () => {
                    const semesterList = yearBox.nextElementSibling;
                    semesterList.classList.toggle('hidden');
                });
            });
        }
    });
});

function getYearHtml(title,gpa,semesterHtml,full= false){
        return `
        <div class="year ${full ? 'full' : ''}">
            <div class="year-box">
                <div class="year-title">${title}</div>
                <div class="gpa">${gpa}</div>
            </div>
            <div class="semester-list hidden">
            ${semesterHtml}
            </div>
        </div>
        `
}

function getSemester(title,gpa){
    return `
    <div class="semester-item">
        <div class="year-title">${title}</div>
        <div class="gpa-white">${gpa}</div>
    </div>
    `
}






