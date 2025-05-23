package models

import (
	"time"
)

type Log struct {
	ID       string    `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Titre    string    `gorm:"size:250"`
	Metadata JSON      `gorm:"type:jsonb;nullable"`
	CreateAt time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP;column:create_at"`
}

type JSON map[string]interface{}
