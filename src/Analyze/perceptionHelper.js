// .7 Likely
// .4 Unsure
// .0 Unlikely
const API_KEY = 'AIzaSyBpnmOySjeP0z9wzTFBoC5zPdjYDh3Uuws';
const apiUrl = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;
const requestedAttributes = ['TOXICITY', 'SEVERE_TOXICITY', 'INCOHERENT', 'INFLAMMATORY', 'OBSCENE'];

function getPerceptionScores(message, context) {
  // messages is the message to get the score of
  // context is an array of messages that were recently sent
  // returns object with attribute scores, which may or may not be populated
  /*
    "summaryScore": {
      "value": float,
    }
  */
  const bodyObj = {
    comment: {
      text: message
    },
    context: {
      entries: [context.map(msg => ({text: msg}))]
    },
    languages: ['en'],
    requestedAttributes: requestedAttributes.reduce((o, attr) => {o[attr] = {}; return o;}, {}),
    doNotStore: true
  }
  const request = new Request(apiUrl, {method: 'POST', body: JSON.stringify(bodyObj)});
  return fetch(request)
    .then((res) => res.json())
    .then((res) => {
      return res.attributeScores;
    });
}

export { getPerceptionScores, requestedAttributes };
