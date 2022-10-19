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

## Credits
Fonts used:
 - [Inter](https://github.com/rsms/inter)
