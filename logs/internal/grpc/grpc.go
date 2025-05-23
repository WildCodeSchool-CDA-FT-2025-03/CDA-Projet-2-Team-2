package config

import (
	"context"
	"encoding/json"
	"logs-server/internal/config"
	"logs-server/internal/models"
	"logs-server/internal/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"gorm.io/datatypes"
)

type LogServer struct {
	proto.UnimplementedLogServiceServer
}

func (s *LogServer) CreateLog(ctx context.Context, req *proto.LogRequest) (*proto.LogResponse, error) {
	db := config.GetDB()

	metadata := make(map[string]interface{})
	for k, v := range req.Metadata {
		metadata[k] = v
	}

	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
		return &proto.LogResponse{
			Success: false,
			Message: "Failed to marshal metadata: " + err.Error(),
		}, nil
	}

	log := models.Log{
		Titre:    req.Titre,
		Metadata: datatypes.JSON(metadataJSON),
	}

	result := db.Create(&log)
	if result.Error != nil {
		return &proto.LogResponse{
			Success: false,
			Message: "Failed to create log: " + result.Error.Error(),
		}, nil
	}

	return &proto.LogResponse{
		Success: true,
		Message: "Log created successfully",
	}, nil
}

func (s *LogServer) GetLogs(ctx context.Context, req *proto.EmptyRequest) (*proto.LogsResponse, error) {
	db := config.GetDB()
	var logs []models.Log

	db.Find(&logs)

	var protoLogs []*proto.LogEntry
	for _, log := range logs {
		var metadata map[string]string
		if err := json.Unmarshal(log.Metadata, &metadata); err != nil {
			continue
		}

		protoLogs = append(protoLogs, &proto.LogEntry{
			Titre:    log.Titre,
			Metadata: metadata,
		})
	}

	return &proto.LogsResponse{
		Logs: protoLogs,
	}, nil
}

func RegisterGrpcServer(s *grpc.Server) {
	proto.RegisterLogServiceServer(s, &LogServer{})
	reflection.Register(s)
}
