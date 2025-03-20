from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import numpy as np
import sympy as sp
import scipy.sparse as sparse
from dev_back.Activity_1 import *
import io
import base64
from dev_back.Activity_2 import *
from dev_back.Activity_4 import *

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

class Activity1(db.Model):
    __tablename__ = 'activity_1'
    
    id_activity = db.Column(db.Integer, primary_key=True, autoincrement=True)
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

class Activity2(db.Model):
    __tablename__ = 'Activity_2'
    id_Activity = db.Column(db.Integer, primary_key=True, autoincrement=True)
    metodo = db.Column(db.String(10), nullable=False)  
    filas = db.Column(db.Integer, nullable=False)
    columnas = db.Column(db.Integer, nullable=False)
    densidad = db.Column(db.Float, nullable=False)

class Activity3(db.Model):
    __tablename__ = 'Activity_3'
    id_Activity = db.Column(db.Integer, primary_key=True, autoincrement=True)
    x = db.Column(db.Numeric, nullable=False)
    x0 = db.Column(db.Numeric, nullable=False)
    n = db.Column(db.Integer, nullable=False)

class Activity4(db.Model):
    __tablename__ = 'Activity_4'
    id_Activity = db.Column(db.Integer, primary_key=True, autoincrement=True)
    function_str = db.Column(db.String(255), nullable=False)
    method = db.Column(db.String(50), nullable=False)
    initial_point = db.Column(db.Float, nullable=False)
    tolerance = db.Column(db.Float, nullable=False)
    learning_rate = db.Column(db.Float, nullable=True)
    result_x = db.Column(db.Float, nullable=False)
    result_f = db.Column(db.Float, nullable=False)
    iterations = db.Column(db.Integer, nullable=True)
    

class RegistryActivities(db.Model):
    __tablename__ = 'Registry_Activities'
    id_RA = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey('Usuario.id_user', ondelete='CASCADE'), nullable=False)
    id_ACT1 = db.Column(db.Integer, db.ForeignKey('Activity_1.id_Activity', ondelete='CASCADE'), nullable=False)
    id_ACT2 = db.Column(db.Integer, db.ForeignKey('Activity_2.id_Activity', ondelete='CASCADE'), nullable=False)
    id_ACT3 = db.Column(db.Integer, db.ForeignKey('Activity_3.id_Activity', ondelete='CASCADE'), nullable=False)
    id_ACT4 = db.Column(db.Integer, db.ForeignKey('Activity_4.id_Activity', ondelete='CASCADE'), nullable=False)

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

        import sympy
        x = sympy.symbols('x')
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
        objective_value = evaluar_funcion_costo(func_obj_coef_x, evaluation_point_x,func_obj_coef_y, evaluation_point_y)
        
        
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

@app.route('/Activity_2/save', methods=['POST'])
def matrix_input_view():
    try:
        data = request.json
        
        metodo = data.get('metodo', '').strip().lower()
        n = int(data.get('filas', 0))
        m = int(data.get('columnas', 0))
        densidad = float(data.get('densidad', 0))
        
        # Create database entry
        operation = Activity2(
            metodo=metodo,
            filas=n,
            columnas=m,
            densidad=densidad
        )
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Operación registrada correctamente'
        })
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/Activity_2/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    
    if 'experiment_type' not in data:
        return jsonify({'error': 'Tipo de experimento no especificado'}), 400
    
    if data['experiment_type'] == 'exp':
        # Para el experimento predefinido
        if 'n' not in data or 'm' not in data:
            return jsonify({'error': 'Faltan parámetros n o m'}), 400
            
        n = data['n']
        m = data['m']
        
        tiempomat, tiemposparse, tiempodensas = tiempo_ejecution_exp(n, m)
        
        return jsonify({
            'tiempomat': tiempomat,
            'tiemposparse': tiemposparse,
            'tiempodensas': tiempodensas
        })
    
    elif data['experiment_type'] == 'user':
        # Para el experimento personalizado
        if 'n' not in data or 'm' not in data or 'metodo' not in data or 'operacion' not in data or 'densidad' not in data:
            return jsonify({'error': 'Faltan parámetros'}), 400
            
        n = data['n']
        m = data['m']
        metodo = data['metodo']
        operacion = data['operacion']
        densidad = data['densidad']
        
        tiempo = tiempo_ejecution_user(n, m, metodo, operacion, densidad)
        
        return jsonify({
            'tiempo': tiempo
        })
    
    else:
        return jsonify({'error': 'Tipo de experimento no válido'}), 400

