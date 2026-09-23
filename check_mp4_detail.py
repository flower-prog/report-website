import os, struct

video_dir = r'c:\Users\zjren\Desktop\report-website-main\assets\video'

def find_atom(data, target, start=0):
    pos = start
    while pos + 8 <= len(data):
        size = struct.unpack('>I', data[pos:pos+4])[0]
        name = data[pos+4:pos+8]
        if size < 8:
            break
        if name == target:
            return pos, size
        pos += size
    return -1, 0

for vid in [1, 2]:
    path = os.path.join(video_dir, str(vid) + '-web.mp4')
    size = os.path.getsize(path)
    print('=== %d-web.mp4 (%dMB) ===' % (vid, size // 1024 // 1024))
    with open(path, 'rb') as f:
        data = f.read(min(2 * 1024 * 1024, size))
    moov_pos, moov_size = find_atom(data, b'moov')
    mdat_pos, mdat_size = find_atom(data, b'mdat')
    print('moov: pos=%d, size=%d' % (moov_pos, moov_size))
    print('mdat: pos=%d, size=%d' % (mdat_pos, mdat_size))
    pos = moov_pos + 8
    moov_end = moov_pos + moov_size
    while pos + 8 <= moov_end:
        s = struct.unpack('>I', data[pos:pos+4])[0]
        n = data[pos+4:pos+8]
        if s < 8:
            break
        if n == b'trak':
            tp = pos + 8
            te = pos + s
            while tp + 8 <= te:
                ts2 = struct.unpack('>I', data[tp:tp+4])[0]
                tn2 = data[tp+4:tp+8]
                if ts2 < 8:
                    break
                if tn2 == b'mdia':
                    mp = tp + 8
                    me = tp + ts2
                    while mp + 8 <= me:
                        ms2 = struct.unpack('>I', data[mp:mp+4])[0]
                        mn2 = data[mp+4:mp+8]
                        if ms2 < 8:
                            break
                        if mn2 == b'minf':
                            mip = mp + 8
                            mie = mp + ms2
                            while mip + 8 <= mie:
                                mis2 = struct.unpack('>I', data[mip:mip+4])[0]
                                mn3 = data[mip+4:mip+8]
                                if mis2 < 8:
                                    break
                                if mn3 == b'stbl':
                                    sp = mip + 8
                                    se = mip + mis2
                                    while sp + 8 <= se:
                                        ss2 = struct.unpack('>I', data[sp:sp+4])[0]
                                        sn = data[sp+4:sp+8]
                                        if ss2 < 8:
                                            break
                                        snn = sn.decode('ascii', errors='replace')
                                        if snn == 'stts':
                                            entries = struct.unpack('>I', data[sp+12:sp+16])[0]
                                            print('  stts entries: %d' % entries)
                                            for e in range(min(entries, 5)):
                                                off = sp + 16 + e * 8
                                                sc = struct.unpack('>I', data[off:off+4])[0]
                                                delta = struct.unpack('>I', data[off+4:off+8])[0]
                                                print('    count=%d, delta=%d (%.2fs)' % (sc, delta, delta / 30.0))
                                        elif snn == 'stss':
                                            entries = struct.unpack('>I', data[sp+12:sp+16])[0]
                                            frames = []
                                            for e in range(entries):
                                                off = sp + 16 + e * 4
                                                if off + 4 > len(data):
                                                    break
                                                frame = struct.unpack('>I', data[off:off+4])[0]
                                                frames.append(frame)
                                            print('  stss keyframes (%d): %s' % (entries, str(frames[:20])))
                                        elif snn == 'stco':
                                            entries = struct.unpack('>I', data[sp+12:sp+16])[0]
                                            offsets = []
                                            for e in range(min(entries, 10)):
                                                off = sp + 16 + e * 4
                                                offset = struct.unpack('>I', data[off:off+4])[0]
                                                offsets.append(offset)
                                            print('  stco entries: %d, first offsets: %s' % (entries, str(offsets)))
                                        elif snn == 'stsc':
                                            entries = struct.unpack('>I', data[sp+12:sp+16])[0]
                                            print('  stsc entries: %d' % entries)
                                        elif snn == 'stsz':
                                            entries = struct.unpack('>I', data[sp+12:sp+16])[0]
                                            print('  stsz samples: %d' % entries)
                                        sp += ss2
                                mip += mis2
                        mp += ms2
                tp += ts2
        pos += s
