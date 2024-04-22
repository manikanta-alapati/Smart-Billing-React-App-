from flask import Blueprint, g, jsonify, request
from . import auth
from . import utils
from flaskr.db import get_db
from . import constants

errors = constants.errors

extract_dict_from_keys = utils.extract_dict_from_keys

bp = Blueprint('user', __name__, url_prefix='/user')


@bp.route('/profile', methods=['GET', 'POST'])
@auth.login_required
def profile():
    print('something')
    db = get_db()
    user = g.user
    keys = ['id', 'email', 'name']
    print(g.user)
    current_values = extract_dict_from_keys(user, keys)
    print(request.method)
    if (request.method == 'GET'):
        print(current_values, g.user)
        return jsonify(current_values)

    name = request.json['name']

    try:
        db.execute('UPDATE user SET name=? WHERE id=?', (name, g.user.id))
    except:
        return errors['PROFILE_UPDATE_FAILED'], 500
