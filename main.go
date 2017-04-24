package main

import (
	"git.vodjk.com/golang/common/modules/setting"
	"github.com/baa-middleware/accesslog"
	"github.com/baa-middleware/gzip"
	"github.com/baa-middleware/recovery"
	"github.com/baa-middleware/static"
	"gopkg.in/baa.v1"
)

func main() {
	app := baa.Default()
	app.Use(recovery.Recovery())

	// gzip
	if !setting.Debug {
		app.Use(gzip.Gzip(gzip.Options{
			CompressionLevel: 9,
		}))
	}

	// 应用状态监测
	app.Get("/ping", func(c *baa.Context) {
		c.Text(200, []byte("PONG"))
	})

	// accesslog
	if setting.Config.MustBool("http.access_open", false) {
		app.Use(accesslog.Logger())
	}

	// static file
	app.Use(static.Static("/", "./public", false, nil))

	// 首页
	app.Get("/", func(c *baa.Context) {
		c.HTML(200, "index.html")
	})

	// 所有的视图页面
	app.Get("/view/*", func(c *baa.Context) {
		c.HTML(200, "./public/index.html")
	})

	// run
	addr := setting.Config.MustString("http.address", "0.0.0.0")
	port := setting.Config.MustString("http.port", "8001")
	app.Run(addr + ":" + port)
}
