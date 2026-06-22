import urllib.request
for url in [
    'https://kaih187.github.io/bold-prints/script.js',
    'https://api.github.com/repos/Kaih187/bold-prints/pages'
]:
    print('URL', url)
    try:
        resp = urllib.request.urlopen(url, timeout=30)
        text = resp.read().decode('utf-8', errors='replace')
        print('LEN', len(text))
        if url.endswith('script.js'):
            print('upload.array', 'upload.array(' in text)
            print('submitArtworkForm', 'submitArtworkForm' in text)
            print('/api/send-artwork', '/api/send-artwork' in text)
            print('first-200', repr(text[:200]))
        else:
            print(text)
    except Exception as e:
        print('ERROR', e)
