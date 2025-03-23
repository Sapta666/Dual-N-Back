import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getNBackSettingsDtoInstance, NBackSettingsDto } from "../models/dual-n-back/NBackSettingDto.model";

@Injectable({
    providedIn: 'root',
})
export class NBackSettingsService {

    //#region Variables

    private isLoggedIn: boolean = false;

    private _sessionItemName: string = "NBackSettings";

    //#endregion

    //#region Page Load

    constructor(private _router: Router) {

    }
    
    //#endregion
    
    //#region Public Functions
    
    public initializeSettings(): void {

        if(sessionStorage.getItem(this._sessionItemName) != null) {            
            return;
        }

        let nBackSettingsDto: NBackSettingsDto = {
            IterationNum: 20,
            N_Back: 2,
            Speed_MS: 1200,
        };
        sessionStorage.setItem(this._sessionItemName,JSON.stringify(nBackSettingsDto));
    }
        
    public getSettings(): NBackSettingsDto {
        let item = sessionStorage.getItem(this._sessionItemName);
        let nBackSettingsDto: NBackSettingsDto = JSON.parse(item == null ? JSON.stringify(getNBackSettingsDtoInstance) : item);
        return nBackSettingsDto;
    }

    public setNewSettings(settings: NBackSettingsDto): void {
        sessionStorage.removeItem(this._sessionItemName);
        sessionStorage.setItem(this._sessionItemName,JSON.stringify(settings));
    }

    //#endregion

    //#region Api Functions

    

    //#endregion

}