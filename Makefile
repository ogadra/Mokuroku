.PHONY: init

init:
	direnv allow
	lefthook install
	cp -n .dev.vars.sample .dev.vars || true
