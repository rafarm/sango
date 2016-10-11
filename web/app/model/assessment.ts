class Qualification {
    subject_id: string;
    qualification: number;
}

class Student {
    student_id: string;
    repeater: boolean;
    qualifications: Qualification[];
}

export class Assessment {
    _id: string;
    name: string;
    students: Student[];
}
