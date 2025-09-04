export function debounce<F extends (...args: unknown[]) => void>(
  fn: F,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
