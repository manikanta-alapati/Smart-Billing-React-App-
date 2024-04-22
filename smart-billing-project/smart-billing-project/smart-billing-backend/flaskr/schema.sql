DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS purchase;
DROP TABLE IF EXISTS purchase_history;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_name TEXT UNIQUE NOT NULL,
    cost NUMBER NOT NULL
);

CREATE TABLE purchase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE purchase_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    count INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchase (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
);

INSERT INTO product (name, class_name, cost) VALUES
    ("Doritos", "doritos", 12),
    ("Kit Kat (King Size)", "kitkat_kingsize", 15),
    ("Kit Kat (Small Size)", "kitkat_small", 10),
    ("Macaroni Cheese", "macaroni_cheese", 20),
    ("Trident", "trident", 8);