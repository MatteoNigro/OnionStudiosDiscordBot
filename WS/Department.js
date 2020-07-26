class Department {

    constructor(_depName, _members) {
        this.departmentName = _depName;
        this.members = new Set(_members);
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

    ChangeName(_name) {
        let reply = ' ';
        if (this.departmentName === _name) {
            reply = 'Il nome del dipartimento è già questo!';
            return reply;
        }
        this.departmentName = _name;
        reply = 'Il nome del dipartimento è stato modificato';
        return reply;
    }

}

module.exports = Department;




    /*
    
        ChangeMemberName() {
            // Trovare un modo elegante di farlo attraverso la chat di Discord
        }
    
        */
