function classify(message) {
  const counts = new Map();
  for (const token of message.match(/[a-zA-Z0-9]+/g) || []) {
    const word = token.toLowerCase();
    if (Object.hasOwn(MODEL.weights, word)) counts.set(word, (counts.get(word) || 0) + 1);
  }
  let squaredNorm = 0;
  let weightedSum = 0;
  const evidence = [];
  for (const [word, count] of counts) {
    const [idf, coefficient] = MODEL.weights[word];
    const tfidf = count * idf;
    squaredNorm += tfidf ** 2;
    weightedSum += tfidf * coefficient;
    if (coefficient > 0) evidence.push([word, tfidf * coefficient]);
  }
  const score = MODEL.bias + weightedSum / (Math.sqrt(squaredNorm) || 1);
  evidence.sort((a,b) => b[1] - a[1]);
  return {label: score > 0 ? 'spam' : 'ham', evidence, known: counts.size};
}
