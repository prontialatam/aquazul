"""Generate the English static pages from Spanish HTML and translations/en.json."""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit, parse_qs, urlencode, urlunsplit
import json
import re

ROOT = Path(__file__).resolve().parent.parent
COPY = json.loads((ROOT / 'translations/en.json').read_text())
COPY.update({'ES': 'ES', 'EN': 'EN', 'Idioma': 'Language',
             'Ver sitio en español': 'View website in Spanish',
             'View website in English': 'View website in English', '4,9': '4.9'})


def translate(value):
    key = ' '.join(value.split())
    if not key or not re.search(r'[A-Za-zÁÉÍÓÚáéíóúñÑ]', key) and key != '4,9':
        return value
    if key not in COPY:
        raise ValueError(f'Missing English translation: {key}')
    leading = value[:len(value) - len(value.lstrip())]
    trailing = value[len(value.rstrip()):]
    return leading + COPY[key] + trailing


def whatsapp(url):
    parts = urlsplit(url)
    if parts.netloc != 'wa.me':
        return url
    query = parse_qs(parts.query)
    if 'text' not in query:
        return url
    message = query['text'][0]
    if message == 'Hola, quisiera agendar una cita en Aquazul.':
        message = "Hello, I'd like to book an appointment at Aquazul."
    elif message == 'Hola, quisiera información sobre tomografía CBCT 3D en Aqua Imágenes.':
        message = "Hello, I'd like information about a 3D CBCT scan at Aqua Imágenes."
    else:
        match = re.fullmatch(r'Hola, Aquazul\. Quisiera agendar una evaluación de (.+)\.', message)
        if not match:
            raise ValueError(f'Missing WhatsApp translation: {message}')
        specialty = next((v for k, v in COPY.items() if k.lower() == match[1]), None)
        if not specialty:
            raise ValueError(f'Unknown specialty: {match[1]}')
        message = f"Hello, Aquazul. I'd like to book an assessment for {specialty.lower()}."
    query['text'] = [message]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query, doseq=True), parts.fragment))


class EnglishHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.output = []
        self.skip = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        raw = self.get_starttag_text()

        def replace(match):
            key, quote, value = match.groups()
            decoded = values.get(key, value)
            if tag == 'html' and key == 'lang':
                decoded = 'en'
            elif key in ('alt', 'aria-label', 'aria-roledescription', 'data-caption', 'data-service'):
                decoded = translate(decoded)
            elif tag == 'meta' and key == 'content' and (values.get('name') == 'description' or values.get('property') in ('og:title', 'og:description')):
                decoded = translate(decoded)
            elif key in ('srcset', 'imagesrcset'):
                decoded = ', '.join('../' + part.strip() for part in decoded.split(','))
            elif key in ('src', 'href') and not decoded.startswith(('https:', 'http:', '#', 'mailto:', 'tel:', 'data:')):
                if tag in ('img', 'script', 'link') or 'assets/' in decoded:
                    decoded = '../' + decoded
            if key == 'href':
                decoded = whatsapp(decoded)
            return f'{key}={quote}{escape(decoded, quote=True)}{quote}'

        raw = re.sub(r'([\w-]+)=([\"\x27])(.*?)\2', replace, raw)
        self.output.append(raw)
        if tag in ('script', 'style'):
            self.skip = True

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        self.output.append(f'</{tag}>')
        if tag in ('script', 'style'):
            self.skip = False

    def handle_data(self, value):
        self.output.append(value if self.skip else escape(translate(value), quote=False))

    def handle_entityref(self, name):
        self.output.append(f'&{name};')

    def handle_charref(self, name):
        self.output.append(f'&#{name};')

    def handle_decl(self, value):
        self.output.append(f'<!{value}>')

    def handle_comment(self, value):
        self.output.append(f'<!--{value}-->')


def language_switch(page, language):
    if page.name == 'index.html':
        es, en = ('./', 'en/') if language == 'es' else ('../', './')
    else:
        es, en = (page.name, '../en/especialidades/' + page.name) if language == 'es' else ('../../especialidades/' + page.name, page.name)
    label = 'Idioma' if language == 'es' else 'Language'
    es_label = 'Ver sitio en español' if language == 'es' else 'View website in Spanish'
    active_es = ' aria-current="page"' if language == 'es' else ''
    active_en = ' aria-current="page"' if language == 'en' else ''
    return f'<div class="language-switch" role="group" aria-label="{label}"><a href="{es}" lang="es" hreflang="es" aria-label="{es_label}"{active_es}>ES</a><a href="{en}" lang="en" hreflang="en" aria-label="View website in English"{active_en}>EN</a></div>'


def enhance(html, page, language):
    switch = language_switch(page, language)
    if 'class="language-switch"' in html:
        html = re.sub(r'<div class="language-switch"[^>]*>.*?</div>', switch, html, count=1)
    elif page.name == 'index.html':
        match = re.search(r'<button class="menu-button".*?</button>', html)
        menu = match[0]
        html = html.replace(menu, '', 1)
        html = html.replace('</nav></div></header>', '</nav><div class="header-controls">' + switch + menu + '</div></div></header>', 1)
    else:
        html = html.replace('</div></header>', switch + '</div></header>', 1)
    html = re.sub(r'<link\b(?=[^>]*(?:rel="canonical"|hreflang=))[^>]*>', '', html)
    path = '' if page.name == 'index.html' else 'especialidades/' + page.name
    es_url = 'https://aquazul.prontialatam.com/' + path
    en_url = 'https://aquazul.prontialatam.com/en/' + path
    canonical = en_url if language == 'en' else es_url
    meta = f'<link rel="canonical" href="{canonical}"><link rel="alternate" hreflang="es" href="{es_url}"><link rel="alternate" hreflang="en" href="{en_url}"><link rel="alternate" hreflang="x-default" href="{es_url}">'
    html = re.sub(r'<script src="[^"]*language\.js" defer></script>', '', html)
    prefix = ('../' if page.name != 'index.html' else '') + ('../' if language == 'en' else '')
    meta += f'<script src="{prefix}language.js" defer></script>'
    html = html.replace('</head>', meta + '</head>', 1)
    if page.name == 'index.html':
        # Locale configuration must run before the interactive page scripts.
        match = re.search(r'<script src="[^"]*language\.js" defer></script>', html)
        html = html.replace(match[0], '', 1)
        script = re.search(r'<script\b', html)
        html = html[:script.start()] + match[0] + html[script.start():]
    return html


for source in [ROOT / 'index.html', *sorted((ROOT / 'especialidades').glob('*.html'))]:
    spanish = source.read_text()
    parser = EnglishHTML()
    parser.feed(spanish)
    english = enhance(''.join(parser.output), source, 'en')
    target = ROOT / 'en' / source.relative_to(ROOT)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(english)
    source.write_text(enhance(spanish, source, 'es'))
print('Generated English home page and 8 specialty pages; ES / EN links added to both languages.')
