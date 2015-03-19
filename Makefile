DEFAULT:
	gofmt -w=true service.go
	if [ ! -d build ]; then mkdir -p build/usr/bin; fi
	go build -o build/usr/bin/clip-service service.go

token: 
	go test -v -run Token github.com/russellsimpkins/clip

user:
	go test -v -run User github.com/russellsimpkins/clip

team:
	go test -v -run Team github.com/russellsimpkins/clip

test: token user team

clean:
ifneq ($(DESTDIR), )
	if [ -d $(DESTDIR) ]; then rm -rf $(DESTDIR); fi
else
	@echo "This target normally used when packaging. usage: make clean DESTDIR=/install/destination"
endif

install:
ifeq ($(DESTDIR), )
	@echo "You failed to set DESTDIR. usage: make install DESTDIR=/install/destination"
else
	mkdir -p $(DESTDIR)
	rsync -a --exclude-from=.rsync-excludes build/* $(DESTDIR)
	rsync -a --exclude-from=.rsync-excludes html/* $(DESTDIR)
endif

i: install
