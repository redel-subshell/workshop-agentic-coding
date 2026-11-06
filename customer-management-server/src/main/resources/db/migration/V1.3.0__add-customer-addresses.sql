CREATE TABLE tab_customer_address (
    c_customer_id  BIGINT       NOT NULL,
    c_position     INTEGER      NOT NULL,
    c_street       VARCHAR(255) NOT NULL,
    c_house_number VARCHAR(20)  NOT NULL,
    c_postal_code  VARCHAR(20)  NOT NULL,
    c_city         VARCHAR(255) NOT NULL,
    CONSTRAINT pk_customer_address
        PRIMARY KEY (c_customer_id, c_position),
    CONSTRAINT fk_customer_address_customer
        FOREIGN KEY (c_customer_id) REFERENCES tab_customer (c_id) ON DELETE CASCADE
);
