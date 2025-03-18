from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import numpy as np
import sympy as sp

app = Flask(__name__)
CORS(app)  

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@database_container:5432/mydatabase_prueba'
db = SQLAlchemy(app)

class Usuario(db.Model):
    __tablename__ = 'usuario'
    id_user = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    credentials = db.Column(db.Integer, nullable=False)

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        id_user = data.get('id_user')
        password = data.get('password')
        username = data.get('username')
        email = data.get('email')
        credentials = data.get('credentials')

        if not id_user or not password or not username or not email or not credentials:
            return jsonify({'error': 'All fields are required'}), 400

        new_user = Usuario(
            id_user=id_user,
            password=password,
            username=username,
            email=email,
            credentials=credentials
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = Usuario.query.filter_by(email=email, password=password).first()

        if user:
            return jsonify({'message': 'Login successful', 'user': {
                'id_user': user.id_user,
                'username': user.username,
                'email': user.email,
                'credentials': user.credentials
            }}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/taylor_series', methods=['POST'])
def taylor_series():
    try:
        data = request.get_json()
        function = data.get('function')
        x0 = float(data.get('x0'))
        n = int(data.get('n'))

        x = sp.symbols('x')
        functions = {
            'sin': sp.sin(x),
            'cos': sp.cos(x),
            'exp': sp.exp(x),
            'log': sp.log(x),
            'custom': sp.sympify(data.get('custom_function')) if data.get('custom_function') else None
        }

        if function not in functions or (function == 'custom' and not functions['custom']):
            return jsonify({'error': 'Invalid function'}), 400

        f = functions[function]
        taylor_expansion = f.series(x, x0, n+1).removeO()

        f_lambdified = sp.lambdify(x, f, 'numpy')
        taylor_lambdified = sp.lambdify(x, taylor_expansion, 'numpy')

        x_vals = np.linspace(x0 - 2, x0 + 2, 400)
        y_vals_original = f_lambdified(x_vals)
        y_vals_taylor = taylor_lambdified(x_vals)

        return jsonify({
            'taylor_expansion': str(taylor_expansion),
            'x_vals': x_vals.tolist(),
            'y_vals_original': y_vals_original.tolist(),
            'y_vals_taylor': y_vals_taylor.tolist()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = Usuario.query.all()
        users_list = []
        for user in users:
            users_list.append({
                'id_user': user.id_user,
                'username': user.username,
                'email': user.email,
                'credentials': user.credentials
            })
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)