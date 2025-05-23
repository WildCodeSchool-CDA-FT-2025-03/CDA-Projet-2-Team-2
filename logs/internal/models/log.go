package models

import "gorm.io/gorm"

type Log struct {
	gorm.Model
	Titre    string `gorm:"size:250"`
	Metadata JSON   `gorm:"type:jsonb;nullable"`
}

type JSON map[string]interface{}
