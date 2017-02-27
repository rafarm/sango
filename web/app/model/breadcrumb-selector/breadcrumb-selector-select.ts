import { BreadcrumbSelectorItem } from "./breadcrumb-selector-item";

export class BreadcrumbSelectorSelect {
    id: string;
    items: BreadcrumbSelectorItem[];

    constructor(id: string, items: BreadcrumbSelectorItem[]) {
        this.id = id;
        this.items = items;
    }
}
