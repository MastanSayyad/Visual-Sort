const codeDisplay = document.querySelector('.tab-content .tab-pane.active pre code');
const languageTabs = document.querySelectorAll('#languageTabs a');
let array = [];
let stop = false;
const delayTime = 300;
const delay = ms => new Promise(res => setTimeout(res, ms));

// Language code snippets
const codeSnippets = {
    java: `public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

public void merge(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int[] leftArr = new int[n1];
    int[] rightArr = new int[n2];
    System.arraycopy(arr, left, leftArr, 0, n1);
    System.arraycopy(arr, mid + 1, rightArr, 0, n2);
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    while (i < n1) {
        arr[k++] = leftArr[i++];
    }
    while (j < n2) {
        arr[k++] = rightArr[j++];
    }
}`,
    c: `void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`,
    cpp: `void mergeSort(vector&lt;int&gt;& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(vector&lt;int&gt;& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector&lt;int&gt; L(n1), R(n2);
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`,
    python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]
        merge_sort(left_half)
        merge_sort(right_half)
        i = j = k = 0
        while i < len(left_half) and j < len(right_half):
            if left_half[i] < right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1
        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1
        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1`
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

async function mergeSortWrapper() {
    await mergeSort(0, array.length - 1);
}

async function mergeSort(left, right) {
    if (left < right) {
        const middle = Math.floor((left + right) / 2);
        
        await mergeSort(left, middle);
        await mergeSort(middle + 1, right);
        await merge(left, middle, right);
    }
}

async function merge(left, middle, right) {
    const leftArray = array.slice(left, middle + 1);
    const rightArray = array.slice(middle + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        if (stop) return;

        await highlightBars([left + i, middle + 1 + j], "comparing");
        await delay(delayTime);

        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        await updateSingleBar(k);
        k++;
    }

    while (i < leftArray.length) {
        if (stop) return;
        array[k] = leftArray[i];
        await updateSingleBar(k);
        i++;
        k++;
    }

    while (j < rightArray.length) {
        if (stop) return;
        array[k] = rightArray[j];
        await updateSingleBar(k);
        j++;
        k++;
    }

    for (let i = left; i <= right; i++) {
        await highlightBars([i], "sorted");
    }
}

async function heapSort() {
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
        await heapify(n, i);

    for (let i = n - 1; i > 0; i--) {
        if (stop) return;
        await swap(0, i);
        await heapify(i, 0);
        document.getElementById(`bar-${i}`).classList.add("sorted");
    }
    document.getElementById(`bar-0`).classList.add("sorted");
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
        case "merge":
            await mergeSortWrapper();
            break;
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
1. Divide the array into two halves.
2. Recursively sort each half.
3. Merge the two sorted halves into a single sorted array.
4. Continue this process until the entire array is sorted.
5. Merge the sorted halves to get the final sorted array.
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