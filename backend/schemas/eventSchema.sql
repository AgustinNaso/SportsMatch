CREATE TABLE events (
    id serial PRIMARY KEY,
    owner_id integer REFERENCES users (id),
    description varchar(1024),
    sport_id integer REFERENCES sports (id),
    time timestamp,
    location varchar(256),
    level number,
    CONSTRAINT fk_owner
        FOREIGN KEY(owner_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_sport
        FOREIGN KEY(sport_id)
            REFERENCES sports(id)
            ON DELETE CASCADE
);