import json

def groupfn(d):
    return d['chrom']

def parse_file(test_file):
    parsed = []
    for i, d in enumerate(test_file.readlines()):
        if i == 0:
            continue
        else:   
            cols = d.split()
            parsed.append({
                'chrom': cols[0],
                'start': cols[1],
                'x': float(cols[2]),
                'y': float(cols[3]),
                'z': float(cols[4])
            })
    return parsed

def load_example_coordinates():
    test_file = open('./src/data/3d_model_of_yeast_with_genomic_positions.txt')
    test_data = parse_file(test_file)
    # write to data file
    f = open('./src/data/example_yeast_data.json', 'w')
    f.write(json.dumps(test_data))

if __name__ == '__main__':
    load_example_coordinates()
