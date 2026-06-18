from pathlib import Path
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')
text = text.replace('<!doctype html>', '<!DOCTYPE html>')
text = re.sub(r'<(meta|link|img|input)([^>]*)\s*/>', r'<\1\2>', text)


def add_button_type(match):
    tag = match.group(0)
    if 'type=' not in tag:
        return tag.replace('<button', '<button type="button"', 1)
    return tag

text = re.sub(r'<button[^>]*>', add_button_type, text)


def add_text_input_type(match):
    tag = match.group(0)
    if 'type=' not in tag:
        return tag.replace('<input', '<input type="text"', 1)
    return tag

text = re.sub(r'<input[^>]*\bname="(?:name|company)"[^>]*>', add_text_input_type, text)

text = text.replace('Stickers & Labels', 'Stickers &amp; Labels')
text = text.replace('Terms & Conditions', 'Terms &amp; Conditions')
text = text.replace('+254 700 265 377', '+254\u00A0 700\u00A0 265\u00A0 377')
text = text.replace('aside class="mobile-menu" aria-hidden="true"', 'aside class="mobile-menu"')
text = text.replace('div class="modal" id="spec-modal" aria-hidden="true"', 'div class="modal" id="spec-modal"')
text = text.replace('div class="modal" id="upload-modal" aria-hidden="true"', 'div class="modal" id="upload-modal"')

path.write_text(text, encoding='utf-8')
