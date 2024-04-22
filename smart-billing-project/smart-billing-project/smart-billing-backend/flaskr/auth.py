import functools
import jwt
from datetime import datetime, timedelta

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

from . import constants

errors = constants.errors

bp = Blueprint('auth', __name__, url_prefix='/auth')

SECRET_KEY = "SECRET_KEY"


def create_jwt_token(email):
    dt = datetime.now() + timedelta(days=30)
    encoded = jwt.encode({"email": email, "exp": dt},
                         SECRET_KEY, algorithm="HS256")
    return encoded


@bp.route('/signup', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    name = request.json['name']
    db = get_db()
    error = None

    if not email:
        error = 'EMAIL_REQUIRED'
    elif not password:
        error = 'PASSWORD_REQUIRED'

    if error is None:
        try:
            db.execute("INSERT INTO user (email, password, name) VALUES (?, ?, ?)",
                       (email, generate_password_hash(password), name))
            db.commit()
        except db.IntegrityError:
            error = 'EMAIL_ALREADY_EXISTS'
        else:
            return jsonify({"jwt_token": create_jwt_token(email)})

    return jsonify(errors[error]), 400


@bp.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    db = get_db()
    error = None
    user = db.execute('SELECT * FROM user WHERE email = ?',
                      (email,)).fetchone()

    if user is None:
        error = 'INVALID_EMAIL'
    elif not check_password_hash(user['password'], password):
        error = 'INVALID_PASSWORD'

    if error:
        return jsonify(errors[error]), 401

    return jsonify({"jwt_token": create_jwt_token(email)})


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        jwt_token = request.headers.get('Authorization')
        print(jwt_token)
        try:
            print('jwt_token', jwt_token)
            jwt_token = jwt_token.split()[1]
            print('jwt_token_after', jwt_token)
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            db = get_db()
            user = db.execute(
                'SELECT * FROM user WHERE email = ?', (payload['email'],)).fetchone()
            g.user = user
            print('auth', user, payload)
        except jwt.ExpiredSignatureError:
            return jsonify(errors['AUTH_TOKEN_EXPIRED'])
        except jwt.InvalidTokenError:
            return jsonify(errors['INVALID_AUTH_TOKEN'])
        except:
            return {"message": "Internal server error."}, 500

        return view(*args, **kwargs)
    return wrapped_view


@bp.route('/hello', methods=['POST'])
@login_required
def sample_response():
    return 'You are a logged in user.'
