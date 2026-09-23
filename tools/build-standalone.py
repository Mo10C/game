"""Bundle the exact game source and local art into one offline HTML file."""
from pathlib import Path
import base64
import re

root = Path(__file__).resolve().parents[1]
public = root / "dist" if (root / "dist" / "index.html").exists() else root
html = (public / "index.html").read_text(encoding="utf-8")
css = (public / "style.css").read_text(encoding="utf-8")
scripts = {name: (public / name).read_text(encoding="utf-8") for name in ("data.js", "engine.js", "card-art.js", "battle-fx.js", "app.js")}
for path in sorted((public / "assets").glob("*.png")):
    encoded = "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode("ascii")
    reference = "./assets/" + path.name
    css = css.replace(reference, encoded)
    scripts = {name: source.replace(reference, encoded) for name, source in scripts.items()}
html = html.replace('<link rel="stylesheet" href="./style.css">', "<style>" + css + "</style>")
for name, source in scripts.items():
    # Prevent a string literal from closing an inline script element.
    source = source.replace("</script", "<\\/script")
    html = html.replace('<script src="./' + name + '"></script>', '<script>\n' + source + '\n</script>')
if re.search(r'(?:href|src)=["\']\./', html) or './assets/' in html or 'url(\'./' in html:
    raise RuntimeError("The standalone output still contains a local dependency")
destination = root.parent / "BloomSpire-Play.html"
destination.write_text(html, encoding="utf-8")
print(f"Created {destination} ({destination.stat().st_size:,} bytes)")
