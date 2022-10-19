"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDataFromGitHub = void 0;
const github_1 = require("@actions/github");
const core = __importStar(require("@actions/core"));
const artifact = __importStar(require("@actions/artifact"));
const chalk_1 = __importDefault(require("chalk"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const i18n_1 = require("./i18n");
const mailing_1 = require("./mailing");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const sendEmail = core.getBooleanInput('send_email');
        const smtpHost = core.getInput('smtp_host');
        const smtpPort = Number(core.getInput('smtp_port'));
        const smtpSecure = core.getBooleanInput('smtp_secure');
        const smtpUser = core.getInput('smtp_user');
        const smtpPassword = core.getInput('smtp_password');
        const smtpFrom = core.getInput('smtp_from');
        const emailTo = core.getInput('email_to').split(';');
        const uploadArtifact = core.getBooleanInput('upload-artifact');
        const language = core.getInput('language');
        const token = core.getInput('token') || process.env.GITHUB_TOKEN || '';
        const repository = core.getInput('repo').split('/');
        if (repository.length !== 2) {
            core.setFailed('Invalid repository name provided.' + repository);
            return;
        }
        const owner = repository[0];
        const repo = repository[1];
        if (language !== 'de' && language !== 'en') {
            console.log(chalk_1.default.bgRedBright('Invalid language provided. Defaulting to English.'));
        }
        // validate email settings
        if (sendEmail === true) {
            if (!smtpHost || !smtpPort || !smtpSecure || !smtpUser || !smtpPassword || !smtpFrom || !emailTo) {
                console.log(chalk_1.default.bgRedBright('Invalid email settings provided.'));
                core.setFailed('Invalid email settings provided.');
                return;
            }
        }
        console.log('Fetching commits...');
        const { commits, head, base } = yield fetchDataFromGitHub(token, owner, repo);
        console.log('Creating PDF...');
        createPDF(commits, owner, repo, language, base.name, head.name);
        console.log('Wrote PDF file.');
        if (uploadArtifact) {
            console.log('Uploading artifact...');
            yield artifact.create().uploadArtifact('changelog', ['output.pdf'], '.');
            console.log('Uploaded artifact.');
        }
        if (sendEmail === true) {
            console.log('Sending email...');
            const transporter = (0, mailing_1.createMailTransport)(smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword);
            yield (0, mailing_1.verifyMailTransporter)(transporter);
            yield (0, mailing_1.sendChangelogMail)(transporter, emailTo, smtpFrom, language, base.name, head.name);
            console.log('Sent email.');
        }
    });
}
function createPDF(commits, owner, repo, language, baseTag, headTag) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const doc = new pdfkit_1.default();
        doc.pipe(fs.createWriteStream('output.pdf'));
        doc
            .font('./fonts/Inter.ttf')
            .fontSize(25)
            .text(language === 'de' ? (0, i18n_1.getGermanHeader)(repo) : (0, i18n_1.getEnglishHeader)(repo), {
            align: 'center',
            link: `https://github.com/${owner}/${repo}`,
        });
        doc.moveDown(1);
        doc
            .fontSize(17)
            .text(language === 'de' ? (0, i18n_1.getGermanSubheader)(baseTag, headTag) : (0, i18n_1.getEnglishSubheader)(baseTag, headTag), {
            align: 'center',
        });
        doc.moveDown(3);
        for (const commit of commits) {
            if (commit.date) {
                doc
                    .fontSize(12)
                    .text(commit.message, { continued: true, link: commit.url })
                    .fillColor('#828282')
                    .fontSize(10)
                    .text(` (${(_a = commit.date) === null || _a === void 0 ? void 0 : _a.getDate()}.${(_b = commit.date) === null || _b === void 0 ? void 0 : _b.getMonth()}.${(_c = commit.date) === null || _c === void 0 ? void 0 : _c.getFullYear()})`, {
                    link: commit.url,
                });
            }
            else {
                doc.fontSize(12).text(commit.message, { link: commit.url });
            }
            doc
                .fillColor('#000000')
                .fontSize(10)
                .text(`${language === 'de' ? (0, i18n_1.getGermanAuthor)() : (0, i18n_1.getEnglishAuthor)()}: ${commit.author}`, { indent: 7 });
            doc.moveDown(1);
        }
        doc.moveDown(5);
        doc.text(language === 'de' ? (0, i18n_1.getGermanOpenInGH)() : (0, i18n_1.getEnglishOpenInGH)(), {
            link: `https://github.com/${owner}/${repo}/compare/${baseTag}...${headTag}`,
            underline: true,
        });
        //Finalize PDF file
        doc.end();
    });
}
function fetchDataFromGitHub(token, owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = (0, github_1.getOctokit)(token);
        const { data: tags } = yield octokit.rest.repos.listTags({
            owner,
            repo,
        });
        if (tags.length < 2) {
            core.setFailed('Not enough tags found. There need to be at least two tags.');
            process.exit(1);
        }
        const base = tags[1];
        const head = tags[0];
        console.log(`Comparing tag *${chalk_1.default.cyan(base.name)}* with tag *${chalk_1.default.cyan(head.name)}*.`);
        const { data: comparison } = yield octokit.rest.repos.compareCommits({
            owner,
            repo,
            base: base.name,
            head: head.name,
        });
        const commits = comparison.commits.map((cm) => {
            return {
                author: cm.commit.author && cm.commit.author.name ? cm.commit.author.name : null,
                date: cm.commit.author && cm.commit.author.date ? new Date(cm.commit.author.date) : null,
                message: cm.commit.message,
                url: cm.html_url,
            };
        });
        core.debug(`Parsed ${commits.length} commits.`);
        return { commits, head, base };
    });
}
exports.fetchDataFromGitHub = fetchDataFromGitHub;
run();
