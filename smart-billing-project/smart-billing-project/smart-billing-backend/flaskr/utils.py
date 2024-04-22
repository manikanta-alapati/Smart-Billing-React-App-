def extract_dict_from_keys(dic, keys, defaults={}):
    ret = defaults
    for key in keys:
        try:
            if defaults[key]:
                ret[key] = defaults[key]
        except:
            pass
        try:
            if dic[key]:
                ret[key] = dic[key]
        except:
            pass
    return ret


def convert_dict_to_tuple(dic, keys):
    return tuple([dic[key] for key in keys])
