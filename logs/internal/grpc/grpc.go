package config

import (
	"context"
	"logs-server/internal/config"
	"logs-server/internal/models"
	"logs-server/internal/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type LogServer struct {
	proto.UnimplementedLogServiceServer
}

func (s *LogServer) CreateLog(ctx context.Context, req *proto.LogRequest) (*proto.LogResponse, error) {
	db := config.GetDB()

	metadata := make(models.JSON)
	for k, v := range req.Metadata {
		metadata[k] = v
	}

	log := models.Log{
		Titre:    req.Titre,
		Metadata: metadata,
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
		metadata := make(map[string]string)
		for k, v := range log.Metadata {
			if str, ok := v.(string); ok {
				metadata[k] = str
			}
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
