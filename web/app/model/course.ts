class Assessment {
    assessment_id: string;
    order: number;
    name: string;
}

export class Course {
    _id: string;
    school_id: string;
    start_year: number;
    academic_year: string;
    stage: string;
    level: string;
    name: string;
    assessments: Assessment[];
}
