const result = document.getElementById("result");

function run() {
    result.innerHTML = ""; // Clear previous result

    const cards = isCardValid();
    if (!cards) return; // Stop if invalid input

    const bullfightResult = calculateBullfight(cards);

    // Display the result
    result.innerHTML = `Result: ${bullfightResult.result}<br>Sequence: ${bullfightResult.sequence.join(", ")}`;
}

function isCardValid() {
    const getCardsValue = document.getElementById("cards").value.trim();
    const cards = getCardsValue.split(/\s+/).map(Number);

    const isValid = cards.length === 5 && cards.every(card => !isNaN(card) && card > 0 && card <= 10);

    if (!isValid) {
        result.innerHTML = "Please enter exactly 5 numbers (1-10), without extra spaces or characters.";
        return null;
    }

    return cards;
}

function calculateBullfight(cards) {
    // Handle 3↔6 swapping properly
    const convertedCards = cards.map(card => {
        if (card === 3) return [3, 6]; // 3 can be 6
        if (card === 6) return [6, 3]; // 6 can be 3
        return [card]; // Wrap non-swappable cards in an array for consistency
    });

    // Generate all possible hands considering 3↔6 swaps
    const allPossibleHands = generateCombinations(convertedCards);

    let bestResult = { result: "Boom", sequence: cards, bullValue: -1 }; // Default to Boom

    for (const hand of allPossibleHands) {
        const result = checkHand(hand);
        if (result && result.bullValue > bestResult.bullValue) {
            bestResult = result; // Store the highest Bull value
        }
    }

    return bestResult;
}

// Generate all possible hands considering 3↔6 swaps
function generateCombinations(cardSets) {
    const hands = [[]];

    for (const cardOptions of cardSets) {
        const newHands = [];
        for (const option of cardOptions) {
            newHands.push(...hands.map(h => [...h, option]));
        }
        hands.length = 0;
        hands.push(...newHands);
    }

    return hands;
}

// Check if a given hand has a valid bullfight hand and return the correct sequence
function checkHand(cards) {
    let bestBullValue = -1;
    let bestSequence = null;

    for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 4; j++) {
            for (let k = j + 1; k < 5; k++) {
                const sum = cards[i] + cards[j] + cards[k];

                if (sum % 10 === 0) {
                    const remaining = cards.filter((_, idx) => idx !== i && idx !== j && idx !== k);
                    const remainingSum = remaining[0] + remaining[1];

                    let bullValue = remainingSum % 10;
                    if (bullValue === 0) bullValue = 10; // Bull 10 is the highest

                    if (bullValue > bestBullValue) {
                        bestBullValue = bullValue;
                        bestSequence = [cards[i], cards[j], cards[k], ...remaining];
                    }
                }
            }
        }
    }

    if (bestSequence) {
        return {
            result: `Bull ${bestBullValue}`,
            sequence: bestSequence,
            bullValue: bestBullValue
        };
    }

    return null;
}
