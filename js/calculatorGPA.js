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
    return data.flatMap(x => x.DanhSachDiem).flatMap(x => x.DanhSachDiemHK)
        .filter(item => item.NotComputeAverageScore == false && item.DiemTK_4).map((item) => {
            return {
                CurriculumID:item.CurriculumID,
                credits: Number(item.Credits),
                grade: Number(item.DiemTK_4)
            }
        }).reduce((map, item) => {
            if (!map.has(item.CurriculumID)) {
                map.set(item.CurriculumID, item);
            } else {
                const existingItem = map.get(item.CurriculumID);
                if (item.grade > existingItem.grade) {
                    map.set(item.CurriculumID, item);
                }
            }
            return map;
        }, new Map()).values()
}
