const fs = require('fs');
const Department = require("./WS/Department");

function WriteNewDPToFile(department) {
    try {
        let departmentData = [];

        departmentData = SerializeForFileWriting(department, departmentData);

        WriteToFile(departmentData);
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

function FillDepartmentData(department) {
    let data;
    try {
        data = fs.readFileSync('team.json', 'utf-8');
    } catch (error) {
        console.error(error);
        return error;
    }

    department = ReconstructDepartment(data, department);

    return department;
}


//=========================== FUNCTIONS =======================================================

function ReconstructDepartment(data, department) {
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

function WriteToFile(departmentData) {
    const data = JSON.stringify(departmentData, null, departmentData.length);
    fs.writeFileSync('team.json', data);
}

function SerializeForFileWriting(department, departmentData) {
    department.forEach(element => {
        let membersObj = {};
        membersObj = element.GetMembers();
        const departmentObject = {
            departmentName: element.departmentName,
            members: membersObj
        };
        departmentData.push(departmentObject);
    });
    return departmentData;
}

module.exports = { FillDepartmentData, WriteNewDPToFile }