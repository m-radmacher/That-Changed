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
  return "Open in GitHub";
}

export function getGermanOpenInGH() {
  return "Auf GitHub öffnen";
}

export function getEnglishAuthor() {
  return "Author";
}

export function getGermanAuthor() {
  return "Autor";
}

export function getEnglishEmailSubject(base: string, head: string) {
  return `Changelog for ${base} to ${head}`;
}

export function getGermanEmailSubject(base: string, head: string) {
  return `Änderungsprotokoll für ${base} zu ${head}`;
}

export function getEnglishOpenTicket(ticketId: string) {
  return `Open ticket ${ticketId}`;
}

export function getGermanOpenTicket(ticketId: string) {
  return `Öffne Ticket ${ticketId}`;
}
