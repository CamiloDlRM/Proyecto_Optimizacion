from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

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

        new_user = Usuario(id_user=id_user, password=password, username=username, email=email, credentials=credentials)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
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