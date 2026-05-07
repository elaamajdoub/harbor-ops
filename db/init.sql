-- Harbor Operations DB Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ships
CREATE TABLE ships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    imo_number VARCHAR(20) UNIQUE NOT NULL,
    flag VARCHAR(100),
    type VARCHAR(100),
    gross_tonnage NUMERIC,
    status VARCHAR(50) DEFAULT 'expected', -- expected, arrived, docked, departed
    berth VARCHAR(50),
    eta TIMESTAMP,
    etd TIMESTAMP,
    actual_arrival TIMESTAMP,
    actual_departure TIMESTAMP,
    captain_name VARCHAR(200),
    agent_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Containers
CREATE TABLE containers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    container_number VARCHAR(20) UNIQUE NOT NULL,
    ship_id UUID REFERENCES ships(id) ON DELETE SET NULL,
    type VARCHAR(20) DEFAULT '20ft', -- 20ft, 40ft, 40ft-hc
    status VARCHAR(50) DEFAULT 'inbound', -- inbound, unloaded, in_yard, outbound, departed
    cargo_type VARCHAR(100),
    weight_kg NUMERIC,
    owner VARCHAR(200),
    destination VARCHAR(200),
    position VARCHAR(50), -- yard position e.g. A-12-3
    is_hazardous BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Equipment (Cranes & Handlers)
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- crane, reach_stacker, forklift, tractor
    status VARCHAR(50) DEFAULT 'available', -- available, in_use, maintenance, offline
    location VARCHAR(100),
    operator_name VARCHAR(200),
    assigned_ship_id UUID REFERENCES ships(id) ON DELETE SET NULL,
    capacity_tons NUMERIC,
    last_maintenance TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cargo Tracking
