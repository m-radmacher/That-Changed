export function getEnglishSubheader(baseTag: string, headTag: string) {
  return `Changelog from ${baseTag} to ${headTag}`;
}

export function getGermanSubheader(baseTag: string, headTag: string) {
  return `Änderungsprotokoll von ${baseTag} zu ${headTag}`;
}

export function getEnglishHeader(repo: string) {
  return `${repo} Changelog`;
}

export function getGermanHeader(repo: string) {
  return `${repo} Änderungsprotokoll`;
}

export function getEnglishOpenInGH() {
  return 'Open in GitHub';
}

export function getGermanOpenInGH() {
  return 'Auf GitHub öffnen';
}

export function getEnglishAuthor() {
  return 'Author';
}

export function getGermanAuthor() {
  return 'Autor';
}
