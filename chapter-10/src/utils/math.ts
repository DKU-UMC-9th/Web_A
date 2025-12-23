export const isPrime = (num: number) => {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    for (let i = 3; i * i <= num; i++) {
        if (num % i === 0) return false;
    }

    return true;
}

export const findPrimeNumbers = (max: number): number[] => {
    const primeNumbers = [];

    for (let i = 2; i <= max; i++) {
        if (isPrime(i)) primeNumbers.push(i);
    }

    return primeNumbers
}