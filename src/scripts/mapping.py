mapping = {
    "settings": {
        "index": {
            "max_result_window": 15000,
            "analysis": {
                "analyzer": {
                    "default": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": ["english_stemmer", "lowercase"]
                    },
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": ["lowercase", "autocomplete_filter"]
                    },
                    "symbols": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": ["lowercase"]
                    }
                },
                "filter": {
                    "english_stemmer": {
                        "type": "stemmer",
                        "language": "english"
                    },
                    "autocomplete_filter": {
                        "type": "edge_ngram",
                        "min_gram": "1",
                        "max_gram": "20"
                    }
                }
            },
        }
    },
    "mappings": {
        "searchable_item": {
            "properties": {
                "name": {
                    "type": "string",
                    "fields": {
                        "symbol": {
                            "type": "string",
                            "analyzer": "symbols"
                        }
                    }
                },
                "gene_symbol": {
                    "type": "string",
                    "analyzer": "symbols"
                },
                "name_key": {
                    "type": "string",
                    "analyzer": "symbols",
                    "fields": {
                        "autocomplete": {
                            "type": "string",
                            "analyzer": "autocomplete"
                        }
                    }
                }
            }
        }
    }
}
