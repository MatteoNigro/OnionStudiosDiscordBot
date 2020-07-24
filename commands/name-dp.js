module.exports = {
    name: 'name-dp',
    descroption: 'Change a department name',
    cooldown: 5,
    args: true,
    usage: '<old-department-name> <new-department-name>',
    execute(message, args, department) {

        FillDepartmentData(department);



    }
}

//=================================== FUNCTIONS ===================================================


function FillDepartmentData(department) {
    const data = fs.readFileSync('team.json', 'utf-8');
    if (data) {
        const parsedData = JSON.parse(data);
        department = parsedData;
    }
}