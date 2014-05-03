#!/bin/bash

set -e

FUNCTION="$1"
COMMIT="$2"
case "$1" in
	--build)
	echo "Starting Build Task Sequence"
	;;
	--integrate)
	echo "Starting Integrate Task Sequence"
	;;
	help)
	echo "Function:"
	echo "--build, Run ansible build + test sequence"
	echo "--integrate, Run ansible git merge, build, test sequence"
	;;
	*)
	echo "Usage: ci.sh [FUNCTION]... [COMMIT]..."
	echo "help for more"
	;;
	esac
