#!/usr/bin/python2.7

#running this file simply means we need to increment the counter!

num = int(open('count.txt').readline().strip())
num += 1
f = open('count.txt','w')
f.write(str(num))
f.close()