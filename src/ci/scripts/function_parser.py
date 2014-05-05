#!/usr/local/bin/python3.3-32
import argparse
parser = argparse.ArgumentParser(description="This program process arguments")
parser.add_argument("-C", "--commit", dest="commit",help="Commit to checkout in task sequence", default="develop")
parser.add_argument("-B", "--base",  dest="base",help="Base to use for merge function", default="develop")
parser.add_argument("-H", "--head", dest="head",help="Head to use when merging in")
parser.add_argument("function", metavar="FUNCTION", type=str,help="Which function to do")
parser.add_argument("-N", "--build", dest="build",help="Build number")
