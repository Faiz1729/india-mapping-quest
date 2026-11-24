#!/usr/bin/env python3
"""Builds data/geo-states.js and data/geo-rivers.js.

Inputs (download once, not stored in the repo):
  --ne      Natural Earth 10m rivers: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson
  --states  Simplified state outlines (dissolved from udit-001/india-maps-data district GeoJSON)

River courses come from Natural Earth where it has them, otherwise from the
hand-placed waypoints below (smoothed). They are learning-grade, not survey-grade.
"""
import json, sys, argparse

ap = argparse.ArgumentParser()
ap.add_argument('--ne', required=True)
ap.add_argument('--states', required=True)
ap.add_argument('--out', default='data')
a = ap.parse_args()

# id -> Natural Earth feature names
NE = {
 'indus': ['Indus'], 'jhelum': ['Jhelum'], 'chenab': ['Chenab'], 'ravi': ['Ravi'], 'beas': ['Beas'], 'sutlej': ['Sutlej'],
 'ganga': ['Ganges'], 'yamuna': ['Yamuna'], 'chambal': ['Chambal'], 'betwa': ['Betwa'], 'son': ['Son'],
 'gandak': ['Gandak'], 'ghaghara': ['Ghäghara'], 'kosi': ['Sapt'],
 'brahmaputra': ['Yarlung', 'Dihang', 'Brahmaputra'], 'lohit': ['Luhit'], 'teesta': ['Tista'], 'manas': ['Mamas'], 'barak': ['Balak'],
 'godavari': ['Godävari'], 'krishna': ['Krishna'], 'bhima': ['Bhima'], 'tungabhadra': ['Tungabhadra'], 'kaveri': ['Cauvery'],
 'pennar': ['Penner'], 'mahanadi': ['Mahäna Nadï'], 'brahmani': ['Brahmani', 'Sankh'], 'wainganga': ['Wainganga'], 'indravati': ['Indravati'],
 'narmada': ['Narmada'], 'tapi': ['Tapi'], 'mahi': ['Mahi'],
}

# id -> hand-placed waypoints [lat, lon] (approximate learning paths)
HAND = {
 'bhagirathi': [[30.92,79.08],[30.99,78.94],[30.85,78.65],[30.73,78.44],[30.50,78.45],[30.38,78.48],[30.20,78.58],[30.14,78.60]],
 'alaknanda': [[30.78,79.40],[30.74,79.49],[30.56,79.56],[30.40,79.33],[30.26,79.22],[30.28,78.98],[30.14,78.60]],
 'gomti': [[28.65,80.05],[28.2,80.4],[27.4,80.7],[26.85,80.95],[26.5,81.3],[26.27,82.07],[25.75,82.68],[25.50,83.20]],
 'ramganga': [[29.95,79.15],[29.65,79.0],[29.48,78.85],[29.2,78.8],[28.85,78.77],[28.4,79.2],[27.85,79.5],[27.45,79.7],[27.05,79.95]],
 'mahananda': [[26.95,88.3],[26.7,88.4],[26.3,88.2],[25.7,88.0],[25.0,88.1],[24.6,88.2]],
 'damodar': [[23.8,84.4],[23.7,85.0],[23.67,86.15],[23.78,86.8],[23.5,87.3],[23.23,87.86],[22.8,88.1],[22.4,88.1],[22.2,88.1]],
 'subarnarekha': [[23.3,85.2],[23.1,85.5],[22.8,86.2],[22.55,86.7],[22.3,87.0],[21.9,87.3],[21.6,87.4]],
 'baitarani': [[21.7,85.5],[21.2,86.0],[20.95,86.5],[20.8,86.95]],
 'ken': [[23.7,80.4],[24.3,80.0],[24.8,80.1],[25.3,80.4],[25.8,80.5]],
 'vaigai': [[9.95,77.45],[9.97,77.9],[9.92,78.12],[9.8,78.6],[9.5,78.95],[9.35,79.2]],
 'tamiraparani': [[8.68,77.35],[8.7,77.5],[8.73,77.7],[8.65,78.1],[8.6,78.15]],
 'periyar': [[9.4,77.2],[9.6,77.1],[9.85,77.0],[9.95,76.8],[10.05,76.55],[10.1,76.35],[10.15,76.2]],
 'bharathappuzha': [[10.55,76.9],[10.75,76.6],[10.8,76.25],[10.78,75.93]],
 'pamba': [[9.35,77.1],[9.3,76.9],[9.4,76.6],[9.5,76.45]],
 'sharavati': [[13.95,75.2],[14.15,74.95],[14.23,74.82],[14.28,74.45]],
 'mandovi': [[15.65,74.3],[15.55,74.1],[15.5,73.85]],
 'sabarmati': [[24.5,73.4],[24.0,73.1],[23.6,72.95],[23.2,72.65],[23.03,72.58],[22.6,72.4],[22.3,72.3]],
 'luni': [[26.45,74.55],[26.2,73.9],[25.9,73.3],[25.8,72.3],[25.4,72.1],[24.9,71.7],[24.3,71.2]],
 'ghaggar': [[30.9,77.0],[30.4,76.7],[30.0,76.0],[29.5,75.05],[29.6,74.3],[29.2,73.2]],
 'subansiri': [[28.5,93.7],[28.1,94.0],[27.6,94.1],[27.3,94.25],[27.1,94.35]],
 'dibang': [[28.65,96.0],[28.3,95.85],[28.05,95.7],[27.8,95.5]],
 'kameng': [[27.9,92.2],[27.4,92.7],[27.0,92.8],[26.7,92.8]],
 'zanskar': [[33.4,76.6],[33.46,76.88],[33.75,77.1],[34.18,77.35]],
 'wardha': [[21.9,78.2],[21.3,78.4],[20.74,78.6],[20.2,79.0],[19.8,79.5],[19.3,79.8]],
}

