export class BreadcrumbSelectorEvent {
    select_id: string;
    select_value: any;

    constructor(id: string, value: any) {
        this.select_id = id;
	this.select_value = value;
    }
}
