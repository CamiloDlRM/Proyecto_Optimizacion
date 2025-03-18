from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dev_back.Activity_1 import *
import io
import base64
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import matplotlib.pyplot as plt

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

class Activity1(db.Model):
    __tablename__ = 'Activity_1'
    
    id_Activity = db.Column(db.Integer, primary_key=True, autoincrement=True)
    func_obj_coef_x = db.Column(db.Numeric, nullable=False)
    func_obj_coef_y = db.Column(db.Numeric, nullable=False)
    resc1_coef_a = db.Column(db.Numeric)
    resc1_coef_b = db.Column(db.Numeric)
    resc1_coef_c = db.Column(db.Numeric)
    resc2_coef_a = db.Column(db.Numeric)
    resc2_coef_b = db.Column(db.Numeric)
    resc2_coef_c = db.Column(db.Numeric)
    resc3_coef_a = db.Column(db.Numeric)
    resc3_coef_b = db.Column(db.Numeric)
    resc3_coef_c = db.Column(db.Numeric)
    evaluation_point_x = db.Column(db.Numeric)
    evaluation_point_y = db.Column(db.Numeric)

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
    
@app.route('/Activity_1/evaluate', methods=['POST'])
def evaluate_Activity_1():
    try:
        data = request.get_json()
        func_obj_coef_x = data.get('func_obj_coef_x')
        func_obj_coef_y = data.get('func_obj_coef_y')
        resc1_coef_a = data.get('resc1_coef_a')
        resc1_coef_b = data.get('resc1_coef_b')
        resc1_coef_c = data.get('resc1_coef_c')
        resc2_coef_a = data.get('resc2_coef_a')
        resc2_coef_b = data.get('resc2_coef_b')
        resc2_coef_c = data.get('resc2_coef_c')
        resc3_coef_a = data.get('resc3_coef_a')
        resc3_coef_b = data.get('resc3_coef_b')
        resc3_coef_c = data.get('resc3_coef_c')
        evaluation_point_x = data.get('evaluation_point_x')
        evaluation_point_y = data.get('evaluation_point_y')

        # Validaciones
        if func_obj_coef_x is None or func_obj_coef_y is None:
            return jsonify({"error": "Los coeficientes de la función objetivo son obligatorios"}), 400
        
        if (resc1_coef_a is None or resc1_coef_b is None or resc1_coef_c is None or
            resc2_coef_a is None or resc2_coef_b is None or resc2_coef_c is None):
            return jsonify({"error": "Se requieren al menos dos restricciones completas"}), 400
        
        try:
            func_obj_coef_x = float(func_obj_coef_x)
            func_obj_coef_y = float(func_obj_coef_y)
            resc1_coef_a = float(resc1_coef_a)
            resc1_coef_b = float(resc1_coef_b)
            resc1_coef_c = float(resc1_coef_c)
            resc2_coef_a = float(resc2_coef_a)
            resc2_coef_b = float(resc2_coef_b)
            resc2_coef_c = float(resc2_coef_c)
            
            if any(x is not None for x in [resc3_coef_a, resc3_coef_b, resc3_coef_c]):
                if None in [resc3_coef_a, resc3_coef_b, resc3_coef_c]:
                    return jsonify({"error": "La tercera restricción está incompleta"}), 400
                resc3_coef_a = float(resc3_coef_a)
                resc3_coef_b = float(resc3_coef_b)
                resc3_coef_c = float(resc3_coef_c)
            else:
                resc3_coef_a = None
                resc3_coef_b = None
                resc3_coef_c = None
            
            if evaluation_point_x is not None and evaluation_point_y is not None:
                evaluation_point_x = float(evaluation_point_x)
                evaluation_point_y = float(evaluation_point_y)
            else:
                return jsonify({"error": "El punto de evaluación es obligatorio"}), 400
        except ValueError:
            return jsonify({"error": "Todos los valores deben ser números"}), 400
        
        if (resc1_coef_a == 0 and resc1_coef_b == 0) or (resc2_coef_a == 0 and resc2_coef_b == 0):
            return jsonify({"error": "Las restricciones deben tener al menos un coeficiente no nulo"}), 400
            
        if resc1_coef_c < 0 or resc2_coef_c < 0 or (resc3_coef_c is not None and resc3_coef_c < 0):
            return jsonify({"error": "Los términos independientes deben ser no negativos"}), 400
        
        if evaluation_point_x < 0 or evaluation_point_y < 0:
            return jsonify({"error": "Las coordenadas del punto de evaluación deben ser no negativas"}), 400
        
        # Crear lista de restricciones
        restricciones = [
            (resc1_coef_a, resc1_coef_b, resc1_coef_c),
            (resc2_coef_a, resc2_coef_b, resc2_coef_c)
        ]
        
        # Añadir tercera restricción si existe
        if resc3_coef_a is not None:
            restricciones.append((resc3_coef_a, resc3_coef_b, resc3_coef_c))
        
        # Evaluar factibilidad
        is_feasible = verificar_factibilidad(evaluation_point_x, evaluation_point_y, restricciones)
        
        # Evaluar la función objetivo usando los coeficientes del usuario
        objective_value = func_obj_coef_x * evaluation_point_x + func_obj_coef_y * evaluation_point_y
        
        
        # Crear figura para el gráfico
        plt.figure(figsize=(10, 8))
        graficar_region_factible(restricciones)
        
        # Marcar el punto de evaluación en el gráfico
        plt.scatter(evaluation_point_x, evaluation_point_y, color='red', s=100, 
                    label=f'Punto de evaluación ({evaluation_point_x}, {evaluation_point_y})')
        
        # Añadir información sobre factibilidad y valor objetivo
        label_text = f'Factible: {"Sí" if is_feasible else "No"}\nValor objetivo: {objective_value:.2f}'
        plt.annotate(label_text, xy=(evaluation_point_x, evaluation_point_y), 
                     xytext=(evaluation_point_x + 0.5, evaluation_point_y + 0.5),
                     bbox=dict(boxstyle="round,pad=0.5", fc="yellow", alpha=0.7))
        
        # Guardar la figura en un buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        
        # Convertir a base64 para incluir en la respuesta JSON
        graph_image = base64.b64encode(buf.getvalue()).decode('utf-8')
        plt.close()
        
        # Crear respuesta con los resultados de la evaluación
        response_data = {
            "is_feasible": is_feasible,
            "objective_value": objective_value,
            "graph": graph_image,
            "evaluation_results": {
                "func_obj_coef_x": func_obj_coef_x,
                "func_obj_coef_y": func_obj_coef_y,
                "resc1_coef_a": resc1_coef_a,
                "resc1_coef_b": resc1_coef_b,
                "resc1_coef_c": resc1_coef_c,
                "resc2_coef_a": resc2_coef_a,
                "resc2_coef_b": resc2_coef_b,
                "resc2_coef_c": resc2_coef_c,
                "resc3_coef_a": resc3_coef_a,
                "resc3_coef_b": resc3_coef_b,
                "resc3_coef_c": resc3_coef_c,
                "evaluation_point_x": evaluation_point_x,
                "evaluation_point_y": evaluation_point_y
            },
            "message": "Evaluación completada exitosamente"
        }
        
        return jsonify(response_data), 200

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return jsonify({"error": str(e), "details": error_details}), 500

