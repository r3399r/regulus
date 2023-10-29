CREATE TABLE result (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	question_id STRING NOT NULL,
	user_id UUID NOT NULL,
	score FLOAT NOT NULL,
	exam_date TIMESTAMP NOT NULL,
	created_at TIMESTAMP NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	FOREIGN KEY (user_id) REFERENCES "user"(id)
);