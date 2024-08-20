const express = require('express');
const axios = require('axios'); 
const app = express();

const WINDOW_SIZE = 10; 
let windowCurrState = [];  


const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];


async function fetchNumbers() {
    try {
        
        const response = await axios.get('http://20.244.56.144/test/primes', { timeout: 500 });
        
        
        console.log("API Response:", response.data);

        
        if (response.data && response.data.numbers) {
            return response.data.numbers; 
        } else {
            console.log("Unexpected response format");
            return [];  
        }
    } catch (error) {
        console.log("Error fetching numbers:", error.message);
        return [];  
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
}


app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    let validTypes = ['p'];  

    if (!validTypes.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

   
    const numbers = primeNumbers;

    if (numbers.length === 0) {
        return res.status(500).json({ error: 'Failed to fetch numbers from third-party API' });
    }

   
    const uniqueNumbers = [...new Set(numbers)];


    const windowPrevState = [...windowCurrState];


    uniqueNumbers.forEach(num => {
        if (windowCurrState.length < WINDOW_SIZE) {
            windowCurrState.push(num);  // Fill the window if not full
        } else {
            windowCurrState.shift();  // Remove oldest and add new number
            windowCurrState.push(num);
        }
    });


    const avg = calculateAverage(windowCurrState);

 
    res.json({
        windowPrevState,
        windowCurrState,
        numbers: uniqueNumbers,
        avg: avg
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
