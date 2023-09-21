CREATE TABLE "user" (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	email STRING NOT NULL,
	birthday STRING NOT NULL,
	memo STRING NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id)
);