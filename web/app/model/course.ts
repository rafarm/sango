import { Assessment } from './assessment';
import { Subject } from './subject';

export class Course {
    _id: string;
    name: string;
    short_name: string;
    year: string;
    subject: Subject[];
    assessments: Assessment[];
}
