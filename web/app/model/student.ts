class Subject {
    subject_id: string;
    adapted: boolean;
}

export class Student {
    _id: string;
    first_name: string;
    last_name: string;
    birthdate: Date;
    gender: string;
    active: boolean;
    repeats: boolean;
    ed_measurements: string[];
    subjects: Subject[];
}
