const codeDisplay = document.querySelector('.tab-content .tab-pane.active pre code');
const languageTabs = document.querySelectorAll('#languageTabs a');
let array = [];
let stop = false;
const delayTime = 300;
const delay = ms => new Promise(res => setTimeout(res, ms));

// Language code snippets
const codeSnippets = {
    java: `public void combSort(int[] arr) {
    int gap = arr.length;
    boolean swapped = true;
    while (gap != 1 || swapped) {
        gap = getNextGap(gap);
        swapped = false;
        for (int i = 0; i < arr.length - gap; i++) {
            if (arr[i] > arr[i + gap]) {
                int temp = arr[i];
                arr[i] = arr[i + gap];
                arr[i + gap] = temp;
                swapped = true;
            }
        }
    }
}

int getNextGap(int gap) {
    gap = (gap * 10) / 13;
    if (gap < 1) return 1;
    return gap;
`,
    c: `void combSort(int arr[], int n) {
    int gap = n;
    bool swapped = true;
    while (gap != 1 || swapped) {
        gap = getNextGap(gap);
        swapped = false;
        for (int i = 0; i < n - gap; i++) {
            if (arr[i] > arr[i + gap]) {
                int temp = arr[i];
                arr[i] = arr[i + gap];
                arr[i + gap] = temp;
                swapped = true;
            }
        }
    }
}

int getNextGap(int gap) {
    gap = (gap * 10) / 13;
    if (gap < 1) return 1;
    return gap;
}`,
    cpp: `void combSort(vector&lt;int&gt;& arr) {
    int gap = arr.size();
    bool swapped = true;
    while (gap != 1 || swapped) {
        gap = getNextGap(gap);
        swapped = false;
        for (int i = 0; i < arr.size() - gap; i++) {
            if (arr[i] > arr[i + gap]) {
                swap(arr[i], arr[i + gap]);
                swapped = true;
            }
        }
    }
}

int getNextGap(int gap) {
    gap = (gap * 10) / 13;
    if (gap < 1) return 1;
    return gap;
}`,
    python: `def comb_sort(arr):
    gap = len(arr)
    swapped = True
    while gap != 1 or swapped:
        gap = get_next_gap(gap)
        swapped = False
        for i in range(len(arr) - gap):
            if arr[i] > arr[i + gap]:
                arr[i], arr[i + gap] = arr[i + gap], arr[i]
                swapped = True

def get_next_gap(gap):
    gap = (gap * 10) // 13
    return max(1, gap)`
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

async function combSort() {
    let gap = array.length;
    let shrink = 1.3;
    let sorted = false;

    while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }

        let i = 0;
        while (i + gap < array.length) {
            if (stop) return;
            if (array[i] > array[i + gap]) {
                await swap(i, i + gap);
                sorted = false;
            }
            i++;
        }
    }

    for (let i = 0; i < array.length; i++) {
        document.getElementById(`bar-${i}`).classList.add("sorted");
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
        // case "insertion":
        //     await insertionSort();
        //     break;
        // case "merge":
        //     await mergeSortWrapper();
        //     break;
        // case "heap":
        //     await heapSort();
        //     break;
        case "comb":
            await combSort();
            break;
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
1. Initialize the gap size to the length of the array.
2. Reduce the gap size by a shrink factor (typically 1.3) until it becomes 1.
3. Compare elements that are 'gap' positions apart and swap them if needed.
4. If a swap is performed, reset the gap size and repeat step 2.
5. Continue the process until the gap size is 1 and no swaps are needed.
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