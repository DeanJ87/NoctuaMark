# NoctuaMark

**PixInsight Astrophotography Watermark & Annotation Tool**

Created by **Tarun Pulikanti** — @hyderabadiastro

NoctuaMark is a PixInsight script for adding presentation-ready watermarks and annotations to astrophotography images. It supports signatures, FITS/XISF metadata, captions, PNG logos, and arrow labels with a live image preview.

## Features

- Signature with name, handle, copyright year, font, colour, opacity, and proportional sizing
- FITS/XISF metadata extraction for object, date, telescope, camera, filter, exposure, site, and sky quality
- Editable metadata and description text blocks
- PNG logo overlay with transparency support
- Arrow and label annotations
- Live preview on the active image
- Preview zoom with scroll wheel and panning with middle-click drag
- Drag positioning for signature, metadata, description, PNG logo, and annotations
- Proportional font scaling based on image width
- Collapsible settings panels
- Persistent settings between sessions

## Installation

NoctuaMark is distributed through a PixInsight update repository.

1. Open PixInsight.
2. Go to **Resources > Updates > Manage Repositories**.
3. Add the NoctuaMark repository URL:

   ```text
   https://pulikantitarun.github.io/NoctuaMark/
   ```

4. Run **Resources > Updates > Check for Updates**.
5. Install the NoctuaMark update.
6. Restart PixInsight.
7. Run NoctuaMark from **Script > Utilities > NoctuaMark**.

Tip: Right-click the menu entry and choose **Add to Toolbar** for one-click access.

## Release Packaging

NoctuaMark releases are published as PixInsight-compatible update packages. Each release is tagged with a semantic version, for example `v1.0.0`.

For each release, GitHub Actions builds:

- `NoctuaMark-<version>.tar.gz`
- `updates.xri`

The archive installs the script under PixInsight's script deployment path:

```text
src/scripts/NoctuaMark/NoctuaMark.js
```

The generated `updates.xri` is published to GitHub Pages alongside the release archive. It declares NoctuaMark as a platform-independent PJSR script package with:

- `type="script"`
- `os="all"`
- `arch="noarch"`
- release date derived from the release build
- package filename derived from the semantic version
- SHA1 checksum for PixInsight package verification

The same `.tar.gz` artifact is attached to the GitHub release for direct download and traceability.

## Usage

| Control | Action |
| --- | --- |
| Scroll wheel on preview | Zoom in or out |
| Middle-click + drag | Pan when zoomed |
| Left-click + drag an element | Reposition it |
| Section headers | Expand or collapse panels |
| **+ Add Annotation** | Click the preview twice to place an arrow label |

## Notes

- NoctuaMark applies changes to the active image view.
- Review the live preview before applying the watermark.
- Save or duplicate important work before applying destructive edits.

## License

MIT License. Free to use, share, and modify with credit to the author.

## Credits

Developed by **Tarun Pulikanti**

- Instagram / AstroBin: @hyderabadiastro
- GitHub: <https://github.com/pulikantitarun>
