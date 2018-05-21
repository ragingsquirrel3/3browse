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
      center_expression = str(chrom) + ':' + str(center)
      g_data = {
        'name': d['locus']['display_name'],
        'category': 'gene',
        'start': d['start'],
        'end': d['end'],
        'center_expression': center_expression
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

if __name__ == '__main__':
  write_data_with_manifest()
