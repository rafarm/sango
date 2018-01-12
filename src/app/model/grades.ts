export class Grades {
    assessment_id: string;

    /*
     * 'students' is an object with grades indexed by student '_id'.
     * At the same time, 'grades' is an object with 'Grade' objects indexed by subjects '_id'.
     */
    students: any;
}
