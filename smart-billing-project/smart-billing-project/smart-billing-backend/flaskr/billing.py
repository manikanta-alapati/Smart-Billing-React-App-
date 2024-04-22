from flask import Blueprint, g, jsonify, request
from flaskr.db import get_db
from . import auth
from .detection import detect
from . import utils
from . import constants

errors = constants.errors

extract_dict_from_keys = utils.extract_dict_from_keys

bp = Blueprint('billing', __name__, url_prefix='/billing')


@bp.route('/detect', methods=['POST'])
def detect_billing():
    try:
        b64_string = request.json['image']
        if 'base64,' in b64_string:
            b64_string = b64_string[b64_string.find('base64,')+7:]
        print(b64_string[:10])
        value = detect(b64_string)
        detected = value['detected']
        print(detected)
        output_image = value['output_image']
        detected_classes = detected.keys()
        b64_prefix = 'data:image/jpeg;base64,'
        if len(detected_classes) == 0:
            return jsonify({'billing_items': [], 'output_image': b64_prefix + b64_string})
        processed_classes = ', '.join([f"'{c}'" for c in detected_classes])
        print(processed_classes)
        db = get_db()
        detected_products = db.execute(
            f"SELECT * FROM product WHERE class_name in ({processed_classes});")

        retval = []
        fetched_products = detected_products.fetchall()
        for each in fetched_products:
            print(each['class_name'])
            product = dict(extract_dict_from_keys(
                each, ['id', 'name', 'class_name', 'cost']))
            print(product)
            product['count'] = detected[product['class_name']]
            print('after-getting-count', product)
            retval.append(product)
            print(retval)
        print(retval)

        return jsonify({'billing_items': retval, 'output_image': b64_prefix + output_image})
    except:
        return errors['PRODUCT_DETECTION_FAILED'], 500


@bp.route('/make-billing', methods=['POST'])
@auth.login_required
def make_billing():
    try:
        billing_items = request.json['billing_items']
        db = get_db()
        db.execute(
            "INSERT INTO purchase (user_id) VALUES (?);", (g.user['id'],))
        purchase_item = db.execute(
            "SELECT * FROM purchase WHERE user_id = ? ORDER BY created DESC;", (g.user['id'],))
        purchase_item = purchase_item.fetchone()
        purchase_id = purchase_item['id']
        print(g.user['id'], purchase_item['user_id'], purchase_item['created'])
        db.execute(
            f"INSERT INTO purchase_history (purchase_id, product_id, count) VALUES {', '.join([str((purchase_id, item['id'], item['count'])) for item in billing_items])};")
        db.commit()
        return jsonify({})
    except:
        return errors['INTERNAL_SERVER_ERROR'], 400


@bp.route('/history', methods=['POST'])
@auth.login_required
def history():
    try:
        user_id = g.user['id']
        db = get_db()
        # billing_history = db.execute(
        #     "SELECT * FROM purchase_history NATURAL JOIN purchase NATURAL JOIN product WHERE user_id = ? ORDER BY created;", user_id)
        purchase_history = db.execute(
            "SELECT * FROM purchase WHERE user_id = ?;", (g.user['id'],))
        print([extract_dict_from_keys(i, ['id', 'user_id', 'created'])
              for i in purchase_history])
        billing_history = db.execute(
            "select purchase.id as purchase_id, purchase_history.id as purchase_history_id, product.id as product_id, product.name as product_name, product.cost as product_cost, purchase_history.count as product_count, purchase.created as purchase_created  from ((purchase inner join purchase_history on purchase.id = purchase_history.purchase_id) inner join product on product.id = purchase_history.product_id) where purchase.user_id = ? order by purchase.created desc, product.id asc;", (g.user['id'],))
        grouped_history = []
        for item in billing_history:
            if len(grouped_history) == 0 or grouped_history[-1]['purchase_id'] != item['purchase_id']:
                grouped_history.append({
                    'purchase_id': item['purchase_id'],
                    'purchase_history_id': item['purchase_history_id'],
                    'purchase_created': item['purchase_created'].isoformat(),
                    'products': [{
                        'product_id': item['product_id'],
                        'product_name': item['product_name'],
                        'product_cost': item['product_cost'],
                        'product_count': item['product_count'],
                    }]})
            else:
                grouped_history[-1]['products'].append({
                    'product_id': item['product_id'],
                    'product_name': item['product_name'],
                    'product_cost': item['product_cost'],
                    'product_count': item['product_count'],
                })
        print(grouped_history)
        return jsonify({'history': grouped_history})

    except:
        return errors['INTERNAL_SERVER_ERROR'], 500
