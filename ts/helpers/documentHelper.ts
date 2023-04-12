export function createElement<T>(
  element: string,
  className?: string,
  id?: string
): T {
  const newElement = document.createElement(element);
  if (className) {
    newElement.className = className;
  }
  if (id) {
    newElement.id = id;
  }
  return newElement as T;
}

export function textNode(text: string) {
  return document.createTextNode(text);
}
