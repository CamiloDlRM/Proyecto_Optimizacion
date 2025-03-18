import numpy as np
from scipy.optimize import minimize

def f_factory(func_str):
    """Genera una función evaluable f(x) desde un string."""
    def f(x):
        return eval(func_str, {"x": x, "np": np})
    return f

def grad_numeric(f, x, delta=1e-6):
    """Derivada numérica aproximada."""
    return (f(x + delta) - f(x - delta)) / (2 * delta)

def hessian_numeric(f, x, delta=1e-6):
    """Segunda derivada numérica aproximada."""
    f_x_plus = f(x + delta)
    f_x_minus = f(x - delta)
    f_x = f(x)
    return (f_x_plus - 2*f_x + f_x_minus) / (delta**2)

def gradient_descent(x0, learning_rate, tolerance, f):
    x = x0
    history = [x]
    while True:
        grad = grad_numeric(f, x)
        x_new = x - learning_rate * grad
        history.append(x_new)
        if abs(x_new - x) < tolerance:
            break
        x = x_new
    return x, f(x), history

def newton_method(x0, tolerance, f):
    x = x0
    history = [x]
    while True:
        grad = grad_numeric(f, x)
        hess = hessian_numeric(f, x)
        # Evitamos división entre cero
        if abs(hess) < 1e-12:
            break
        x_new = x - grad / hess
        history.append(x_new)
        if abs(x_new - x) < tolerance:
            break
        x = x_new
    return x, f(x), history

def bfgs_method(x0, tolerance, f):
    # Wrap f como requiere scipy (array unidimensional)
    def func(x):
        return f(x[0])
    def grad_func(x):
        return np.array([grad_numeric(f, x[0])])
    
    start_x = np.array([x0])
    result = minimize(func, start_x, method='BFGS', jac=grad_func,
                      options={'gtol': tolerance})
    return result.x[0], result.fun, None