CREATE TABLE cargo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    container_id UUID REFERENCES containers(id) ON DELETE SET NULL,
    ship_id UUID REFERENCES ships(id) ON DELETE SET NULL,
    description TEXT,
    shipper VARCHAR(200),
    consignee VARCHAR(200),
    origin VARCHAR(200),
    destination VARCHAR(200),
    weight_kg NUMERIC,
    status VARCHAR(50) DEFAULT 'in_transit', -- in_transit, at_port, customs_hold, released, delivered
    customs_cleared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Port Authority Communications
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ship_id UUID REFERENCES ships(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- arrival_notice, departure_clearance, customs_request, inspection, alert
    subject VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    authority VARCHAR(200),
    status VARCHAR(50) DEFAULT 'sent', -- sent, received, acknowledged, resolved
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed admin user (password: admin123)
INSERT INTO users (username, hashed_password) VALUES (
    'admin',
    '$2b$12$V3SOS4KR1DY4dqjZ3mlCw.nhL/67LWHyFwMFx24b3GL4nAp.jBnFy'
);

-- Seed sample data
INSERT INTO ships (name, imo_number, flag, type, gross_tonnage, status, berth, eta, etd, captain_name, agent_name) VALUES
('MSC Adriana', 'IMO9234567', 'Panama', 'Container Ship', 85000, 'docked', 'B-04', NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 'Capt. James Rivera', 'Mediterranean Shipping Co.'),
('Ever Given II', 'IMO9876543', 'Liberia', 'Container Ship', 220000, 'arrived', 'B-07', NOW() - INTERVAL '5 hours', NOW() + INTERVAL '3 days', 'Capt. Chen Wei', 'Evergreen Marine'),
('Maersk Altair', 'IMO1234567', 'Denmark', 'Bulk Carrier', 45000, 'expected', NULL, NOW() + INTERVAL '12 hours', NOW() + INTERVAL '4 days', 'Capt. Lars Nielsen', 'Maersk Line'),
('CMA CGM Titan', 'IMO5678901', 'France', 'Container Ship', 130000, 'departed', 'B-02', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day', 'Capt. Pierre Dubois', 'CMA CGM');

INSERT INTO containers (container_number, ship_id, type, status, cargo_type, weight_kg, owner, destination, position) VALUES
('MSCU1234567', (SELECT id FROM ships WHERE imo_number='IMO9234567'), '40ft', 'in_yard', 'Electronics', 18500, 'Samsung Corp', 'Tunis Centre', 'A-04-2'),
('EVGU7654321', (SELECT id FROM ships WHERE imo_number='IMO9876543'), '20ft', 'unloaded', 'Textiles', 12000, 'Zara Logistics', 'Sousse', 'B-11-1'),
('MAEU9999001', (SELECT id FROM ships WHERE imo_number='IMO9234567'), '40ft-hc', 'in_yard', 'Automotive Parts', 22000, 'Toyota Logistics', 'Sfax', 'A-07-3'),
('CMAU4567890', (SELECT id FROM ships WHERE imo_number='IMO9876543'), '20ft', 'inbound', 'Food & Beverage', 9800, 'Nestlé Tunisia', 'Tunis', NULL);

INSERT INTO equipment (name, type, status, location, operator_name, capacity_tons) VALUES
('Crane Alpha', 'crane', 'in_use', 'Berth B-04', 'Ahmed Salah', 80),
('Crane Beta', 'crane', 'available', 'Berth B-07', NULL, 80),
('Crane Gamma', 'crane', 'maintenance', 'Workshop', NULL, 120),
('Reach Stacker RS-01', 'reach_stacker', 'in_use', 'Yard Zone A', 'Mohamed Ali', 45),
('Reach Stacker RS-02', 'reach_stacker', 'available', 'Yard Zone B', NULL, 45),
('Forklift FL-03', 'forklift', 'in_use', 'Warehouse 2', 'Khalil Ben Amor', 5),
('Terminal Tractor TT-01', 'tractor', 'available', 'Gate 1', NULL, NULL);

INSERT INTO cargo (tracking_number, ship_id, container_id, description, shipper, consignee, origin, destination, weight_kg, status, customs_cleared) VALUES
('TRK-2024-00123', (SELECT id FROM ships WHERE imo_number='IMO9234567'), (SELECT id FROM containers WHERE container_number='MSCU1234567'), 'Consumer electronics batch', 'Samsung Korea', 'Electroplanet Tunisia', 'Busan, South Korea', 'Tunis', 18500, 'at_port', TRUE),
('TRK-2024-00124', (SELECT id FROM ships WHERE imo_number='IMO9876543'), (SELECT id FROM containers WHERE container_number='EVGU7654321'), 'Clothing and textiles', 'Zara Spain', 'Zara Tunis', 'Barcelona, Spain', 'Sousse', 12000, 'at_port', FALSE),
('TRK-2024-00125', (SELECT id FROM ships WHERE imo_number='IMO9234567'), (SELECT id FROM containers WHERE container_number='MAEU9999001'), 'Toyota spare parts', 'Toyota Japan', 'Toyota Sfax Dealer', 'Yokohama, Japan', 'Sfax', 22000, 'customs_hold', FALSE);

INSERT INTO communications (ship_id, type, subject, body, authority, status, priority) VALUES
((SELECT id FROM ships WHERE imo_number='IMO9234567'), 'arrival_notice', 'Arrival Notification - MSC Adriana', 'MSC Adriana has completed berthing at B-04. All crew documents verified. Request clearance for cargo operations.', 'Port Authority Tunis', 'acknowledged', 'normal'),
((SELECT id FROM ships WHERE imo_number='IMO9876543'), 'customs_request', 'Customs Inspection Request - Ever Given II', 'Requesting customs inspection for container EVGU7654321 carrying textile goods. Manifest attached.', 'Customs Authority', 'sent', 'high'),
((SELECT id FROM ships WHERE imo_number='IMO1234567'), 'arrival_notice', 'ETA Notice - Maersk Altair', 'Maersk Altair expected arrival in 12 hours. Requesting berth B-03 assignment and pilot boat.', 'Port Pilot Station', 'received', 'normal'),
(NULL, 'alert', 'Storm Warning - Reduce Operations', 'Meteorological alert: Strong winds expected tonight 22:00-06:00. All crane operations to be suspended above wind speed threshold.', 'Maritime Safety Authority', 'acknowledged', 'urgent');
