CREATE DATABASE IF NOT EXISTS student_results;

USE student_results;

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  semester INT NOT NULL,
  max_marks INT DEFAULT 100,
  is_lab BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS marks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(10),
  subject_id INT,
  marks INT NOT NULL,
  semester INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  UNIQUE KEY unique_mark (student_id, subject_id)
);