@app.route('/Activity_1/save', methods=['POST'])
def save_Activity_1():
    try:
        data = request.get_json()
        
        func_obj_coef_x = data.get('func_obj_coef_x')
        func_obj_coef_y = data.get('func_obj_coef_y')
        resc1_coef_a = data.get('resc1_coef_a')
        resc1_coef_b = data.get('resc1_coef_b')
        resc1_coef_c = data.get('resc1_coef_c')
        resc2_coef_a = data.get('resc2_coef_a')
        resc2_coef_b = data.get('resc2_coef_b')
        resc2_coef_c = data.get('resc2_coef_c')
        resc3_coef_a = data.get('resc3_coef_a')
        resc3_coef_b = data.get('resc3_coef_b')
        resc3_coef_c = data.get('resc3_coef_c')
        evaluation_point_x = data.get('evaluation_point_x')
        evaluation_point_y = data.get('evaluation_point_y')
        required_fields = [
            'func_obj_coef_x', 'func_obj_coef_y', 
            'resc1_coef_a', 'resc1_coef_b', 'resc1_coef_c',
            'resc2_coef_a', 'resc2_coef_b', 'resc2_coef_c',
            'evaluation_point_x', 'evaluation_point_y'
        ]
        
        missing_fields = [field for field in required_fields if data.get(field) is None]
        if missing_fields:
            return jsonify({
                "error": "Faltan campos requeridos",
                "missing_fields": missing_fields
            }), 400
        
        # Convertir tipos donde sea necesario
        try:
            func_obj_coef_x = float(func_obj_coef_x)
            func_obj_coef_y = float(func_obj_coef_y)
            resc1_coef_a = float(resc1_coef_a)
            resc1_coef_b = float(resc1_coef_b)
            resc1_coef_c = float(resc1_coef_c)
            resc2_coef_a = float(resc2_coef_a)
            resc2_coef_b = float(resc2_coef_b)
            resc2_coef_c = float(resc2_coef_c)
            
            if resc3_coef_a is not None:
                resc3_coef_a = float(resc3_coef_a)
                resc3_coef_b = float(resc3_coef_b)
                resc3_coef_c = float(resc3_coef_c)
            
            evaluation_point_x = float(evaluation_point_x)
            evaluation_point_y = float(evaluation_point_y)
            
            
        except ValueError:
            return jsonify({"error": "Error en el formato de los datos numéricos"}), 400
        
        new_data_AC1 = Activity1(
            func_obj_coef_x=func_obj_coef_x,
            func_obj_coef_y=func_obj_coef_y,
            resc1_coef_a=resc1_coef_a,
            resc1_coef_b=resc1_coef_b,
            resc1_coef_c=resc1_coef_c,
            resc2_coef_a=resc2_coef_a,
            resc2_coef_b=resc2_coef_b,
            resc2_coef_c=resc2_coef_c,
            resc3_coef_a=resc3_coef_a,
            resc3_coef_b=resc3_coef_b,
            resc3_coef_c=resc3_coef_c,
            evaluation_point_x=evaluation_point_x,
            evaluation_point_y=evaluation_point_y
        )
        
        
        db.session.add(new_data_AC1)
        db.session.commit()
        
        return jsonify({
            "message": "Actividad guardada exitosamente"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/Activity_1', methods=['GET'])
def get_Activity_1():
    pass
    

if __name__ == '__main__':
    app.run(debug=True)