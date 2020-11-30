import { Settings } from './settings.js';
import { ProjectStorage } from './projectStorage.js';

class Control {


    constructor() {
        this.projectStorage = new ProjectStorage();
        this.settings = new Settings(); 

        this.createDivs();

        this.min = this.projectStorage.getTime() !== null ? this.projectStorage.getTime().min : 0;
        this.second = this.projectStorage.getTime() !== null ? this.projectStorage.getTime().second : 0;
        this.intervalId = null;
        this.step = this.projectStorage.getStep() !== null ? this.projectStorage.getStep() : 0;

        this.stepName.innerHTML = 'Step: ';
        this.timeDiv.innerHTML = `${this._addZero(this.min)}:${this._addZero(this.second)}`;
        this.stepValue.innerHTML = this.step;
        this.settingsDiv.innerHTML = 'settings';

        this.settingsDiv.addEventListener('click', () => {

            /*при клике на кнопку настроек проверяем открыто ли меню, 
            если открыто, закрываем и запускаем таймер.
            если закрыто, смотрим не открыто ли окно параметров, если открыто, то закрываем его и 
            открываем меню, при этом ставим на паузу таймер*/

            if (this.settings.isSettingsOpen()) {
                this.settings.settingsClose()
                this.startTime();

            } else {
                if (this.settings.isParamOpen() || this.settings.isScoreOpen() || this.settings.isWonOpen()) {
                    this.settings.scoreClose();
                    this.settings.paramClose();
                    this.settings.wonClose();
                    this.settings.settingsOpen();
                }
                this.settings.settingsOpen();
                this.endTime();

            }

        });
    }

    _updateTime() {

        this.second++;

        if (this.second > 59) {
            this.min++;
            this.second = 0;
        }

        this.timeDiv.innerHTML = `${this._addZero(this.min)}:${this._addZero(this.second)}`;
    }

    _addZero(time) {
        return parseInt(time, 10) < 10 ? `0${time}` : time;
    }

    createDivs(){
        let containerDiv = document.createElement('div');
        this.timeDiv = document.createElement('div');
        this.stepDiv = document.createElement('div');
        this.stepName = document.createElement('div');
        this.stepValue = document.createElement('div');
        this.settingsDiv = document.createElement('div');

        containerDiv.classList.add('control');
        this.timeDiv.classList.add('time');
        this.stepDiv.classList.add('step');
        this.stepName.classList.add('step-name');
        this.stepValue.classList.add('step-value');
        this.settingsDiv.classList.add('set');

        this.stepDiv.append(this.stepName, this.stepValue);
        containerDiv.append(this.timeDiv, this.stepDiv, this.settingsDiv);
        document.body.prepend(containerDiv);

    }

    updateStep() {
        this.step++;
        this.stepValue.innerHTML = this.step;
        if (this.intervalId === null) {
            this.startTime()
        }
    }

    startTime() {
        this.settingsDiv.innerHTML = 'pause';
        this.timeDiv.classList.add('startTime');
        this.intervalId = setInterval(() => {
            this._updateTime();
        }, 1000);
    }

    endTime() {
        this.settingsDiv.innerHTML = 'back';
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.timeDiv.classList.remove('startTime');
    }

    saveState = () => {
        this.projectStorage.setTime(this.min, this.second);
        this.projectStorage.setStep(this.step);
    }

    youWon() {
        this.settings.wonOpen(this.timeDiv.innerHTML, this.step);
        this.endTime();
    }

    isSound() {
        return this.settings.isSound();
    }

}

export {
    Control
};
