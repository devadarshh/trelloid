export function absoluteUrl(path: string) {
  return `${process.env.APP_URL}${path}`;
}
