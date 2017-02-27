export class BreadcrumbSelectorItem {
    label: string;
    value: any;
    isGroup: boolean;
    
    constructor(label: string, value: any, isGroup: boolean){
        this.label = label;
        this.value = value;
        this.isGroup = isGroup;
    }
}
