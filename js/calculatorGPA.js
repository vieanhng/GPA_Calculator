function calculateGPA(grades) {
    let totalCredits = 0;
    let totalGradePoints = 0;

    for (const grade of grades) {
        const credits = Number(grade.credits);
        const gradePoints = Number(grade.grade);

        totalCredits += credits;
        totalGradePoints += credits * gradePoints;
    }

    return (totalGradePoints / totalCredits).toFixed(2);
}

function getFullListMark(data){
    const obj = {};

    data.flatMap(x => x.DanhSachDiem).flatMap(x => x.DanhSachDiemHK)
        .filter(item => item.NotComputeAverageScore == false && item.DiemTK_4).map((item) => {
            return {
                CurriculumID:item.CurriculumID,
                credits: Number(item.Credits),
                grade: Number(item.DiemTK_4)
            }
        }).forEach(item => {
            if (!obj[item.CurriculumID] || obj[item.CurriculumID].grade < item.grade) {
                obj[item.CurriculumID] = item;
            }
        });

    return Object.values(obj);
}
