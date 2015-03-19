DEFAULT:
	gofmt -w=true service.go
	go build service.go

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
	mkdir -p $(DESTDIR)/bin
	rsync -a --exclude-from=.rsync-excludes . $(DESTDIR)/var/www
endif

i: install
