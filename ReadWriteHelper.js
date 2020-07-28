const fs = require('fs');
const Department = require("./WS/Department");

function WriteNewDPToFile(department) {
    try {
        //let data = JSON.stringify(department, null, department.length);
        //fs.writeFileSync('team.json', data);
        let arrayDp = [];
        department.forEach(element => {
            arrayDp.push(element.departmentName);
        });
        let members = [];
        department.forEach(element => {
            members.push(element.GetMembers());
        });

        console.log(arrayDp);
        console.log(members);

        // TODO: C'è un problema con la scrittura dei dati su file JSON
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