function getMovingAvgArray(arr, lengthOfMAarray, MAindex) {
  let startIndex = arr.length - lengthOfMAarray;
  let sum = 0;
  for (let i = startIndex - MAindex; i < startIndex; i++) {
    sum += arr[i];
  }
  let result = [];
  for (let i = startIndex; i < arr.length; i++) {
    sum += arr[i] - arr[i - MAindex];
    result.push(parseFloat((sum / MAindex).toFixed(2)));
  }
  return result;
}

module.exports = {
  getMovingAvgArray,
};
