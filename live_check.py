import urllib.request
url = 'https://kaih187.github.io/bold-prints/script.js'
text = urllib.request.urlopen(url, timeout=30).read().decode('utf-8', errors='replace')
print('len', len(text))
print('upload.array', 'upload.array(' in text)
print('submitArtworkForm', 'submitArtworkForm' in text)
print('fetch /api/send-artwork', '/api/send-artwork' in text)
print(text[:200])
