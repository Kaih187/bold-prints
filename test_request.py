import http.client
from pathlib import Path
file_path = Path('test.txt')
file_path.write_text('test')
boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body_lines = []
fields = {'name': 'Test User', 'phone': '+255769604606', 'product': 'Banner Printing'}
for name, value in fields.items():
    body_lines.append('--' + boundary)
    body_lines.append(f'Content-Disposition: form-data; name="{name}"')
    body_lines.append('')
    body_lines.append(value)
body_lines.append('--' + boundary)
body_lines.append('Content-Disposition: form-data; name="artwork"; filename="test.txt"')
body_lines.append('Content-Type: text/plain')
body_lines.append('')
body_lines.append(file_path.read_text())
body_lines.append('--' + boundary + '--')
body_lines.append('')
body = '\r\n'.join(body_lines).encode('utf-8')
conn = http.client.HTTPConnection('127.0.0.1', 3000, timeout=10)
conn.request('POST', '/api/send-artwork', body, {
    'Content-Type': f'multipart/form-data; boundary={boundary}',
    'Content-Length': str(len(body))
})
resp = conn.getresponse()
print('STATUS', resp.status)
print(resp.read().decode('utf-8', errors='replace'))
