CREATE TABLE question (
	id STRING NOT NULL,
	content STRING NOT NULL,
    answer STRING NULL,
    answer_format STRING NULL,
    youtube STRING NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id)
);