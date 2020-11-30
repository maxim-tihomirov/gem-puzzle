import { Game } from './script.js';
import { ProjectStorage } from './projectStorage.js';

class Settings {
    constructor() {
        this.settingsDiv = document.createElement('div');
        this.paramDiv = document.createElement('div');
        this.scoreDiv = document.createElement('div');
        this.wonDiv = document.createElement('div');

        this.wonDiv.classList.add('settings');
        this.wonDiv.classList.add('win');

        this.settingsDiv.classList.add('settings');
        this.paramDiv.classList.add('settings');
        this.scoreDiv.classList.add('settings');

        this.projectStorage = new ProjectStorage();

        this.sound = this.projectStorage.getSoundValue() === 'Sound: ON';

        document.querySelector('.container').append(this.wonDiv);
        document.querySelector('.container').append(this.settingsDiv);
        document.querySelector('.container').append(this.paramDiv);
        document.querySelector('.container').append(this.scoreDiv);
        this.createMenu();
        this.paramCreate();
    }

    settingsOpen() {
        this.settingsDiv.classList.add('active');
    }
    settingsClose() {
        this.settingsDiv.classList.remove('active');
    }

    startNewGame = () => {
        this.projectStorage.clearState();
        document.body.innerHTML = '';
        Game.start(this.projectStorage.getSizeGame() !== null ? this.projectStorage.getSizeGame() : 4);
    }

    changeParamAndStartNewGame = (sizeGame) => {
        this.projectStorage.clearState();
        this.projectStorage.setSizeGame(sizeGame);
        document.body.innerHTML = '';
        Game.start(sizeGame);
    }

    createMenu() {
        const newGame = this._getNewElemWithTitleAndClasses('New Game', ['items-menu', 'new-game']);
        const score = this._getNewElemWithTitleAndClasses('Score', ['items-menu']);
        const settings = this._getNewElemWithTitleAndClasses('Settings', ['items-menu']);

        this.settingsDiv.append(newGame, score, settings);

        newGame.addEventListener('click', () => {
            this.startNewGame();
        });
        score.addEventListener('click', () => {
            this.scoreOpen()
        });
        settings.addEventListener('click', () => {
            this.paramOpen();
        });
    }

    _getNewElemWithTitleAndClasses(title, classNameArr){
        let div =  document.createElement('div');
        div.classList.add(...classNameArr);
        div.innerHTML = title;
        return div;

    }

    scoreCreate() {

        const score = [this._getNewElemWithTitleAndClasses('', ['score'])];
        const scoreDate = [this._getNewElemWithTitleAndClasses('Date', ['score-item', 'score-title'])];
        const scoreTime = [this._getNewElemWithTitleAndClasses('Time', ['score-item', 'score-title'])];
        const scoreStep = [this._getNewElemWithTitleAndClasses('Steps', ['score-item', 'score-title'])];

        score[0].append(scoreDate[0], scoreTime[0], scoreStep[0]);
        this.scoreDiv.append(score[0]);

        const bestScore = this.projectStorage.getScore() !== null ? this.projectStorage.getScore() : 0;

        if (bestScore === 0) return

        for (let i = 1; i <= bestScore.length; i++) {
            scoreDate[i] = this._getNewElemWithTitleAndClasses(bestScore[i - 1].date, ['score-item']);
            scoreTime[i] = this._getNewElemWithTitleAndClasses(bestScore[i - 1].time, ['score-item']);
            scoreStep[i] = this._getNewElemWithTitleAndClasses(bestScore[i - 1].step, ['score-item']);

            score[i] = this._getNewElemWithTitleAndClasses('', ['score']);

            score[i].append(scoreDate[i], scoreTime[i], scoreStep[i]);
            this.scoreDiv.append(score[i]);
        }

        this.scoreDiv.style.justifyContent = 'start';
    }
    scoreOpen() {
        this.settingsClose();
        this.scoreDiv.innerHTML = '';
        this.scoreCreate();
        this.scoreDiv.classList.add('active');
    }

    scoreClose() {
        this.scoreDiv.classList.remove('active');
    }

    paramOpen() {
        this.settingsClose();
        this.paramDiv.classList.add('active');
    }

    paramClose() {
        this.paramDiv.classList.remove('active');
    }

    paramCreate() {
        let setDiv = document.createElement('div');
        let sizeGame = document.createElement('div');
        let soundGame = document.createElement('div');

        let listSet = document.createElement('select');
        let option1 = document.createElement('option');
        let option2 = document.createElement('option');
        let option3 = document.createElement('option');
        let option4 = document.createElement('option');
        let option5 = document.createElement('option');
        let option6 = document.createElement('option');
        let btnConfirm = document.createElement('button');

        setDiv.classList.add('item-group');
        sizeGame.classList.add('set-item-name');
        listSet.classList.add('set-item-value');
        btnConfirm.classList.add('button');
        soundGame.classList.add('sound-item');

        sizeGame.innerHTML = "Size game: ";
        soundGame.innerHTML = this.projectStorage.getSoundValue();
        option1.innerHTML = '3x3';
        option2.innerHTML = '4x4';
        option3.innerHTML = '5x5';
        option4.innerHTML = '6x6';
        option5.innerHTML = '7x7';
        option6.innerHTML = '8x8';
        btnConfirm.innerHTML = 'Change size';
        option1.value = 3;
        option2.value = 4;
        option3.value = 5;
        option4.value = 6;
        option5.value = 7;
        option6.value = 8;
        listSet.append(option1, option2, option3, option4, option5, option6);

        setDiv.append(sizeGame, listSet);
        this.paramDiv.append(setDiv, btnConfirm, soundGame);

        soundGame.addEventListener('click', () => {
            if (soundGame.innerHTML === "Sound: ON") {
                soundGame.innerHTML = "Sound: OFF";
                this.sound = false;
                this.projectStorage.setSoundValue('Sound: OFF');
            } else {
                soundGame.innerHTML = "Sound: ON";
                this.sound = true;
                this.projectStorage.setSoundValue('Sound: ON');
            }
        });

        btnConfirm.addEventListener('click', () => {
            this.changeParamAndStartNewGame(listSet.value);
        });
    }

    wonOpen(time, n) {
        this.wonDiv.innerHTML = `Ура! Вы решили головоломку за ${time} и ${n} ходов`;
        this.wonDiv.classList.add('active');

        this.projectStorage.saveScore(time, n);
    }

    wonClose() {
        this.wonDiv.classList.remove('active');
    }

    isSound() {
        return this.sound;
    }

    isWonOpen() {
        return this.wonDiv.classList.contains('active');
    }

    isSettingsOpen() {
        return this.settingsDiv.classList.contains('active');
    }
    isParamOpen() {
        return this.paramDiv.classList.contains('active');
    }
    isScoreOpen() {
        return this.scoreDiv.classList.contains('active');
    }

}


export {
    Settings
}