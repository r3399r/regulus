CREATE TABLE question (
	id STRING NOT NULL,
	content STRING NOT NULL,
    answer STRING NULL,
    youtube STRING NULL,
	has_solution BOOLEAN NOT NULL,
	has_image BOOLEAN NOT NULL,
	accumulative_score FLOAT NULL,
	accumulative_count INT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id)
);