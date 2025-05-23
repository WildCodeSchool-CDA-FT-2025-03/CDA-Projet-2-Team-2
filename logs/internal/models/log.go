package models

import "gorm.io/gorm"

type Log struct {
	gorm.Model
	Message string
}
