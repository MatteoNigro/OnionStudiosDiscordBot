const fs = require('fs');
const Department = require("./WS/Department");

function WriteNewDPToFile(department) {
    try {
        let data = JSON.stringify(department, null, department.length);
        fs.writeFileSync('team.json', data);
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

function FillDepartmentData(department) {
    const data = fs.readFileSync('team.json', 'utf-8');
    if (data) {
        const parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) {
            const rawData = parsedData[i];
            const arrayOfMembers = Object.values(rawData.members);
            const newDep = new Department(rawData.departmentName, arrayOfMembers);
            department[i] = newDep;
        }
    }
    return department;
}



module.exports = { FillDepartmentData, WriteNewDPToFile }