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
## Examples
You can find the full examples in the [examples](examples) directory.
German example:
![German demo](/examples/de.png)

English Example:
![English demo](/examples/en.png)
## Credits
Fonts used:
 - [Inter](https://github.com/rsms/inter)
