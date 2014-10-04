package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", home)
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	fmt.Println("listening...")

	err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
	if err != nil {
		panic(err)
	}
}

func home(res http.ResponseWriter, req *http.Request) {
    t, _ := template.ParseFiles("index.html")
    t.Execute(res, nil)
}
