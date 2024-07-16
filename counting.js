// DOM elements
const arrayContainer = document.getElementById('array-container');
const arrayInput = document.getElementById('input-numbers');
const submitBtn = document.getElementById('submit');
const startBtn = document.getElementById('start-sort');
const stopBtn = document.getElementById('stop');
const resumeBtn = document.getElementById('resume');
const resetBtn = document.getElementById('reset');
const clearBtn = document.getElementById('clear');
const codeDisplay = document.getElementById('code-display');

// Variables
let array = [];
let sorting = false;
let paused = false;

// Event listeners
submitBtn.addEventListener('click', submitArray);
startBtn.addEventListener('click', startSort);
stopBtn.addEventListener('click', stopSort);
resumeBtn.addEventListener('click', resumeSort);
resetBtn.addEventListener('click', resetArray);
clearBtn.addEventListener('click', clearArray);

// Tab buttons event listeners
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayCode(button.getAttribute('data-lang'));
    });
});

function submitArray() {
    const input = arrayInput.value.trim().split(/\s+/).map(Number);
    if (input.some(isNaN)) {
        alert('Please enter valid numbers');
        return;
    }
    array = input;
    displayArray();
}

function displayArray() {
    arrayContainer.innerHTML = '';
    const max = Math.max(...array);
    array.forEach(num => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(num / max) * 100}%`;
        bar.style.width = `${100 / array.length}%`;
        arrayContainer.appendChild(bar);
    });
}

async function countingSort() {
    const max = Math.max(...array);
    const count = new Array(max + 1).fill(0);
    const output = new Array(array.length);

    for (let i = 0; i < array.length; i++) {
        if (paused) await new Promise(resolve => resumeBtn.onclick = () => { paused = false; resolve(); });
        count[array[i]]++;
        updateBar(i, 'red');
        await sleep(100);
    }

    for (let i = 1; i <= max; i++) {
        if (paused) await new Promise(resolve => resumeBtn.onclick = () => { paused = false; resolve(); });
        count[i] += count[i - 1];
        await sleep(50);
    }

    for (let i = array.length - 1; i >= 0; i--) {
        if (paused) await new Promise(resolve => resumeBtn.onclick = () => { paused = false; resolve(); });
        output[count[array[i]] - 1] = array[i];
        count[array[i]]--;
        updateBar(i, 'green');
        await sleep(100);
    }

    for (let i = 0; i < array.length; i++) {
        if (paused) await new Promise(resolve => resumeBtn.onclick = () => { paused = false; resolve(); });
        array[i] = output[i];
        updateBar(i, 'blue');
        await sleep(100);
    }

    sorting = false;
}

function updateBar(index, color) {
    arrayContainer.children[index].style.backgroundColor = color;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startSort() {
    if (!sorting) {
        sorting = true;
        paused = false;
        countingSort();
    }
}

function stopSort() {
    paused = true;
}

function resumeSort() {
    paused = false;
}

function resetArray() {
    sorting = false;
    paused = false;
    displayArray();
}

function clearArray() {
    array = [];
    arrayContainer.innerHTML = '';
    arrayInput.value = '';
}

function displayCode(lang) {
    const codes = {
        java: `public void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    int range = max - min + 1;
    int count[] = new int[range];
    int output[] = new int[arr.length];
    for (int i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
    }
    for (int i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    for (int i = 0; i < arr.length; i++) {
        arr[i] = output[i];
    }
}`,
        c: `void countingSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max)
            max = arr[i];
    }
    int count[max + 1];
    int output[n];
    memset(count, 0, sizeof(count));
    for (int i = 0; i < n; i++)
        count[arr[i]]++;
    for (int i = 1; i <= max; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}`,
        cpp: `void countingSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    int min = *min_element(arr.begin(), arr.end());
    int range = max - min + 1;
    vector<int> count(range), output(arr.size());
    for (int i = 0; i < arr.size(); i++)
        count[arr[i] - min]++;
    for (int i = 1; i < count.size(); i++)
        count[i] += count[i - 1];
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    for (int i = 0; i < arr.size(); i++)
        arr[i] = output[i];
}`,
        python: `def counting_sort(arr):
    max_element = max(arr)
    min_element = min(arr)
    range_of_elements = max_element - min_element + 1
    count_arr = [0 for _ in range(range_of_elements)]
    output_arr = [0 for _ in range(len(arr))]
    
    for i in range(0, len(arr)):
        count_arr[arr[i]-min_element] += 1
    
    for i in range(1, len(count_arr)):
        count_arr[i] += count_arr[i-1]
    
    i = len(arr)-1
    while i >= 0:
        output_arr[count_arr[arr[i] - min_element] - 1] = arr[i]
        count_arr[arr[i] - min_element] -= 1
        i -= 1
    
    for i in range(0, len(arr)):
        arr[i] = output_arr[i]
    
    return arr`
    };
    
    codeDisplay.textContent = codes[lang] || 'Code not available for this language';
}

// Initial display
displayArray();
displayCode('java');