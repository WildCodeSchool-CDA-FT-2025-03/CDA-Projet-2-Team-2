package main

import (
	"fmt"
	"log"
	"net"
	"os"

	"logs-server/internal/config"
	grpc "logs-server/internal/grpc"
	"logs-server/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	grpc_go "google.golang.org/grpc"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	grpcPort := os.Getenv("GRPC_PORT")

	if port == "" {
		log.Println("PORT is not set, using default port 3333")
		port = "3333"
	}

	config.InitDatabase()

	if grpcPort == "" {
		log.Println("GRPC_PORT is not set, using default port 50051")
		grpcPort = "50051"
	}

	go startGrpcServer(grpcPort)

	server := gin.Default()
	server.GET("/", handlers.GetLogs)
	server.Run(":" + port)
}

func startGrpcServer(grpcPort string) {
	lis, err := net.Listen("tcp", ":"+grpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc_go.NewServer()
	grpc.RegisterGrpcServer(s)

	fmt.Printf("gRPC server listening on :%s\n", grpcPort)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
