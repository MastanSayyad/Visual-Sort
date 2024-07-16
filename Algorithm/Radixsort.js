const codeDisplay = document.querySelector('.tab-content .tab-pane.active pre code');
const languageTabs = document.querySelectorAll('#languageTabs a');
let array = [];
let stop = false;
const delayTime = 300;
const delay = ms => new Promise(res => setTimeout(res, ms));

// Language code snippets
const codeSnippets = {
    java: `public class RadixSort {
    public static void radixSort(int[] arr) {
        int max = Arrays.stream(arr).max().getAsInt();
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSort(arr, exp);
        }
    }

    private static void countingSort(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count = new int[10];

        for (int i = 0; i < n; i++) {
            count[(arr[i] / exp) % 10]++;
        }

        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }

        System.arraycopy(output, 0, arr, 0, n);
    }

`,
    c: `int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max)
            max = arr[i];
    }
    return max;
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};

    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}

`,
    cpp: `int getMax(int arr[], int n) {
    return *max_element(arr, arr + n);
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};

    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`,
    python: `def getMax(arr):
    return max(arr)

def countingSort(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    for i in range(n):
        index = (arr[i] // exp) % 10
        count[index] += 1

    for i in range(1, 10):
        count[i] += count[i - 1]

    for i in range(n - 1, -1, -1):
        index = (arr[i] // exp) % 10
        output[count[index] - 1] = arr[i]
        count[index] -= 1

    for i in range(n):
        arr[i] = output[i]

def radixSort(arr):
    max1 = getMax(arr)
    exp = 1
    while max1 // exp > 0:
        countingSort(arr, exp)
        exp *= 10`
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

// Function to get the maximum number in the array
function getMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// Function to count sort based on the digit represented by exp
async function countSort(arr, exp) {
    let output = new Array(arr.length);
    let count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
        count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        await updateSingleBar(i);
    }
}

// Function to implement Radix Sort
async function radixSort() {
    let m = getMax(array);

    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
        await countSort(array, exp);
        if (stop) return;
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
        case "radix":
            await radixSort();
            break;
        // case "insertion":
        //     await insertionSort();
        //     break;
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
1.  Find the maximum number in the array to determine the number of digits.
2.  Initialize the exponent (exp) to 1, representing the current digit place (1 for LSD, 10 for tens, 100 for hundreds, etc.).
3.  While the maximum number divided by the current exponent (exp) is greater than 0:
4.      Use a stable counting sort to sort the array based on the current digit.
5.      Increase the exponent (exp) by multiplying it by 10 to move to the next significant digit.
6.  Repeat until all digit places have been processed.
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
