const arrayContainer = document.getElementById("array-container");
const selectedAlgorithm = document.getElementById("algorithm");
const visualizationSpeedSlider = document.getElementById("visualization-speed");
const arraySizeSlider = document.getElementById("array-size");
const generateArrayBtn = document.getElementById("generate");
const startVisualizationBtn = document.getElementById("start");
const pauseResumeVisualizationBtn = document.getElementById("pause-resume");

let array = [];
let arraySize = arraySizeSlider.value;
let visualizationSpeed = 1000 / visualizationSpeedSlider.value;
let maxArrayValue = 0;
let isSorting = false;
let isPaused = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderArray() {
  maxArrayValue = Math.max(...array);
  arrayContainer.innerHTML = "";
  array.forEach((value) => {
    const normalizedHeight = (value / maxArrayValue) * 100;
    const bar = document.createElement("div");
    bar.innerText = value;
    bar.classList.add("bar");
    bar.style.height = `${normalizedHeight}%`;
    bar.style.width = `${100 / arraySize}%`;
    arrayContainer.appendChild(bar);
  });
}

function generateRandomArray() {
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }
  renderArray();
}

async function swap(bars, i, j) {
  await sleep(visualizationSpeed);
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
  bars[i].style.height = `${(array[i] / maxArrayValue) * 100}%`;
  bars[i].innerText = array[i];
  bars[j].style.height = `${(array[j] / maxArrayValue) * 100}%`;
  bars[j].innerText = array[j];
}

async function bubbleSort() {
  pauseResumeVisualizationBtn.disabled = false;
  generateArrayBtn.disabled = true;
  startVisualizationBtn.disabled = true;
  const bars = arrayContainer.children;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.backgroundColor = "var(--bar-comparing)";
      bars[j + 1].style.backgroundColor = "var(--bar-comparing)";

      while (isPaused) {
        await sleep(100);
      }

      if (array[j] > array[j + 1]) {
        await swap(bars, j, j + 1);
      }

      bars[j].style.backgroundColor = "var(--default-bar-color)";
      bars[j + 1].style.backgroundColor = "var(--default-bar-color)";
    }
    bars[array.length - i - 1].style.backgroundColor =
      "var(--sorted-bar-color)";

    await sleep(visualizationSpeed);
  }
  generateArrayBtn.disabled = false;
  startVisualizationBtn.disabled = false;
  pauseResumeVisualizationBtn.disabled = true;
}

async function selectionSort() {
  pauseResumeVisualizationBtn.disabled = false;
  generateArrayBtn.disabled = true;
  startVisualizationBtn.disabled = true;
  const bars = arrayContainer.children;
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = "var(--bar-comparing)";
      bars[minIndex].style.backgroundColor = "var(--bar-comparing)";

      while (isPaused) {
        await sleep(100);
      }

      if (array[j] < array[minIndex]) {
        if (minIndex !== i) {
          bars[minIndex].style.backgroundColor = "var(--default-bar-color)";
        }
        minIndex = j;
      } else {
        bars[j].style.backgroundColor = "var(--default-bar-color)";
      }
    }

    if (minIndex !== i) {
      await swap(bars, i, minIndex);
    }

    bars[i].style.backgroundColor = "var(--sorted-bar-color)";
  }
  generateArrayBtn.disabled = false;
  startVisualizationBtn.disabled = false;
  pauseResumeVisualizationBtn.disabled = true;
}

async function insertionSort() {
  pauseResumeVisualizationBtn.disabled = false;
  generateArrayBtn.disabled = true;
  startVisualizationBtn.disabled = true;
  const bars = arrayContainer.children;

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = "var(--highlight-bar-color)";

    await sleep(visualizationSpeed);

    while (j >= 0 && array[j] > key) {
      bars[j].style.backgroundColor = "var(--bar-comparing)";
      bars[j + 1].style.backgroundColor = "var(--bar-comparing)";

      while (isPaused) {
        await sleep(100);
      }

      array[j + 1] = array[j];
      bars[j + 1].style.height = `${(array[j + 1] / maxArrayValue) * 100}%`;
      bars[j + 1].innerText = array[j + 1];

      await sleep(visualizationSpeed);

      bars[j].style.backgroundColor = "var(--default-bar-color)";
      j = j - 1;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${(key / maxArrayValue) * 100}%`;
    bars[j + 1].innerText = key;

    bars[i].style.backgroundColor = "var(--default-bar-color)";
    bars[j + 1].style.backgroundColor = "var(--sorted-bar-color)";

    await sleep(visualizationSpeed);
  }

  for (let i = 0; i < array.length; i++) {
    bars[i].style.backgroundColor = "var(--sorted-bar-color)";
  }

  generateArrayBtn.disabled = false;
  startVisualizationBtn.disabled = false;
  pauseResumeVisualizationBtn.disabled = true;
}

arraySizeSlider.addEventListener("input", (e) => {
  arraySize = e.target.value;
});

visualizationSpeedSlider.addEventListener("input", (e) => {
  visualizationSpeed = 1000 / e.target.value;
});

generateArrayBtn.addEventListener("click", () => {
  generateRandomArray();
});

pauseResumeVisualizationBtn.addEventListener("click", () => {
  if (isPaused) {
    pauseResumeVisualizationBtn.innerText = "Pause";
    isPaused = false;
  } else {
    pauseResumeVisualizationBtn.innerText = "Resume";
    isPaused = true;
  }
});

startVisualizationBtn.addEventListener("click", () => {
  const selectedAlgorithmValue = selectedAlgorithm.value;
  switch (selectedAlgorithmValue) {
    case "bubble-sort":
      bubbleSort();
      break;
    case "selection-sort":
      selectionSort();
      break;
    case "insertion-sort":
      insertionSort();
      break;
    default:
      console.log("Invalid algorithm");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  pauseResumeVisualizationBtn.disabled = true;
  generateRandomArray();
});
