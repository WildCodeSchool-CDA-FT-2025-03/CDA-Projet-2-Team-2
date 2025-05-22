package main

import (
	"log"
	"os"

	"logs-server/internal/config"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")

	if port == "" {
		log.Println("PORT is not set, using default port 3333")
		port = "3333"
	}

	config.InitDatabase()

	server := gin.Default()
	server.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!!"})
	})
	server.Run(":" + port)
}
