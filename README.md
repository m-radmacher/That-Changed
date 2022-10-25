<h1 align="center">
  📋🔎
</h1>
<h1 align="center">
  That Changed (GitHub action)
</h1>

<p align="center">
  A GitHub action that generates a changelog in the PDF file format.
</p>

## Configuration
- **token**: A GitHub personal access token with the `repo` scope on the repository you want to generate the changelog for. (Defaults to `${{ github.token }}`)
- **language**: The language to use for the changelog. (Defaults to `en`, also accepts `de`)
- **upload**: Whether to upload the changelog as an artifact. (Defaults to `true`)
- **repo**: The repository you want to generate the changelog for in the format `<username>/<repo>`. (Defaults to `${{ github.repository }}`)
- **send_email**: Whether to send the changelog as an email. (Defaults to `false`)
- **smtp_host**: The SMTP host to use for sending the email.
- **smtp_port**: The SMTP port to use for sending the email.
- **smtp_username**: SMTP username to send emails.
- **smtp_password**: SMTP password for the SMTP user.
- **smtp_from**: Email address to send the email from.
- **email_to**: Email address to send the email to. (Semicolon separated list)
- **issue_tracker_url**: The URL template of your issue tracker. Use `%ID%` as a placeholder for the ticket id (Defaults to '')

## Issue Tracker References
Let's say you have an issue tracker that has the following URL schema: `<URL>/issues/<TICKET ID>`. In this case, you would set the `issue_tracker_url` to `<URL>/issues/%ID%`.
If you now use `$123$` in your commit message, the action will add a little note under your commit with a link to `<URL>/issues/123` on the changelog.
Should you not want to use this feature, you can set `issue_tracker_url` to an empty string.

> **Note**
> Issue tracker ids currently have to fit this regex: `$[a-zA-Z0-9_-]{1,6}$`

## Examples
You can find the full examples in the [examples](examples) directory.
German example:
![German demo](/examples/de.png)

English Example:
![English demo](/examples/en.png)
## Credits
Fonts used:
 - [Inter](https://github.com/rsms/inter)
