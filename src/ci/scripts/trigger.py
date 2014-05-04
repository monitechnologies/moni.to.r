#!/usr/bin/python
#Import required modules
import class_case
import function_parser
import sys

#Set the arguments
args = function_parser.parser.parse_args()

for case in class_case.switch(args.function):
        if case('build'):
                print("Starting Task Sequence for: {}".format(args.function))
                break
        if case('integrate'):
                print("Starting Task Sequence for: {}".format(args.function))
                break
        if True:
                print "Valid functions are: build,integrate"
                sys.exit()
