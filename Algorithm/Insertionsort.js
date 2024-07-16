const codeDisplay = document.querySelector('.tab-content .tab-pane.active pre code');
const languageTabs = document.querySelectorAll('#languageTabs a');
let array = [];
let stop = false;
const delayTime = 300;
const delay = ms => new Promise(res => setTimeout(res, ms));

// Language code snippets
const codeSnippets = {
    java: `public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

`,
    c: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
}
`,
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`
};

// Event listener for language tabs
languageTabs.forEach(tab => {
    tab.addEventListener('click', event => {
        const language = event.target.getAttribute('href').substring(1);
        codeDisplay.innerText = codeSnippets[language];
    });
});

// Set the initial code display content
codeDisplay.innerText = codeSnippets.java;

// Function to submit array input
function submit() {
    const input = document.getElementById("array").value;
    array = input.split(" ").map(Number);
    visualizeArray(array);
}

// Function to visualize the array
function visualizeArray(arr) {
    const container = document.getElementById("visualization");
    container.innerHTML = "";
    const maxVal = Math.max(...arr);
    const containerWidth = container.offsetWidth;
    const barWidth = Math.max(30, Math.min(100, containerWidth / arr.length - 2));

    arr.forEach((val, idx) => {
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        barContainer.style.width = `${barWidth}px`;
        barContainer.style.left = `${idx * (barWidth + 2)}px`;

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = val;

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(val / maxVal) * 300}px`;
        bar.style.width = `${barWidth}px`;
        bar.id = `bar-${idx}`;

        barContainer.appendChild(label);
        barContainer.appendChild(bar);
        container.appendChild(barContainer);
    });
}

// Function to update bars
async function updateBars() {
    const maxVal = Math.max(...array);
    array.forEach((val, idx) => {
        const container = document.getElementById(`bar-${idx}`).parentElement;
        const label = container.querySelector('.bar-label');
        const bar = container.querySelector('.bar');

        label.textContent = val;
        bar.style.height = `${(val / maxVal) * 300}px`;
    });
    await delay(delayTime);
}

// Function to swap array elements
async function swap(i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    const container1 = document.getElementById(`bar-${i}`).parentElement;
    const container2 = document.getElementById(`bar-${j}`).parentElement;

    const tempLeft = container1.style.left;
    container1.style.left = container2.style.left;
    container2.style.left = tempLeft;

    container1.querySelector('.bar').id = `bar-${j}`;
    container2.querySelector('.bar').id = `bar-${i}`;

    await updateBars();
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let j = i;
        document.getElementById(`bar-${j}`).classList.add("comparing");
        while (j > 0 && array[j - 1] > array[j]) {
            if (stop) return;
            await swap(j, j - 1);
            j--;
            await delay(delayTime);
        }
        document.getElementById(`bar-${j}`).classList.remove("comparing");
        for (let k = 0; k <= i; k++) {
            document.getElementById(`bar-${k}`).classList.add("sorted");
        }
    }
}

// Function to highlight bars
async function highlightBars(indices, className) {
    indices.forEach(index => {
        document.getElementById(`bar-${index}`).classList.remove("comparing", "sorted");
        if (className) {
            document.getElementById(`bar-${index}`).classList.add(className);
        }
    });
    await delay(delayTime);
}

// Function to update a single bar
async function updateSingleBar(index) {
    const maxVal = Math.max(...array);
    const container = document.getElementById(`bar-${index}`).parentElement;
    const label = container.querySelector('.bar-label');
    const bar = container.querySelector('.bar');

    label.textContent = array[index];
    bar.style.height = `${(array[index] / maxVal) * 300}px`;
    await delay(delayTime);
}

// Function to reset the visualization
function reset() {
    stop = false;
    visualizeArray(array);
}

// Function to handle stop button click
function stopClicked() {
    document.getElementById("resume").disabled = false;
    document.getElementById("reset").disabled = false;
}

// Functions to enable and disable buttons
function disableSubmitButton() {
    document.getElementById("submit").disabled = true;
    document.getElementById("start").disabled = true;
    document.getElementById("resume").disabled = true;
    document.getElementById("reset").disabled = true;
}

function enableSubmitButton() {
    document.getElementById("submit").disabled = false;
    document.getElementById("start").disabled = false;
    document.getElementById("resume").disabled = false;
    document.getElementById("reset").disabled = false;
}

// Function to start the sorting
async function startSort() {
    disableSubmitButton();
    reset();
    const sortMethod = document.getElementById("sortSelect").value;
    switch(sortMethod) {
        // case "bubble":
        //     await bubbleSort();
        //     break;
        // Add other sorting algorithms here
        // case "selection":
        //     await selectionSort();
        //     break;
        case "insertion":
            await insertionSort();
            break;
        // case "merge":
        //     await mergeSortWrapper();
        //     break;
        // case "heap":
        //     await heapSort();
        //     break;
        // case "comb":
        //     await combSort();
        //     break;
        // case "quick":
        //     await quickSort();
        //     break;
    }
    enableSubmitButton();
}

// Function to show a step in the tour
function showStep(step) {
    const tourPopup = document.getElementById("tourPopup");
    const targetElement = document.getElementById(tourSteps[step].target);
    const targetRect = targetElement.getBoundingClientRect();

    let top = targetRect.bottom + 10;
    let left = targetRect.left + targetRect.width / 2 - 150;

    if (left < 10) left = 10;
    if (left + 300 > window.innerWidth) left = window.innerWidth - 310;

    if (top + 200 > window.innerHeight) {
        top = targetRect.top - 210;
        if (top < 10) {
            top = 10;
        }
    }

    top = Math.max(10, Math.min(top, window.innerHeight - 210));

    tourPopup.style.left = `${left}px`;
    tourPopup.style.top = `${top}px`;

    document.getElementById("tourTitle").textContent = tourSteps[step].title;
    document.getElementById("tourDescription").textContent = tourSteps[step].description;

    if (step === tourSteps.length - 1) {
        document.getElementById("tourNext").textContent = "Finish";
    } else {
        document.getElementById("tourNext").textContent = "Next";
    }

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

// Event listener for tour next button
document.getElementById("tourNext").addEventListener("click", () => {
    currentStep++;
    if (currentStep < tourSteps.length) {
        showStep(currentStep);
    } else {
        document.getElementById("tourOverlay").style.display = "none";
        currentStep = 0;
    }
});

// Start the tour when the page loads
window.addEventListener("load", function() {
    loader.style.display = "none";
    startTour();
});

// Event listener for tour skip button
document.getElementById("tourSkip").addEventListener("click", () => {
    document.getElementById("tourOverlay").style.display = "none";
    currentStep = 0;
});

// Loader
var loader = document.getElementById("Loader");
window.addEventListener("load", function() {
    loader.style.display = "none";
});

const description = document.querySelector('.bubble-sort-description');

const bubbleSortAlgorithm = `
1.  Iterate from the second element to the last element.
2.  For each element, compare it with the elements in the sorted part and find its correct position.
3.  Shift all the elements in the sorted part that are greater than the current element to the right.
4.  Insert the current element into its correct position in the sorted part.
5.  Repeat until the entire array is sorted.
`;

description.querySelector('pre code.algorithm').innerText = bubbleSortAlgorithm;
$(document).ready(function() {
    $('.dropdown-toggle').dropdown();
  });

  const topButton = document.getElementById("topbtn");
  window.onscroll = function () {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          topButton.style.display = "block";
      } else {
          topButton.style.display = "none";
      }
  };
  topButton.onclick = function (event) {
    event.preventDefault(); 
    window.scrollTo({
        top: 0,
        behavior: 'smooth'  
    });
};
  const upimage = document.getElementByClass("upimage");
  window.onscroll = function () {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          topButton.style.display = "block";
      } else {
          topButton.style.display = "none";
      }
  };
  topButton.onclick = function (event) {
      event.preventDefault(); 
      window.scrollTo({
          top: 0,
          behavior: 'smooth'  
      });
  };