#!/usr/bin/python

import cgi

log = open("log.txt", "a")
log.write("Received CGI request\n")

arguments = cgi.FieldStorage()
stayTime = int(arguments['length'].value) #in ms

log.write("\tstayTime: " + str(stayTime) + "\n")

data = open('times.txt').readlines()
t = int(data[0])
n = int(data[1])

t = t*n
t += stayTime
n += 1
t = t/n;

f = open('times.txt','w')
f.write(str(t) + "\n")
f.write(str(n))
f.close()

print ""