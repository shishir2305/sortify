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
    array.push(Math.floor(Math.random() * 100) + 3);
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
  bars[i].style.backgroundColor = "var(--swapped-bar-color)";
  bars[j].style.height = `${(array[j] / maxArrayValue) * 100}%`;
  bars[j].innerText = array[j];
  bars[j].style.backgroundColor = "var(--swapped-bar-color)";
  await sleep(visualizationSpeed);
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
        bars[minIndex].style.backgroundColor = "var(--highlight-bar-color)";
        await sleep(visualizationSpeed);
      } else {
        bars[j].style.backgroundColor = "var(--default-bar-color)";
      }
    }

    if (minIndex !== i) {
      await swap(bars, i, minIndex);
    }

    bars[i].style.backgroundColor = "var(--sorted-bar-color)";
    await sleep(visualizationSpeed);
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

      bars[j].style.backgroundColor = "var(--default-bar-color)";
      j = j - 1;
      await sleep(visualizationSpeed);
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

async function merge(bars, start, mid, end) {
  let n1 = mid - start + 1;
  let n2 = end - mid;
  let leftArray = [];
  let rightArray = [];

  for (let i = 0; i < n1; i++) {
    leftArray[i] = array[start + i];
  }
  for (let i = 0; i < n2; i++) {
    rightArray[i] = array[mid + 1 + i];
  }

  let i = 0,
    j = 0,
    k = start;
  while (i < n1 && j < n2) {
    bars[start + i].style.backgroundColor = "var(--bar-comparing)";
    bars[mid + 1 + j].style.backgroundColor = "var(--bar-comparing)";
    await sleep(visualizationSpeed);

    while (isPaused) {
      await sleep(100);
    }

    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      bars[k].style.height = `${(array[k] / maxArrayValue) * 100}%`;
      bars[k].innerText = array[k];
      i++;
    } else {
      array[k] = rightArray[j];
      bars[k].style.height = `${(array[k] / maxArrayValue) * 100}%`;
      bars[k].innerText = array[k];
      j++;
    }
    k++;
  }

  while (i < n1) {
    array[k] = leftArray[i];
    bars[k].style.height = `${(array[k] / maxArrayValue) * 100}%`;
    bars[k].innerText = array[k];
    i++;
    k++;
  }

  while (j < n2) {
    array[k] = rightArray[j];
    bars[k].style.height = `${(array[k] / maxArrayValue) * 100}%`;
    bars[k].innerText = array[k];
    j++;
    k++;
  }

  for (let i = start; i <= end; i++) {
    bars[i].style.backgroundColor = "var(--sorted-bar-color)";
    await sleep(visualizationSpeed);
  }
}

async function mergeSortHelper(bars, start, end) {
  if (start < end) {
    let mid = Math.floor((start + end) / 2);
    await mergeSortHelper(bars, start, mid);
    await mergeSortHelper(bars, mid + 1, end);
    await merge(bars, start, mid, end);
  }
}

async function mergeSort() {
  pauseResumeVisualizationBtn.disabled = false;
  generateArrayBtn.disabled = true;
  startVisualizationBtn.disabled = true;
  const bars = arrayContainer.children;
  await mergeSortHelper(bars, 0, array.length - 1);
  generateArrayBtn.disabled = false;
  startVisualizationBtn.disabled = false;
  pauseResumeVisualizationBtn.disabled = true;
}

async function partition(bars, low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    bars[j].style.backgroundColor = "var(--bar-comparing)";
    bars[high].style.backgroundColor = "var(--pivot-bar-color)";

    while (isPaused) {
      await sleep(100);
    }

    if (array[j] < pivot) {
      i++;
      await swap(bars, i, j);
    }
    bars[j].style.backgroundColor = "var(--default-bar-color)";
  }

  await swap(bars, i + 1, high);

  for (let j = low; j <= high; j++) {
    if (j !== i + 1) {
      bars[j].style.backgroundColor = "var(--sorted-bar-color)";
    }
  }

  bars[i + 1].style.backgroundColor = "var(--sorted-bar-color)";
  await sleep(visualizationSpeed);
  return i + 1;
}

async function quickSortHelper(bars, low, high) {
  if (low < high) {
    let partitionIndex = await partition(bars, low, high);
    await quickSortHelper(bars, low, partitionIndex - 1);
    await quickSortHelper(bars, partitionIndex + 1, high);
  }
}

async function quickSort() {
  pauseResumeVisualizationBtn.disabled = false;
  generateArrayBtn.disabled = true;
  startVisualizationBtn.disabled = true;
  const bars = arrayContainer.children;
  await quickSortHelper(bars, 0, array.length - 1);
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
    case "merge-sort":
      mergeSort();
      break;
    case "quick-sort":
      quickSort();
      break;
    default:
      console.log("Invalid algorithm");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  pauseResumeVisualizationBtn.disabled = true;
  generateRandomArray();
});
