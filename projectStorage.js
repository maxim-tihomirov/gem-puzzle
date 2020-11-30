class ProjectStorage {
    constructor() {
        this.time = null;
        this.step = null;
        this.cellsLocation = null;

        if (this.getSoundValue() === null) {
            this.setSoundValue('Sound: ON');
        }
    }

    saveScore(time, step) {

        const date = this.getDate();
        const bestScore = {
            time,
            step,
            date
        }

        const lastScore = this.getScore();
        lastScore.push(bestScore);
        lastScore.sort((a, b) => a.time > b.time ? 1 : -1);
        if (lastScore.length > 10) {
            lastScore.pop();
        }

        localStorage.setItem('score', JSON.stringify(lastScore));
    }

    saveGame(cells) {
        const arr = cells.map(el => {
            return {
                top: el.top,
                left: el.left,
                num: el.element === null ? 0 : el.element.innerHTML
            }
        });

        localStorage.setItem('cells', JSON.stringify(arr));
    }

    setStep(step) {
        localStorage.setItem('step', step);
    }

    setTime(min, second) {
        const time = {
            min,
            second
        }
        localStorage.setItem('time', JSON.stringify(time));
    }

    setSoundValue(value) {
        localStorage.setItem('sound', value)
    }

    setSizeGame(sizeGame) {
        localStorage.setItem('sizeGame', sizeGame);
    }

    getScore() {
        return localStorage.getItem('score') !== null ? JSON.parse(localStorage.getItem('score')) : [];
    }

    getSaveGame() {
        return JSON.parse(localStorage.getItem('cells'));
    }

    getStep = () => {
        return localStorage.getItem('step');
    }

    getSizeGame() {
        return localStorage.getItem('sizeGame');
    }

    getTime = () => {
        return localStorage.getItem('time') !== null ? JSON.parse(localStorage.getItem('time')) : null;
    }

    getDate() {
        const date = new Date();
        let options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return `${date.toLocaleString('ru-RU', options)}`;
    }

    getSoundValue() {
        return localStorage.getItem('sound');
    }

    clearState() {
        localStorage.removeItem('step');
        localStorage.removeItem('time');
        localStorage.removeItem('cells');
    }

    clear() {
        localStorage.clear();
    }
}

export {
    ProjectStorage
}