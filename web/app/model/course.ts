import { Assessment } from './assessment';

export class Course {
    _id: string;
    name: string;
    short_name: string;
    year: string;
    assessments: Assessment[];
}
