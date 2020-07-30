// fetch helpers

export function status(response: Response): Promise<Response> {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

export function json(response: Response): Promise<JSON> {
  return response.json();
}

export function arrayBuffer(response: Response): Promise<ArrayBuffer> {
  return response.arrayBuffer();
}

export function fetchJSON(url: string): Promise<JSON> {
  return new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
      .then(status)
      .then(json)
      .then(data => {
        resolve(data);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export const fetchXML = (url: string): Promise<XMLDocument> =>
  fetch(url)
    .then(status)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"));

export const fetchArraybuffer = (url: string): Promise<ArrayBuffer> =>
  fetch(url)
    .then(status)
    .then(arrayBuffer);

// export async function fetchArraybuffer(url: string): Promise<ArrayBuffer> {
//   // console.log('fectch ab', url);
//   const response = await fetch(url);
//   const response_1 = await status(response);
//   return arrayBuffer(response_1);
// }
