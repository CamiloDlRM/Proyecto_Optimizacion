-- Tabla Usuario
CREATE TABLE Usuario (
    id_user INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    credentials INTEGER NOT NULL
);

-- Tabla Activity_1
CREATE TABLE Activity_1 (
    id_Activity INTEGER PRIMARY KEY AUTOINCREMENT,
    func_obj_coef_x NUMERIC NOT NULL,
    func_obj_coef_y NUMERIC NOT NULL,
    resc1_coef_a NUMERIC,
    resc1_coef_b NUMERIC,
    resc1_coef_c NUMERIC,
    resc2_coef_a NUMERIC,
    resc2_coef_b NUMERIC,
    resc2_coef_c NUMERIC,
    resc3_coef_a NUMERIC,
    resc3_coef_b NUMERIC,
    resc3_coef_c NUMERIC,
    evaluation_point_x NUMERIC,
    evaluation_point_y NUMERIC
);

-- Tabla Activity_2
CREATE TABLE Activity_2 (
    id_Activity INTEGER PRIMARY KEY AUTOINCREMENT,
    metodo VARCHAR(10) NOT NULL,
    filas INTEGER NOT NULL,
    columnas INTEGER NOT NULL,
    densidad REAL NOT NULL
);

-- Tabla Activity_3
CREATE TABLE Activity_3 (
    id_Activity INTEGER PRIMARY KEY AUTOINCREMENT,
    x NUMERIC NOT NULL,
    x0 NUMERIC NOT NULL,
    n INTEGER NOT NULL
);

-- Tabla Activity_4
CREATE TABLE Activity_4 (
    id_Activity INTEGER PRIMARY KEY AUTOINCREMENT,
    function_str VARCHAR(255) NOT NULL,
    method VARCHAR(50) NOT NULL,
    initial_point REAL NOT NULL,
    tolerance REAL NOT NULL,
    learning_rate REAL,
    result_x REAL NOT NULL,
    result_f REAL NOT NULL,
    iterations INTEGER
);

-- Tabla Registry_Activities
CREATE TABLE Registry_Activities (
    id_RA INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_ACT1 INTEGER NOT NULL,
    id_ACT2 INTEGER NOT NULL,
    id_ACT3 INTEGER NOT NULL,
    id_ACT4 INTEGER NOT NULL,
    FOREIGN KEY (id_user) REFERENCES Usuario(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_ACT1) REFERENCES Activity_1(id_Activity) ON DELETE CASCADE,
    FOREIGN KEY (id_ACT2) REFERENCES Activity_2(id_Activity) ON DELETE CASCADE,
    FOREIGN KEY (id_ACT3) REFERENCES Activity_3(id_Activity) ON DELETE CASCADE,
    FOREIGN KEY (id_ACT4) REFERENCES Activity_4(id_Activity) ON DELETE CASCADE
);