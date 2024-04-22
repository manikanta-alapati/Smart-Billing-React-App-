from flask import Blueprint, g, jsonify
from flaskr.db import get_db
from . import auth
from . import utils
from . import constants

errors = constants.errors

extract_dict_from_keys = utils.extract_dict_from_keys

bp = Blueprint('product', __name__, url_prefix='/product')


@bp.route('/all', methods=['GET'])
def get_products():
    try:
        db = get_db()
        products = db.execute("SELECT * FROM product;")
        keys = ['id', 'name', 'class_name', 'cost']
        products = products.fetchall()
        processed = []
        for product in products:
            processed.append(dict(extract_dict_from_keys(product, keys)))

        return jsonify({'products': processed})
    except:
        return errors['INTERNAL_SERVER_ERROR'], 500
