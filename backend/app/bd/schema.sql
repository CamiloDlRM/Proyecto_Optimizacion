CREATE TABLE Usuario (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    credentials INT NOT NULL
);

CREATE TABLE Activity_1 (
    id_Activity SERIAL PRIMARY KEY,
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

CREATE TABLE Activity_2 (
    id_Activity SERIAL PRIMARY KEY,
    valor_1 NUMERIC NOT NULL,
    valor_2 NUMERIC NOT NULL,
    valor_3 NUMERIC NOT NULL
);

CREATE TABLE Activity_3 (
    id_Activity SERIAL PRIMARY KEY,
    x NUMERIC NOT NULL,
    x0 NUMERIC NOT NULL,
    n INTEGER NOT NULL
);

CREATE TABLE Activity_4 (
    id_Activity SERIAL PRIMARY KEY,
    valor_1 NUMERIC NOT NULL,
    valor_2 NUMERIC NOT NULL,
    valor_3 NUMERIC NOT NULL
);

CREATE TABLE Registry_Activities (
    id_RA SERIAL PRIMARY KEY,
    id_user INT UNIQUE NOT NULL,
    id_ACT1 INT UNIQUE NOT NULL,
    id_ACT2 INT UNIQUE NOT NULL,
    id_ACT3 INT UNIQUE NOT NULL,
    id_ACT4 INT UNIQUE NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES Usuario (id_user) ON DELETE CASCADE,
    CONSTRAINT fk_act1 FOREIGN KEY (id_ACT1) REFERENCES Activity_1 (id_Activity) ON DELETE CASCADE,
    CONSTRAINT fk_act2 FOREIGN KEY (id_ACT2) REFERENCES Activity_2 (id_Activity) ON DELETE CASCADE,
    CONSTRAINT fk_act3 FOREIGN KEY (id_ACT3) REFERENCES Activity_3 (id_Activity) ON DELETE CASCADE,
    CONSTRAINT fk_act4 FOREIGN KEY (id_ACT4) REFERENCES Activity_4 (id_Activity) ON DELETE CASCADE
);
