DROP TABLE IF EXISTS matches;

DROP TABLE IF EXISTS registrations;

DROP TABLE IF EXISTS tournaments;

DROP TABLE IF EXISTS game_tables;

DROP TABLE IF EXISTS users;

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_role VARCHAR(20) DEFAULT 'player', -- player || admin
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    game_tables (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL,
        location_info VARCHAR(100),
        table_status VARCHAR(100) DEFAULT 'available'
    );

CREATE TABLE
    tournaments (
        id SERIAL PRIMARY KEY,
        tournament_name VARCHAR(100) NOT NULL,
        format VARCHAR(100),
        tournament_date TIMESTAMP NOT NULL,
        entry_fee DECIMAL(10, 2) NOT NULL,
        max_players INT DEFAULT 32,
        tournament_status VARCHAR(100) DEFAULT 'open'
    );

CREATE TABLE
    registrations (
        id SERIAL PRIMARY KEY,
        tournament_id INT NOT NULL,
        user_id INT NOT NULL,
        payment_status VARCHAR(100) DEFAULT 'payment pending',
        payment_ref VARCHAR(100),
        decklist TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        -- foreign keys
        CONSTRAINT fk_tournament_reg FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        CONSTRAINT fk_user_reg FOREIGN KEY (user_id) REFERENCES users (id),
        -- user só pode se inscrever uma vez em um torneio
        UNIQUE (tournament_id, user_id)
    );

CREATE TABLE
    matches (
        id SERIAL PRIMARY KEY,
        tournament_id INT NOT NULL,
        table_id INT NOT NULL,
        player1_id INT NOT NULL,
        player2_id INT NOT NULL,
        round INT NOT NULL,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        winner_id INT,
        is_draw BOOLEAN DEFAULT FALSE,
        -- foreign keys
        CONSTRAINT fk_tournament_match FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        CONSTRAINT fk_table_match FOREIGN KEY (table_id) REFERENCES game_tables (id),
        CONSTRAINT fk_p1_match FOREIGN KEY (player1_id) REFERENCES users (id),
        CONSTRAINT fk_p2_match FOREIGN KEY (player2_id) REFERENCES users (id)
    );