def chaikin(pts, n=2):
    for _ in range(n):
        out = [pts[0]]
        for i in range(len(pts) - 1):
            p, q = pts[i], pts[i + 1]
            out.append([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]])
            out.append([0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]])
        out.append(pts[-1])
        pts = out
    return pts

def dp(pts, eps):  # Douglas-Peucker
    if len(pts) < 3: return pts
    import math
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        x0, y0 = pts[i]
        n = abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1))
        d = n / (math.hypot(x2 - x1, y2 - y1) or 1e-9) if (x1, y1) != (x2, y2) else math.hypot(x0 - x1, y0 - y1)
        if d > dmax: dmax, idx = d, i
    if dmax > eps:
        return dp(pts[:idx + 1], eps)[:-1] + dp(pts[idx:], eps)
    return [pts[0], pts[-1]]

ne = json.load(open(a.ne))
by = {}
for f in ne['features']:
    n = f['properties']['name']
    if n and f['geometry']:
        by.setdefault(n, []).append(f['geometry'])

rivers = {}
for rid, names in NE.items():
    lines = []
    for n in names:
        for g in by.get(n, []):
            cs = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
            for c in cs:
                pts = [[p[1], p[0]] for p in c]
                if len(pts) < 2: continue
                # keep Indian-subcontinent window only (drops namesakes elsewhere)
                if not any(5 < p[0] < 40 and 60 < p[1] < 100 for p in pts): continue
                lines.append(pts)
    if not lines: print('MISSING NE', rid)
    rivers[rid] = lines
for rid, pts in HAND.items():
    rivers[rid] = [chaikin(pts)]

def fmt(pts):
    pts = dp(pts, 0.012)
    return [[round(p[0], 2), round(p[1], 2)] for p in pts]
out = {rid: [fmt(l) for l in lines] for rid, lines in rivers.items()}
js = 'window.GEO_RIVERS=' + json.dumps(out, separators=(',', ':')) + ';\n'
open(a.out + '/geo-rivers.js', 'w').write(js)
print('rivers', len(out), len(js) // 1024, 'KB')

st = open(a.states).read()
open(a.out + '/geo-states.js', 'w').write('window.GEO_STATES=' + st + ';\n')
print('states', len(st) // 1024, 'KB')
