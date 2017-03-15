import { Student } from './student';
import { Subject } from './subject';

export class Group {
    _id: string;
    name: string;
    short_name: string;
    year: string;
    course_id: string;
    subjects: Subject[];
    students: Student[];
}
