package handlers

import (
	"logs-server/internal/config"
	"logs-server/internal/models"

	"github.com/gin-gonic/gin"
)

func GetLogs(c *gin.Context) {
	db := config.GetDB()
	var logs []models.Log

	db.Find(&logs)

	c.JSON(200, logs)
}
