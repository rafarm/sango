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
    repeats: boolean;
    ed_measures: string[];
    subjects: Subject[];
}
