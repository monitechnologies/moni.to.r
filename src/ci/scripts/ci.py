#!/usr/bin/python

import argparse
import sys
import case

parser = argparse.ArgumentParser(description="This program process arguments")
parser.add_argument("-C", "--commit", dest="commit",help="Commit to checkout in task sequence", default="develop")
parser.add_argument("-B", "--base",  dest="base",help="Base to use for merge function", default="develop")
parser.add_argument("-H", "--head", dest="head",help="Head to use when merging in")
parser.add_argument('function', metavar='FUNCTION', type=str,help='Which function to do')
args = parser.parse_args()

for case in case.switch(args.function):
	if case('build'):
		print("Starting Task Sequence for: {}".format(args.function))
		break
	if case('integrate'):
		print("Starting Task Sequence for: {}".format(args.function))
		break
	if True: 
		print "Valid functions are: build,integrate"
		sys.exit()
