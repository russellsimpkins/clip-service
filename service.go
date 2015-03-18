package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/russellsimpkins/clip"
	"net/http"
	"time"
)


func HelloWorld(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	writer.Write([]byte("In it to win it"))
	fmt.Printf("We have this many %v", vars)
	return
}


func main() {

	r := mux.NewRouter()

	r.HandleFunc("/svc/clip/user/{email:[a-zA-Z0-9\\.\\-\\@]+}", clip.CreateUserHandler).Methods("POST")
	r.HandleFunc("/svc/clip/user/{email:[a-zA-Z0-9\\.\\-\\@]+}", clip.UpdateUserHandler).Methods("PUT")
	r.HandleFunc("/svc/clip/user/{email:[a-zA-Z0-9\\.\\-\\@]+}", clip.FetchUserHandler).Methods("GET")


	r.HandleFunc("/svc/clip/team", clip.CreateTeamHandler).Methods("POST")
	r.HandleFunc("/svc/clip/teams", GetTeamsHandler).Methods("GET")
	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9\\.\\-_]+}", clip.UpdateTeamHandler).Methods("PUT")
	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9 \\%\\.\\-_]+}", clip.GetTeamHandler).Methods("GET")
	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9 \\%\\.\\-_]+}", clip.DeleteTeamHandler).Methods("DELETE")

	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9\\.\\-_]+}/token",
		clip.CreateTokenHandler).Methods("POST")
	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9\\.\\-_]+}/token/{token:[a-zA-Z0-9]+}",
		clip.UpdateTokenHandler).Methods("PUT")
	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9 \\%\\.\\-_]+}/token/{token:[a-zA-Z0-9]+}",
		clip.GetTokenHandler).Methods("GET")
	r.HandleFunc("/svc/clip/team/{name:[a-zA-Z0-9 \\%\\.\\-_]+}/token/{token:[a-zA-Z0-9]+}",
		clip.DeleteTokenHandler).Methods("DELETE")

	
	srv := &http.Server{
        Handler:        r,
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
