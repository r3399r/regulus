CREATE TABLE tag (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id),
	UNIQUE (name)
);