@app.route('/Activity_4/evaluate', methods=['POST'])
def optimize():
    data = request.get_json()
    
    try:
        func_str = data.get('function')
        method = data.get('method')
        x0_str = data.get('initialPoint')
        tolerance = float(data.get('tolerance'))
        learning_rate = float(data.get('learningRate', 0.01))
        
        # Validación básica
        if not func_str:
            return jsonify({"error": "La función es requerida"}), 400
        
        # Convertir punto inicial a float o lista de floats
        try:
            # Check if it contains a comma (multiple variables)
            if ',' in x0_str:
                x0 = [float(x.strip()) for x in x0_str.split(',')]
            else:
                x0 = float(x0_str)
        except Exception as e:
            return jsonify({"error": f"Punto inicial inválido: {str(e)}"}), 400
        
        # Verificar que la función se puede evaluar
        try:
            if isinstance(x0, list) and len(x0) > 1:
                # Multiple variables
                eval_vars = {"x": x0[0], "y": x0[1] if len(x0) > 1 else 0, "z": x0[2] if len(x0) > 2 else 0, "np": np}
            else:
                # Single variable
                eval_vars = {"x": float(x0) if not isinstance(x0, list) else x0[0], "np": np}
            
            eval(func_str, eval_vars)
        except Exception as e:
            return jsonify({"error": f"Función inválida: {str(e)}"}), 400
        
        # Crear la función a optimizar
        f_user = f_factory(func_str)
        
        # Medir tiempo de ejecución
        start_time = time.time()
        history = None
        
        # Ejecutar el método seleccionado
        if method == "gradiente":
            x_opt, f_opt, history = gradient_descent(x0, learning_rate, tolerance, f_user)
            iterations = len(history) - 1
        elif method == "newton":
            x_opt, f_opt, history = newton_method(x0, tolerance, f_user)
            iterations = len(history) - 1
        elif method == "bfgs":
            x_opt, f_opt, history = bfgs_method(x0, tolerance, f_user)
            iterations = len(history) - 1 if history else None
        else:
            return jsonify({"error": "Método no válido"}), 400
        
        execution_time = time.time() - start_time
        
        # Generar gráfica
        plot_image = generate_function_plot(func_str, x_opt, f_opt, history)
        
        # Preparar resultado
        result = {
            "result_x": float(x_opt) if not isinstance(x_opt, list) else [float(x) for x in x_opt],
            "result_f": float(f_opt),
            "iterations": iterations,
            "execution_time": execution_time,
            "plot_image": plot_image
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_function_plot(func_str, x_opt, f_opt, history=None):
    """
    Generate a plot showing the function and the optimal point.
    Returns the plot as a base64-encoded string.
    """
    plt.figure(figsize=(10, 6))
    
    # Determinar si es una función de una o varias variables
    is_multivariate = 'y' in func_str or 'z' in func_str
    
    if not is_multivariate:
        # Para funciones de una variable, mostramos la función y el punto óptimo
        x_range = np.linspace(x_opt - 5, x_opt + 5, 1000)
        f_values = [eval(func_str, {"x": x, "np": np}) for x in x_range]
        
        plt.plot(x_range, f_values, 'b-', label=f"f(x) = {func_str}")
        plt.scatter([x_opt], [f_opt], color='red', s=100, label=f"Óptimo: ({x_opt:.4f}, {f_opt:.4f})")
        
        # Si hay historial, mostrar la convergencia
        if history:
            # Modificación aquí para manejar diferentes formatos de historia
            x_history = []
            f_history = []
            for h in history:
                if isinstance(h, tuple) and len(h) == 2:
                    # Si h es una tupla (x, f)
                    x_history.append(h[0])
                    f_history.append(h[1])
                elif isinstance(h, list) and len(h) == 2:
                    # Si h es una lista [x, f]
                    x_history.append(h[0])
                    f_history.append(h[1])
                elif isinstance(h, dict) and 'x' in h and 'f' in h:
                    # Si h es un diccionario {'x': x, 'f': f}
                    x_history.append(h['x'])
                    f_history.append(h['f'])
            
            plt.plot(x_history, f_history, 'g--', marker='o', markersize=4, alpha=0.6, label="Convergencia")
    
    else:
        # Para funciones multivariables, mostramos un contour plot
        # Asumimos que estamos trabajando con 2 variables para simplificar
        x_range = np.linspace(x_opt[0] - 2, x_opt[0] + 2, 100)
        y_range = np.linspace(x_opt[1] - 2, x_opt[1] + 2, 100)
        X, Y = np.meshgrid(x_range, y_range)
        
        Z = np.zeros_like(X)
        for i in range(X.shape[0]):
            for j in range(X.shape[1]):
                Z[i, j] = eval(func_str, {"x": X[i, j], "y": Y[i, j], "np": np})
        
        plt.contourf(X, Y, Z, 20, cmap='viridis', alpha=0.8)
        plt.colorbar(label="f(x,y)")
        plt.contour(X, Y, Z, 20, colors='k', linewidths=0.5, alpha=0.3)
        
        plt.scatter([x_opt[0]], [x_opt[1]], color='red', s=100, 
                    label=f"Óptimo: ({x_opt[0]:.4f}, {x_opt[1]:.4f}), f={f_opt:.4f}")
        
        # Si hay historial, mostrar la trayectoria
        if history:
            x_history = []
            y_history = []
            
            for h in history:
                # Manejar diferentes formatos de historia
                if isinstance(h, tuple) and len(h) >= 1:
                    if isinstance(h[0], (list, np.ndarray)) and len(h[0]) >= 2:
                        # Si h es como ([x, y], f)
                        x_history.append(h[0][0])
                        y_history.append(h[0][1])
                    elif len(h) >= 2:
                        # Si h es como (x, y, f)
                        x_history.append(h[0])
                        y_history.append(h[1])
                elif isinstance(h, list):
                    if len(h) >= 2:
                        # Si h es [x, y, f]
                        x_history.append(h[0])
                        y_history.append(h[1])
                elif isinstance(h, dict) and 'x' in h:
                    # Si h es un diccionario {'x': [x, y], 'f': f}
                    if isinstance(h['x'], (list, np.ndarray)) and len(h['x']) >= 2:
                        x_history.append(h['x'][0])
                        y_history.append(h['x'][1])
            
            if x_history and y_history:
                plt.plot(x_history, y_history, 'r--', marker='o', markersize=4, alpha=0.6, label="Convergencia")
    
    plt.grid(True, alpha=0.3)
    plt.title(f"Optimización de la función {func_str}", fontsize=12)
    plt.xlabel("x" if not is_multivariate else "x1")
    plt.ylabel("f(x)" if not is_multivariate else "x2")
    plt.legend()
    plt.tight_layout()
    
    # Convertir el gráfico a base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=150)
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    return plot_data

@app.route('/Activity_4/save', methods=['POST'])
def save_result():
    data = request.get_json()
    
    try:
        
        func_str = data.get('function')
        method = data.get('method')
        x0 = float(data.get('initialPoint'))
        tolerance = float(data.get('tolerance'))
        learning_rate = float(data.get('learningRate')) if data.get('learningRate') else None
        result_x = float(data.get('result_x'))
        result_f = float(data.get('result_f'))
        iterations = data.get('iterations')
        
        
        new_result = Activity4(
            function_str=func_str,
            method=method,
            initial_point=x0,
            tolerance=tolerance,
            learning_rate=learning_rate,
            result_x=result_x,
            result_f=result_f,
            iterations=iterations,
        )
        
        # Guardar en la base de datos
        db.session.add(new_result)
        db.session.commit()
        
        return jsonify({"success": True, "id": new_result.id})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True)