import { Component, OnInit } from "@angular/core";
import { UtilsEnum } from "src/app/enum/utils.enum";
import * as $ from 'jquery';
import { NBackSettingsService } from "src/app/services/n-back-settings.service";
import { NBackSettingsDto } from "src/app/models/dual-n-back/NBackSettingDto.model";

@Component({
    selector: "app-dual-n-back",
    templateUrl: "./dual-n-back.component.html"
})
export class DualNBackComponent implements OnInit {

    //#region Variables

    public showNBackSettingsPopup: boolean = false;

    private _counter: number = 0;// to keep track of the current iteration
    public isPlaying: boolean = false;// to denote whether the game is being played at the moment or not

    public audioMatch: boolean = false;// to check whether the audio has matched or not
    public positionMatch: boolean = false;// to check whether the position has matched or not

    private _gridPositionItems: number[] = [];// to keep a list of the selected grid positions that are going to be shown
    private _audioLetterAsciiCodeItems: number[] = [];// to keep a list of the selected audio items that are going to be played

    private _currentGridItem: number = 0;// to store the current position item with which the previous elements will be compared to
    private _currentAudioItem: number = 0;// to store the current audio item with which the previous elements will be compared to

    public displayScore: boolean = false;
    public audioScore: number = 0;
    private _isAudioPressed: boolean = false;
    public gridScore: number = 0;
    private _isGridPressed: boolean = false;

    private _interval: NodeJS.Timer;//to store the thread object id

    // game settings options
    public n_back_Setting: number = 1;
    private _speedMS_Setting: number = 1200;
    public iterationNum_Setting: number = 20;

    //#endregion

    //#region Page Load

    constructor(private _nBackSettingsService: NBackSettingsService,) {
    }
    
    ngOnInit(): void {
        this.setKeyPressEvents();
        this.prepareGridPositions();
        this.prepareAudioValues();
        this._nBackSettingsService.initializeSettings();        
        this.setSettingsValues();
    }

    //#endregion

    //#region Private Functions

    private setSettingsValues(): void {
        let settings: NBackSettingsDto = this._nBackSettingsService.getSettings();
        this._speedMS_Setting = settings.Speed_MS;
        this.n_back_Setting = settings.N_Back;
        this.iterationNum_Setting = settings.IterationNum;
    }

    private prepareAudioValues(): void {
        this._audioLetterAsciiCodeItems = [];
        for (let m = 0; m < this.iterationNum_Setting; m++) {
            this._audioLetterAsciiCodeItems.push(Math.floor(Math.random() * (100 - 97)) + 97);
        }
    }

    private prepareGridPositions(): void {
        this._gridPositionItems = [];
        for (let m = 0; m < this.iterationNum_Setting; m++) {
            this._gridPositionItems.push(Math.floor(Math.random() * (2 - 0)) + 0);
        }
    }

    private setKeyPressEvents(): void {
        $(document).keypress((key) => {
            let keyPressed: string = key.originalEvent.key;

            if (this._counter > this.n_back_Setting &&
                this._audioLetterAsciiCodeItems[this._counter - 1 - this.n_back_Setting] == this._currentAudioItem &&
                (keyPressed == 'A' || keyPressed == 'a') &&
                !this._isAudioPressed) {
                this._isAudioPressed = true
                this.audioMatch = true;
            }
            else if (this._counter > this.n_back_Setting &&
                (keyPressed == 'A' || keyPressed == 'a') &&
                !this._isAudioPressed) {
                this._isAudioPressed = true;
                this.audioScore--;
            }

            if (this._counter > this.n_back_Setting &&
                this._gridPositionItems[this._counter - 1 - this.n_back_Setting] == this._currentGridItem &&
                (keyPressed == 'L' || keyPressed == 'l') &&
                !this._isGridPressed) {
                this._isGridPressed = true;
                this.positionMatch = true;
            }
            else if (this._counter > this.n_back_Setting &&
                (keyPressed == 'L' || keyPressed == 'l') &&
                !this._isGridPressed) {
                this._isGridPressed = true;
                this.gridScore--;
            }

            if (keyPressed == ' ')
                this.onStartClick();
        });
        $(document).keydown((key) => {
            if (key.originalEvent.key == "Escape" && this._interval) {
                this.isPlaying = false;
                $('div#cell-' + this._gridPositionItems[this._counter - 1]).css('display', this._counter > 0 ? 'none' : 'block');
                clearInterval(this._interval);
                this._counter = 0;
                this.audioScore = 0;
                this.gridScore = 0;
                this.displayScore = false;
                this._isAudioPressed = false;
                this._isGridPressed = false;
                this.prepareAudioValues();
                this.prepareGridPositions();
            }
        });
    }

    private resetChecks(): void {

        if (this._counter > this.n_back_Setting && this._audioLetterAsciiCodeItems[this._counter - 1 - this.n_back_Setting] == this._currentAudioItem && !this.audioMatch)
            this.audioScore--;
        if (this._counter > this.n_back_Setting && this._gridPositionItems[this._counter - 1 - this.n_back_Setting] == this._currentGridItem && !this.positionMatch)
            this.gridScore--;

        this.audioMatch = false;
        this.positionMatch = false;
        this._isAudioPressed = false;
        this._isGridPressed = false;
    }

    private executeInfo(audio: HTMLAudioElement): void {
        if (this._counter > 0)
            $('div#cell-' + this._gridPositionItems[this._counter - 1]).css('display', 'none');
        $('div#cell-' + this._gridPositionItems[this._counter]).css('display', 'block');

        if (this._counter > this.n_back_Setting) {
            this.audioScore++;
            this.gridScore++;
        }

        if (this._counter == this.iterationNum_Setting) {
            this.isPlaying = false;
            $('div#cell-' + this._gridPositionItems[this._counter - 1]).css('display', 'none');
            this._counter = 0;
            clearInterval(this._interval);
            console.log(this.audioScore, this.gridScore);
            this.displayScore = true;
            $('#audioScore').text(this.audioScore);
            $('#gridScore').text(this.gridScore);
            this.audioScore = 0;
            this.gridScore = 0;
            this._isAudioPressed = false;
            this._isGridPressed = false;
            return;
        }

        this._currentAudioItem = this._audioLetterAsciiCodeItems[this._counter];
        this._currentGridItem = this._gridPositionItems[this._counter];

        audio.src = UtilsEnum.assets + "/dual-n-back/vocal-" + String.fromCharCode(this._audioLetterAsciiCodeItems[this._counter]) + ".mp3";
        if (this._speedMS_Setting <= 1000)
            audio.playbackRate = 1000 / this._speedMS_Setting;
        audio.load();
        audio.play();

        this._counter++;
    }

    //#endregion

    //#region Component Functions

    public onSettingsChanged(): void {
        this.showNBackSettingsPopup = false;
        this.setSettingsValues();
    }

    public onEditSettingsClick(): void {
        this.showNBackSettingsPopup = true;
    }

    public onStartClick(): void {

        this.displayScore = false;
        if (!this.isPlaying)
            this.isPlaying = true;
        else
            return;

        //this is the first sound being played
        let audio: HTMLAudioElement = new Audio();
        this.executeInfo(audio);

        this._interval = setInterval(() => {
            this.resetChecks();
            this.executeInfo(audio);
        }, this._speedMS_Setting);
    }

    //#endregion

}