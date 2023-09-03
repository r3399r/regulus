CREATE TABLE question_category (
	question_id STRING NOT NULL,
	category_id UUID NOT NULL,
	PRIMARY KEY (question_id, category_id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	FOREIGN KEY (category_id) REFERENCES category(id)
);