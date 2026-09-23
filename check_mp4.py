import os, struct

video_dir = r'c:\Users\zjren\Desktop\report-website-main\assets\video'
for i in [1, 2, 3]:
    path = os.path.join(video_dir, f'{i}-web.mp4')
    with open(path, 'rb') as f:
        data = f.read(2 * 1024 * 1024)
    moov = data.find(b'moov')
    mdat = data.find(b'mdat')
    stss = data.find(b'stss')
    stco = data.find(b'stco')
    ftyp = data[4:8]
    size = os.path.getsize(path)
    print(f'{i}-web.mp4 ({size//1024//1024}MB): ftyp={ftyp}, moov@{moov}, mdat@{mdat}, stss@{stss}, stco@{stco}')
    
    # Parse top-level atoms
    pos = 0
    atoms = []
    while pos < min(len(data), size) and len(atoms) < 10:
        if pos + 8 > len(data):
            break
        atom_size = struct.unpack('>I', data[pos:pos+4])[0]
        atom_type = data[pos+4:pos+8]
        if atom_size < 8:
            break
        try:
            name = atom_type.decode('ascii')
        except:
            name = repr(atom_type)
        atoms.append(f'{name}({atom_size})')
        pos += atom_size
    print(f'  Top atoms: {" -> ".join(atoms)}')
    
    # Check stss entry count if present
    if stss >= 0:
        # stss box: size(4) + 'stss'(4) + version/flags(4) + entry_count(4)
        entry_count = struct.unpack('>I', data[stss+8:stss+12])[0]
        print(f'  stss entries (keyframes): {entry_count}')
