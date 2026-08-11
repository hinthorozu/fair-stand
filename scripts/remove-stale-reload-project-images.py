from pathlib import Path

path = Path('src/main.js')
text = path.read_text(encoding='utf-8')

text = text.replace("const reloadProjectImagesButton = document.querySelector('#reload-project-images');\n", "", 1)

start = text.find("reloadProjectImagesButton.addEventListener('click', async () => {")
if start == -1:
    raise SystemExit('stale reloadProjectImagesButton listener not found')

end_marker = "\n});\n\nnewProjectButton.addEventListener('click'"
end = text.find(end_marker, start)
if end == -1:
    raise SystemExit('stale listener end not found')

text = text[:start] + "newProjectButton.addEventListener('click'" + text[end + len("\n});\n\nnewProjectButton.addEventListener('click'"):]

path.write_text(text, encoding='utf-8')
