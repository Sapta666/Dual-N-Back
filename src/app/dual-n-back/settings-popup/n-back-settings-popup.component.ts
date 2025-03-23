import { AfterViewInit, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { getNBackSettingsDtoInstance } from "src/app/models/dual-n-back/NBackSettingDto.model";
import { NBackSettingsService } from "src/app/services/n-back-settings.service";

@Component({
    selector: 'app-n-back-settings-popup',
    templateUrl: "./n-back-settings-popup.component.html"
})
export class NBackSettingsPopupComponent implements OnInit {

    //#region Variables

    public formGroup: FormGroup;

    @Output() onSave = new EventEmitter();
    @Output() onCancel = new EventEmitter();

    //#endregion

    //#region Page Load

    constructor(private _fb: FormBuilder,
        private _nBackSettingsService: NBackSettingsService) {

    }

    ngOnInit(): void {
        this.initializeFormGroup();
    }

    //#endregion

    //#region Private Functions

    private initializeFormGroup(): void {               
        this.formGroup = this._fb.group(getNBackSettingsDtoInstance);
        this.formGroup.patchValue(this._nBackSettingsService.getSettings());        
    }

    //#endregion

    //#region Component Functions 

    public onCloseClick(): void {
        this.onCancel.emit();
    }

    public onSubmitClick(): void {
        if(!this.formGroup.valid) {
            alert("Form Validation Failed!");
            return;
        }
        this._nBackSettingsService.setNewSettings(this.formGroup.value);
        this.onSave.emit();
    }

    //#endregion

}