export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArr = array.slice();
  if (from < 0 || to < 0 || from >= newArr.length || to > newArr.length) return newArr;
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
}