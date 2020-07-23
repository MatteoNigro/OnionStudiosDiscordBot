class Department {

    constructor(_depName) {
        this.departmentName = _depName;
        this.members = new Set();
    }

    AddMember(memberName) {
        if (this.members.has(memberName)) {
            console.log(`Il membro ${memberName} fa già parte di questo dipartimento`);
            return;
        }
        this.members.add(memberName);
        console.log(`Il membro ${memberName} è stato aggiunto al dipartimento di ${this.departmentName}`);
    }

    RemoveMember(memberName) {
        if (!this.members.has(memberName)) {
            console.log(`Il membro ${_memeberName} che si vuole eliminare non è nel dipartimento`);
            return;
        }
        this.members.delete(memberName);
        console.log(`Il memebro ${memberName} è stato eliminato dal dipartimento`);
    }

    // Da vedere se modificare con un return;
    ShowMembers() {
        this.members.forEach((m) => {
            console.log(m);
        })
    }

}

module.exports = Department;




    /*


    
        ChangeName(_name) {
            if (this.departmentName == _name) {
                console.log('Il nome del dipartimento è già questo!');
                return;
            }
            this.departmentName = _name;
            console.log('Il nome del dipartimento è stato modificato');
        }
    
        ChangeMemberName() {
            // Trovare un modo elegante di farlo attraverso la chat di Discord
        }
    
        */
