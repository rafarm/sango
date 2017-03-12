import { Student } from './student';

export class Group {
    _id: string;
    name: string;
    short_name: string;
    year: string;
    course_id: string;
    students: Student[];
}
