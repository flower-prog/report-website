import os

video_dir = r'c:\Users\zjren\Desktop\report-website-main\assets\video'
for i in range(1, 6):
    fname = f'{i}-web.mp4'
    path = os.path.join(video_dir, fname)
    with open(path, 'rb') as f:
        data = f.read()  # read entire file
    codecs = {
        'avc1(H.264)': data.find(b'avc1'),
        'hev1(HEVC)': data.find(b'hev1'),
        'hvc1(HEVC)': data.find(b'hvc1'),
        'mp4v': data.find(b'mp4v'),
        'av01(AV1)': data.find(b'av01'),
        'vp08(VP8)': data.find(b'vp08'),
        'vp09(VP9)': data.find(b'vp09'),
    }
    size = os.path.getsize(path)
    print(f'{fname} ({size//1024//1024}MB):')
    for k, v in codecs.items():
        if v >= 0:
            print(f'  -> {k} found at offset {v}')
    # Also print ftyp brand
    ftyp = data[8:12]
    print(f'  ftyp brand: {ftyp}')
