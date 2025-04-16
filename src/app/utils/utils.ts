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

  const validTLDs =
    /\.(com|net|org|edu|gov|mil|biz|info|name|museum|[a-z]{2,})$/i;

  const hasProtocol = /^https?:\/\//.test(trimmedUrl);
  const startsWithWww = /^www\./.test(trimmedUrl);
  const isDirectDomain = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(
    trimmedUrl
  );

  if (!hasProtocol && !startsWithWww && !isDirectDomain) {
    return false;
  }

  let urlToTest = trimmedUrl;

  if (!hasProtocol) {
    urlToTest = `https://${trimmedUrl}`;
  }

  try {
    const urlObj = new URL(urlToTest);
    const hostname = urlObj.hostname;

    const isValidHostname =
      hostname.includes(".") &&
      !hostname.startsWith(".") &&
      !hostname.endsWith(".") &&
      !/\.\./.test(hostname) &&
      validTLDs.test(hostname) &&
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        hostname
      );

    return isValidHostname;
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
