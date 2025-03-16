INSERT INTO Usuario (username, password, email, credentials) VALUES
('usuario1', 'password123', 'usuario1@example.com', 1001234567),
('usuario2', 'pass456', 'usuario2@example.com', 1007654321),
('usuario3', 'securepass', 'usuario3@example.com', 1012345678);

INSERT INTO Activity_1 (func_obj_coef_x, func_obj_coef_y, resc1_coef_a, resc1_coef_b, resc1_coef_c, 
                        resc2_coef_a, resc2_coef_b, resc2_coef_c, resc3_coef_a, resc3_coef_b, resc3_coef_c, 
                        evaluation_point_x, evaluation_point_y)
VALUES
(2, 3, 1, 1, 8, 3, 2, 18, 1, 0, 5, 3, 2), 
(4, 2, 3, 4, 5, 1, 2, 9, 2, 3, 6, 4, 1),
(1, 1, 1, 2, 6, 2, 1, 12, 2, 1, 3, 2, 3);

INSERT INTO Activity_2 (valor_1, valor_2, valor_3) VALUES
(10, 20, 30),
(5, 15, 25),
(8, 18, 28);


INSERT INTO Activity_3 (x, x0, n) VALUES
(1.5, 0.5, 10),
(2.0, 1.0, 15),
(3.2, 1.5, 20);

INSERT INTO Activity_4 (valor_1, valor_2, valor_3) VALUES
(50, 60, 70),
(30, 40, 50),
(20, 25, 35);


INSERT INTO Registry_Activities (id_user, id_ACT1, id_ACT2, id_ACT3, id_ACT4) VALUES
(1, 1, 1, 1, 1),
(2, 2, 2, 2, 2),
(3, 3, 3, 3, 3);