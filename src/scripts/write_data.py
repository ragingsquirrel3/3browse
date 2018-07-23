import csv
import numpy
import urllib, json
import roman

YEAST_API = 'https://www.yeastgenome.org/backend'

# fetch SGD gene info
def get_yeast_data():
  genes = []
  chroms = range(1, 2)# TEMP 2 -> 17
  for chrom in chroms:
    r_chrom =roman.toRoman(chrom)
    url = YEAST_API + '/contig/chromosome_' + r_chrom + '/sequence_details'
    print(url)
    response = urllib.urlopen(url)
    data = json.loads(response.read())
    gene_data = data['genomic_dna']
    for d in gene_data:
      center = int(numpy.mean([d['start'], d['end']]))
      # get 3d position
      three_pos = get_3d_position_from_position('1', center)
      center_expression = str(chrom) + ':' + str(center)
      g_data = {
        'name': d['locus']['display_name'],
        'category': 'gene',
        'start': d['start'],
        'end': d['end'],
        'center_expression': center_expression,
        'position': three_pos,# assign 3d position
      }
      genes.append(g_data)

  return { 'genes': genes }

def write_data(input_data):
  with open('src/data/yeast_gene_data.json', 'w') as outfile:
      json.dump(input_data, outfile)

def write_data_with_manifest():
  print('saving data')
  yeast_data = get_yeast_data()

  write_data(yeast_data)

def get_3d_position_from_position(chrom, start_pos):
  with open('./src/data/3d_model_of_yeast_with_genomic_positions.txt','rb') as tsvin:
    tsvin = csv.reader(tsvin, delimiter='\t')
    closest_index = 0
    closest_diff = 5000
    closest_pos = '0 0 0'
    i = 0
    for row in tsvin:
      if i != 0:
        chrom_val = row[1]
        this_diff = abs(int(chrom_val) - start_pos)
        if this_diff < closest_diff:
          closest_index = i
          closest_diff = this_diff
          closest_pos = str(row[2]) + ' ' + str(row[3]) + ' ' + str(row[4])
      i += 1
    return closest_pos

if __name__ == '__main__':
  write_data_with_manifest()
