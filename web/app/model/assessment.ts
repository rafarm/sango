class Qualification {
    subject_id: string;
    enroled: boolean;
    adapted: boolean;
    qualification: number;
}

class Student {
    _id: string;
    first_name: string;
    last_name: string;
    qualifications: Qualification[];
}

class Subject {
    _id: string;
    name: string;
}

export class Assessment {
    _id: string;
    name: string;
    order: number;
    subjects: Subject[];
    students: Student[];
}
