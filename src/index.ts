import { getOctokit } from '@actions/github';
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import chalk from 'chalk';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import {
  getEnglishAuthor,
  getEnglishHeader,
  getEnglishOpenInGH,
  getEnglishOpenTicket,
  getEnglishSubheader,
  getGermanAuthor,
  getGermanHeader,
  getGermanOpenInGH,
  getGermanOpenTicket,
  getGermanSubheader,
} from './i18n';
import { createMailTransport, sendChangelogMail, verifyMailTransporter } from './mailing';
import path from 'path';

export type Commit = {
  author: string | null;
  url: string;
  message: string;
  date: Date | null;
};

async function run() {
  const sendEmail = core.getBooleanInput('send_email');
  const smtpHost = core.getInput('smtp_host');
  const smtpPort = Number(core.getInput('smtp_port'));
  const smtpSecure = core.getBooleanInput('smtp_secure');
  const smtpUser = core.getInput('smtp_username');
  const smtpPassword = core.getInput('smtp_password');
  const smtpFrom = core.getInput('smtp_from');
  const emailTo = core.getInput('email_to').split(';');

  const issueTrackerUrlTemplate = core.getInput('issue_tracker_url');
  const uploadArtifact = core.getBooleanInput('upload');
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
    console.log(chalk.bgRedBright('Invalid language provided. Defaulting to English.'));
  }

  // validate email settings
  if (sendEmail === true) {
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFrom || !emailTo) {
      core.debug(JSON.stringify({ smtpHost, smtpPort, smtpUser, smtpPassword, smtpFrom, emailTo }));
      console.log(chalk.bgRedBright('Invalid email settings provided.'));
      core.setFailed('Invalid email settings provided.');
      return;
    }
  }

  console.log('Fetching commits...');
  const { commits, head, base } = await fetchDataFromGitHub(token, owner, repo);
  console.log('Creating PDF...');
  core.debug('Temporary folder location: ' + process.env.RUNNER_TEMP);
  createPDF(commits, owner, repo, language, base.name, head.name, issueTrackerUrlTemplate);
  console.log('Wrote PDF file.');
  if (uploadArtifact) {
    console.log('Uploading artifact...');
    core.debug('Temporary folder content: ' + fs.readdirSync(process.env.RUNNER_TEMP as string).join('; '));
    await artifact
      .create()
      .uploadArtifact(
        'changelog',
        [path.join(process.env.RUNNER_TEMP as string, 'output.pdf')],
        process.env.RUNNER_TEMP as string
      );
    console.log('Uploaded artifact.');
  }
  if (sendEmail === true) {
    console.log('Sending email...');
    const transporter = createMailTransport(smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword);
    await verifyMailTransporter(transporter);
    await sendChangelogMail(transporter, emailTo, smtpFrom, language, base.name, head.name);
    console.log('Sent email.');
  }
}

function createPDF(
  commits: Commit[],
  owner: string,
  repo: string,
  language: string,
  baseTag: string,
  headTag: string,
  issueTrackerUrlTemplate: string
) {
  // create empty pdf file
  fs.closeSync(fs.openSync(path.join(process.env.RUNNER_TEMP as string, 'output.pdf'), 'w'));
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path.join(process.env.RUNNER_TEMP as string, 'output.pdf')));

  // list available fonts
  if (fs.existsSync(path.join(__dirname, 'fonts'))) {
    core.debug('Available fonts: ' + fs.readdirSync(path.join(__dirname, 'fonts')).join(', '));
  } else {
    core.debug('fonts folder does not exist');
  }

  doc
    .font(path.join(__dirname, 'fonts', 'Inter.ttf'))
    .fontSize(25)
    .text(language === 'de' ? getGermanHeader(repo) : getEnglishHeader(repo), {
      align: 'center',
      link: `https://github.com/${owner}/${repo}`,
    });

  doc.moveDown(1);

  doc
    .fontSize(17)
    .text(language === 'de' ? getGermanSubheader(baseTag, headTag) : getEnglishSubheader(baseTag, headTag), {
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
        .text(` (${commit.date?.getDate()}.${commit.date?.getMonth()}.${commit.date?.getFullYear()})`, {
          link: commit.url,
        });
    } else {
      doc.fontSize(12).text(commit.message, { link: commit.url });
    }
    // add author if available
    doc
      .fillColor('#000000')
      .fontSize(10)
      .text(`${language === 'de' ? getGermanAuthor() : getEnglishAuthor()}: ${commit.author}`, { indent: 7 });
    // check for issue tracker references in commit message
    const issueTrackerRegex = new RegExp('$[a-zA-Z0-9_-]{1,6}$');
    const issueTrackerReferences = issueTrackerRegex.exec(commit.message);
    if (issueTrackerReferences && issueTrackerReferences.length > 0) {
      if (!issueTrackerUrlTemplate) {
        console.log(chalk.bgYellowBright('Found issue tracker references, but not issue tracker URL was configured.'));
        return;
      }
      for (const match of issueTrackerReferences) {
        doc
          .fillColor('#000000')
          .fontSize(10)
          .text(`${language === 'de' ? getGermanOpenTicket(match) : getEnglishOpenTicket(match)}: ${commit.author}`, {
            indent: 7,
            link: issueTrackerUrlTemplate.replace(`%ID%`, match.substring(1, match.length - 1)),
          });
        doc.moveDown(1);
      }
    }
    doc.moveDown(1);
  }

  doc.moveDown(5);
  doc.text(language === 'de' ? getGermanOpenInGH() : getEnglishOpenInGH(), {
    link: `https://github.com/${owner}/${repo}/compare/${baseTag}...${headTag}`,
    underline: true,
  });

  //Finalize PDF file
  doc.end();
}

export async function fetchDataFromGitHub(token: string, owner: string, repo: string) {
  const octokit = getOctokit(token);

  const { data: tags } = await octokit.rest.repos.listTags({
    owner,
    repo,
  });

  if (tags.length < 2) {
    core.setFailed('Not enough tags found. There need to be at least two tags.');
    process.exit(1);
  }

  const base = tags[1];
  const head = tags[0];

  console.log(`Comparing tag *${chalk.cyan(base.name)}* with tag *${chalk.cyan(head.name)}*.`);

  const { data: comparison } = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: base.name,
    head: head.name,
  });

  const commits: Commit[] = comparison.commits.map((cm) => {
    return {
      author: cm.commit.author && cm.commit.author.name ? cm.commit.author.name : null,
      date: cm.commit.author && cm.commit.author.date ? new Date(cm.commit.author.date) : null,
      message: cm.commit.message,
      url: cm.html_url,
    };
  });

  core.debug(`Parsed ${commits.length} commits.`);
  return { commits, head, base };
}

run();
