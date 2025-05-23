package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Log struct {
	gorm.Model
	Titre    string         `gorm:"size:250"`
	Metadata datatypes.JSON `gorm:"type:jsonb;nullable"`
}

type JSON map[string]interface{}
