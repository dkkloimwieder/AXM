-- Item Table
CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    item_type VARCHAR(4) CHECK (item_type IN ('ASM', 'CMP', 'RAW')) NOT NULL,
    description TEXT,
    cost NUMERIC(10,5) DEFAULT 0.00000, 
    ext JSONB
);

-- Routing Table
CREATE TABLE routing (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    code VARCHAR(100) NOT NULL,
    description TEXT,
    ext JSONB
);
-- Workstation Type Table
CREATE TABLE workstation_type (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    ext JSONB
);

-- Workstation Table
CREATE TABLE workstation (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    name VARCHAR(100),
    workstation_type_id INTEGER,
    description TEXT,
    labor_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    overhead_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    consumable_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    rent_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000, 
    electricity_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000, 
    ext JSONB,
    FOREIGN KEY (workstation_type_id) REFERENCES workstation_type(id)
);

-- Bill of Materials (BOM) Table
CREATE TABLE bom (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    item_id INTEGER NOT NULL,
    routing_id INTEGER,
    description TEXT,
    effective_date TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    ext JSONB,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (routing_id) REFERENCES routing(id)
);

-- Operator Type Table
CREATE TABLE operator_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    external_id VARCHAR(100),
    description TEXT,
    labor_cost NUMERIC(10,5) NOT NULL,
    ext JSONB
);

-- Operation Table
CREATE TABLE operation (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL, 
    external_id VARCHAR(100),
    routing_id INTEGER NOT NULL,
    sequence_number INTEGER NOT NULL,
    workstation_id INTEGER NOT NULL,
    operator_type_id INTEGER,
    description TEXT,
    rate FLOAT NOT NULL, -- piece/hr
    cycle_time INTEGER NOT NULL,  -- time in ms per piece
    setup_time INTEGER NOT NULL DEFAULT 0, -- time in ms for setup
    ext JSONB,
    FOREIGN KEY (routing_id) REFERENCES routing(id),
    FOREIGN KEY (workstation_id) REFERENCES workstation(id),
    FOREIGN KEY (operator_type_id) REFERENCES operator_type(id)
);


-- BOM Component Table
CREATE TABLE bom_component (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    bom_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    operation_id INTEGER,
    quantity FLOAT NOT NULL,
    ext JSONB,
    FOREIGN KEY (bom_id) REFERENCES bom(id),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (operation_id) REFERENCES operation(id)
);

-- Operator Table
CREATE TABLE operator (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    external_id VARCHAR(100),
    operator_type_id INTEGER NOT NULL,
    labor_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    ext JSONB,
    FOREIGN KEY (operator_type_id) REFERENCES operator_type(id)
);

-- Work Order Table
CREATE TABLE work_order (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100),
    item_id INTEGER NOT NULL,
    bom_id INTEGER NOT NULL,
    routing_id INTEGER NOT NULL,
    quantity FLOAT NOT NULL ,
    completed_quantity FLOAT NOT NULL DEFAULT 0.0,
    planned_start_date TIMESTAMPTZ,
    planned_end_date TIMESTAMPTZ,
    actual_start_date TIMESTAMPTZ,
    actual_end_date TIMESTAMPTZ,
    status VARCHAR(20) CHECK (status IN ('planned', 'released', 'started', 'completed', 'cancelled')),
    ext JSONB,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (bom_id) REFERENCES bom(id),
    FOREIGN KEY (routing_id) REFERENCES routing(id)
);

-- Run Table (Work Order Instance)
CREATE TABLE run (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER,
    quantity FLOAT NOT NULL DEFAULT 0.0,
    completed_quantity FLOAT NOT NULL DEFAULT 0.0,
    item_id INTEGER NOT NULL,
    bom_id INTEGER NOT NULL,
    routing_id INTEGER NOT NULL,
    planned_start_date TIMESTAMPTZ,
    planned_end_date TIMESTAMPTZ,
    planned_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    actual_start_date TIMESTAMPTZ,
    actual_end_date TIMESTAMPTZ,
    actual_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    status VARCHAR(20) CHECK (status IN ('planned','released', 'started', 'completed', 'cancelled')),
    ext JSONB,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (work_order_id) REFERENCES work_order(id)
    FOREIGN KEY (bom_id) REFERENCES bom(id),
    FOREIGN KEY (routing_id) REFERENCES routing(id)
);

--Run Operation Table
CREATE TABLE run_operation (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL,
    run_id INTEGER NOT NULL,
    external_id VARCHAR(100),
    routing_id INTEGER NOT NULL,
    sequence_number INTEGER NOT NULL,
    workstation_id INTEGER NOT NULL,
    operator_type_id INTEGER,
    description TEXT,
    quantity FLOAT NOT NULL DEFAULT 0.0,
    actual_quantity FLOAT NOT NULL DEFAULT 0.0,
    rate FLOAT NOT NULL, -- piece/hr
    cycle_time INTEGER NOT NULL,  -- time in ms per piece
    setup_time INTEGER NOT NULL DEFAULT 0, -- time in ms for setup
    actual_rate FLOAT NOT NULL, -- piece/hr
    actual_cycle_time INTEGER NOT NULL,  -- time in ms per piece
    actual_setup_time INTEGER NOT NULL DEFAULT 0, -- time in ms for setup
    planned_start_date TIMESTAMPTZ,
    planned_end_date TIMESTAMPTZ,
    actual_start_date TIMESTAMPTZ,
    actual_end_date TIMESTAMPTZ,
    planned_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    actual_cost NUMERIC(10,5) NOT NULL DEFAULT 0.00000,
    ext JSONB,
    FOREIGN KEY (run_id) REFERENCES run(id),
    FOREIGN KEY (routing_id) REFERENCES routing(id),
    FOREIGN KEY (workstation_id) REFERENCES workstation(id),
    FOREIGN KEY (operator_type_id) REFERENCES operator_type(id)
);

---- Run Operator Assignment Table
--CREATE TABLE run_operator_assignment (
--    id SERIAL PRIMARY KEY,
--    run_id INTEGER,
--    operator_id INTEGER,
--    operation_id INTEGER,
--    start_datetime TIMESTAMPTZ,
--    end_datetime TIMESTAMPTZ,
--    FOREIGN KEY (run_id) REFERENCES run(id),
--    FOREIGN KEY (operator_id) REFERENCES operator(id),
--    FOREIGN KEY (operation_id) REFERENCES operation(id)
--);
    stg = """INSERT INTO newtable (workorder,blob) VALUES (?,?::jsonb)"""
    workorder = '123'
    system.db.runPrepUpdate(stg, [workorder,jsonString])
   SELECT DISTINCT last_name
    FROM (
        SELECT jsonb_array_elements(blob::jsonb -> 'employees') ->> 'lastName' AS last_name
        FROM newtable
    ) AS last_names;

