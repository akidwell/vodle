export declare interface PolicySave {
    save(): void;
    showInvalidControls(): void;
    hideInvalid(): void;
    isValid(): boolean;
    isDirty(): boolean;
}