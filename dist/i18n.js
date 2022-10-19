"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGermanEmailSubject = exports.getEnglishEmailSubject = exports.getGermanAuthor = exports.getEnglishAuthor = exports.getGermanOpenInGH = exports.getEnglishOpenInGH = exports.getGermanHeader = exports.getEnglishHeader = exports.getGermanSubheader = exports.getEnglishSubheader = void 0;
function getEnglishSubheader(baseTag, headTag) {
    return `Changelog from ${baseTag} to ${headTag}`;
}
exports.getEnglishSubheader = getEnglishSubheader;
function getGermanSubheader(baseTag, headTag) {
    return `Änderungsprotokoll von ${baseTag} zu ${headTag}`;
}
exports.getGermanSubheader = getGermanSubheader;
function getEnglishHeader(repo) {
    return `${repo} Changelog`;
}
exports.getEnglishHeader = getEnglishHeader;
function getGermanHeader(repo) {
    return `${repo} Änderungsprotokoll`;
}
exports.getGermanHeader = getGermanHeader;
function getEnglishOpenInGH() {
    return 'Open in GitHub';
}
exports.getEnglishOpenInGH = getEnglishOpenInGH;
function getGermanOpenInGH() {
    return 'Auf GitHub öffnen';
}
exports.getGermanOpenInGH = getGermanOpenInGH;
function getEnglishAuthor() {
    return 'Author';
}
exports.getEnglishAuthor = getEnglishAuthor;
function getGermanAuthor() {
    return 'Autor';
}
exports.getGermanAuthor = getGermanAuthor;
function getEnglishEmailSubject(base, head) {
    return `Changelog for ${base} to ${head}`;
}
exports.getEnglishEmailSubject = getEnglishEmailSubject;
function getGermanEmailSubject(base, head) {
    return `Änderungsprotokoll für ${base} zu ${head}`;
}
exports.getGermanEmailSubject = getGermanEmailSubject;
