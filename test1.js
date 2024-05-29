function countZeroOne(n) {
    // 0과 1이 몇 번 출력되는지를 저장할 배열
    let count = [0, 0]

    // 피보나치 수열을 계산하는 함수
    const fibonacci = (n) => {
        if (n === 0) {
            count[0]++;
            return 0;
        } else if (n === 1) {
            count[1]++;
            return 1;
        } else {
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
    }

    fibonacci(n);

    return count;
}
console.log(countZeroOne(10))