CREATE TABLE question_chapter (
	question_id STRING NOT NULL,
	chapter_id UUID NOT NULL,
	PRIMARY KEY (question_id, chapter_id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	FOREIGN KEY (chapter_id) REFERENCES chapter(id)
);