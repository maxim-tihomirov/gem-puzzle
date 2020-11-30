import { Control } from './control.js';
import { ProjectStorage } from './projectStorage.js';

const Game = {

  elements: {
    container: null,
    items: []
  },

  func: {
    control: null,
    projectStorage: null
  },

  emptyCell: {
    element: null,
    top: 0,
    left: 0
  },

  parameters: {
    sizeGame: 400,
    sizeCell: null,
    numberSells: null
  },

  createCells() {
    this.elements.container = document.createElement('div');
    this.elements.container.classList.add('container');
    this.elements.container.style.width = this.parameters.sizeGame + 'px';
    this.elements.container.style.height = this.parameters.sizeGame + 'px';

    this.parameters.sizeCell = this.parameters.sizeGame / this.parameters.numberSells;
  },

  createElements(numberCells) {

    this.parameters.numberSells = numberCells;

    this.createCells();

    if (this.func.projectStorage.getSaveGame() !== null) {

      this.getCellsFromStorage();

    } else {

      this.createNewCells();

      this.cellsMixing();
    }

    document.querySelector('body').append(this.elements.container);


    this.elements.items.map((el, index) => {
      if (el.element === null) return;
      el.element.addEventListener('mousedown', (ev) => {
        this.dragAndDrop(ev, index);
      });

      el.element.addEventListener('click', (ev) => {
        this.move(index);
      });
    });
  },

  createNewCells() {
    for (let i = 0; i < this.parameters.numberSells * this.parameters.numberSells; i++) {
      let left = (i - 1) % this.parameters.numberSells;
      let top = (i - 1 - left) / this.parameters.numberSells;

      if (i === 0) {
        this.emptyCell.top = this.parameters.numberSells - 1;
        this.emptyCell.left = this.parameters.numberSells - 1;
        this.elements.items.push(this.emptyCell);
      } else {
        let item = document.createElement('div');
        item.classList.add('item');
        item.style.width = this.parameters.sizeCell + 'px';
        item.style.height = this.parameters.sizeCell + 'px';
        item.innerHTML = i;
        item.style.top = `${top * this.parameters.sizeCell}px`;
        item.style.left = `${left * this.parameters.sizeCell}px`;

        this.elements.items.push({
          top: top,
          left: left,
          element: item
        });
        this.elements.container.append(item);

      }
    }
  },

  getCellsFromStorage() {
    const itemsFromProjectsStorage = this.func.projectStorage.getSaveGame();
    const randArray = [];

    for (let i of itemsFromProjectsStorage) {
      randArray.push(i.num);
    }
    this.parameters.numberSells = Math.sqrt(itemsFromProjectsStorage.length);
    this.parameters.sizeCell = this.parameters.sizeGame / this.parameters.numberSells;

    for (let [i, numb] of randArray.entries()) {
      const left = itemsFromProjectsStorage[i].left;
      const top = itemsFromProjectsStorage[i].top;

      if (numb === 0) {
        this.emptyCell.top = top;
        this.emptyCell.left = left;
        this.elements.items.push(this.emptyCell);
      } else {
        const item = document.createElement('div');
        item.classList.add('item');
        item.style.width = this.parameters.sizeCell + 'px';
        item.style.height = this.parameters.sizeCell + 'px';
        item.innerHTML = itemsFromProjectsStorage[i].num;
        item.style.top = `${top * this.parameters.sizeCell}px`;
        item.style.left = `${left * this.parameters.sizeCell}px`;

        this.elements.items.push({
          top: top,
          left: left,
          element: item
        });
        this.elements.container.append(item);
      }
    }
  },

  cellsMixing() {
    for (let k = 0; k < this.parameters.numberSells * this.parameters.numberSells; k++) {
      const randArray = [...Array(this.parameters.numberSells * this.parameters.numberSells).keys()].sort(() => Math.random() - 0.5);

      for (let i of randArray) {

        if (!this.isMovable(this.elements.items[i])) {
          this.movingCell(i)
        }
      }
    }
  },

  movingCell(i) {
    this.elements.items[i].element.style.top = `${this.emptyCell.top * this.parameters.sizeCell}px`;
    this.elements.items[i].element.style.left = `${this.emptyCell.left * this.parameters.sizeCell}px`;

    let tempTop = this.emptyCell.top;
    let tempLeft = this.emptyCell.left;

    this.emptyCell.top = this.elements.items[i].top;
    this.emptyCell.left = this.elements.items[i].left;

    this.elements.items[i].top = tempTop;
    this.elements.items[i].left = tempLeft;
  },

  isMovable(item) {
    const dif = Math.abs(this.emptyCell.top - item.top) + Math.abs(this.emptyCell.left - item.left);
    return dif !== 1;
  },

  move(i) {

    const item = this.elements.items[i];

    if (this.isMovable(item)) return;

    if (this.func.control.isSound()) {
      this.onAudioStep();
    }

    item.element.classList.add('item-anim');

    this.func.control.updateStep();

    this.movingCell(i);

    setTimeout(() => {
      item.element.classList.remove('item-anim');

      this.func.projectStorage.saveGame(this.elements.items);
      this.func.control.saveState();

      if (this.isWin()) {
        this.func.control.youWon();
        if (this.func.control.isSound()) {
          this.onAudioWin();
        }
      }
    }, 150);

  },

  isWin() {
    let isWin = this.elements.items.filter(el => {
      if (el.element === null) return;

      return Number(el.element.innerHTML) === el.top * this.parameters.numberSells + el.left + 1;
    });

    return isWin.length === this.elements.items.length - 1;

  },

  dragAndDrop(event, i) {
    event.preventDefault();

    let item = this.elements.items[i];
    let container = this.elements.container;

    item.element.style.zIndex = '1000';

    //Узнаём бордер контейнера и приводим его к числу
    let borderSizeOfContainer = Number(getComputedStyle(container)
      .getPropertyValue('border-width')
      .split('')
      .filter(e => Number.isInteger(Number(e)))
      .join(''));

    let shiftX = event.clientX - item.element.getBoundingClientRect().left + Number(borderSizeOfContainer);
    let shiftY = event.clientY - item.element.getBoundingClientRect().top + Number(borderSizeOfContainer);


    dragMove(event.pageX, event.pageY);

    function dragMove(pageX, pageY) {
      let newLeft = pageX - shiftX - container.getBoundingClientRect().left;
      let newTop = pageY - shiftY - container.getBoundingClientRect().top;
      item.element.style.left = newLeft + 'px';
      item.element.style.top = newTop + 'px';
    }

    function onMouseMove(evt) {
      dragMove(evt.pageX, evt.pageY);
    }

    const onMouseUp = () => {

      if (this.isMovable(item)) {
        item.element.style.left = item.left * this.parameters.sizeCell + 'px';
        item.element.style.top = item.top * this.parameters.sizeCell + 'px';
      }

      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      item.element.style.zIndex = '1';
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);


  },

  onAudioStep() {
    let audio = new Audio();
    audio.preload = 'auto';
    audio.src = './assets/gas-stove-burner-igniting.mp3';
    audio.play();
  },
  onAudioWin() {
    let audio = new Audio();
    audio.preload = 'auto';
    audio.src = './assets/win.mp3';
    audio.play();
  },

  update() {
    this.elements.container = null;
    this.elements.items = [];

  },

  start(numberCells = 4) {
    this.func.projectStorage = new ProjectStorage();
    numberCells = this.func.projectStorage.getSizeGame() !== null ? this.func.projectStorage.getSizeGame() : numberCells;
    this.update();
    this.createElements(numberCells);
    this.func.control = new Control();

  }
};

Game.start();

export {
  Game
}