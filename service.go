package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/russellsimpkins/clip"
)

func HelloWorld(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	writer.Write([]byte("In it to win it"))
	fmt.Printf("We have this many %v", vars)
	return
}

func main() {
	var (
		router *mux.Router
	)

	router = mux.NewRouter()
	clip.SetRoutes(router)
	srv := &http.Server{
		Handler:        router,
		Addr:           ":8001",
		WriteTimeout:   15 * time.Second,
		ReadTimeout:    15 * time.Second,
		MaxHeaderBytes: 32768,
	}

	err := srv.ListenAndServe()
	if err != nil {
		fmt.Println("ListenAndServe: ", err)
	}
}
