package config

import (
	"log"

	"logs-server/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	db, err := gorm.Open(sqlite.Open("logs.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database")
	}
	DB = db
	db.AutoMigrate(&models.Log{})
}

func GetDB() *gorm.DB {
	return DB
}
