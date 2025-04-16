export function downloadURL(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = ".pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function isValidUrl(url: string): boolean {
  const trimmedUrl = url.trim();

  const hasProtocol = /^https?:\/\//.test(trimmedUrl);
  const startsWithWww = /^www\./.test(trimmedUrl);

  if (!hasProtocol && !startsWithWww) {
    return false;
  }

  let urlToTest = trimmedUrl;
  if (!hasProtocol) {
    urlToTest = `https://${trimmedUrl}`;
  }

  try {
    new URL(urlToTest);
    return /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/.test(
      urlToTest
    );
  } catch {
    return false;
  }
}

export function formatUrl(url: string): string {
  const trimmedUrl = url.trim();
  if (/^https?:\/\//.test(trimmedUrl)) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
}
