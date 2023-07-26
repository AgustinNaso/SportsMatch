CREATE TABLE participants (
    id serial PRIMARY KEY,
    event_id integer REFERENCES events (id),
    user_id integer REFERENCES users (id),
    status varchar(256),
    CONSTRAINT fk_event
        FOREIGN KEY(event_id)
            REFERENCES events(id)
            ON DELETE CASCADE
);